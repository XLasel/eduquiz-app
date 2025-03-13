'use client';

import { ReactElement } from 'react';
import {
  ControllerFieldState,
  ControllerRenderProps,
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
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

import { PasswordField } from './PasswordField';

export type FieldConfig<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  type: 'text' | 'password' | 'checkbox';
  placeholder?: string;
  description?: string;
  render?: ({
    field,
    fieldState,
    form,
    label,
    placeholder,
    description,
  }: {
    field: ControllerRenderProps<T, Path<T>>;
    fieldState: ControllerFieldState;
    form: UseFormReturn<T>;
    label: string;
    placeholder?: string;
    description?: string;
  }) => ReactElement;
};

const fieldRenderers: {
  [key in 'text' | 'password' | 'checkbox']: <T extends FieldValues>(props: {
    field: ControllerRenderProps<T, Path<T>>;
    f: FieldConfig<T>;
  }) => ReactElement;
} = {
  checkbox: <T extends FieldValues>({
    field,
    f,
  }: {
    field: ControllerRenderProps<T, Path<T>>;
    f: FieldConfig<T>;
  }) => (
    <FormItem className="flex flex-row items-start gap-2 space-y-0">
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
  ),
  password: <T extends FieldValues>({
    field,
    f,
  }: {
    field: ControllerRenderProps<T, Path<T>>;
    f: FieldConfig<T>;
  }) => (
    <PasswordField
      field={field}
      label={f.label}
      placeholder={f.placeholder}
      description={f.description}
    />
  ),
  text: <T extends FieldValues>({
    field,
    f,
  }: {
    field: ControllerRenderProps<T, Path<T>>;
    f: FieldConfig<T>;
  }) => (
    <FormItem>
      <FormLabel>{f.label}</FormLabel>
      <FormControl>
        <FormInput type={f.type} placeholder={f.placeholder} {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  ),
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

  const getFieldRenderer = (f: FieldConfig<T>) => {
    if (f.render) {
      const render = f.render;
      return ({
        field,
        fieldState,
        form,
      }: {
        field: ControllerRenderProps<T, Path<T>>;
        fieldState: ControllerFieldState;
        form: UseFormReturn<T>;
      }) =>
        render({
          field,
          fieldState,
          form,
          label: f.label,
          placeholder: f.placeholder,
          description: f.description,
        });
    }

    return ({ field }: { field: ControllerRenderProps<T, Path<T>> }) =>
      (fieldRenderers[f.type] ?? fieldRenderers.text)({ field, f });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
      >
        {fields.map((f) => (
          <FormField
            key={f.name as string}
            control={control}
            name={f.name as Path<T>}
            render={(props) => getFieldRenderer(f)({ ...props, form })}
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
