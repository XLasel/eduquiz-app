'use client';

import { useMemo } from 'react';

import { useSearchParams } from 'next/navigation';

import { searchParamsSchema } from '@/schemas/search';

export const useParsedSearchParams = () => {
  const searchParams = useSearchParams();

  const searchParamsRecord = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams]
  );

  const parsedSearchParams = useMemo(() => {
    try {
      return searchParamsSchema.parse(searchParamsRecord);
    } catch {
      return {};
    }
  }, [searchParamsRecord]);

  return parsedSearchParams;
};
