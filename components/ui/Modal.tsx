import React, { useCallback, useEffect } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { FocusTrap } from &apos;./FocusTrap&apos;;

interface ModalProps {
}
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos; | &apos;xl&apos;;

}

export const Modal: React.FC<ModalProps> = ({
}
  isOpen,
  onClose,
  title,
  children,
  size = &apos;md&apos;
}: any) => {
}
  const sizeClasses = {
}
    sm: &apos;max-w-md&apos;,
    md: &apos;max-w-lg&apos;,
    lg: &apos;max-w-2xl&apos;,
    xl: &apos;max-w-4xl&apos;
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
}
    if (isOpen) {
}
      document.body.style.overflow = &apos;hidden&apos;;
      document.body.style.paddingRight = &apos;15px&apos;; // Prevent layout shift from scrollbar
    } else {
}
      document.body.style.overflow = &apos;&apos;;
      document.body.style.paddingRight = &apos;&apos;;
    }

    return () => {
}
      document.body.style.overflow = &apos;&apos;;
      document.body.style.paddingRight = &apos;&apos;;
    };
  }, [isOpen]);

  // Handle Escape key to close modal
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

  return (
    <AnimatePresence>
      {isOpen && (
}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <FocusTrap active={isOpen}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative glass-pane w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto custom-scrollbar`}
              style={{
}
                WebkitOverflowScrolling: &apos;touch&apos;,
                scrollbarWidth: &apos;thin&apos;
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? &apos;modal-title&apos; : undefined}
            >
              {title && (
}
                <div className="flex items-center justify-between p-6 border-b border-white/20">
                  <h2 id="modal-title" className="text-xl font-semibold text-[var(--text-primary)]">
                    {title}
                  </h2>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-2xl min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Close modal"
                  >
                    ✕
                  </button>
                </div>
              )}
              
              <div className="p-6">
                {children}
              </div>
            </motion.div>
          </FocusTrap>
        </div>
      )}
    </AnimatePresence>
  );
};