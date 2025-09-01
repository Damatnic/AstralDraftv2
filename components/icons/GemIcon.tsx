import React from 'react';

interface IconProps {
  size?: number | string;
  className?: string;
  color?: string;
  'aria-label'?: string;

}

export const GemIcon: React.FC<{ className?: string }> = ({ className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "w-5 h-5"} role="img" aria-label="gem icon">
        <path d="M6 3h12l4 6-10 13L2 9Z" />
        <path d="M12 22 2 9" />
        <path d="M12 22 22 9" />
        <path d="m2 9 10-6 10 6" />
    </svg>
);