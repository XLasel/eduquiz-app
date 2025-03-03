import { RotateCcw, Save, Trash2 } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/shadcnUi/button';

interface ActionButtonProps {
  onClick: () => void;
  className?: string;
}

interface ToggleableActionButtonProps extends ActionButtonProps {
  isDirty: boolean;
}

export const DeleteButton = ({ onClick, className }: ActionButtonProps) => (
  <Button
    type="button"
    variant="destructive"
    onClick={onClick}
    className={className}
  >
    <Trash2 className="h-4 w-4" />
    <span className="sr-only">Удалить</span>
  </Button>
);

export const ResetButton = ({
  isDirty,
  onClick,
  className,
}: ToggleableActionButtonProps) => (
  <Button
    type="button"
    variant="outline"
    disabled={!isDirty}
    onClick={onClick}
    className={cn('space-x-3', className)}
  >
    <RotateCcw className="h-4 w-4" />
    <span className="sr-only">Сбросить</span>
  </Button>
);

export const SaveButton = ({
  isDirty,
  formId,
  label = true,
  className,
}: {
  isDirty: boolean;
  formId?: string;
  label?: 'adaptive' | boolean;
  className?: string;
}) => (
  <Button
    form={formId}
    type="submit"
    disabled={!isDirty}
    className={cn('flex items-center gap-2', className)}
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
