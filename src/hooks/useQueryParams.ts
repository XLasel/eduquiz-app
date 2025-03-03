'use client';

import { useCallback, useMemo } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type TParamsToAdd = {
  [key: string]: string | string[] | null | undefined;
};

export const useQueryParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentParams = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams]
  );

  const updateQueryParams = useCallback(
    ({
      paramsToAdd = {},
      paramsToRemove = [],
      replace = false,
    }: {
      paramsToAdd?: TParamsToAdd;
      paramsToRemove?: string[];
      replace?: boolean;
    } = {}) => {
      const updatedParams = new URLSearchParams(currentParams.toString());

      Object.entries(paramsToAdd).forEach(([key, value]) => {
        if (value === undefined || value === '' || value === null) {
          updatedParams.delete(key);
        } else if (Array.isArray(value)) {
          updatedParams.delete(key);
          value.forEach((val) => updatedParams.append(key, val));
        } else {
          updatedParams.set(key, value);
        }
      });

      paramsToRemove.forEach((key) => updatedParams.delete(key));

      const newRoute = `${pathname}?${updatedParams.toString()}`;

      if (replace) {
        router.replace(newRoute);
      } else {
        router.push(newRoute, { scroll: false });
      }
    },
    [router, pathname, currentParams]
  );

  return { updateQueryParams, currentParams };
};
