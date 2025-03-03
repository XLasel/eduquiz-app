import { z } from 'zod';

import { answerServerSchema } from './answer';
import { questionServerSchema } from './question';
import { testServerSchema } from './test';

export const paginationSchema = z.object({
  total_pages: z.number(),
  total_count: z.number(),
});

export const testsListServerSchema = z.object({
  tests: z.array(testServerSchema),
  meta: paginationSchema,
});

export const testByIdServerSchema = testServerSchema;
export const testCreatedServerSchema = testServerSchema;
export const testUpdatedServerSchema = testCreatedServerSchema;
export const questionCreatedServerSchema = questionServerSchema;
export const questionUpdatedServerSchema = questionServerSchema;
export const answerCreatedServerSchema = answerServerSchema;
export const answerUpdatedServerSchema = answerServerSchema;
