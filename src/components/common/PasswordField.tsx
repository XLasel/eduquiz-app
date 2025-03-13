import { ComponentProps, useState } from 'react';
import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';

import { Eye, EyeOff } from 'lucide-react';

import {
  FormControl,
  FormDescription,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcnUi/form';

export const PasswordField = <T extends FieldValues>({
  field,
  label,
  placeholder,
  description,
  className,
}: {
  field: ControllerRenderProps<T, Path<T>>;
  label: string;
  placeholder?: string;
  description?: string;
} & ComponentProps<typeof FormItem>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormItem className={className}>
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
      {description && (
        <FormDescription className="leading-tight">
          {description}
        </FormDescription>
      )}
      <FormMessage />
    </FormItem>
  );
};
