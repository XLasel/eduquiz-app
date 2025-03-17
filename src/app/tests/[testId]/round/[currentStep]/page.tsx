'use client';

import { use, useCallback, useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { usePreviousRoutes } from '@/providers/RouteHistoryProvider';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectCurrentTest,
  selectShowCurrentTestSkeleton,
  selectShowTestForm,
} from '@/redux/selectors/testSelectors';
import { setScore } from '@/redux/slices/testSessionSlice';
import { calculateScore } from '@/lib/utils';

import { Button } from '@/components/shadcnUi/button';
import { Progress } from '@/components/shadcnUi/progress';
import { Skeleton } from '@/components/shadcnUi/skeleton';

import { APP_ROUTES, TESTS_LIST_ROUTE_PATTERN } from '@/constants';

import { QuestionList } from './QuestionList';
import { QuestionNotFound } from './QuestionNotFound';
import { ResultDisplay } from './ResultDisplay';
import { SkeletonStepForm } from './SkeletonStepForm';
import { StepForm } from './StepForm';

export type Navigation = {
  next: () => void;
  previous: () => void;
  goToQuestion: (step: number) => void;
};

const StepPage = ({
  params,
}: {
  params: Promise<{ testId: string; currentStep: string }>;
}) => {
  const { currentStep, testId } = use(params);
  const step = +currentStep;
  const id = +testId;

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { findRoute } = usePreviousRoutes();

  const showSkeleton = useAppSelector(selectShowCurrentTestSkeleton);
  const showForm = useAppSelector(selectShowTestForm);

  const test = useAppSelector(selectCurrentTest);
  const score = useAppSelector((state) => state.testSession.score);

  const userAnswers = useAppSelector((state) => state.testSession.answers);

  const [showResults, setShowResults] = useState(false);
  const [showQuestionList, setShowQuestionList] = useState(false);

  const totalQuestions = test?.questions?.length || 0;
  const isValidStep = step >= 1 && step <= totalQuestions;

  const isTestsSkeletonVisible = showSkeleton || test?.id !== id;
  const isShowForm = showForm && !isTestsSkeletonVisible;

  useEffect(() => {
    if (isShowForm) {
      if (step < 1) router.replace(APP_ROUTES.TESTS.ROUND(id, 1));
      if (step > test?.questions?.length)
        router.replace(APP_ROUTES.TESTS.ROUND(id, test?.questions?.length));
    }
  }, [step, test, router, id, isShowForm]);

  const progress = (step / (test?.questions?.length || 1)) * 100;

  const lastTestsRoute =
    findRoute(TESTS_LIST_ROUTE_PATTERN) || APP_ROUTES.TESTS.LIST;

  const navigation: Navigation = useMemo(
    () => ({
      next: () =>
        router.push(
          APP_ROUTES.TESTS.ROUND(
            id,
            Math.min(test?.questions?.length || 0, step + 1)
          )
        ),
      previous: () =>
        router.push(APP_ROUTES.TESTS.ROUND(id, Math.max(1, step - 1))),
      goToQuestion: (step: number) =>
        router.push(APP_ROUTES.TESTS.ROUND(id, step)),
    }),
    [router, id, test?.questions?.length, step]
  );

  const calculateScoreAndShowResults = useCallback(() => {
    if (!test) return;
    dispatch(setScore(calculateScore(userAnswers, test)));
    setShowResults(true);
  }, [userAnswers, test, dispatch]);

  if (isTestsSkeletonVisible) {
    return (
      <>
        <div className="flex flex-row flex-wrap justify-between gap-2 sm:flex-nowrap">
          <Skeleton className="h-9 w-1/2" />
          <Skeleton className="h-8 w-28" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-7" />
          </div>
          <Skeleton className="h-2" />
        </div>
        <div className="flex flex-col gap-4 md:gap-5">
          <SkeletonStepForm />
        </div>
      </>
    );
  }

  if (!isValidStep || !test?.questions[step - 1]) {
    return <QuestionNotFound />;
  }

  return (
    <>
      <>
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="flex flex-row flex-wrap justify-between gap-2 sm:flex-nowrap">
            <h1 className="text-clip text-3xl font-bold">{test!.title}</h1>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQuestionList(!showQuestionList)}
              className="text-sm"
            >
              Вопросы {step}/{test?.questions?.length}
            </Button>
          </div>
          {showQuestionList && (
            <QuestionList
              questions={test!.questions}
              step={step}
              userAnswers={userAnswers}
              goToQuestion={navigation.goToQuestion}
            />
          )}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Прогресс</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <div className="flex flex-col gap-4 md:gap-5">
          <StepForm
            questions={test!.questions}
            userAnswers={userAnswers}
            currentStep={step}
            calculateScore={calculateScoreAndShowResults}
            navigation={navigation}
          />
        </div>
      </>

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
