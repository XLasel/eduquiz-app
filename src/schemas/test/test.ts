import { z } from 'zod';

import { questionFormSchema, questionServerSchema } from './question';

export const testFormSchema = z.object({
  id: z.number().optional(),
  title: z
    .string()
    .min(1, { message: 'Название не может быть пустым' })
    .transform((title) => title.trim()),
  questions: z.array(questionFormSchema).nonempty({
    message: 'Тест должен содержать хотя бы один вопрос',
  }),
});

export const testServerSchema = z.object({
  id: z.number(),
  created_at: z.string().datetime({ offset: true }),
  title: z.string().min(1),
  questions: z.array(questionServerSchema),
});

export type TestFormValue = z.infer<typeof testFormSchema>;
export type Test = z.infer<typeof testServerSchema>;
