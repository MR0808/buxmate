import * as z from 'zod';

export const LoginSchema = z.object({
    email: z.string().email({
        message: 'Email is required'
    }),
    password: z.string().min(1, {
        message: 'Password is required'
    }),
    token: z.optional(z.string()),
    rememberMe: z.optional(z.boolean()),
    backupCode: z.optional(z.string())
});

export const RegisterSchema = z.object({
    email: z.string().email({
        message: 'Email is required'
    }),
    name: z.string().min(1, {
        message: 'First name is required'
    }),
    lastName: z.string().min(1, {
        message: 'Last name is required'
    }),
    password: z.string().min(8, {
        message: 'Password must have a minimum of 8 characters'
    }),
    terms: z.boolean().refine((val) => val === true, {
        message: 'You must accept the terms and conditions'
    })
});
// .superRefine(({ password }, checkPassComplexity) => {
//     if (password.length < 8) return;

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
//             message:
//                 'Password does not meet complexity requirements (at least one uppercase, one lowercase, one number and one special character)'
//         });
//     }
// });

export const EmailSchema = z.object({
    email: z.string().email({
        message: 'Email must be valid'
    })
});

export const ResetPasswordSchema = z
    .object({
        password: z.string().min(6, {
            message: 'Password must be at least 6 characters'
        }),
        confirmPassword: z
            .string()
            .min(6, { message: 'Password must be at least 6 characters' })
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match'
    })
    .superRefine(({ password }, checkPassComplexity) => {
        const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
        const containsLowercase = (ch: string) => /[a-z]/.test(ch);
        const containsSpecialChar = (ch: string) =>
            /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
        let countOfUpperCase = 0,
            countOfLowerCase = 0,
            countOfNumbers = 0,
            countOfSpecialChar = 0;
        for (let i = 0; i < password.length; i++) {
            const ch = password.charAt(i);
            if (!isNaN(+ch)) countOfNumbers++;
            else if (containsUppercase(ch)) countOfUpperCase++;
            else if (containsLowercase(ch)) countOfLowerCase++;
            else if (containsSpecialChar(ch)) countOfSpecialChar++;
        }
        if (
            countOfLowerCase < 1 ||
            countOfUpperCase < 1 ||
            countOfSpecialChar < 1 ||
            countOfNumbers < 1
        ) {
            checkPassComplexity.addIssue({
                code: 'custom',
                message: 'password does not meet complexity requirements'
            });
        }
    });

export const TwoFactorSchema = z.object({
    token: z.string().min(1, {
        message: 'Token is required'
    })
});
