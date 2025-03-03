'use client';

import { ReactElement, useState } from 'react';
import {
  ControllerFieldState,
  ControllerRenderProps,
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormStateReturn,
} from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/components/shadcnUi/button';
import { Checkbox } from '@/components/shadcnUi/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcnUi/form';

export type FieldConfig<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  type: 'text' | 'password' | 'checkbox';
  placeholder?: string;
  description?: string;
  render?: ({
    field,
    fieldState,
    formState,
  }: {
    field: ControllerRenderProps<T, Path<T>>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<T>;
  }) => ReactElement;
};

const PasswordField = <T extends FieldValues>({
  field,
  label,
  placeholder,
}: {
  field: ControllerRenderProps<T, Path<T>>;
  label: string;
  placeholder?: string;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className="relative">
          <FormInput
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
            {...field}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

interface AuthFormProps<T extends FieldValues, TData> {
  schema: z.ZodType<TData>;
  onSubmit: SubmitHandler<T>;
  defaultValues: DefaultValues<T>;
  fields: FieldConfig<T>[];
  loading: boolean;
  error?: { code: number | null; message: string | null } | null;
  submitLabel?: string;
}

export const AuthForm = <T extends FieldValues, TData>({
  schema,
  onSubmit,
  defaultValues,
  fields,
  loading,
  error,
  submitLabel = 'Отправить',
}: AuthFormProps<T, TData>) => {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { control, handleSubmit } = form;

  const renderField = (f: FieldConfig<T>) => {
    if (f.render) {
      return f.render;
    }

    if (f.type === 'checkbox') {
      return ({ field }: { field: ControllerRenderProps<T, Path<T>> }) => (
        <FormItem className="flex flex-row items-start gap-2 space-y-0 px-3 py-2">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="cursor-pointer">{f.label}</FormLabel>
            {f.description && (
              <FormDescription className="leading-tight">
                {f.description}
              </FormDescription>
            )}
          </div>
        </FormItem>
      );
    }

    if (f.type === 'password') {
      return ({ field }: { field: ControllerRenderProps<T, Path<T>> }) => (
        <PasswordField
          field={field}
          label={f.label}
          placeholder={f.placeholder}
        />
      );
    }

    return ({ field }: { field: ControllerRenderProps<T, Path<T>> }) => (
      <FormItem>
        <FormLabel>{f.label}</FormLabel>
        <FormControl>
          <FormInput type={f.type} placeholder={f.placeholder} {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
        {fields.map((f) => (
          <FormField
            key={f.name as string}
            control={control}
            name={f.name as Path<T>}
            render={renderField(f)}
          />
        ))}

        {error?.message && <p className="text-destructive">{error.message}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Загрузка...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </form>
    </Form>
  );
};

AuthForm.displayName = 'AuthForm';
