'use client';

import { signInRequest } from '@/redux/actions/authActions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectIsAuthLoading } from '@/redux/selectors/authSelectors';

import { signInFormSchema, SignInValues } from '@/schemas/auth';
import { SignInPayload } from '@/types/auth';

import { AuthForm, FieldConfig } from '@/components/common';

import { APP_ROUTES } from '@/constants';
import { useHandleAuthStatus, useIsClient } from '@/hooks';
import { useCallbackUrl } from '@/hooks';

const SIGN_IN_FORM_FIELDS: FieldConfig<SignInValues>[] = [
  {
    name: 'username',
    label: 'Никнейм',
    type: 'text',
    placeholder: 'Имя пользователя',
  },
  {
    name: 'password',
    label: 'Пароль',
    type: 'password',
    placeholder: 'Пароль',
  },
];

export const SignInForm = () => {
  const isClient = useIsClient();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsAuthLoading);

  const callbackurl = useCallbackUrl();
  const redirectUrl = callbackurl || APP_ROUTES.TESTS.LIST;

  useHandleAuthStatus({
    successType: 'signIn',
    redirectUrl,
  });

  return (
    <AuthForm<SignInValues, SignInPayload>
      schema={signInFormSchema}
      onSubmit={(data) => dispatch(signInRequest(data))}
      defaultValues={{
        username: '',
        password: '',
      }}
      fields={SIGN_IN_FORM_FIELDS}
      loading={isClient && isLoading}
      submitLabel="Войти"
    />
  );
};
