import * as z from 'zod';
import libphonenumber from 'google-libphonenumber';

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

const phoneNumberSchema = z
    .string()
    .nonempty({ message: 'Mobile number is required' })
    .refine(
        (number) => {
            try {
                const phoneNumber = phoneUtil.parse(number);
                return phoneUtil.isValidNumber(phoneNumber);
            } catch (error) {
                return false;
            }
        },
        { message: 'Invalid mobile number' }
    );

export const RegisterSchema = z.object({
    email: z.email({
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
    overEighteen: z.boolean().refine((val) => val === true, {
        message: 'You must confirm that you are over 18 years old'
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

export const OTPSchema = z.object({
    otp: z
        .string()
        .length(6, 'OTP must be 6 digits')
        .regex(/^\d+$/, 'OTP must contain only numbers')
});

export const PhoneSchema = z.object({
    phoneNumber: phoneNumberSchema
});
