import React, { useCallback, useEffect, useRef } from &apos;react&apos;;

interface FocusTrapProps {
}
  children: React.ReactNode;
  active: boolean;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({ children, active }: any) => {
}
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
}
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      &apos;button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])&apos;
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
}
      if (e.key !== &apos;Tab&apos;) return;

      if (e.shiftKey) {
}
        if (document.activeElement === firstElement) {
}
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
}
        if (document.activeElement === lastElement) {
}
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener(&apos;keydown&apos;, handleTabKey);
    firstElement?.focus();

    return () => {
}
      document.removeEventListener(&apos;keydown&apos;, handleTabKey);
    };
  }, [active]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
};