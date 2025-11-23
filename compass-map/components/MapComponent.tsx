import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapComponentProps } from '../types';
import { calculateDestination } from '../utils/geo';

// Fix Leaflet's default icon path issues in Webpack/Vite environments
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom hook to update map center when location changes
const RecenterMap: React.FC<{ center: { lat: number; lng: number } }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng]);
  }, [center.lat, center.lng, map]);
  return null;
};

export const MapComponent: React.FC<MapComponentProps> = ({ center, heading, showCompassLine }) => {
  // Calculate the end point of the line if compass is active
  const linePath = useMemo(() => {
    if (!showCompassLine || heading === null) return null;
    
    // Draw a line 50km long in the direction of the heading
    const endPoint = calculateDestination(center, 50000, heading);
    
    return [
      [center.lat, center.lng],
      [endPoint.lat, endPoint.lng]
    ] as [number, number][];
  }, [center, heading, showCompassLine]);

  return (
    <MapContainer 
      center={[center.lat, center.lng]} 
      zoom={15} 
      zoomControl={false} // Disable default controls for cleaner mobile look
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Helper to keep map centered on user */}
      <RecenterMap center={center} />

      {/* User Location Indicator */}
      {/* Accuracy Circle */}
      <Circle 
        center={[center.lat, center.lng]}
        radius={50} // Approximate static radius or could pass actual accuracy
        pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1, weight: 1 }}
      />
      
      {/* Location Dot */}
      <Circle 
        center={[center.lat, center.lng]}
        radius={8}
        pathOptions={{ color: '#ffffff', fillColor: '#2563eb', fillOpacity: 1, weight: 2 }}
      />

      {/* Compass Line */}
      {linePath && (
        <Polyline 
          positions={linePath} 
          pathOptions={{ 
            color: '#f97316', // Orange-500
            weight: 4,
            opacity: 0.8,
            dashArray: '10, 10' // Dashed line for a more "guide" like feel
          }} 
        />
      )}
    </MapContainer>
  );
};
