/**
 * AccessibleModal Component
 * WCAG 2.1 Level AA Compliant Modal Dialog
 */

import React, { useEffect, useRef, useId } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FocusTrap, KEYBOARD_KEYS, announceToScreenReader } from '../../../utils/accessibility';
import AccessibleButton from './AccessibleButton';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  footer?: React.ReactNode;
  initialFocus?: React.RefObject<HTMLElement>;
  returnFocus?: React.RefObject<HTMLElement>;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  role?: 'dialog' | 'alertdialog';
}

const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  footer,
  initialFocus,
  returnFocus,
  ariaLabelledBy,
  ariaDescribedBy,
  role = 'dialog'
}: any) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const focusTrapRef = useRef<FocusTrap | null>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const generatedId = useId();
  const titleId = ariaLabelledBy || `${generatedId}-title`;
  const descriptionId = ariaDescribedBy || (description ? `${generatedId}-description` : undefined);

  // Size styles
  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4'
  };

  // Handle focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Create and activate focus trap
      focusTrapRef.current = new FocusTrap(modalRef.current);
      focusTrapRef.current.activate();

      // Set initial focus
      if (initialFocus?.current) {
        initialFocus.current.focus();
      }

      // Announce modal opening to screen readers
      announceToScreenReader(`${title} dialog opened`, 'polite');

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      return () => {
        // Deactivate focus trap
        focusTrapRef.current?.deactivate();

        // Restore body scroll
        document.body.style.overflow = '';

        // Return focus to previous element or specified return focus
        const elementToFocus = returnFocus?.current || previousActiveElement.current;
        if (elementToFocus) {
          // Small delay to ensure modal is fully closed
          setTimeout(() => {
            elementToFocus.focus();
          }, 50);
        }

        // Announce modal closing
        announceToScreenReader(`${title} dialog closed`, 'polite');
      };
    }
  }, [isOpen, title, initialFocus, returnFocus]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === KEYBOARD_KEYS.ESCAPE) {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={handleOverlayClick}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
          >
            <div
              ref={modalRef}
              className={`
                ${sizeStyles[size]}
                w-full bg-gray-800 rounded-xl shadow-2xl
                pointer-events-auto
                max-h-[90vh] flex flex-col
              `}
              role={role}
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-gray-700">
                <div className="flex-1">
                  <h2
                    id={titleId}
                    className="text-xl font-semibold text-white"
                  >
                    {title}
                  </h2>
                  {description && (
                    <p
                      id={descriptionId}
                      className="mt-1 text-sm text-gray-400"
                    >
                      {description}
                    </p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="ml-4 text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Close dialog"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AccessibleModal;