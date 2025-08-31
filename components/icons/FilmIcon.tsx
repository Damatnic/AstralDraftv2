interface IconProps {
  size?: number | string;
  className?: string;
  color?: string;
  'aria-label'?: string;

import React from 'react';

}

export const FilmIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "w-5 h-5"} role="img" aria-label="film icon">
        <rect width="24" height="24" x="3" y="3" rx="2"/>
        <path d="M7 3v18"/>
        <path d="M3 7.5h4"/>
        <path d="M3 12h18"/>
        <path d="M3 16.5h4"/>
        <path d="M17 3v18"/>
        <path d="M17 7.5h4"/>
        <path d="M17 16.5h4"/>
    </svg>
);