import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const containerVariants = cva('container mx-auto', {
  variants: {
    marginTop: {
      none: '',
      withSpacing: 'mt-4 md:mt-6',
    },
    marginBottom: {
      none: '',
      withSpacing: 'mb-4 md:mb-6',
    },
    padding: {
      none: '',
      withSpacing: 'px-4 sm:px-6',
    },
  },
  defaultVariants: {
    marginTop: 'none',
    marginBottom: 'none',
    padding: 'none',
  },
});

export const BasePageContainer = ({
  children,
  className,
  marginTop,
  marginBottom,
  padding,
}: {
  children: React.ReactNode;
  className?: string;
} & VariantProps<typeof containerVariants>) => {
  return (
    <div
      className={cn(
        containerVariants({ marginTop, marginBottom, padding }),
        className
      )}
    >
      {children}
    </div>
  );
};
