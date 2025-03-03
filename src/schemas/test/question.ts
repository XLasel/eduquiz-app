import { z } from 'zod';

import { answerFormSchema, answerServerSchema } from './answer';

export const questionTypes = ['single', 'multiple', 'number'] as const;
export const questionTypeSchema = z.enum(questionTypes);

export const questionFormSchema = z
  .object({
    id: z.number().optional(),
    title: z
      .string()
      .transform((text) => text.trim())
      .pipe(
        z.string().min(1, { message: 'Текст вопроса не может быть пустым' })
      ),
    question_type: questionTypeSchema,
    answer: z.number().nullable(),
    answers: z.array(answerFormSchema),
  })
  .superRefine((data, ctx) => {
    const { question_type, answers, answer } = data;

    if (question_type !== 'number') {
      // Минимальное количество ответов
      if (answers.length < 2) {
        ctx.addIssue({
          code: 'custom',
          message: 'Вопрос должен иметь как минимум 2 ответа',
          path: ['answers', 'root'],
        });
      }

      // Проверка на пустые ответы
      answers.forEach((answer, index) => {
        if (answer.text.trim() === '') {
          ctx.addIssue({
            code: 'custom',
            message: 'Ответы не могут быть пустыми',
            path: ['answers', index, 'text'],
          });
        }
      });

      // Проверка правильных ответов
      const correctAnswers = answers.filter((a) => a.is_right).length;
      if (question_type === 'single' && correctAnswers !== 1) {
        ctx.addIssue({
          code: 'custom',
          message:
            'В вопросе с одиночным выбором должен быть один правильный ответ',
          path: ['answers', 'root'],
        });
      } else if (question_type === 'multiple' && correctAnswers === 0) {
        ctx.addIssue({
          code: 'custom',
          message:
            'В вопросе с множественным выбором должен быть хотя бы один правильный ответ',
          path: ['answers', 'root'],
        });
      }
    } else {
      // Проверка наличия ответа для числового типа
      if (answer === null) {
        ctx.addIssue({
          code: 'custom',
          message: 'В числовом вопросе должен быть указан ответ',
          path: ['answer'],
        });
      }
    }
  });

export type QuestionType = z.infer<typeof questionTypeSchema>;
export const questionServerSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  question_type: questionTypeSchema,
  answer: z.number().nullable(),
  answers: z.array(answerServerSchema),
});
export type QuestionFormValue = z.infer<typeof questionFormSchema>;
export type Question = z.infer<typeof questionServerSchema>;
