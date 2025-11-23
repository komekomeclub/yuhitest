import { useState, useEffect, useCallback } from 'react';

export const useDeviceOrientation = () => {
  const [heading, setHeading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setPermissionGranted(true);
          return true;
        } else {
          setError('Permission denied for device orientation.');
          return false;
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error requesting permission');
        return false;
      }
    } else {
      // Non-iOS devices usually don't need explicit permission request, just secure context
      setPermissionGranted(true);
      return true;
    }
  }, []);

  useEffect(() => {
    if (!permissionGranted) return;

    // Handler for iOS and standard deviceorientation
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // iOS Webkit
      if ((event as any).webkitCompassHeading !== undefined && (event as any).webkitCompassHeading !== null) {
        setHeading((event as any).webkitCompassHeading);
      } 
      // Fallback for non-absolute standard events if absolute isn't available
      else if (!('ondeviceorientationabsolute' in window) && event.alpha !== null) {
         const compassHeading = 360 - event.alpha;
         setHeading((compassHeading + 360) % 360);
      }
    };

    // Handler specifically for Android Absolute Orientation
    const handleAbsoluteOrientation = (event: DeviceOrientationEvent) => {
      if (event.absolute && event.alpha !== null) {
        const compassHeading = 360 - event.alpha;
        setHeading((compassHeading + 360) % 360);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    
    // Check for Android specific absolute orientation support
    if ('ondeviceorientationabsolute' in window) {
      window.addEventListener('deviceorientationabsolute', handleAbsoluteOrientation as any, true);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
      if ('ondeviceorientationabsolute' in window) {
        window.removeEventListener('deviceorientationabsolute', handleAbsoluteOrientation as any, true);
      }
    };
  }, [permissionGranted]);

  return { heading, requestPermission, permissionGranted, error };
};