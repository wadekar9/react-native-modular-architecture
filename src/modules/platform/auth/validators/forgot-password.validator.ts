import { z } from 'zod';

export const forgotPasswordValidatorSchema = z.object({
  email: z.string().min(1, 'Please enter email address.').email('Please enter a valid email address.'),
});

export type ForgotPasswordValidatorSchemaType = z.infer<typeof forgotPasswordValidatorSchema>;

