'use client';

import { useAppSelector } from '@/redux/hooks';
import { selectIsAuthenticated } from '@/redux/selectors/authSelectors';

export const IfAuthenticated = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isAuthenticatedVisible = useAppSelector(selectIsAuthenticated);

  return isAuthenticatedVisible ? children : null;
};
