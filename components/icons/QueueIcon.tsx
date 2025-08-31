interface IconProps {
  size?: number | string;
  className?: string;
  color?: string;
  'aria-label'?: string;

import React from 'react';

}

export const QueueIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "w-5 h-5"} role="img" aria-label="queue icon">
        <path d="M8 6h10" />
        <path d="M6 12h10" />
        <path d="M4 18h10" />
        <path d="m18 18 3-3-3-3" />
    </svg>
);