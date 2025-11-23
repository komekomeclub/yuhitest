export interface LatLng {
  lat: number;
  lng: number;
}

export interface MapComponentProps {
  center: LatLng;
  heading: number | null;
  showCompassLine: boolean;
}

export interface CompassButtonProps {
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

// Augment window for iOS specific device orientation properties
declare global {
  interface DeviceOrientationEvent {
    webkitCompassHeading?: number;
    requestPermission?: () => Promise<'granted' | 'denied'>;
  }
}
