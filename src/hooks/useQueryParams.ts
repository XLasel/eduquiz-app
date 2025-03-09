'use client';

import { useCallback } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type TParamsToAdd = {
  [key: string]: string | string[] | null | undefined;
};

export const useQueryParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

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
      const updatedParams = new URLSearchParams(searchParams.toString());

      Object.entries(paramsToAdd).forEach(([key, value]) => {
        if (!value) {
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
      //eslint-disable-next-line @typescript-eslint/no-unused-expressions
      replace
        ? router.replace(newRoute)
        : router.push(newRoute, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  return { updateQueryParams };
};
