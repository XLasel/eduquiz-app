'use client';

import { use, useEffect } from 'react';

import { notFound } from 'next/navigation';

import { startTestFetch } from '@/redux/actions/testActions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectTestStateError } from '@/redux/selectors/testSelectors';
import { getErrorMessage } from '@/lib/utils';

const TestLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ testId: string }>;
}) => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectTestStateError);
  const { testId } = use(params);

  useEffect(() => {
    const testIdNumber = Number(testId);
    if (isNaN(testIdNumber) || testIdNumber <= 0) {
      notFound();
    }
    dispatch(startTestFetch(testIdNumber));
  }, [testId, dispatch]);

  if (error) {
    if (error.code === 404) {
      notFound();
    }
    throw new Error(error.message ?? getErrorMessage());
  }
  return children;
};

export default TestLayout;
