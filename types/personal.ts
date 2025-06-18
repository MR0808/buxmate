import { Country, Gender, State } from '@/generated/prisma';

export interface GenderProps {
    genderProp?: Gender;
}

export interface LocationProps {
    stateProp?: State;
    countryProp?: Country;
    countries: Country[];
    states: State[];
    initialValueProp: boolean;
}

export interface DateOfBirthProps {
    dateOfBirthProp?: Date;
}
