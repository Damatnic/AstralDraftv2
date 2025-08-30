import React from 'react';

export const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 glass-button-primary px-4 py-2 rounded-lg"
    >
      Skip to main content
    </a>
  );
};

export default SkipLink;