import { z } from 'zod';

const baseAnswerSchema = z.object({
  questionId: z.number(),
});

const singleAnswerSchema = baseAnswerSchema.extend({
  type: z.literal('single'),
  selectedAnswerId: z.number(),
  numericAnswer: z.literal(null),
});

const multipleAnswerSchema = baseAnswerSchema.extend({
  type: z.literal('multiple'),
  selectedAnswerId: z.array(z.number()).min(1, 'Выберите хотя бы один ответ'),
  numericAnswer: z.literal(null),
});

const numberAnswerSchema = baseAnswerSchema.extend({
  type: z.literal('number'),
  selectedAnswerId: z.array(z.number()).default([]),
  numericAnswer: z.number().min(0, 'Введите неотрицательное число'),
});

// Combined schema with a discriminator by the type field
export const currentUserAnswerSchema = z.discriminatedUnion('type', [
  singleAnswerSchema,
  multipleAnswerSchema,
  numberAnswerSchema,
]);

// Types based on schemas
export type SingleAnswerValue = z.infer<typeof singleAnswerSchema>;
export type MultipleAnswerValue = z.infer<typeof multipleAnswerSchema>;
export type NumberAnswerValue = z.infer<typeof numberAnswerSchema>;
export type CurrentUserAnswerValue = z.infer<typeof currentUserAnswerSchema>;
