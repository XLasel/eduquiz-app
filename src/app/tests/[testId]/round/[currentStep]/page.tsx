'use client';

import { use, useState } from 'react';

import { useRouter } from 'next/navigation';

import { usePreviousRoutes } from '@/providers/RouteHistoryProvider';
import { useAppSelector } from '@/redux/hooks';
import {
  selectCurrentTest,
  selectIsNotEmptyCurrentTest,
  selectIsTestsSkeletonVisible,
} from '@/redux/selectors/testSelectors';

import { Progress } from '@/components/shadcnUi/progress';
import { Skeleton } from '@/components/shadcnUi/skeleton';

import { APP_ROUTES, TESTS_LIST_ROUTE_PATTERN } from '@/constants';

import { ResultDisplay } from './ResultDisplay';
import { SkeletonStepForm } from './SkeletonStepForm';
import { StepForm } from './StepForm';

const StepPage = ({
  params,
}: {
  params: Promise<{ testId: string; currentStep: string }>;
}) => {
  const router = useRouter();
  const { findRoute } = usePreviousRoutes();

  const test = useAppSelector(selectCurrentTest);
  const isTestsSkeletonVisible = useAppSelector(selectIsTestsSkeletonVisible);
  const isNotEmptyCurrentTest = useAppSelector(selectIsNotEmptyCurrentTest);
  const score = useAppSelector((state) => state.testSession.score);

  const [showResults, setShowResults] = useState(false);

  const { currentStep } = use(params);

  const lastTestsRoute =
    findRoute(TESTS_LIST_ROUTE_PATTERN) || APP_ROUTES.TESTS.LIST;

  return (
    <>
      {isTestsSkeletonVisible ? (
        <Skeleton className="mt-2 h-1" />
      ) : (
        <Progress
          value={(Number(currentStep) / (test?.questions?.length || 1)) * 100}
          className="mt-2 h-1"
        />
      )}

      <div className="flex flex-col gap-4 md:gap-5">
        {isTestsSkeletonVisible && <Skeleton className="h-9 w-1/2" />}
        {isNotEmptyCurrentTest && (
          <h1 className="text-3xl font-bold">{test!.title}</h1>
        )}
        {isTestsSkeletonVisible && <SkeletonStepForm />}
        {isNotEmptyCurrentTest && (
          <StepForm
            test={test!}
            currentStep={Number(currentStep)}
            setShowResults={setShowResults}
          />
        )}
      </div>

      <ResultDisplay
        showResults={showResults}
        setShowResults={setShowResults}
        confirmExit={() => router.push(lastTestsRoute)}
        score={score ?? 0}
        testLength={test?.questions?.length ?? 0}
      />
    </>
  );
};

export default StepPage;
