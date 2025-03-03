import { LinkCallback } from '@/components/common';

import { APP_ROUTES } from '@/constants';

import { SignInForm } from './SignInForm';

const Login = () => (
  <>
    <div className="flex flex-col gap-2">
      <h1 className="text-ellipsis text-3xl font-bold tracking-tight md:text-4xl">
        С&nbsp;возвращением!
      </h1>
      <p>
        Ещё не с&nbsp;нами?{' '}
        <LinkCallback name="Регистрация" href={APP_ROUTES.AUTH.REGISTER} />
      </p>
    </div>
    <SignInForm />
  </>
);
export default Login;
