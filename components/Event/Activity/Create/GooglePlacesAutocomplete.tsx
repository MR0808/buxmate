'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import type { GooglePlaceResult } from '@/types/places';
import { googleMapsLoader } from '@/lib/googleMapsLoader';

interface GooglePlacesAutocompleteProps {
    onPlaceSelect: (place: GooglePlaceResult) => void;
    placeholder?: string;
    className?: string;
    value?: string;
    onChange?: (value: string) => void;
}

export function GooglePlacesAutocomplete({
    onPlaceSelect,
    placeholder = 'Search for a place or enter an address...',
    className,
    value,
    onChange
}: GooglePlacesAutocompleteProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadGoogleMaps = async () => {
            try {
                // Check if already loaded
                if (googleMapsLoader.isGoogleMapsLoaded()) {
                    if (isMounted) {
                        initializeAutocomplete();
                        setIsLoaded(true);
                    }
                    return;
                }

                // Load Google Maps
                await googleMapsLoader.load();

                if (isMounted) {
                    initializeAutocomplete();
                    setIsLoaded(true);
                }
            } catch (error) {
                console.error('Failed to load Google Maps:', error);
                if (isMounted) {
                    setLoadError(
                        error instanceof Error
                            ? error.message
                            : 'Failed to load Google Maps'
                    );
                }
            }
        };

        loadGoogleMaps();

        return () => {
            isMounted = false;
            // Cleanup autocomplete listeners
            if (autocompleteRef.current) {
                const googleAPI = googleMapsLoader.getAPI();
                if (googleAPI) {
                    try {
                        googleAPI.maps.event.clearInstanceListeners(
                            autocompleteRef.current
                        );
                    } catch (error) {
                        console.warn(
                            'Error cleaning up autocomplete listeners:',
                            error
                        );
                    }
                }
            }
        };
    }, []);

    const initializeAutocomplete = () => {
        if (!inputRef.current) return;

        const googleAPI = googleMapsLoader.getAPI();
        if (!googleAPI) return;

        try {
            autocompleteRef.current = new googleAPI.maps.places.Autocomplete(
                inputRef.current,
                {
                    types: ['establishment', 'geocode'],
                    fields: [
                        'place_id',
                        'name',
                        'formatted_address',
                        'geometry',
                        'types',
                        'rating',
                        'user_ratings_total',
                        'price_level',
                        'business_status',
                        'opening_hours',
                        'website',
                        'formatted_phone_number',
                        'international_phone_number',
                        'address_components',
                        'vicinity',
                        'icon',
                        'icon_background_color',
                        'icon_mask_base_uri',
                        'photos',
                        'plus_code',
                        'utc_offset_minutes'
                    ]
                }
            );

            autocompleteRef.current.addListener('place_changed', () => {
                if (!autocompleteRef.current) return;

                const place = autocompleteRef.current.getPlace();

                if (!place.geometry) {
                    console.error('No geometry found for place');
                    return;
                }

                onPlaceSelect(place);
            });
        } catch (error) {
            console.error('Error initializing autocomplete:', error);
            setLoadError('Failed to initialize autocomplete');
        }
    };

    if (loadError) {
        return (
            <div className="p-2 text-sm text-red-600 bg-red-50 rounded border">
                Error loading Google Maps: {loadError}
            </div>
        );
    }

    return (
        <Input
            ref={inputRef}
            placeholder={isLoaded ? placeholder : 'Loading Google Maps...'}
            className={className}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={!isLoaded}
        />
    );
}
