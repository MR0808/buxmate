import { auth } from '@/lib/auth';

export type Session = typeof auth.$Infer.Session;
export type SessionType = Awaited<ReturnType<typeof auth.api.getSession>>;
import { Country, Gender, State } from '@/generated/prisma';

export interface GenderProps {
    genderProp?: Gender;
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
