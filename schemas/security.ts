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

export const UpdatePasswordSchema = z
    .object({
        currentPassword: z.string().min(6, {
            message: 'Password must be at least 6 characters'
        }),
        password: z.string().min(6, {
            message: 'Password must be at least 6 characters'
        }),
        confirmPassword: z.string()
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match'
    });
// .superRefine(({ password }, checkPassComplexity) => {
//     const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
//     const containsLowercase = (ch: string) => /[a-z]/.test(ch);
//     const containsSpecialChar = (ch: string) =>
//         /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
//     let countOfUpperCase = 0,
//         countOfLowerCase = 0,
//         countOfNumbers = 0,
//         countOfSpecialChar = 0;
//     for (let i = 0; i < password.length; i++) {
//         const ch = password.charAt(i);
//         if (!isNaN(+ch)) countOfNumbers++;
//         else if (containsUppercase(ch)) countOfUpperCase++;
//         else if (containsLowercase(ch)) countOfLowerCase++;
//         else if (containsSpecialChar(ch)) countOfSpecialChar++;
//     }
//     if (
//         countOfLowerCase < 1 ||
//         countOfUpperCase < 1 ||
//         countOfSpecialChar < 1 ||
//         countOfNumbers < 1
//     ) {
//         checkPassComplexity.addIssue({
//             code: 'custom',
//             message: 'password does not meet complexity requirements'
//         });
//     }
// });
