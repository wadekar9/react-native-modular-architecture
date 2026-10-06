import { z } from 'zod';

export const signInValidatorSchema = z.object({
  username: z.string().min(1, 'Please enter username or email.'),
  password: z.string().min(1, 'Please enter password.').min(6, 'Password must be at least 6 characters long.'),
});

export type SignInValidatorSchemaType = z.infer<typeof signInValidatorSchema>;
export type signInValidatorSchemaType = SignInValidatorSchemaType;