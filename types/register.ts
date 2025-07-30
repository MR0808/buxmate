import { Country } from '@/generated/prisma';

export type RegistrationStep =
    | 'initial'
    | 'email-verify'
    | 'phone-number'
    | 'phone-verify'
    | 'complete';

export interface RegistrationData {
    userId?: string;
    name: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    overEighteen: boolean;
    terms: boolean;
}

export interface MultiStepRegisterFormProps {
    defaultCountry: Country;
}

export interface InitialRegistrationFormProps {
    data: RegistrationData;
    onNext: (data: RegistrationData & { userId: string }) => void;
}

export interface EmailVerificationFormProps {
    email: string;
    userId?: string;
    onNext: (userId: string) => void;
}

export interface PhoneNumberFormProps {
    userId: string;
    onNext: (phoneNumber: string) => void;
    defaultCountry: Country;
}

export interface PhoneVerificationFormProps {
    userId: string;
    phoneNumber: string;
    email: string;
    password: string;
    onNext: () => void;
}

export interface RegistrationCompleteProps {
    name: string;
    email: string;
    phoneNumber: string;
}
