'use client';

import { useEffect } from 'react';

import { fetchCurrentUserRequest } from '@/redux/actions/authActions';
import { useAppDispatch } from '@/redux/hooks';

export const UserInitializer = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUserRequest());
  }, [dispatch]);

  return null;
};
