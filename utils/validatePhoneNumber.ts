import {
    parsePhoneNumberWithError,
    isValidPhoneNumber
} from 'libphonenumber-js';

// Helper function to validate and format phone number
export const validatePhoneNumber = (
    phone: string
): {
    isValid: boolean;
    formatted?: string;
    country?: string;
} => {
    try {
        // Try to parse the phone number
        const phoneNumber = parsePhoneNumberWithError(phone);

        if (phoneNumber && isValidPhoneNumber(phone)) {
            return {
                isValid: true,
                formatted: phoneNumber.formatInternational(),
                country: phoneNumber.country
            };
        }

        return { isValid: false };
    } catch {
        return { isValid: false };
    }
};
