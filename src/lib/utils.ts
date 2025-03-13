import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { UserAnswer } from '@/redux/slices/testSessionSlice';

import { SearchParams } from '@/schemas/search';
import { Test } from '@/schemas/test';

import {
  AUTH_SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  TEST_SUCCESS_MESSAGES,
} from '@/constants';

/**
 * Merges CSS classes using tailwind-merge and clsx
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/**
 * Gets the first letters from the user's name for an avatar
 */
export const getUsernameLetters = (displaName: string) => {
  const [a, b] = displaName.split('@')[0].split(/\.|\s|-|_/);

  if (!b) {
    return `${a[0]?.toUpperCase() ?? ''}${a[1]?.toUpperCase() ?? ''}`;
  }

  return `${a[0]?.toUpperCase() ?? ''}${b[0]?.toUpperCase() ?? ''}`;
};

/**
 * Finds the indexes of elements to swap when changing order
 */
export const getFieldIndexesToSwap = (
  originalOrder: string[],
  newOrder: string[]
): [number | undefined, number | undefined] => {
  let indexA: number | undefined;
  let indexB: number | undefined;

  for (let i = 0; i < originalOrder.length; i++) {
    if (originalOrder[i] !== newOrder[i]) {
      if (indexA === undefined) {
        indexA = i;
      } else {
        indexB = i;
        break;
      }
    }
  }

  return [indexA, indexB];
};

/**
 * Handles element reordering
 */
export const onReorder = (
  newOrder: string[],
  fields: { id: string }[],
  swap: (indexA: number, indexB: number) => void
) => {
  const originalOrder = fields.map((field) => field.id);
  const [indexA, indexB] = getFieldIndexesToSwap(originalOrder, newOrder);

  if (indexA !== undefined && indexB !== undefined) {
    swap(indexA, indexB);
  }
};

/**
 * Extracts the session ID from the cookie header
 */
export const extractSessionId = (setCookieHeader: string): string => {
  return setCookieHeader.split('; ')[0].split('=')[1];
};

/**
 * Gets the absolute URL for the specified path
 */
export const getAbsoluteUrl = (path: string) => {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
};

/**
 * Generates a cache key based on search parameters
 */
export const generateCacheKey = (cacheKey: SearchParams): string => {
  const { sort, page, per, search } = cacheKey;
  const params = new URLSearchParams({
    page: page.toString(),
    per: per.toString(),
    search,
    sort,
  }).toString();

  return `cache_key_${params}`;
};

/**
 * Compares two cache keys
 */
export const compareCacheKeys = (a: string, b: string) => {
  const aParts = a.split('_').slice(1);
  const bParts = b.split('_').slice(1);
  return aParts.join('_') === bParts.join('_');
};

/**
 * Calculates the score based on user answers
 */
export const calculateScore = (
  userAnswers: UserAnswer[],
  test: Test
): number => {
  return test.questions.reduce((totalScore, question) => {
    const userAnswer = userAnswers.find(
      (answer) => answer.questionId === question.id
    );

    if (!userAnswer) return totalScore;

    const scoreHandlers = {
      single: () => {
        const correctAnswer = question.answers.find(
          (answer) => answer.is_right
        );
        return correctAnswer?.id === userAnswer.selectedAnswerId;
      },

      multiple: () => {
        const correctAnswerIds = question.answers
          .filter((answer) => answer.is_right)
          .map((answer) => answer.id);

        const selectedIds = userAnswer.selectedAnswerId as number[];

        return (
          Array.isArray(selectedIds) &&
          correctAnswerIds.every((id) => selectedIds.includes(id)) &&
          correctAnswerIds.length === selectedIds.length
        );
      },

      number: () => userAnswer.numericAnswer === question.answer,
    };

    const isCorrect = scoreHandlers[question.question_type]();
    return isCorrect ? totalScore + 1 : totalScore;
  }, 0);
};

/**
 * Retrieves an error message
 */
export const getErrorMessage = (status?: number, entity?: string): string => {
  if (entity && status) {
    const specificKey = `${entity}:${status}`;
    if (ERROR_MESSAGES[specificKey]) return ERROR_MESSAGES[specificKey];
  }

  if (status) {
    const genericKey = status.toString();
    if (ERROR_MESSAGES[genericKey]) return ERROR_MESSAGES[genericKey];
  }

  return ERROR_MESSAGES['default'] ?? 'Произошла неизвестная ошибка';
};

/**
 * Retrieves a success message for a test operation
 */
export const getTestSuccessMessage = (
  entity?: string,
  operation?: string
): string => {
  const key =
    entity && operation ? `${entity}:${operation}` : operation || 'default';
  return TEST_SUCCESS_MESSAGES[key];
};

/**
 * Retrieves a success message for authentication
 */
export const getAuthSuccessMessage = (
  key?: keyof typeof AUTH_SUCCESS_MESSAGES
): string => {
  return AUTH_SUCCESS_MESSAGES[key ?? 'default'];
};

/**
 * Makes selected properties of a type required
 */
export type MakePropertyRequired<T, K extends keyof T> = Pick<Required<T>, K> &
  Omit<T, K>;

/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Formats error messages
 */
export const formatErrors = (errors: Record<string, string[]>) => {
  return (
    Object.entries(errors)
      .map(
        ([field, messages]) =>
          `${capitalize(field.replace(/_/g, ' '))}: ${messages.join(', ')}`
      )
      .join('. ') + '.'
  );
};
