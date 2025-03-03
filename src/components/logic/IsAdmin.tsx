'use client';

import { useEffect } from 'react';
import { ComponentType } from 'react';

import { useRouter } from 'next/navigation';

import { useAppSelector } from '@/redux/hooks';
import {
  selectIsAdmin,
  selectIsSkeletonVisible,
} from '@/redux/selectors/authSelectors';

import DefaultLoading from '@/app/loading';
import { APP_ROUTES } from '@/constants';

type IsAdminOptions = {
  LoadingComponent?: ComponentType;
};

export const IsAdmin = <P extends object>(
  Component: ComponentType<P>,
  options: IsAdminOptions = {}
) => {
  const AdminComponent = (props: P) => {
    const router = useRouter();
    const isAdmin = useAppSelector(selectIsAdmin);
    const isSkeletonVisible = useAppSelector(selectIsSkeletonVisible);

    const LoadingComponent = options.LoadingComponent || DefaultLoading;

    useEffect(() => {
      if (!isSkeletonVisible && !isAdmin) {
        router.push(APP_ROUTES.HOME);
      }
    }, [isSkeletonVisible, isAdmin, router]);

    if (isSkeletonVisible) return <LoadingComponent />;
    if (isAdmin) return <Component {...props} />;

    return <LoadingComponent />;
  };

  return AdminComponent;
};
