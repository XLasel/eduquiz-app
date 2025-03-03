import { z } from 'zod';

export const answerFormSchema = z.object({
  id: z.number().optional(),
  text: z.string(),
  is_right: z.boolean(),
});

export const answerServerSchema = z.object({
  id: z.number(),
  text: z.string().min(1),
  is_right: z.boolean(),
});

export type AnswerFormValue = z.infer<typeof answerFormSchema>;
export type Answer = z.infer<typeof answerServerSchema>;
