'use client';

import { TestPageWrapper } from './_components';

const NotFound = () => {
  return (
    <TestPageWrapper className="items-center justify-center">
      <div className="flex h-full max-w-3xl grow flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-6xl font-bold text-secondary-foreground">404</h1>
        <p className="text-xl text-muted-foreground">Упс! Тест не найден.</p>
      </div>
    </TestPageWrapper>
  );
};

export default NotFound;
