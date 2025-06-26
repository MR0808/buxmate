import { Prisma, Country, State } from '@/generated/prisma';

import { auth } from '@/lib/auth';

export type Session = typeof auth.$Infer.Session;
export type SessionType = Awaited<ReturnType<typeof auth.api.getSession>>;

type Currency = Prisma.CurrencyGetPayload<{
    select: { id: true; name: true; code: true; symbolNative: true };
}>;

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
