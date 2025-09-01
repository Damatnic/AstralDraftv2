import { useEffect, useRef } from &apos;react&apos;;

export const useAccessibility = () => {
}
  const focusTrapRef = useRef<HTMLDivElement>(null);
  
  const announceToScreen = (message: string) => {
}
    const announcement = document.createElement(&apos;div&apos;);
    announcement.setAttribute(&apos;aria-live&apos;, &apos;polite&apos;);
    announcement.setAttribute(&apos;aria-atomic&apos;, &apos;true&apos;);
    announcement.className = &apos;sr-only&apos;;
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
}
      document.body.removeChild(announcement);
    }, 1000);
  };
  
  const trapFocus = () => {
}
    const focusableElements = focusTrapRef.current?.querySelectorAll(
      &apos;button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])&apos;
    );
    
    if (focusableElements && focusableElements.length > 0) {
}
      (focusableElements[0] as HTMLElement).focus();
    }
  };
  
  return {
}
    announceToScreen,
    trapFocus,
//     focusTrapRef
  };
};
