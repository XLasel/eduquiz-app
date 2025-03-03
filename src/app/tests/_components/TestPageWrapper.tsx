import { cn } from '@/lib/utils';

import { BackToTestButton } from './BackToTestButton';

export const TestPageWrapper = ({
  children,
  className,
  requireConfirmation = false,
}: {
  children: React.ReactNode;
  className?: string;
  requireConfirmation?: boolean;
}) => {
  return (
    <div className={cn('flex w-full grow flex-col gap-4 md:gap-6', className)}>
      <BackToTestButton requireConfirmation={requireConfirmation} />
      {children}
    </div>
  );
};
