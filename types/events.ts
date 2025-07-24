import { Prisma, Country, State } from '@/generated/prisma';

import { auth } from '@/lib/auth';
import { getEvent } from '@/actions/event';

export type Session = typeof auth.$Infer.Session;
export type SessionType = Awaited<ReturnType<typeof auth.api.getSession>>;

type Currency = Prisma.CurrencyGetPayload<{
    select: { id: true; name: true; code: true; symbolNative: true };
}>;

export type EventType = Awaited<ReturnType<typeof getEvent>>['data'];

export interface AddEventProps {
    currencies: Currency[];
    defaultCurrency: Currency | null;
    countryProp?: Country;
    countries: Country[];
    states: State[];
    userSession: SessionType | null;
}

export interface LocationProps {
    countries: Country[];
    states: State[];
}

export interface CurrencyProps {
    currencies: Currency[];
}

export interface EventInformationProps {
    event: {
        host: {
            name: string;
            id: string;
            lastName: string;
            email: string;
            image: string | null;
            phoneNumber: string | null;
        };
        totalCost: number;
        totalGuests: number;
        date: Date;
        timezone: string;
        id: string;
        state: {
            name: string;
            country: {
                name: string;
                id: string;
            };
            id: string;
        };
    };
}

export interface AddGuestsProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export type ValidationResult = {
    validEmails?: string[];
    invalidEmails?: string[];
    validPhoneNumbers?: Array<{
        original: string;
        formatted: string;
        country?: string;
    }>;
    invalidPhoneNumbers?: string[];
};
