/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";

// Centralized Google Maps API loader (TypeScript)
let isLoaded = false;
let isLoading = false;
let loadPromise: Promise<void> | null = null;

declare global {
  interface Window {
    google?: any;
  }
}

export type GoogleMapsLoaderOptions = {
  apiKey?: string;
  libraries?: string[];
};

function buildSrc({ apiKey, libraries = ["places"] }: GoogleMapsLoaderOptions) {
  const key = apiKey || process.env.NEXT_PUBLIC_FIREBASE_MAP_KEY || "";
  const libs = libraries?.length ? `&libraries=${libraries.join(",")}` : "";
  return `https://maps.googleapis.com/maps/api/js?key=${key}${libs}`;
}

export const loadGoogleMapsAPI = (
  options: GoogleMapsLoaderOptions = {}
): Promise<void> => {
  if (typeof window === "undefined") {
    // SSR: return resolved promise; client will load later
    return Promise.resolve();
  }

  // If already loaded
  if (isLoaded && window.google && window.google.maps) {
    return Promise.resolve();
  }
  // If loading
  if (isLoading && loadPromise) {
    return loadPromise;
  }

  // If script exists already, wait for ready
  const selector = 'script[src*="maps.googleapis.com/maps/api/js"]';
  const existingScript = document.querySelector<HTMLScriptElement>(selector);
  if (existingScript) {
    isLoading = true;
    loadPromise = new Promise((resolve) => {
      const checkLoaded = () => {
        if (window.google && window.google.maps) {
          isLoaded = true;
          isLoading = false;
          resolve();
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
    });
    return loadPromise;
  }

  // Inject script
  isLoading = true;
  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = buildSrc(options);
    script.async = true;
    script.defer = true;

    script.onload = () => {
      isLoaded = true;
      isLoading = false;
      resolve();
    };

    script.onerror = () => {
      isLoading = false;
      reject(new Error("Failed to load Google Maps API"));
    };

    document.head.appendChild(script);
  });

  return loadPromise;
};

export const useGoogleMapsAPI = (
  options: GoogleMapsLoaderOptions = {}
): { isReady: boolean; error: Error | null } => {
  const [isReady, setIsReady] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let mounted = true;
    loadGoogleMapsAPI(options)
      .then(() => mounted && setIsReady(true))
      .catch((err) => mounted && setError(err as Error));
    return () => {
      mounted = false;
    };
  }, [options.apiKey, JSON.stringify(options.libraries)]);

  return { isReady, error };
};

export type GoogleMapsServices = {
  geocoder: any;
  autocompleteService: any;
  placesService: (map: any) => any;
};

export const initGoogleMapsServices = (): GoogleMapsServices | null => {
  if (typeof window !== "undefined" && window.google && window.google.maps) {
    try {
      return {
        geocoder: new window.google.maps.Geocoder(),
        autocompleteService:
          new window.google.maps.places.AutocompleteService(),
        placesService: (map: any) =>
          new window.google.maps.places.PlacesService(map),
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error initializing Google Maps services:", error);
      return null;
    }
  }
  return null;
};
