'use client';

import React from 'react';

import Link from 'next/link';

import { cn } from '@/lib/utils';

import { BasePageContainer } from '@/components/common';
import { Button, buttonVariants } from '@/components/shadcnUi/button';

import { APP_ROUTES } from '@/constants';

const Error = ({ error, reset }: { error: Error; reset: () => void }) => {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('logging error:', error);
    }
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center">
      <BasePageContainer
        marginTop="withSpacing"
        marginBottom="withSpacing"
        padding="withSpacing"
      >
        <div className="flex h-full flex-col items-center justify-center gap-6">
          <h2 className="text-center text-3xl font-semibold">
            Что-то пошло не так!
          </h2>
          <div className="flex max-w-xl flex-col items-center justify-center gap-4">
            <p className="text-center text-lg text-muted-foreground">
              {error?.message}
            </p>
            <Button
              variant="brand"
              size="lg"
              className="self-center rounded-full text-lg"
              onClick={() => reset()}
            >
              Попробовать снова
            </Button>
            <Link
              href={APP_ROUTES.HOME}
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'lg' }),
                'self-center rounded-full text-lg'
              )}
            >
              На главную
            </Link>
          </div>
        </div>
      </BasePageContainer>
    </div>
  );
};

export default Error;
