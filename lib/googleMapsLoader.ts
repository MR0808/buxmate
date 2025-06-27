type GoogleMapsAPI = {
    maps: {
        places: {
            Autocomplete: new (
                input: HTMLInputElement,
                options?: {
                    types?: string[];
                    fields?: string[];
                }
            ) => any;
        };
        event: {
            clearInstanceListeners: (instance: any) => void;
        };
    };
};

// Avoid conflicting with existing google declarations
declare global {
    interface Window {
        googleMapsLoading?: boolean;
        googleMapsCallbacks?: (() => void)[];
        initGoogleMaps?: () => void;
    }
}

class GoogleMapsLoader {
    private static instance: GoogleMapsLoader;
    private isLoaded = false;
    private isLoading = false;
    private callbacks: (() => void)[] = [];

    private constructor() {}

    static getInstance(): GoogleMapsLoader {
        if (!GoogleMapsLoader.instance) {
            GoogleMapsLoader.instance = new GoogleMapsLoader();
        }
        return GoogleMapsLoader.instance;
    }

    // Helper method to safely access google maps API
    private getGoogleMapsAPI(): GoogleMapsAPI | null {
        // Use type assertion to access google without declaring it on Window
        const globalGoogle = (window as any).google;
        return globalGoogle?.maps ? globalGoogle : null;
    }

    async load(): Promise<GoogleMapsAPI> {
        return new Promise((resolve, reject) => {
            // If already loaded, resolve immediately
            const googleAPI = this.getGoogleMapsAPI();
            if (this.isLoaded && googleAPI) {
                resolve(googleAPI);
                return;
            }

            // Add callback to queue
            this.callbacks.push(() => {
                const api = this.getGoogleMapsAPI();
                if (api) {
                    resolve(api);
                } else {
                    reject(new Error('Google Maps failed to load'));
                }
            });

            // If already loading, just wait for callbacks
            if (this.isLoading) {
                return;
            }

            // Check if script already exists
            const existingScript = document.querySelector(
                'script[src*="maps.googleapis.com"]'
            );
            if (existingScript) {
                console.warn(
                    'Google Maps script already exists, waiting for load...'
                );
                this.isLoading = true;
                // Wait a bit and check if it's loaded
                setTimeout(() => {
                    const api = this.getGoogleMapsAPI();
                    if (api) {
                        this.handleLoad();
                    } else {
                        reject(
                            new Error(
                                'Google Maps script exists but failed to load'
                            )
                        );
                    }
                }, 1000);
                return;
            }

            this.isLoading = true;

            // Create and load script
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`;
            script.async = true;
            script.defer = true;

            // Set up global callback
            window.initGoogleMaps = () => {
                this.handleLoad();
            };

            script.onerror = () => {
                this.isLoading = false;
                reject(new Error('Failed to load Google Maps script'));
            };

            document.head.appendChild(script);
        });
    }

    private handleLoad() {
        this.isLoaded = true;
        this.isLoading = false;

        // Execute all callbacks
        this.callbacks.forEach((callback) => {
            try {
                callback();
            } catch (error) {
                console.error('Error in Google Maps callback:', error);
            }
        });

        // Clear callbacks
        this.callbacks = [];

        // Clean up global callback
        delete window.initGoogleMaps;
    }

    isGoogleMapsLoaded(): boolean {
        return this.isLoaded && !!this.getGoogleMapsAPI();
    }

    getAPI(): GoogleMapsAPI | null {
        return this.getGoogleMapsAPI();
    }
}

export const googleMapsLoader = GoogleMapsLoader.getInstance();
