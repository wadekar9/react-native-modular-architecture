import { z } from 'zod';

export const otpVerificationValidatorSchema = z.object({
  otp: z.string().min(1, 'Please enter the verification code.').length(6, 'Verification code must be 6 digits.'),
});

export type OtpVerificationValidatorSchemaType = z.infer<typeof otpVerificationValidatorSchema>;
