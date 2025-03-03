import React from 'react';

import { BasePageContainer } from '@/components/common';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <BasePageContainer className="flex max-w-md grow items-center justify-center px-4 py-8 sm:px-6 sm:py-10 md:min-w-96">
      <div className="mx-auto flex w-full flex-col gap-4">{children}</div>
    </BasePageContainer>
  );
};

export default AuthLayout;
