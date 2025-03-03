'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectAuthStateError,
  selectAuthStatus,
} from '@/redux/selectors/authSelectors';
import { clearStatus } from '@/redux/slices/authSlice';
import { getAuthSuccessMessage } from '@/lib/utils';

import { useToast } from './useToast';

interface UseHandleAuthStatusParams {
  successType: 'signIn' | 'signUp' | 'logOut';
  redirectUrl?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useHandleAuthStatus = ({
  successType,
  redirectUrl,
  onSuccess,
  onError,
}: UseHandleAuthStatusParams) => {
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthStateError);
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (error?.message) {
      if (error.code !== 401) {
        toast({
          title: 'Ошибка',
          description: error.message,
          variant: 'destructive',
        });
        onError?.(error.message);
        dispatch(clearStatus());
      }
    }

    const successMessage = getAuthSuccessMessage(successType);
    if (status.message === successMessage) {
      toast({
        title: 'Успешно',
        description: successMessage,
      });

      onSuccess?.();
      dispatch(clearStatus());

      if (redirectUrl) {
        router.push(redirectUrl);
        router.refresh();
      }
    }
  }, [
    successType,
    toast,
    status,
    error,
    dispatch,
    router,
    redirectUrl,
    onSuccess,
    onError,
  ]);
};
