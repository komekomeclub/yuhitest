import { useState, useEffect } from 'react';

interface GeolocationState {
  location: GeolocationPosition | null;
  error: string | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(s => ({ ...s, error: "Geolocation is not supported by your browser" }));
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setState({
        location: position,
        error: null,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      setState(s => ({ ...s, error: error.message }));
    };

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, options);

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return state;
};
