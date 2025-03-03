import { z } from 'zod';

export const signInFormSchema = z.object({
  username: z
    .string()
    .transform((name) => name.trim())
    .pipe(
      z.string().min(1, { message: 'Имя пользователя не может быть пустым' })
    ),
  password: z.string().min(6, 'Пароль должен содержать не менее 6 символов'),
});

export const signUpFormSchema = z
  .object({
    username: z
      .string()
      .transform((name) => name.trim())
      .pipe(
        z.string().min(1, 'Имя пользователя не может быть пустым').max(255, {
          message: 'Имя пользователя должно содержать не более 255 символов',
        })
      ),
    password: z.string().min(6, 'Пароль должен содержать не менее 6 символов'),
    password_confirmation: z.string().min(1, 'Пожалуйста, подтвердите пароль'),
    is_admin: z.boolean().transform((val) => val ?? false),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Пароли не совпадают',
    path: ['password_confirmation'],
  });

export const userSchema = z.object({
  id: z.number(),
  username: z.string().min(1).max(255),
  is_admin: z.boolean(),
});

export type SignInValues = z.infer<typeof signInFormSchema>;
export type SignUpValues = z.infer<typeof signUpFormSchema>;
export type User = z.infer<typeof userSchema>;
