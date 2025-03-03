'use client';

import { useCallback } from 'react';

import { useRouter } from 'next/navigation';

import { LogIn } from 'lucide-react';

import { logOutRequest } from '@/redux/actions/authActions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectCurrentUser,
  selectIsSkeletonVisible,
} from '@/redux/selectors/authSelectors';

import { IfAuthenticated, IfUnauthenticated } from '@/components/logic';
import { Button } from '@/components/shadcnUi/button';
import { Skeleton } from '@/components/shadcnUi/skeleton';

import { APP_ROUTES } from '@/constants';
import { useHandleAuthStatus } from '@/hooks';

import { Profile } from '../Profile';

export const UserActionButtons = ({
  onClick,
}: {
  onClick?: (href: string) => void;
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectCurrentUser);
  const isSkeletonVisible = useAppSelector(selectIsSkeletonVisible);

  const handleLogout = useCallback(() => {
    dispatch(logOutRequest());
  }, [dispatch]);

  const handleClick = useCallback(
    (href: string) => (onClick ? onClick(href) : router.push(href)),
    [onClick, router]
  );

  useHandleAuthStatus({
    successType: 'logOut',
    redirectUrl: APP_ROUTES.HOME,
  });

  if (isSkeletonVisible) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  return (
    <>
      <IfAuthenticated>
        <Profile
          username={user?.username ?? ''}
          isAdmin={user?.is_admin ?? false}
          handleLogout={handleLogout}
        />
      </IfAuthenticated>
      <IfUnauthenticated>
        <div className="flex w-full gap-2">
          <Button
            className="hidden lg:inline-flex"
            variant="ghost"
            onClick={() => handleClick(APP_ROUTES.AUTH.REGISTER)}
          >
            Зарегистрироваться
          </Button>
          <Button
            className="w-full lg:w-auto"
            onClick={() => handleClick(APP_ROUTES.AUTH.LOGIN)}
          >
            <LogIn className="mr-2 h-4 w-4" /> Войти
          </Button>
        </div>
      </IfUnauthenticated>
    </>
  );
};
