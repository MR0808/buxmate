import { auth } from '@/lib/auth';

export type Session = typeof auth.$Infer.Session;
export type SessionType = Awaited<ReturnType<typeof auth.api.getSession>>;
import { Country, Gender, State } from '@/generated/prisma';

export interface GenderProps {
    genderProp?: Gender;
    userSession: SessionType | null;
}

export interface PhoneNumberProps {
    defaultCountry: Country;
    userSession: SessionType | null;
}

export interface LocationProps {
    stateProp?: State;
    countryProp?: Country;
    countries: Country[];
    states: State[];
    initialValueProp: boolean;
    userSession: SessionType | null;
}

export interface DateOfBirthProps {
    dateOfBirthProp?: Date;
    userSession: SessionType | null;
}

export interface LocationData {
    countries: Country[] | null;
    defaultCountry: Country;
    states: State[] | null;
    country: Country | null;
    state: State | null;
    initialValueProp: boolean;
}
