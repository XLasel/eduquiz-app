import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
} from '@reduxjs/toolkit';
import { AxiosError, AxiosResponse } from 'axios';
import { call, put } from 'typed-redux-saga';
import { ZodSchema } from 'zod';

type ApiFunc<T, R> = T extends undefined | void
  ? () => Promise<AxiosResponse<R>>
  : (params: T) => Promise<AxiosResponse<R>>;

export interface SagaWrapperParams<T, TData, F extends ApiFunc<T, TData>> {
  entity: string;
  api: F;
  payload?: T;
  schema?: ZodSchema;
  setPending?: ActionCreatorWithoutPayload<string>;
  setSuccess?: ActionCreatorWithoutPayload<string>;
  setError?: ActionCreatorWithPayload<{ code: number; entity: string }>;
  handleDataWithPayload?: ActionCreatorWithPayload<TData, string>;
  handleDataWithoutPayload?: ActionCreatorWithoutPayload<string>;
  successCallback?: (data: TData) => void;
  errorCallback?: (error: {
    status: number;
    message: string;
    data: unknown | null;
  }) => void;
}

type ErrorWithStatus = Error & { status: number; responseData?: unknown };

export const parseData = <TData>(
  data: unknown,
  schema?: ZodSchema<TData>
): TData => {
  if (!schema) {
    return data as TData;
  }

  const parsedData = schema.safeParse(data);

  if (parsedData.success) {
    return parsedData.data;
  } else {
    const validationError = new Error(
      `Ошибка при парсинге данных: ${parsedData.error.message}`
    ) as ErrorWithStatus;
    validationError.status = 422;
    throw validationError;
  }
};

export const handleApiError = (status: number, data: unknown): never => {
  const error = new Error(
    `API вернул статус ${status}: ${JSON.stringify(data)}`
  ) as ErrorWithStatus;
  error.status = status;
  error.responseData = data;
  throw error;
};

export function* createSagaWrapper<T, TData, F extends ApiFunc<T, TData>>({
  entity,
  api,
  payload,
  schema,
  setPending,
  setSuccess,
  setError,
  handleDataWithPayload,
  handleDataWithoutPayload,
  successCallback,
  errorCallback,
}: SagaWrapperParams<T, TData, F>): Generator {
  if (setPending) yield* put(setPending());

  try {
    const response = payload
      ? yield* call(
          api as (params: T) => Promise<AxiosResponse<TData>>,
          payload
        )
      : yield* call(api as () => Promise<AxiosResponse<TData>>);

    if (response.status >= 200 && response.status < 300) {
      const { data } = response;
      const parsedData: TData = parseData(data, schema);

      if (handleDataWithPayload) {
        yield* put(handleDataWithPayload(parsedData));
      } else if (handleDataWithoutPayload) {
        yield* put(handleDataWithoutPayload());
      }

      if (setSuccess) yield* put(setSuccess());
      if (successCallback) yield* call(successCallback, parsedData);
    } else {
      handleApiError(response.status, response.data);
    }
  } catch (error: unknown) {
    const errorStatus =
      (error as ErrorWithStatus).status ||
      (error as AxiosError).response?.status ||
      500;
    const errorMessage =
      typeof (error as ErrorWithStatus).message === 'string'
        ? (error as ErrorWithStatus).message
        : JSON.stringify((error as AxiosError).response?.data) ||
          'Произошла ошибка. Попробуйте позже.';
    const errorObject = {
      status: errorStatus,
      message: errorMessage,
      data: (error as ErrorWithStatus).responseData || null,
    };

    if (setError) yield* put(setError({ code: errorStatus, entity }));
    if (errorCallback) yield* call(errorCallback, errorObject);
  }
}
