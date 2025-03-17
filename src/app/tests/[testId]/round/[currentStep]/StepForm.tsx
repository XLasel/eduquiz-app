'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { Control, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useAppDispatch } from '@/redux/hooks';
import { saveUserAnswer } from '@/redux/slices/testSessionSlice';

import {
  currentUserAnswerSchema,
  CurrentUserAnswerValue,
  NumberAnswerValue,
} from '@/schemas/sessionTest';
import { Question } from '@/schemas/test';
import { UserAnswerData } from '@/types/session';

import { QuestionTypeBadge } from '@/components/common';
import { Button } from '@/components/shadcnUi/button';
import { Form } from '@/components/shadcnUi/form';

import { useDebouncedCallback } from '@/hooks';

import { MultipleChoice, NumberInput, SingleChoice } from './ItemsChoice';
import { Navigation } from './page';

type FormValues = CurrentUserAnswerValue;

const getDefaultFormValues = (
  currentAnswer: FormValues | undefined,
  currentQuestion: Question
): FormValues => {
  const { id, question_type } = currentQuestion;
  const baseValues = {
    questionId: id,
    type: question_type,
  };

  switch (question_type) {
    case 'single':
      return {
        ...baseValues,
        type: 'single',
        selectedAnswerId: (currentAnswer?.selectedAnswerId as number) ?? null,
        numericAnswer: null,
      };
    case 'multiple':
      return {
        ...baseValues,
        type: 'multiple',
        selectedAnswerId: Array.isArray(currentAnswer?.selectedAnswerId)
          ? currentAnswer.selectedAnswerId
          : [],
        numericAnswer: null,
      };
    case 'number':
      return {
        ...baseValues,
        type: 'number',
        selectedAnswerId: [],
        numericAnswer: (currentAnswer?.numericAnswer as number) ?? null,
      };
  }
};

export const StepForm = ({
  questions,
  userAnswers,
  currentStep,
  calculateScore,
  navigation,
}: {
  questions: Question[];
  userAnswers: UserAnswerData[];
  currentStep: number;
  calculateScore: () => void;
  navigation: Navigation;
}) => {
  const dispatch = useAppDispatch();
  const currentQuestion = questions[currentStep - 1];
  const currentAnswer = userAnswers.find(
    (a) => a.questionId === currentQuestion?.id
  );

  const methods = useForm<FormValues>({
    defaultValues: currentQuestion
      ? getDefaultFormValues(currentAnswer, currentQuestion)
      : undefined,
    resolver: zodResolver(currentUserAnswerSchema),
    mode: 'onChange',
  });

  const {
    handleSubmit,
    watch,
    formState: { isDirty, isValid },
    control,
  } = methods;

  const formValues = watch();

  const isAnswerDifferent = useMemo(() => {
    return JSON.stringify(formValues) !== JSON.stringify(currentAnswer);
  }, [formValues, currentAnswer]);

  const saveAnswer = useCallback(
    (data: CurrentUserAnswerValue) => {
      dispatch(saveUserAnswer(data));
    },
    [dispatch]
  );

  const debouncedSaveAnswer = useDebouncedCallback(() => {
    if (isAnswerDifferent && isDirty && isValid) {
      handleSubmit((data) => saveAnswer(data))();
    }
  }, 500);

  useEffect(() => {
    debouncedSaveAnswer();
  }, [formValues, isAnswerDifferent, isDirty, isValid, debouncedSaveAnswer]);

  const isLastStep = currentStep === questions.length;
  const isReadyToComplete = questions.every((q) =>
    userAnswers.some((a) => a.questionId === q.id)
  );

  const onSubmit = useCallback(
    (data: CurrentUserAnswerValue) => {
      saveAnswer(data);
      if (isLastStep && isReadyToComplete) {
        calculateScore();
      } else {
        navigation.next();
      }
    },
    [saveAnswer, isLastStep, isReadyToComplete, calculateScore, navigation]
  );

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && isValid) {
        handleSubmit(onSubmit)();
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [handleSubmit, isValid, onSubmit]);

  return (
    <Form {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 md:gap-4"
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">
            {currentStep}. {currentQuestion.title}
          </h2>
          <QuestionTypeBadge type={currentQuestion.question_type} />
        </div>
        {(() => {
          switch (currentQuestion.question_type) {
            case 'single':
              return (
                <SingleChoice
                  control={
                    control as Control<
                      Extract<CurrentUserAnswerValue, { type: 'single' }>
                    >
                  }
                  currentQuestion={currentQuestion}
                />
              );
            case 'multiple':
              return (
                <MultipleChoice
                  control={
                    control as Control<
                      Extract<CurrentUserAnswerValue, { type: 'multiple' }>
                    >
                  }
                  currentQuestion={currentQuestion}
                />
              );
            case 'number':
              return (
                <NumberInput control={control as Control<NumberAnswerValue>} />
              );
            default:
              return null;
          }
        })()}
        <div className="flex flex-row-reverse justify-between">
          {isLastStep ? (
            <Button variant="brand" disabled={!isReadyToComplete}>
              Завершить тест
            </Button>
          ) : (
            <Button disabled={!isValid}>
              <span className="sr-only md:not-sr-only md:mr-2">Следующий</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
          {currentStep === 1 ? null : (
            <Button
              type="button"
              variant="outline"
              onClick={navigation.previous}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only md:not-sr-only md:ml-2">Предыдущий</span>
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
