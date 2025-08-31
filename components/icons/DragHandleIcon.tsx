interface IconProps {
  size?: number | string;
  className?: string;
  color?: string;
  'aria-label'?: string;

import React from 'react';

}

export const DragHandleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "w-5 h-5"} role="img" aria-label="drag handle icon">
        <circle cx="9" cy="12" r="1.5"></circle>
        <circle cx="9" cy="6" r="1.5"></circle>
        <circle cx="9" cy="18" r="1.5"></circle>
        <circle cx="15" cy="12" r="1.5"></circle>
        <circle cx="15" cy="6" r="1.5"></circle>
        <circle cx="15" cy="18" r="1.5"></circle>
    </svg>
);