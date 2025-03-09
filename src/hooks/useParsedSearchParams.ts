'use client';

import { useMemo } from 'react';

import { useSearchParams } from 'next/navigation';

import { searchParamsSchema } from '@/schemas/search';

import { DEFAULT_SEARCH_PARAMS } from '@/constants';

export const useParsedSearchParams = () => {
  const searchParams = useSearchParams();

  const searchParamsRecord = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams]
  );

  return useMemo(() => {
    try {
      return searchParamsSchema.parse(searchParamsRecord);
    } catch {
      return DEFAULT_SEARCH_PARAMS;
    }
  }, [searchParamsRecord]);
};
