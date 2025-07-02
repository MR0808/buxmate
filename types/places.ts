export interface AddressType {
    id: string;
    displayName: {
        text: string;
        languageCode?: string;
    };
    address1: string;
    address2: string;
    formattedAddress: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
    lat: number;
    lng: number;
    countryCode: string;
    types?: string[];
    businessStatus?:
        | 'OPERATIONAL'
        | 'CLOSED_TEMPORARILY'
        | 'CLOSED_PERMANENTLY'
        | '';
}

export interface AddressAutoCompleteProps {
    resultInput: string;
    setResultInput: (resultInput: string) => void;
    address: AddressType;
    setAddress: (address: AddressType) => void;
    searchInput: string;
    setSearchInput: (searchInput: string) => void;
    showInlineError?: boolean;
    placeholder?: string;
}

export interface CommonProps {
    selectedPlaceId: string;
    setSelectedPlaceId: (placeId: string) => void;
    showInlineError?: boolean;
    searchInput: string;
    setSearchInput: (searchInput: string) => void;
    placeholder?: string;
}

export interface AddressFormProps {
    address: AddressType;
}

export interface AddressFields {
    address1?: string;
    address2?: string;
    city?: string;
    region?: string;
    postalCode?: string;
}
