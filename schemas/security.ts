import * as z from 'zod';

export const ChangeEmailSchema = z.object({
    currentEmail: z.string().email({
        message: 'Email must be valid'
    }),
    newEmail: z.string().email({
        message: 'Email must be valid'
    })
});

export const VerifyOtpSchema = z.object({
    currentEmail: z.string().email({
        message: 'Email must be valid'
    }),
    newEmail: z.string().email({
        message: 'Email must be valid'
    }),
    otp: z.string().length(6, {
        message: 'Verification code must be 6 characters long'
    })
});
