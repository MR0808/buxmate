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

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
    activities: string[];
};

export type FilterOptions = {
    availableActivities: string[];
};

export const availableActivities = [
    'Login',
    'Profile Update',
    'Document Upload',
    'Registration',
    'Email Verification',
    'Application Submitted',
    'Review Failed',
    'Timeout',
    'Data Export',
    'Settings Update',
    'Password Change',
    'Background Check Failed',
    'Interview Failed'
];

export const mockUsers: User[] = [
    {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+1 (555) 123-4567',
        email: 'john.doe@example.com',
        status: 'ACCEPTED',
        activities: ['Login', 'Profile Update', 'Document Upload']
    },
    {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '+1 (555) 987-6543',
        email: 'jane.smith@example.com',
        status: 'PENDING',
        activities: ['Registration', 'Email Verification']
    },
    {
        id: '3',
        firstName: 'Michael',
        lastName: 'Johnson',
        phoneNumber: '+1 (555) 456-7890',
        email: 'michael.johnson@example.com',
        status: 'DECLINED',
        activities: ['Application Submitted', 'Review Failed']
    },
    {
        id: '4',
        firstName: 'Emily',
        lastName: 'Davis',
        phoneNumber: '+1 (555) 321-0987',
        email: 'emily.davis@example.com',
        status: 'EXPIRED',
        activities: ['Registration', 'Timeout']
    },
    {
        id: '5',
        firstName: 'David',
        lastName: 'Wilson',
        phoneNumber: '+1 (555) 654-3210',
        email: 'david.wilson@example.com',
        status: 'ACCEPTED',
        activities: ['Login', 'Data Export', 'Settings Update']
    },
    {
        id: '6',
        firstName: 'Sarah',
        lastName: 'Brown',
        phoneNumber: '+1 (555) 789-0123',
        email: 'sarah.brown@example.com',
        status: 'PENDING',
        activities: ['Registration']
    },
    {
        id: '7',
        firstName: 'Robert',
        lastName: 'Taylor',
        phoneNumber: '+1 (555) 234-5678',
        email: 'robert.taylor@example.com',
        status: 'ACCEPTED',
        activities: ['Login', 'Profile Update', 'Password Change']
    },
    {
        id: '8',
        firstName: 'Lisa',
        lastName: 'Anderson',
        phoneNumber: '+1 (555) 876-5432',
        email: 'lisa.anderson@example.com',
        status: 'DECLINED',
        activities: ['Application Submitted', 'Background Check Failed']
    },
    {
        id: '9',
        firstName: 'James',
        lastName: 'Martinez',
        phoneNumber: '+1 (555) 345-6789',
        email: 'james.martinez@example.com',
        status: 'EXPIRED',
        activities: ['Registration', 'Email Verification', 'Timeout']
    },
    {
        id: '10',
        firstName: 'Jennifer',
        lastName: 'Garcia',
        phoneNumber: '+1 (555) 567-8901',
        email: 'jennifer.garcia@example.com',
        status: 'PENDING',
        activities: ['Registration', 'Document Upload']
    },
    {
        id: '11',
        firstName: 'Christopher',
        lastName: 'Rodriguez',
        phoneNumber: '+1 (555) 678-9012',
        email: 'christopher.rodriguez@example.com',
        status: 'ACCEPTED',
        activities: [
            'Login',
            'Profile Update',
            'Data Export',
            'Settings Update'
        ]
    },
    {
        id: '12',
        firstName: 'Amanda',
        lastName: 'Lewis',
        phoneNumber: '+1 (555) 789-0123',
        email: 'amanda.lewis@example.com',
        status: 'DECLINED',
        activities: ['Application Submitted', 'Interview Failed']
    },
    // Add a user with all activities for testing
    {
        id: '13',
        firstName: 'Super',
        lastName: 'User',
        phoneNumber: '+1 (555) 999-9999',
        email: 'super.user@example.com',
        status: 'ACCEPTED',
        activities: availableActivities
    }
];
