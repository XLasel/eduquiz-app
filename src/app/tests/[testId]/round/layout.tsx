'use client';

import { useEffect } from 'react';

import { useAppDispatch } from '@/redux/hooks';
import { resetSession } from '@/redux/slices/testSessionSlice';

import { TestPageWrapper } from '../../_components';

const RoundLayout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(resetSession());
    };
  }, [dispatch]);

  return (
    <TestPageWrapper requireConfirmation className="max-w-3xl">
      {children}
    </TestPageWrapper>
  );
};

export default RoundLayout;
