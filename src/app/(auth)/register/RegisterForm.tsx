'use client';

import React from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { signUpRequest } from '@/redux/actions/authActions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectIsAuthLoading } from '@/redux/selectors/authSelectors';

import { signUpFormSchema, SignUpValues } from '@/schemas/auth';
import { SignUpPayload } from '@/types/auth';

import { AuthForm, FieldConfig } from '@/components/common';
import { PasswordField } from '@/components/common/PasswordField';

import { APP_ROUTES } from '@/constants';
import { useHandleAuthStatus, useIsClient } from '@/hooks';
import { useCallbackUrl } from '@/hooks';

const REGISTER_FORM_FIELDS: FieldConfig<SignUpValues>[] = [
  {
    name: 'username',
    label: 'Никнейм',
    type: 'text',
    placeholder: 'Придумайте уникальное имя',
  },
  {
    name: 'password',
    label: 'Пароль',
    type: 'password',
    placeholder: 'Придумайте пароль',
  },
  {
    name: 'password_confirmation',
    label: 'Подтверждение пароля',
    type: 'password',
    placeholder: 'Повторите ввод пароля',
  },
  {
    name: 'is_admin',
    label: 'Зарегистрироваться как Администратор',
    type: 'checkbox',
    description:
      'Администратор обладает правами для создания и управления тестами',
  },
  {
    name: 'admin_code',
    label: 'Код Администратора',
    type: 'password',
    placeholder: 'Введите код доступа',
    description: 'Код необходим для регистрации как Администратор',
    render: ({ field, label, placeholder, description, form }) => {
      const { watch } = form;
      const isAdmin = watch('is_admin');

      return (
        <AnimatePresence mode="popLayout">
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <PasswordField
                className="px-1"
                {...{ field, label, placeholder, description }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      );
    },
  },
];

export const RegisterForm = () => {
  const isClient = useIsClient();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsAuthLoading);

  const callbackurl = useCallbackUrl();
  const redirectUrl = callbackurl || APP_ROUTES.TESTS.LIST;

  useHandleAuthStatus({ successType: 'signUp', redirectUrl });

  return (
    <AuthForm<SignUpValues, SignUpPayload>
      schema={signUpFormSchema}
      onSubmit={(data) => dispatch(signUpRequest(data))}
      defaultValues={{
        username: '',
        password: '',
        password_confirmation: '',
        is_admin: false,
        admin_code: '',
      }}
      fields={REGISTER_FORM_FIELDS}
      loading={isClient && isLoading}
      submitLabel="Зарегистрироваться"
    />
  );
};
