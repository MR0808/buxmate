import { Country } from '@/generated/prisma';

export interface LoginFormProps {
    callbackUrl: string;
}
export interface RegisterFormProps {
    defaultCountry: Country;
}
