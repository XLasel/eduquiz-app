import { Skeleton } from '@/components/shadcnUi/skeleton';

export const SkeletonStepForm = () => {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-6 w-3/4" />
      <div className="flex flex-col gap-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-9 w-12 md:w-32" />
        <Skeleton className="h-9 w-12 md:w-32" />
      </div>
    </div>
  );
};
