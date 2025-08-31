import { useEffect, useRef } from 'react';

export const useAccessibility = () => {
  const focusTrapRef = useRef<HTMLDivElement>(null);
  
  const announceToScreen = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };
  
  const trapFocus = () => {
    const focusableElements = focusTrapRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements && focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }
  };
  
  return {
    announceToScreen,
    trapFocus,
    focusTrapRef
  };
};
