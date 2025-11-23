import React from 'react';
import { Compass, X } from 'lucide-react';

interface CompassButtonProps {
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const CompassButton: React.FC<CompassButtonProps> = ({ isActive, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300
        border-4 
        ${disabled 
          ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed' 
          : isActive
            ? 'bg-orange-500 border-white text-white hover:bg-orange-600 scale-105 shadow-orange-500/30'
            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
        }
      `}
      aria-label={isActive ? "Disable Compass Line" : "Enable Compass Line"}
    >
      {isActive ? (
        <X className="w-8 h-8" strokeWidth={3} />
      ) : (
        <Compass className={`w-8 h-8 ${!disabled && 'group-hover:rotate-45 transition-transform'}`} />
      )}
    </button>
  );
};
