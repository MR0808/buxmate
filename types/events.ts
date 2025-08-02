import { Prisma, Country, State } from '@/generated/prisma';

import { auth } from '@/lib/auth';
import { getEvent } from '@/actions/event';

export type Session = typeof auth.$Infer.Session;
export type SessionType = Awaited<ReturnType<typeof auth.api.getSession>>;

type Currency = Prisma.CurrencyGetPayload<{
    select: { id: true; name: true; code: true; symbolNative: true };
}>;

type Invitation = Prisma.InvitationGetPayload<{
    include: { recipient: true };
}>;

export type EventType = Awaited<ReturnType<typeof getEvent>>['data'];

export interface EventProps {
    host: {
        name: string;
        id: string;
        lastName: string;
        email: string;
        image: string | null;
        phoneNumber: string | null;
    };
    totalCost: number;
    invitations: Invitation[];
    date: Date;
    timezone: string;
    id: string;
    slug: string;
    state: {
        name: string;
        country: {
            name: string;
            id: string;
        };
        id: string;
    };
}

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
    user: Session['user'];
    event: EventProps;
}

export interface ManageGuestsProps {
    user: Session['user'];
    event: EventProps;
}

export interface AddGuestsProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    eventSlug: string;
}

export type ValidationResult = {
    validPhoneNumbers?: Array<{
        original: string;
        formatted: string;
        country?: string;
    }>;
    invalidPhoneNumbers?: string[];
};

export interface InvitationResult {
    success: boolean;
    invitations: {
        phoneNumber: string;
        status: 'created' | 'duplicate' | 'declined' | 'expired';
        isRegisteredUser: boolean;
        invitation: Invitation;
    }[];
    errors: string[];
}

export interface SendInvitationSMSProps {
    invitation: {
        id: string;
        inviteToken: string;
        phoneNumber: string;
    };
    event: {
        hostName: string;
        hostLastName: string;
        title: string;
    };
}
