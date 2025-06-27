// Remove the GoogleMapsAPI interface since it's now in the loader
// Keep the rest of the types

export interface GooglePlaceResult {
    place_id: string;
    name?: string;
    formatted_address: string;
    geometry: {
        location: {
            lat: () => number;
            lng: () => number;
        };
    };
    types: string[];
    rating?: number;
    user_ratings_total?: number;
    price_level?: number;
    business_status?: string;
    opening_hours?: {
        open_now: boolean;
        periods: Array<{
            close: { day: number; time: string };
            open: { day: number; time: string };
        }>;
        weekday_text: string[];
    };
    website?: string;
    formatted_phone_number?: string;
    international_phone_number?: string;
    address_components: Array<{
        long_name: string;
        short_name: string;
        types: string[];
    }>;
    vicinity?: string;
    icon?: string;
    icon_background_color?: string;
    icon_mask_base_uri?: string;
    photos?: Array<{
        height: number;
        width: number;
        photo_reference: string;
    }>;
    plus_code?: {
        compound_code: string;
        global_code: string;
    };
    utc_offset?: number;
}

export interface PlaceFormData {
    placeId: string;
    name?: string;
    formattedAddress: string;
    latitude: number;
    longitude: number;
    types: string[];
    rating?: number;
    userRatingsTotal?: number;
    priceLevel?: number;
    businessStatus?: string;
    openingHours?: any;
    website?: string;
    phoneNumber?: string;
    internationalPhoneNumber?: string;
    streetNumber?: string;
    route?: string;
    locality?: string;
    administrativeAreaLevel1?: string;
    administrativeAreaLevel2?: string;
    country?: string;
    postalCode?: string;
    vicinity?: string;
    icon?: string;
    iconBackgroundColor?: string;
    iconMaskBaseUri?: string;
    photos?: any;
    plusCode?: any;
    utcOffset?: number;
}
