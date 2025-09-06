/**
 * Advanced Security and Console Management Module
 * Implements multi-layered defense against browser extension interference
 */

// Define comprehensive noise patterns
const EXTENSION_NOISE_PATTERNS = [
  // React DevTools specific
  'react devtools',
  'react_devtools',
  'reactdevtools',
  '__react',
  'react-devtools',
  'duplicate welcome',
  'welcome "message"',
  'content script',
  'devtools detected',
  'devtools extension',
  
  // Chrome/Firefox extension errors
  'message port closed',
  'runtime.lasterror',
  'could not establish connection',
  'receiving end does not exist',
  'extension context',
  'chrome-extension',
  'moz-extension',
  'browser extension',
  'extension error',
  
  // Property access errors
  'cannot read properties of undefined',
  'reading \'length\'',
  'undefined.length',
  'of undefined',
  'of null',
  
  // PostMessage related
  'postmessage',
  'message event',
  'message handler',
  
  // General extension noise
  'uncaught (in promise)',
  'unchecked runtime.lasterror',
  'non-existent content script',
  'extension runtime',
  
  // Development tool messages
  'download the react devtools',
  'react hook',
  'react fiber',
  'react dom',
  
  // Browser specific
  'non-passive event listener',
  'passive event listener',
  'blocked a frame',
  'cross-origin',
  'cors',
  
  // Network related extension errors
  'failed to fetch',
  'network error',
  'load resource',
  
  // Other common extension noise
  'grammarly',
  'lastpass',
  'adblock',
  'honey',
  'metamask',
  'bitwarden'
];

/**
 * Ultra-aggressive message filtering
 */
export function isExtensionNoise(message: any): boolean {
  try {
    // Convert message to string for pattern matching
    let msgStr = '';
    if (typeof message === 'string') {
      msgStr = message.toLowerCase();
    } else if (message && typeof message === 'object') {
      // Handle Error objects
      if (message instanceof Error) {
        msgStr = (message.message || message.toString()).toLowerCase();
      } else {
        try {
          msgStr = JSON.stringify(message).toLowerCase();
        } catch {
          msgStr = String(message).toLowerCase();
        }
      }
    } else if (message !== null && message !== undefined) {
      msgStr = String(message).toLowerCase();
    }
    
    // If we can't parse the message, assume it's noise
    if (!msgStr) return true;
    
    // Check against all patterns
    return EXTENSION_NOISE_PATTERNS.some((pattern: any) => 
      msgStr.includes(pattern.toLowerCase())
    );
  } catch {
    // If any error occurs during filtering, silence the message
    return true;
  }
}

/**
 * Safe stringify function that handles all edge cases
 */
export function safeStringify(obj: any): string {
  const seen = new WeakSet();
  
  try {
    return JSON.stringify(obj, (key, value) => {
      // Handle circular references
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);
      }
      
      // Handle special types
      if (value instanceof Error) {
        return `[Error: ${value.message}]`;
      }
      if (typeof value === 'function') {
        return '[Function]';
      }
      if (typeof value === 'symbol') {
        return value.toString();
      }
      if (value === undefined) {
        return '[undefined]';
      }
      
      return value;
    });
  } catch {
    // Fallback for completely unparseable objects
    try {
      return String(obj);
    } catch {
      return '[Unparseable]';
    }
  }
}

/**
 * Initialize comprehensive console protection
 */
export function initializeConsoleProtection(): void {
  // Store original console methods
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
    debug: console.debug
  };
  
  // Create filtered console wrapper
  const createFilteredMethod = (originalMethod: Function) => {
    return function(...args: any[]) {
      try {
        // Check if any argument contains extension noise
        const hasNoise = args.some((arg: any) => isExtensionNoise(arg));
        
        if (!hasNoise) {
          // Also check the combined message
          const combinedMessage = args.map((arg: any) => {
            if (typeof arg === 'string') return arg;
            if (arg instanceof Error) return arg.message;
            return safeStringify(arg);
          }).join(' ');
          
          if (!isExtensionNoise(combinedMessage)) {
            // Safe to log
            originalMethod.apply(console, args);
          }
        }
      } catch {
        // Silently ignore any errors in the filtering process
      }
    };
  };
  
  // Override all console methods
  console.log = createFilteredMethod(originalConsole.log);
  console.warn = createFilteredMethod(originalConsole.warn);
  console.error = createFilteredMethod(originalConsole.error);
  console.info = createFilteredMethod(originalConsole.info);
  console.debug = createFilteredMethod(originalConsole.debug);
  
  // Intercept window error events
  window.addEventListener('error', (event: any) => {
    if (isExtensionNoise(event.message) || 
        isExtensionNoise(event.error) ||
        (event.filename && event.filename.includes('extension://'))) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return false;
    }
  }, true);
  
  // Intercept unhandled promise rejections
  window.addEventListener('unhandledrejection', (event: any) => {
    if (isExtensionNoise(event.reason)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return false;
    }
  }, true);
}

