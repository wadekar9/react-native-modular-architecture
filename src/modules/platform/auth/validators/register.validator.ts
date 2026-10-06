import { z } from 'zod';

export const registerValidatorSchema = z.object({
  firstName: z.string().min(1, 'Please enter first name.').min(2, 'First name must be at least 2 characters.'),
  lastName: z.string().min(1, 'Please enter last name.').min(2, 'Last name must be at least 2 characters.'),
  username: z.string().min(1, 'Please enter username.').min(3, 'Username must be at least 3 characters.'),
  email: z.string().min(1, 'Please enter email address.').email('Please enter a valid email address.'),
  password: z.string().min(1, 'Please enter password.').min(6, 'Password must be at least 6 characters long.'),
  confirmPassword: z.string().min(1, 'Please confirm your password.'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});

export type RegisterValidatorSchemaType = z.infer<typeof registerValidatorSchema>;

