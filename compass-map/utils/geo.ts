import { LatLng } from '../types';

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

/**
 * Calculates a destination point given a start point, distance, and bearing.
 * Uses the Haversine formula for a spherical Earth.
 * 
 * @param start - Starting latitude and longitude
 * @param distanceMeters - Distance to travel in meters
 * @param bearingDegrees - Direction in degrees (0 = North, 90 = East)
 * @returns The destination latitude and longitude
 */
export const calculateDestination = (
  start: LatLng, 
  distanceMeters: number, 
  bearingDegrees: number
): LatLng => {
    // Earth Radius ~ 6371e3 meters
    const R = 6371e3;
    const phi1 = toRad(start.lat);
    const lambda1 = toRad(start.lng);
    const theta = toRad(bearingDegrees);
    const delta = distanceMeters / R;

    const phi2 = Math.asin(
      Math.sin(phi1) * Math.cos(delta) + 
      Math.cos(phi1) * Math.sin(delta) * Math.cos(theta)
    );
    
    const lambda2 = lambda1 + Math.atan2(
      Math.sin(theta) * Math.sin(delta) * Math.cos(phi1), 
      Math.cos(delta) - Math.sin(phi1) * Math.sin(phi2)
    );

    return {
        lat: toDeg(phi2),
        lng: toDeg(lambda2)
    };
};
