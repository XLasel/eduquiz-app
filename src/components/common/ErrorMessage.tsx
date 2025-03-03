import { cn } from '@/lib/utils';

import { FormMessageVariants } from '@/components/shadcnUi/form';

export const ErrorMessage = ({
  message,
  className,
}: {
  message?: string;
  className?: string;
}) => {
  if (!message) return null;
  return <p className={cn(FormMessageVariants(), className)}>{message}</p>;
};
