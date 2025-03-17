import * as React from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import { QuestionType } from '@/schemas/test';

const questionTypeBadgeVariants = cva(
  'inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      type: {
        single: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        multiple:
          'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        number:
          'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
      },
    },
    defaultVariants: {
      type: 'single',
    },
  }
);

const typeLabels: Record<QuestionType, string> = {
  single: 'Один из списка',
  multiple: 'Несколько из списка',
  number: 'Численный ответ',
};

const QuestionTypeBadge = ({
  className,
  type,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof questionTypeBadgeVariants>) => {
  return (
    <span
      className={cn(questionTypeBadgeVariants({ type, className }))}
      {...props}
    >
      {typeLabels[type as QuestionType]}
    </span>
  );
};

export { QuestionTypeBadge, questionTypeBadgeVariants };
