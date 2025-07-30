import crypto from 'crypto';
import libphonenumber from 'google-libphonenumber';
import { sendSingleSMSAction } from '@/actions/smsglobal';
import { SMSMessage } from '@/types/smsglobal';

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

export const generateOTP = (): string => {
    return crypto.randomInt(100000, 999999).toString();
};

export const validatePhoneNumber = (phoneNumber: string) => {
    try {
        const parsed = phoneUtil.parse(phoneNumber);
        const isValid = phoneUtil.isValidNumber(parsed);
        const formatted = phoneUtil.format(
            parsed,
            libphonenumber.PhoneNumberFormat.E164
        );

        return {
            isValid,
            formatted: isValid ? formatted : phoneNumber,
            original: phoneNumber
        };
    } catch (error) {
        return {
            isValid: false,
            formatted: phoneNumber,
            original: phoneNumber
        };
    }
};

export const sendEmailOTP = async (
    email: string,
    otp: string,
    name: string
) => {
    // Replace this with your email service (Resend, SendGrid, etc.)
    console.log(`Sending email OTP to ${email}: ${otp}`);

    // Example with a hypothetical email service:
    /*
    await emailService.send({
        to: email,
        subject: 'Verify your Buxmate account',
        template: 'email-otp',
        data: {
            name,
            otp,
            expiresIn: '10 minutes'
        }
    });
    */
};

export const sendSMSOTP = async (phoneNumber: string, otp: string) => {
    console.log(`Sending SMS OTP to ${phoneNumber}: ${otp}`);

    const smsMessage: SMSMessage = {
        destination: phoneNumber,
        message: `Your verification code for Buxmate is: ${otp}. This code will expire in 10 minutes.`
    };

    // const response = await sendSingleSMSAction(smsMessage);

    // if (!response.messages) {
    //     return {
    //         success: false,
    //         message: 'Failed to send verification message'
    //     };
    // }

    return {
        success: true,
        message: 'Phone number updated successfully!',
        data: {
            phoneNumber
        }
    };
};
