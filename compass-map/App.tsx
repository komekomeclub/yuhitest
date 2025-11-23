import React, { useState, useEffect, useCallback } from 'react';
import { MapComponent } from './components/MapComponent';
import { CompassButton } from './components/CompassButton';
import { useGeolocation } from './hooks/useGeolocation';
import { useDeviceOrientation } from './hooks/useDeviceOrientation';
import { Compass as CompassIcon, Loader2, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const { location, error: geoError } = useGeolocation();
  const { heading, requestPermission, permissionGranted, error: compassError } = useDeviceOrientation();
  
  const [isCompassActive, setIsCompassActive] = useState(false);

  // If the user activates the compass but we need permission (iOS), request it
  const handleToggleCompass = useCallback(async () => {
    if (!isCompassActive) {
      // Trying to turn ON
      const hasPermission = await requestPermission();
      if (hasPermission) {
        setIsCompassActive(true);
      }
    } else {
      // Trying to turn OFF
      setIsCompassActive(false);
    }
  }, [isCompassActive, requestPermission]);

  return (
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden flex flex-col">
      {/* Map Layer */}
      <div className="flex-grow relative z-0">
        {location ? (
          <MapComponent 
            center={{ lat: location.coords.latitude, lng: location.coords.longitude }}
            heading={heading}
            showCompassLine={isCompassActive}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 flex-col gap-4">
            {geoError ? (
               <div className="flex flex-col items-center text-red-500 p-6 text-center">
                 <AlertTriangle size={48} className="mb-2" />
                 <p className="font-bold">Location Error</p>
                 <p>{geoError}</p>
               </div>
            ) : (
              <>
                <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
                <p>Acquiring GPS signal...</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* UI Overlay - using safe-area env variables for mobile notch/home bar support */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 p-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-[calc(1rem+env(safe-area-inset-bottom))] pl-[calc(1rem+env(safe-area-inset-left))] pr-[calc(1rem+env(safe-area-inset-right))]">
        {/* Header / Status */}
        <div className="absolute top-4 left-0 right-0 pt-[env(safe-area-inset-top)] flex justify-center pointer-events-auto">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-xs font-mono text-gray-700 flex items-center gap-2 border border-gray-200">
               <div className={`w-2 h-2 rounded-full ${location ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
               {location ? 'GPS Active' : 'Waiting for GPS'}
               {isCompassActive && (
                 <>
                  <span className="w-[1px] h-3 bg-gray-300 mx-1"></span>
                  <span className="text-orange-600 font-bold">{Math.round(heading || 0)}°</span>
                 </>
               )}
            </div>
        </div>

        {/* Compass Button (Left Edge) */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-auto pl-[env(safe-area-inset-left)]">
          <CompassButton 
            isActive={isCompassActive} 
            onClick={handleToggleCompass} 
            disabled={!location}
          />
        </div>

        {/* Error Toasts */}
        {compassError && isCompassActive && (
           <div className="absolute bottom-10 left-1/2 -translate-x-1/2 mb-[env(safe-area-inset-bottom)] bg-red-50 text-red-600 px-4 py-2 rounded-lg shadow text-sm border border-red-200 pointer-events-auto max-w-[90%] text-center">
             Compass Error: {compassError}
           </div>
        )}
      </div>
    </div>
  );
};

export default App;