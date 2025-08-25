
import React from 'react';

export const DragHandleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className || "h-5 w-5"}>
        <circle cx="9" cy="12" r="1.5"></circle>
        <circle cx="9" cy="6" r="1.5"></circle>
        <circle cx="9" cy="18" r="1.5"></circle>
        <circle cx="15" cy="12" r="1.5"></circle>
        <circle cx="15" cy="6" r="1.5"></circle>
        <circle cx="15" cy="18" r="1.5"></circle>
    </svg>
);
