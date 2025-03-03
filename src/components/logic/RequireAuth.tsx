'use client';

import { useEffect } from 'react';
import { ComponentType } from 'react';

import { useRouter } from 'next/navigation';

import { useAppSelector } from '@/redux/hooks';
import {
  selectIsAuthenticated,
  selectIsSkeletonVisible,
  selectIsUnauthenticated,
} from '@/redux/selectors/authSelectors';

import DefaultLoading from '@/app/loading';
import { APP_ROUTES } from '@/constants';

type RequireAuthOptions = {
  LoadingComponent?: ComponentType;
};

export const RequireAuth = <P extends object>(
  Component: ComponentType<P>,
  options: RequireAuthOptions = {}
) => {
  const AuthenticatedComponent = (props: P) => {
    const router = useRouter();
    const isUnauthenticated = useAppSelector(selectIsUnauthenticated);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isSkeletonVisible = useAppSelector(selectIsSkeletonVisible);

    const LoadingComponent = options.LoadingComponent || DefaultLoading;

    useEffect(() => {
      if (isUnauthenticated) router.push(APP_ROUTES.AUTH.LOGIN);
    }, [isUnauthenticated, router]);

    if (isSkeletonVisible) return <LoadingComponent />;

    if (isAuthenticated) return <Component {...props} />;

    return <LoadingComponent />;
  };

  return AuthenticatedComponent;
};
