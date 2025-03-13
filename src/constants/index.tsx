import { SortEnum } from '@/schemas/search';
import { QuestionType } from '@/schemas/test';

export const MAX_RETRY_COUNT = 3;

export const APP_ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
  TESTS: {
    LIST: '/tests',
    CREATE: '/tests/create',
    EDIT: (testId: number) => `/tests/${testId}/edit`,
    ROUND: (testId: number, step: number) => `/tests/${testId}/round/${step}`,
    RESULTS: (testId: number) => `/tests/${testId}/results`,
  },
} as const;

export const TESTS_LIST_ROUTE_PATTERN = /^\/tests(?:\?.*)?$/;

export const EMPTY_OPTION = { text: '', is_right: false };

export const EMPTY_QUESTION = {
  title: '',
  question_type: 'single' as QuestionType,
  answer: null,
  answers: [EMPTY_OPTION],
};
export const SESSION_COOKIE_NAME = '_session_id';

export const DEFAULT_SEARCH_PARAMS: {
  page: number;
  per: number;
  search: string;
  sort: SortEnum;
} = {
  page: 1,
  per: 5,
  search: '',
  sort: 'created_at_desc',
};

export const ERROR_MESSAGES: Record<string, string> = {
  default: 'Произошла неизвестная ошибка',
  '401': 'Сеанс не найден или истек. Пожалуйста, войдите снова.',
  '403': 'Доступ запрещен. У вас нет прав для выполнения этого действия.',
  '404': 'Ресурс не найден. Пожалуйста, проверьте данные.',
  '500': 'На сервере произошла ошибка. Пожалуйста, повторите попытку позже.',

  'user:403': 'Доступ запрещен. Неверный код администратора.',

  'answer:404': 'Ответ не найден. Проверьте ID или обратитесь к поддержке.',
  'question:404':
    'Вопрос не найден. Проверьте данные или обратитесь к поддержке.',
  'test:404': 'Тест не найден. Убедитесь, что данные верны.',
  'user:404': 'Пользователь не найден.',

  'session:400': 'Неправильное имя пользователя или пароль.',
  'user:400': 'Ошибка при создании пользователя. Проверьте введенные данные.',
  'answer:400': 'Неверные данные ответа.',
  'question:400': 'Неверные данные вопроса.',
};

export const REQUEST_STATUS = {
  INITIALIZING: 'initializing',
  IDLE: 'idle',
  PENDING: 'pending',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export type RequestStatus =
  (typeof REQUEST_STATUS)[keyof typeof REQUEST_STATUS];

export const TEST_ENTITY = {
  TEST: 'test',
  QUESTION: 'question',
  ANSWER: 'answer',
} as const;

export const AUTH_ENTITY = {
  USER: 'user',
  SESSION: 'session',
} as const;

export const OperationTypes = {
  UPDATE: 'update',
  CREATE: 'create',
  DELETE: 'delete',
} as const;

export const AUTH_OPERATIONS_KEYS = {
  SIGN_UP: 'signUp',
  SIGN_IN: 'signIn',
  FETCH_CURRENT_USER: 'fetchCurrentUser',
  LOG_OUT: 'logOut',
};

export type TestEntity = (typeof TEST_ENTITY)[keyof typeof TEST_ENTITY];
export type Operation = (typeof OperationTypes)[keyof typeof OperationTypes];

export const TEST_SUCCESS_MESSAGES: Record<string, string> = {
  default: 'Операция завершена успешна',
  [OperationTypes.CREATE]: 'Создание завершено успешно',
  [OperationTypes.UPDATE]: 'Обновление завершено успешно',
  [OperationTypes.DELETE]: 'Удаление завершено успешно',

  [`${TEST_ENTITY.TEST}:${OperationTypes.CREATE}`]: 'Тест успешно создан',
  [`${TEST_ENTITY.TEST}:${OperationTypes.UPDATE}`]: 'Тест успешно обновлен',
  [`${TEST_ENTITY.TEST}:${OperationTypes.DELETE}`]: 'Тест успешно удален',

  [`${TEST_ENTITY.QUESTION}:${OperationTypes.CREATE}`]: 'Вопрос успешно создан',
  [`${TEST_ENTITY.QUESTION}:${OperationTypes.UPDATE}`]:
    'Вопрос успешно обновлен',
  [`${TEST_ENTITY.QUESTION}:${OperationTypes.DELETE}`]: 'Вопрос успешно удален',

  [`${TEST_ENTITY.ANSWER}:${OperationTypes.CREATE}`]: 'Ответ успешно создан',
  [`${TEST_ENTITY.ANSWER}:${OperationTypes.UPDATE}`]: 'Ответ успешно обновлен',
  [`${TEST_ENTITY.ANSWER}:${OperationTypes.DELETE}`]: 'Ответ успешно удален',
};

export const AUTH_SUCCESS_MESSAGES: Record<string, string> = {
  default: 'Операция завершена успешна',
  [AUTH_OPERATIONS_KEYS.SIGN_UP]: 'Регистрация завершена успешно',
  [AUTH_OPERATIONS_KEYS.SIGN_IN]: 'Вы успешно вошли',
  [AUTH_OPERATIONS_KEYS.FETCH_CURRENT_USER]: 'Найден активный сеанс',
  [AUTH_OPERATIONS_KEYS.LOG_OUT]: 'Вы успешно вышли',
};

export const AUTH_STATUS = {
  ...REQUEST_STATUS,
  UNAUTHORIZED: 'unauthorized',
  AUTHORIZED: 'authorized',
} as const;

export type AuthStatus = (typeof AUTH_STATUS)[keyof typeof AUTH_STATUS];
