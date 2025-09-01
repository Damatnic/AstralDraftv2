/**
 * AccessibleInput Component
 * WCAG 2.1 Level AA Compliant Input Field
 */

import React, { forwardRef, InputHTMLAttributes, useState, useId } from &apos;react&apos;;
import { generateAriaId } from &apos;../../../utils/accessibility&apos;;

interface AccessibleInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, &apos;size&apos;> {
}
  label: string;
  error?: string;
  helperText?: string;
  size?: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: &apos;left&apos; | &apos;right&apos;;
  showLabel?: boolean;
  required?: boolean;
  autoAnnounceErrors?: boolean;
}

const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(
  (
    {
}
      label,
      error,
      helperText,
      size = &apos;md&apos;,
      fullWidth = false,
      icon,
      iconPosition = &apos;left&apos;,
      showLabel = true,
      required = false,
      autoAnnounceErrors = true,
      className = &apos;&apos;,
      id,
      type = &apos;text&apos;,
      disabled,
      ...rest
    },
//     ref
  ) => {
}
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;
    const [isFocused, setIsFocused] = useState(false);

    // Size styles with minimum touch target
    const sizeStyles = {
}
      sm: &apos;px-3 py-2 text-sm min-h-[44px]&apos;,
      md: &apos;px-4 py-2.5 text-base min-h-[44px]&apos;,
      lg: &apos;px-5 py-3 text-lg min-h-[48px]&apos;
    };

    // Announce errors to screen readers
    React.useEffect(() => {
}
      if (error && autoAnnounceErrors) {
}
        const announcement = document.createElement(&apos;div&apos;);
        announcement.setAttribute(&apos;role&apos;, &apos;alert&apos;);
        announcement.setAttribute(&apos;aria-live&apos;, &apos;assertive&apos;);
        announcement.className = &apos;sr-only&apos;;
        announcement.textContent = `Error: ${error}`;
        document.body.appendChild(announcement);
        setTimeout(() => document.body.removeChild(announcement), 1000);
      }
    }, [error, autoAnnounceErrors]);

    const hasIcon = !!icon;
    const paddingClass = hasIcon
      ? iconPosition === &apos;left&apos;
        ? &apos;pl-10&apos;
        : &apos;pr-10&apos;
      : &apos;&apos;;

    return (
      <div className={`${fullWidth ? &apos;w-full&apos; : &apos;&apos;} ${className}`}>
        {showLabel && (
}
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-200 mb-1"
          >
            {label}
            {required && (
}
              <span className="text-red-500 ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          {hasIcon && (
}
            <div
              className={`absolute inset-y-0 ${
}
                iconPosition === &apos;left&apos; ? &apos;left-0 pl-3&apos; : &apos;right-0 pr-3&apos;
              } flex items-center pointer-events-none`}
              aria-hidden="true"
            >
              <span className="text-gray-400">{icon}</span>
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            className={`
}
              ${sizeStyles[size]}
              ${paddingClass}
              ${fullWidth ? &apos;w-full&apos; : &apos;&apos;}
              ${error 
}
                ? &apos;border-red-500 focus:border-red-500 focus:ring-red-500&apos; 
                : isFocused
                  ? &apos;border-blue-500 ring-2 ring-blue-500/20&apos;
                  : &apos;border-gray-600 focus:border-blue-500 focus:ring-blue-500&apos;
              }
              ${disabled ? &apos;bg-gray-800 opacity-50 cursor-not-allowed&apos; : &apos;bg-gray-700&apos;}
              text-white placeholder-gray-400
              border rounded-lg
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
            `}
            disabled={disabled}
            aria-label={!showLabel ? label : undefined}
            aria-invalid={!!error}
            aria-describedby={
}
              [error && errorId, helperText && helperId]
                .filter(Boolean)
                .join(&apos; &apos;) || undefined
            }
            aria-required={required}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...rest}
          />
        </div>

        {helperText && !error && (
}
          <p
            id={helperId}
            className="mt-1 text-sm text-gray-400"
            role="status"
            aria-live="polite"
          >
            {helperText}
          </p>
        )}

        {error && (
}
          <p
            id={errorId}
            className="mt-1 text-sm text-red-500 flex items-center"
            role="alert"
            aria-live="assertive"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

AccessibleInput.displayName = &apos;AccessibleInput&apos;;

export default AccessibleInput;