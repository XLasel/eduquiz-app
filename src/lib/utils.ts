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
 * Объединяет CSS классы с помощью tailwind-merge и clsx
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/**
 * Получает первые буквы из имени пользователя для аватара
 */
export const getUsernameLetters = (displaName: string) => {
  const [a, b] = displaName.split('@')[0].split(/\.|\s|-|_/);

  if (!b) {
    return `${a[0]?.toUpperCase() ?? ''}${a[1]?.toUpperCase() ?? ''}`;
  }

  return `${a[0]?.toUpperCase() ?? ''}${b[0]?.toUpperCase() ?? ''}`;
};

/**
 * Находит индексы элементов для обмена при изменении порядка
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
 * Обрабатывает изменение порядка элементов
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
 * Извлекает ID сессии из заголовка cookie
 */
export const extractSessionId = (setCookieHeader: string): string => {
  return setCookieHeader.split('; ')[0].split('=')[1];
};

/**
 * Получает абсолютный URL для указанного пути
 */
export const getAbsoluteUrl = (path: string) => {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
};

/**
 * Генерирует ключ кэша на основе параметров поиска
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
 * Сравнивает два ключа кэша
 */
export const compareCacheKeys = (a: string, b: string) => {
  const aParts = a.split('_').slice(1);
  const bParts = b.split('_').slice(1);
  return aParts.join('_') === bParts.join('_');
};

/**
 * Вычисляет оценку на основе ответов пользователя
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
 * Получает сообщение об ошибке
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
 * Получает сообщение об успешном выполнении операции с тестом
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
 * Получает сообщение об успешной авторизации
 */
export const getAuthSuccessMessage = (
  key?: keyof typeof AUTH_SUCCESS_MESSAGES
): string => {
  return AUTH_SUCCESS_MESSAGES[key ?? 'default'];
};

/**
 * Делает выбранные свойства типа обязательными
 */
export type MakePropertyRequired<T, K extends keyof T> = Pick<Required<T>, K> &
  Omit<T, K>;
