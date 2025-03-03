'use client';

import Link from 'next/link';

import { BasePageContainer } from '@/components/common';

interface Props {
  error: Error;
  reset: () => void;
}

const GlobalError = ({ error, reset }: Props) => {
  return (
    <html lang="ru">
      <body>
        <main className="flex min-h-[100vh] items-center justify-center px-4">
          <BasePageContainer className="py-16 text-center">
            <div className="mb-4 flex justify-center text-destructive">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 className="mb-4 text-3xl font-bold text-destructive">
              Произошла ошибка
            </h2>
            <p className="mb-4 text-lg font-medium text-gray-600">
              &ldquo;{error?.message}&rdquo;
            </p>

            <p className="mb-8 text-lg font-medium text-gray-600">
              Пожалуйста, повторите попытку через несколько секунд. Мы скоро
              вернемся и продолжим работу. Если проблема не решится, пожалуйста,
              сообщите об этом разработчику на GitHub.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => reset()}
                className="rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
              >
                Попробовать снова
              </button>

              <Link
                href={'/'}
                className="rounded-lg bg-brand px-6 py-3 font-medium text-brand-foreground transition hover:bg-brand/90"
              >
                На главную
              </Link>
            </div>
          </BasePageContainer>
        </main>
      </body>
    </html>
  );
};

export default GlobalError;
