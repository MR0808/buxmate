import { Prisma, Country, State } from '@/generated/prisma';

type Currency = Prisma.CurrencyGetPayload<{
    select: { id: true; name: true; code: true; symbolNative: true };
}>;

export interface AddEventProps {
    currencies: Currency[];
    defaultCurrency: Currency | null;
    countryProp?: Country;
    countries: Country[];
    states: State[];
}

export interface LocationProps {
    countries: Country[];
    states: State[];
}

export interface CurrencyProps {
    currencies: Currency[];
    defaultCurrency: Currency | null;
    currentStep: number;
    setCurrency: React.Dispatch<React.SetStateAction<string>>;
    currency: string;
}
