import React, { useState, useEffect } from 'react';
import { Button } from './Button';

export const HighContrastMode: React.FC = () => {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('high-contrast') === 'true';
    setHighContrast(saved);
    if (saved) {
      document.documentElement.classList.add('high-contrast');
    }
  }, []);

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem('high-contrast', newValue.toString());
    
    if (newValue) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={toggleHighContrast}
      aria-label={`${highContrast ? 'Disable' : 'Enable'} high contrast mode`}
    >
      {highContrast ? '🔆' : '🌓'} Contrast
    </Button>
  );
};