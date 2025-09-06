/**
 * Activity Icon Component
 * Used for activity feeds and notifications
 */

import React from 'react';

interface ActivityIconProps {
  className?: string;
}

export const ActivityIcon: React.FC<ActivityIconProps> = ({ className = "w-5 h-5" }) => (
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
      d="M13 10V3L4 14h7v7l9-11h-7z" 
    />
  </svg>
);

export default ActivityIcon;