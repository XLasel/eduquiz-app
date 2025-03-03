import { LinkCallback } from '@/components/common';

import { APP_ROUTES } from '@/constants';

import { RegisterForm } from './RegisterForm';

const RegisterPage = () => (
  <>
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        Создайте новый аккаунт
      </h1>
      <p>
        Уже есть аккаунт?{' '}
        <LinkCallback name="Вход" href={APP_ROUTES.AUTH.LOGIN} />
      </p>
    </div>
    <RegisterForm />
  </>
);
export default RegisterPage;
