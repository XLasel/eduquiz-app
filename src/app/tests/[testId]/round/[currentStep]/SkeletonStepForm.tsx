import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/shadcnUi/card';
import { Skeleton } from '@/components/shadcnUi/skeleton';

export const SkeletonStepForm = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-5 h-7 w-3/4" />
        <div className="flex flex-col space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-5 w-48" />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-row-reverse justify-between">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-32" />
      </CardFooter>
    </Card>
  );
};
