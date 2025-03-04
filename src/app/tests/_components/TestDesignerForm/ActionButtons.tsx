import { RotateCcw, Save, Trash2 } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button, ButtonProps } from '@/components/shadcnUi/button';

export const DeleteButton = ({ ...props }: ButtonProps) => (
  <Button type="button" variant="destructive" {...props}>
    <Trash2 className="h-4 w-4" />
    <span className="sr-only">Удалить</span>
  </Button>
);

export const ResetButton = ({ className, ...props }: ButtonProps) => (
  <Button
    type="button"
    variant="outline"
    className={cn('space-x-3', className)}
    {...props}
  >
    <RotateCcw className="h-4 w-4" />
    <span className="sr-only">Сбросить</span>
  </Button>
);

export const SaveButton = ({
  formId,
  label = true,
  className,
  ...props
}: {
  formId?: string;
  label?: 'adaptive' | boolean;
  className?: string;
} & ButtonProps) => (
  <Button
    form={formId}
    type="submit"
    className={cn('flex items-center gap-2', className)}
    {...props}
  >
    <Save className="h-4 w-4" />
    <span
      className={cn(
        label === 'adaptive' && 'sr-only md:not-sr-only',
        !label && 'sr-only'
      )}
    >
      Сохранить
    </span>
  </Button>
);
