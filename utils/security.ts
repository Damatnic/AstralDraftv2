/**
 * Advanced Security and Console Management Module
 * Implements multi-layered defense against browser extension interference
 */

// Define comprehensive noise patterns
const EXTENSION_NOISE_PATTERNS = [
  // React DevTools specific
  &apos;react devtools&apos;,
  &apos;react_devtools&apos;,
  &apos;reactdevtools&apos;,
  &apos;__react&apos;,
  &apos;react-devtools&apos;,
  &apos;duplicate welcome&apos;,
  &apos;welcome "message"&apos;,
  &apos;content script&apos;,
  &apos;devtools detected&apos;,
  &apos;devtools extension&apos;,
  
  // Chrome/Firefox extension errors
  &apos;message port closed&apos;,
  &apos;runtime.lasterror&apos;,
  &apos;could not establish connection&apos;,
  &apos;receiving end does not exist&apos;,
  &apos;extension context&apos;,
  &apos;chrome-extension&apos;,
  &apos;moz-extension&apos;,
  &apos;browser extension&apos;,
  &apos;extension error&apos;,
  
  // Property access errors
  &apos;cannot read properties of undefined&apos;,
  &apos;reading \&apos;length\&apos;&apos;,
  &apos;undefined.length&apos;,
  &apos;of undefined&apos;,
  &apos;of null&apos;,
  
  // PostMessage related
  &apos;postmessage&apos;,
  &apos;message event&apos;,
  &apos;message handler&apos;,
  
  // General extension noise
  &apos;uncaught (in promise)&apos;,
  &apos;unchecked runtime.lasterror&apos;,
  &apos;non-existent content script&apos;,
  &apos;extension runtime&apos;,
  
  // Development tool messages
  &apos;download the react devtools&apos;,
  &apos;react hook&apos;,
  &apos;react fiber&apos;,
  &apos;react dom&apos;,
  
  // Browser specific
  &apos;non-passive event listener&apos;,
  &apos;passive event listener&apos;,
  &apos;blocked a frame&apos;,
  &apos;cross-origin&apos;,
  &apos;cors&apos;,
  
  // Network related extension errors
  &apos;failed to fetch&apos;,
  &apos;network error&apos;,
  &apos;load resource&apos;,
  
  // Other common extension noise
  &apos;grammarly&apos;,
  &apos;lastpass&apos;,
  &apos;adblock&apos;,
  &apos;honey&apos;,
  &apos;metamask&apos;,
  &apos;bitwarden&apos;
];

/**
 * Ultra-aggressive message filtering
 */
export function isExtensionNoise(message: any): boolean {
}
  try {
}
    // Convert message to string for pattern matching
    let msgStr = &apos;&apos;;
    if (typeof message === &apos;string&apos;) {
}
      msgStr = message.toLowerCase();
    } else if (message && typeof message === &apos;object&apos;) {
}
      // Handle Error objects
      if (message instanceof Error) {
}
        msgStr = (message.message || message.toString()).toLowerCase();
      } else {
}
        try {
}
          msgStr = JSON.stringify(message).toLowerCase();
        } catch {
}
          msgStr = String(message).toLowerCase();
        }
      }
    } else if (message !== null && message !== undefined) {
}
      msgStr = String(message).toLowerCase();
    }
    
    // If we can&apos;t parse the message, assume it&apos;s noise
    if (!msgStr) return true;
    
    // Check against all patterns
    return EXTENSION_NOISE_PATTERNS.some((pattern: any) => 
      msgStr.includes(pattern.toLowerCase())
    );
  } catch {
}
    // If any error occurs during filtering, silence the message
    return true;
  }
}

/**
 * Safe stringify function that handles all edge cases
 */
