import { z } from 'zod';

export const resetPasswordValidatorSchema = z.object({
  password: z.string().min(1, 'Please enter new password.').min(6, 'Password must be at least 6 characters long.'),
  confirmPassword: z.string().min(1, 'Please confirm your new password.'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});

export type ResetPasswordValidatorSchemaType = z.infer<typeof resetPasswordValidatorSchema>;
