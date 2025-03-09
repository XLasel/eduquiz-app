import { z } from 'zod';

import { DEFAULT_SEARCH_PARAMS } from '@/constants';

const SortEnum = z.enum(['created_at_desc', 'created_at_asc']);

export const searchParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(DEFAULT_SEARCH_PARAMS.page),
  per: z.coerce.number().int().positive().default(DEFAULT_SEARCH_PARAMS.per),
  search: z.string().trim().toLowerCase().default(DEFAULT_SEARCH_PARAMS.search),
  sort: SortEnum.default(DEFAULT_SEARCH_PARAMS.sort),
});

export type SortEnum = z.infer<typeof SortEnum>;
export type SearchParams = z.infer<typeof searchParamsSchema>;
