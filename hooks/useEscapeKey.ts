/**
 * Custom hook for handling Escape key press to close modals
 */
import { useEffect } from &apos;react&apos;;

export const useEscapeKey = (isOpen: boolean, onClose: () => void) => {
}
  useEffect(() => {
}
    const handleEscapeKey = (event: KeyboardEvent) => {
}
      if (event.key === &apos;Escape&apos; && isOpen) {
}
        onClose();
      }
    };

    if (isOpen) {
}
      document.addEventListener(&apos;keydown&apos;, handleEscapeKey);
    }

    return () => {
}
      document.removeEventListener(&apos;keydown&apos;, handleEscapeKey);
    };
  }, [isOpen, onClose]);
};