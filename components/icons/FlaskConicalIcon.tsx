import React from 'react';

interface IconProps {
  size?: number | string;
  className?: string;
  color?: string;
  'aria-label'?: string;

}

export const FlaskConicalIcon: React.FC<{ className?: string }> = ({ className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "w-5 h-5"} role="img" aria-label="flask conical icon">
        <path d="M4.5 3h15"/>
        <path d="M6 3v12.5a4.5 4.5 0 0 0 9 0V3"/>
        <path d="M6 14h12"/>
    </svg>
);