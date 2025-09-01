import React from 'react';

interface IconProps {
  size?: number | string;
  className?: string;
  color?: string;
  'aria-label'?: string;

}

export const PaperPlaneIcon: React.FC<{ className?: string }> = ({ className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "w-5 h-5"} role="img" aria-label="paper plane icon">
        <path d="m3 3 3 9-3 9 19-9Z"/>
        <path d="M6 12h16"/>
    </svg>
);