export function safeStringify(obj: any): string {
}
  const seen = new WeakSet();
  
  try {
}
    return JSON.stringify(obj, (key, value) => {
}
      // Handle circular references
      if (typeof value === &apos;object&apos; && value !== null) {
}
        if (seen.has(value)) {
}
          return &apos;[Circular]&apos;;
        }
        seen.add(value);
      }
      
      // Handle special types
      if (value instanceof Error) {
}
        return `[Error: ${value.message}]`;
      }
      if (typeof value === &apos;function&apos;) {
}
        return &apos;[Function]&apos;;
      }
      if (typeof value === &apos;symbol&apos;) {
}
        return value.toString();
      }
      if (value === undefined) {
}
        return &apos;[undefined]&apos;;
      }
      
      return value;
    });
  } catch {
}
    // Fallback for completely unparseable objects
    try {
}
      return String(obj);
    } catch {
}
      return &apos;[Unparseable]&apos;;
    }
  }
}

/**
 * Initialize comprehensive console protection
 */
export function initializeConsoleProtection(): void {
}
  // Store original console methods
  const originalConsole = {
}
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
    debug: console.debug
  };
  
  // Create filtered console wrapper
  const createFilteredMethod = (originalMethod: Function) => {
}
    return function(...args: any[]) {
}
      try {
}
        // Check if any argument contains extension noise
        const hasNoise = args.some((arg: any) => isExtensionNoise(arg));
        
        if (!hasNoise) {
}
          // Also check the combined message
          const combinedMessage = args.map((arg: any) => {
}
            if (typeof arg === &apos;string&apos;) return arg;
            if (arg instanceof Error) return arg.message;
            return safeStringify(arg);
          }).join(&apos; &apos;);
          
          if (!isExtensionNoise(combinedMessage)) {
}
            // Safe to log
            originalMethod.apply(console, args);
          }
        }
      } catch {
}
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
  window.addEventListener(&apos;error&apos;, (event: any) => {
}
    if (isExtensionNoise(event.message) || 
        isExtensionNoise(event.error) ||
        (event.filename && event.filename.includes(&apos;extension://&apos;))) {
}
      event.preventDefault();
      event.stopImmediatePropagation();
      return false;
    }
  }, true);
  
  // Intercept unhandled promise rejections
  window.addEventListener(&apos;unhandledrejection&apos;, (event: any) => {
}
    if (isExtensionNoise(event.reason)) {
}
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
}
  // Override postMessage to filter React DevTools messages
  const originalPostMessage = window.postMessage.bind(window);
  
  window.postMessage = function(message: any, targetOrigin: string, transfer?: Transferable[]) {
}
    try {
}
      const msgStr = typeof message === &apos;string&apos; 
        ? message 
        : safeStringify(message);
      
      // Block React DevTools specific messages
      if (msgStr.toLowerCase().includes(&apos;react&apos;) || 
          msgStr.toLowerCase().includes(&apos;devtools&apos;) ||
          msgStr.toLowerCase().includes(&apos;__react&apos;)) {
}
        return; // Silently drop the message
      }
      
      // Allow other messages through
      return originalPostMessage(message, targetOrigin, transfer);
    } catch {
}
      // Drop any problematic messages
      return;
    }
  };
  
  // Also filter incoming messages
  window.addEventListener(&apos;message&apos;, (event: any) => {
}
    try {
}
      const dataStr = typeof event.data === &apos;string&apos;
        ? event.data
        : safeStringify(event.data);
      
      if (dataStr.toLowerCase().includes(&apos;react&apos;) || 
          dataStr.toLowerCase().includes(&apos;devtools&apos;)) {
}
        event.stopImmediatePropagation();
        event.preventDefault();
        return false;
      }
    } catch {
}
      // Ignore errors
    }
  }, true);
  
  // Remove React DevTools global hooks if they exist
  try {
}
    if (&apos;__REACT_DEVTOOLS_GLOBAL_HOOK__&apos; in window) {
}
      delete (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
    }
  } catch {
}
    // Ignore if we can&apos;t delete
  }
  
  // Prevent React DevTools from being defined
  Object.defineProperty(window, &apos;__REACT_DEVTOOLS_GLOBAL_HOOK__&apos;, {
}
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
}
  // Must be called as early as possible
  initializeConsoleProtection();
  blockReactDevTools();
  
  // Additional security hardening
  if (process.env.NODE_ENV === &apos;production&apos;) {
}
    // Disable right-click in production
    document.addEventListener(&apos;contextmenu&apos;, (e: any) => {
}
      e.preventDefault();
      return false;
    });
    
    // Disable dev tools shortcuts
    document.addEventListener(&apos;keydown&apos;, (e: any) => {
}
      // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (e.key === &apos;F12&apos; || 
          (e.ctrlKey && e.shiftKey && [&apos;I&apos;, &apos;J&apos;, &apos;C&apos;].includes(e.key))) {
}
        e.preventDefault();
        return false;
      }
    });
  }
}