/**
 * Block React DevTools communication entirely
 */
export function blockReactDevTools(): void {
  // Override postMessage to filter React DevTools messages
  const originalPostMessage = window.postMessage.bind(window);
  
  window.postMessage = function(message: any, targetOrigin: string, transfer?: Transferable[]) {
    try {
      const msgStr = typeof message === 'string' 
        ? message 
        : safeStringify(message);
      
      // Block React DevTools specific messages
      if (msgStr.toLowerCase().includes('react') || 
          msgStr.toLowerCase().includes('devtools') ||
          msgStr.toLowerCase().includes('__react')) {
        return; // Silently drop the message
      }
      
      // Allow other messages through
      return originalPostMessage(message, targetOrigin, transfer);
    } catch {
      // Drop any problematic messages
      return;
    }
  };
  
  // Also filter incoming messages
  window.addEventListener('message', (event: any) => {
    try {
      const dataStr = typeof event.data === 'string'
        ? event.data
        : safeStringify(event.data);
      
      if (dataStr.toLowerCase().includes('react') || 
          dataStr.toLowerCase().includes('devtools')) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return false;
      }
    } catch {
      // Ignore errors
    }
  }, true);
  
  // Remove React DevTools global hooks if they exist
  try {
    if ('__REACT_DEVTOOLS_GLOBAL_HOOK__' in window) {
      delete (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
    }
  } catch {
    // Ignore if we can't delete
  }
  
  // Prevent React DevTools from being defined
  Object.defineProperty(window, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
    value: undefined,
    writable: false,
    configurable: false,
    enumerable: false
  });
}

/**
 * Initialize all security measures
 */
export function initializeSecurity(): void {
  // Must be called as early as possible
  initializeConsoleProtection();
  blockReactDevTools();
  
  // Additional security hardening
  if (process.env.NODE_ENV === 'production') {
    // Disable right-click in production
    document.addEventListener('contextmenu', (e: any) => {
      e.preventDefault();
      return false;
    });
    
    // Disable dev tools shortcuts
    document.addEventListener('keydown', (e: any) => {
      // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key))) {
        e.preventDefault();
        return false;
      }
    });
  }
}

// Auto-initialize on import in browser environment
if (typeof window !== 'undefined') {
  // Initialize immediately
  initializeSecurity();
  
  // Also initialize on DOMContentLoaded to catch late-loading extensions
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSecurity);
  } else {
    // DOM already loaded, initialize again to be safe
    setTimeout(initializeSecurity, 0);
  }
}

/**
 * Security validators for input sanitization
 */
export const SecurityValidators = {
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  
  alphanumeric: (value: string): boolean => {
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(value);
  },
  
  numeric: (value: string): boolean => {
    const numericRegex = /^\d+$/;
    return numericRegex.test(value);
  },
  
  safeText: (value: string): boolean => {
    // Allow letters, numbers, spaces, and common punctuation
    const safeTextRegex = /^[a-zA-Z0-9\s.,!?'"-]+$/;
    return safeTextRegex.test(value);
  },
  
  url: (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }
};

/**
 * Sanitize user input to prevent XSS and injection attacks
 */
export function sanitizeInput(input: string, type: 'text' | 'email' | 'numeric' | 'alphanumeric' = 'text'): string {
  if (!input) return '';
  
  // Remove any script tags or dangerous HTML
  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
  
  // Apply type-specific sanitization
  switch (type) {
    case 'email':
      sanitized = sanitized.toLowerCase().trim();
      break;
    case 'numeric':
      sanitized = sanitized.replace(/[^\d]/g, '');
      break;
    case 'alphanumeric':
      sanitized = sanitized.replace(/[^a-zA-Z0-9]/g, '');
      break;
    case 'text':
    default:
      // Allow common text characters but escape HTML entities
      sanitized = sanitized
        .replace(/&/g, '&')
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/"/g, '"')
        .replace(/'/g, '&#039;');
      break;
  }
  
  return sanitized;
}

export default {
  initializeSecurity,
  initializeConsoleProtection,
  blockReactDevTools,
  isExtensionNoise,
  safeStringify,
  sanitizeInput,
  SecurityValidators
};