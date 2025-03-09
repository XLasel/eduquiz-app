'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { Control, useForm } from 'react-hook-form';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { saveUserAnswer, setScore } from '@/redux/slices/testSessionSlice';
import { calculateScore } from '@/lib/utils';

import {
  currentUserAnswerSchema,
  CurrentUserAnswerValue,
  NumberAnswerValue,
} from '@/schemas/sessionTest';
import { Question, Test } from '@/schemas/test';

import { Button } from '@/components/shadcnUi/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/shadcnUi/card';
import { Checkbox } from '@/components/shadcnUi/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/shadcnUi/form';
import { Input } from '@/components/shadcnUi/input';
import { RadioGroup, RadioGroupItem } from '@/components/shadcnUi/radioGroup';

import { APP_ROUTES } from '@/constants';
import { useDebouncedCallback } from '@/hooks';

type FormValues = CurrentUserAnswerValue;

export const StepForm = ({
  test,
  currentStep,
  setShowResults,
}: {
  test: Test;
  currentStep: number;
  setShowResults: (value: boolean) => void;
}) => {
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

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { questions, id: testId } = test;
  const currentIndex = currentStep - 1;
  const currentQuestion = questions[currentIndex];
  const userAnswers = useAppSelector((state) => state.testSession.answers);
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

  const navigation = useMemo(
    () => ({
      next: () =>
        router.push(
          APP_ROUTES.TESTS.ROUND(
            testId,
            Math.min(questions.length, currentStep + 1)
          )
        ),
      previous: () =>
        router.push(
          APP_ROUTES.TESTS.ROUND(testId, Math.max(0, currentStep - 1))
        ),
    }),
    [router, testId, questions.length, currentStep]
  );

  const onSubmit = useCallback(
    (data: CurrentUserAnswerValue) => {
      saveAnswer(data);
      if (isLastStep && isReadyToComplete) {
        const score = calculateScore(userAnswers, test);
        dispatch(setScore(score));
        setShowResults(true);
      } else {
        navigation.next();
      }
    },
    [
      test,
      dispatch,
      userAnswers,
      saveAnswer,
      isLastStep,
      isReadyToComplete,
      setShowResults,
      navigation,
    ]
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

  if (!currentQuestion) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-destructive">
            Вопрос не найден
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-destructive">
            Пожалуйста, вернитесь к{' '}
            <Link href={APP_ROUTES.TESTS.LIST} className="hover:underline">
              списку тестов
            </Link>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Вопрос {currentStep} из {questions.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h4 className="mb-5 text-lg">{currentQuestion.title}</h4>
            {(() => {
              switch (currentQuestion.question_type) {
                case 'single':
                  return renderSingleChoice(
                    control as Control<
                      Extract<CurrentUserAnswerValue, { type: 'single' }>
                    >,
                    currentQuestion
                  );
                case 'multiple':
                  return renderMultipleChoice(
                    control as Control<
                      Extract<CurrentUserAnswerValue, { type: 'multiple' }>
                    >,
                    currentQuestion
                  );
                case 'number':
                  return renderNumberInput(
                    control as Control<NumberAnswerValue>
                  );
                default:
                  return null;
              }
            })()}
          </CardContent>
          <CardFooter className="flex flex-row-reverse justify-between">
            {isLastStep ? (
              <Button variant="brand" disabled={!isReadyToComplete}>
                Завершить тест
              </Button>
            ) : (
              <Button disabled={!isValid}>
                <span className="sr-only md:not-sr-only md:mr-2">
                  Следующий
                </span>
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
                <span className="sr-only md:not-sr-only md:ml-2">
                  Предыдущий
                </span>
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

const renderSingleChoice = (
  control: Control<Extract<CurrentUserAnswerValue, { type: 'single' }>>,
  currentQuestion: Question
) => (
  <FormField
    control={control}
    name="selectedAnswerId"
    render={({ field }) => (
      <div className="px-2">
        <RadioGroup
          onValueChange={(value) => {
            field.onChange(Number(value));
          }}
          defaultValue={field.value?.toString()}
        >
          {currentQuestion.answers?.map((option, i) => (
            <FormItem
              key={i}
              className="flex flex-row items-center space-x-3 space-y-0"
            >
              <FormControl>
                <RadioGroupItem
                  className="flex-shrink-0"
                  value={option.id.toString()}
                />
              </FormControl>
              <FormLabel className="cursor-pointer text-base font-normal leading-normal">
                {option.text}
              </FormLabel>
            </FormItem>
          ))}
        </RadioGroup>
      </div>
    )}
  />
);

const renderMultipleChoice = (
  control: Control<Extract<CurrentUserAnswerValue, { type: 'multiple' }>>,
  currentQuestion: Question
) => (
  <FormField
    control={control}
    name="selectedAnswerId"
    render={({ field }) => (
      <div className="space-y-2">
        {currentQuestion.answers?.map((option, i) => (
          <FormItem
            key={i}
            className="flex flex-row items-center space-x-3 space-y-0"
          >
            <FormControl>
              <Checkbox
                className="flex-shrink-0"
                checked={field.value?.includes(option.id)}
                onCheckedChange={(checked) => {
                  const currentValue = field.value;
                  return checked
                    ? field.onChange([...(currentValue || []), option.id])
                    : field.onChange(
                        currentValue?.filter((value) => value !== option.id)
                      );
                }}
              />
            </FormControl>
            <FormLabel className="cursor-pointer text-base font-normal leading-normal">
              {option.text}
            </FormLabel>
          </FormItem>
        ))}
      </div>
    )}
  />
);

const renderNumberInput = (control: Control<NumberAnswerValue>) => (
  <FormField
    control={control}
    name="numericAnswer"
    render={({ field }) => (
      <Input
        type="number"
        className="max-w-xs"
        placeholder="Ответ"
        {...field}
        value={field.value ?? ''}
        onChange={(e) => {
          const value = e.target.value;
          if (value.trim() === '') {
            field.onChange('');
          } else if (!isNaN(Number(value))) {
            field.onChange(Number(value));
          }
        }}
      />
    )}
  />
);
