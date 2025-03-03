'use client';

import { useAppSelector } from '@/redux/hooks';
import { selectIsUnauthenticated } from '@/redux/selectors/authSelectors';

export const IfUnauthenticated = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isUnauthenticatedVisible = useAppSelector(selectIsUnauthenticated);

  return isUnauthenticatedVisible ? children : null;
};
