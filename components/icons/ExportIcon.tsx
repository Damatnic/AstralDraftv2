import React from 'react';

interface IconProps {
  size?: number | string;
  className?: string;
  color?: string;
  'aria-label'?: string;
}

export const ExportIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = "w-5 h-5", 
  color = "currentColor",
  'aria-label': ariaLabel
}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    role="img" 
    aria-label={ariaLabel || `${testId} icon`}
    data-testid="exporticon"
  >
    {/* Placeholder icon - replace with actual SVG paths */}
    <circle cx="12" cy="12" r="10"/>
  </svg>
);

export default ExportIcon;
