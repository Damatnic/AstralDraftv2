import React from 'react';

interface IconProps {
  size?: number | string;
  className?: string;
  color?: string;
  'aria-label'?: string;

}

export const CrownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "w-5 h-5"} role="img" aria-label="crown icon">
        <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z" />
        <path d="M5 20h14" />
    </svg>
);