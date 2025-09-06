/**
 * Wifi Off Icon Component
 * Used for disconnected status indicators
 */

import React from 'react';

interface WifiOffIconProps {
  className?: string;
}

export const WifiOffIcon: React.FC<WifiOffIconProps> = ({ className = "w-5 h-5" }) => (
  <svg 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M3 3l18 18M10.5 10.5a5 5 0 017 0l1.5-1.5a7 7 0 00-7-2M7 7C2 7 2 12 2 12s0 5 5 5m0-10C10 7 12 9 12 9" 
    />
    <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
  </svg>
);

export default WifiOffIcon;