// Auto-initialize on import in browser environment
if (typeof window !== &apos;undefined&apos;) {
}
  // Initialize immediately
  initializeSecurity();
  
  // Also initialize on DOMContentLoaded to catch late-loading extensions
  if (document.readyState === &apos;loading&apos;) {
}
    document.addEventListener(&apos;DOMContentLoaded&apos;, initializeSecurity);
  } else {
}
    // DOM already loaded, initialize again to be safe
    setTimeout(initializeSecurity, 0);
  }
}

/**
 * Security validators for input sanitization
 */
export const SecurityValidators = {
}
  email: (value: string): boolean => {
}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  
  alphanumeric: (value: string): boolean => {
}
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(value);
  },
  
  numeric: (value: string): boolean => {
}
    const numericRegex = /^\d+$/;
    return numericRegex.test(value);
  },
  
  safeText: (value: string): boolean => {
}
    // Allow letters, numbers, spaces, and common punctuation
    const safeTextRegex = /^[a-zA-Z0-9\s.,!?&apos;"-]+$/;
    return safeTextRegex.test(value);
  },
  
  url: (value: string): boolean => {
}
    try {
}
      new URL(value);
      return true;
    } catch {
}
      return false;
    }
  }
};

/**
 * Sanitize user input to prevent XSS and injection attacks
 */
export function sanitizeInput(input: string, type: &apos;text&apos; | &apos;email&apos; | &apos;numeric&apos; | &apos;alphanumeric&apos; = &apos;text&apos;): string {
}
  if (!input) return &apos;&apos;;
  
  // Remove any script tags or dangerous HTML
  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, &apos;&apos;)
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, &apos;&apos;)
    .replace(/javascript:/gi, &apos;&apos;)
    .replace(/on\w+\s*=/gi, &apos;&apos;);
  
  // Apply type-specific sanitization
  switch (type) {
}
    case &apos;email&apos;:
      sanitized = sanitized.toLowerCase().trim();
      break;
    case &apos;numeric&apos;:
      sanitized = sanitized.replace(/[^\d]/g, &apos;&apos;);
      break;
    case &apos;alphanumeric&apos;:
      sanitized = sanitized.replace(/[^a-zA-Z0-9]/g, &apos;&apos;);
      break;
    case &apos;text&apos;:
    default:
      // Allow common text characters but escape HTML entities
      sanitized = sanitized
        .replace(/&/g, &apos;&amp;&apos;)
        .replace(/</g, &apos;&lt;&apos;)
        .replace(/>/g, &apos;&gt;&apos;)
        .replace(/"/g, &apos;&quot;&apos;)
        .replace(/&apos;/g, &apos;&#039;&apos;);
      break;
  }
  
  return sanitized;
}

export default {
}
  initializeSecurity,
  initializeConsoleProtection,
  blockReactDevTools,
  isExtensionNoise,
  safeStringify,
  sanitizeInput,
//   SecurityValidators
};