'use client';

import { useSearchParams } from 'next/navigation';

export const useCallbackUrl = (): string | null => {
  const searchParams = useSearchParams();
  return searchParams?.get('callbackUrl') ?? null;
};
