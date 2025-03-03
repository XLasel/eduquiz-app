'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useAppSelector } from '@/redux/hooks';
import {
  selectTestStateError,
  selectTestStateStatus,
} from '@/redux/selectors/testSelectors';
import { getErrorMessage, getTestSuccessMessage } from '@/lib/utils';

import { Operation, TestEntity } from '@/constants';

import { useToast } from './useToast';

interface UseHandleTestStatusParams {
  entity: TestEntity;
  operation: Operation;
  redirectUrl?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useHandleTestStatus = ({
  entity,
  operation,
  redirectUrl,
  onSuccess,
  onError,
}: UseHandleTestStatusParams) => {
  const status = useAppSelector(selectTestStateStatus);
  const error = useAppSelector(selectTestStateError);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (error?.code) {
      const expectedError = getErrorMessage(error.code, entity);
      if (error.message === expectedError) {
        toast({
          title: 'Ошибка',
          description: error.message,
          variant: 'destructive',
        });
        onError?.(error.message);
      }
    }

    const successMessage = getTestSuccessMessage(entity, operation);
    if (status.message === successMessage) {
      toast({
        title: 'Успешно',
        description: successMessage,
      });

      onSuccess?.();

      if (redirectUrl) {
        router.push(redirectUrl);
        router.refresh();
      }
    }
  }, [
    toast,
    status,
    error,
    entity,
    operation,
    redirectUrl,
    router,
    onSuccess,
    onError,
  ]);
};
