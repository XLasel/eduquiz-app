import { Skeleton } from '@/components/shadcnUi/skeleton';

export const SkeletonTestDesignerForm = () => {
  return (
    <div className="flex flex-1 flex-col gap-6 md:min-w-[450px]">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap">
          <Skeleton className="h-8 w-64" />
          <div className="flex flex-1 justify-end gap-2 self-end sm:flex-initial">
            <Skeleton className="h-9 w-9 flex-shrink-0" />
            <Skeleton className="h-9 w-9 flex-shrink-0" />
            <Skeleton className="h-9 w-full min-w-9 md:w-[130px]" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="flex flex-1 flex-col gap-5">
        <Skeleton className="h-12 w-full" />
        <ul className="flex flex-col gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-[176px] w-full rounded-lg" />
          ))}
        </ul>
      </div>
    </div>
  );
};
