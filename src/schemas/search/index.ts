import { z } from 'zod';

import { DEFAULT_PARAMS } from '@/constants';

const SortEnum = z.enum(['created_at_desc', 'created_at_asc']);

export const searchParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? DEFAULT_PARAMS.page : parsed;
    }),

  per: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? DEFAULT_PARAMS.per : parsed;
    }),

  search: z
    .string()
    .optional()
    .transform((val) => (val === '' ? undefined : val)),

  sort: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return SortEnum.safeParse(val).success ? val : DEFAULT_PARAMS.sort;
    }),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;
