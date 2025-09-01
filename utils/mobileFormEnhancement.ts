// Mobile Form Enhancement Utility
// Automatically enhances form inputs with proper attributes for mobile usability


export interface FormEnhancementOptions {
}
  enableAutocomplete?: boolean;
  enableInputMode?: boolean;
  enableMobileKeyboards?: boolean;
}

/**
 * Enhances form inputs with mobile-optimized attributes
 * Call this function on form containers to automatically enhance all inputs
 */
export function enhanceFormForMobile(
  formElement: HTMLFormElement | HTMLElement,
  options: FormEnhancementOptions = {}
) {
}
  const {
}
    enableAutocomplete = true,
    enableInputMode = true,
    enableMobileKeyboards = true
  } = options;

  if (!formElement) return;

  // Get all input elements within the form
  const inputs = formElement.querySelectorAll(&apos;input, textarea&apos;);

  inputs.forEach((input: any) => {
}
    const inputElement = input as HTMLInputElement | HTMLTextAreaElement;
    
    // Skip if already enhanced
    if (inputElement.dataset.mobileEnhanced === &apos;true&apos;) return;
    
    enhanceInput(inputElement, { enableAutocomplete, enableInputMode, enableMobileKeyboards });
    
    // Mark as enhanced to avoid duplicate processing
    inputElement.dataset.mobileEnhanced = &apos;true&apos;;
  });
}

/**
 * Enhances a single input element with mobile-optimized attributes
 */
export function enhanceInput(
  input: HTMLInputElement | HTMLTextAreaElement,
  options: FormEnhancementOptions = {}
) {
}
  const {
}
    enableAutocomplete = true,
    enableInputMode = true,
    enableMobileKeyboards = true
  } = options;

  if (!input) return;

  const placeholder = input.placeholder?.toLowerCase() || &apos;&apos;;
  const name = input.name?.toLowerCase() || &apos;&apos;;
  const id = input.id?.toLowerCase() || &apos;&apos;;
  const type = input.type?.toLowerCase() || &apos;&apos;;

  // Set input modes for better mobile keyboards
  if (enableInputMode && enableMobileKeyboards) {
}
    setInputMode(input, placeholder, name, id, type);
  }

  // Set autocomplete attributes
  if (enableAutocomplete) {
}
    setAutocomplete(input, placeholder, name, id, type);
  }

  // Set specific input types for better mobile experience
  if (enableMobileKeyboards) {
}
    optimizeInputType(input, placeholder, name, id);
  }

  // Ensure minimum font size to prevent zoom on iOS
  if (!input.style.fontSize || parseInt(input.style.fontSize) < 16) {
}
    input.style.fontSize = &apos;16px&apos;;
  }
}

/**
 * Sets appropriate input mode for mobile keyboards
 */
function setInputMode(
  input: HTMLInputElement | HTMLTextAreaElement,
  placeholder: string,
  name: string,
  id: string,
  type: string
) {
}
  // Skip if already has inputmode
  if (input.getAttribute(&apos;inputmode&apos;)) return;

  if (type === &apos;email&apos; || placeholder.includes(&apos;email&apos;) || name.includes(&apos;email&apos;) || id.includes(&apos;email&apos;)) {
}
    input.setAttribute(&apos;inputmode&apos;, &apos;email&apos;);
  } else if (type === &apos;tel&apos; || placeholder.includes(&apos;phone&apos;) || placeholder.includes(&apos;tel&apos;) || name.includes(&apos;phone&apos;) || name.includes(&apos;tel&apos;)) {
}
    input.setAttribute(&apos;inputmode&apos;, &apos;tel&apos;);
  } else if (type === &apos;url&apos; || placeholder.includes(&apos;url&apos;) || placeholder.includes(&apos;website&apos;) || placeholder.includes(&apos;http&apos;)) {
}
    input.setAttribute(&apos;inputmode&apos;, &apos;url&apos;);
  } else if (
    type === &apos;number&apos; || 
    placeholder.includes(&apos;number&apos;) || 
    placeholder.includes(&apos;%&apos;) || 
    placeholder.includes(&apos;score&apos;) || 
    placeholder.includes(&apos;point&apos;) ||
    placeholder.includes(&apos;prediction&apos;) ||
    placeholder.includes(&apos;training&apos;) ||
    placeholder.includes(&apos;validation&apos;)
  ) {
}
    input.setAttribute(&apos;inputmode&apos;, &apos;numeric&apos;);
  } else if (
    placeholder.includes(&apos;search&apos;) || 
    name.includes(&apos;search&apos;) || 
    id.includes(&apos;search&apos;)
  ) {
}
    input.setAttribute(&apos;inputmode&apos;, &apos;search&apos;);
  }
}

/**
 * Sets appropriate autocomplete attributes
 */
function setAutocomplete(
  input: HTMLInputElement | HTMLTextAreaElement,
  placeholder: string,
  name: string,
  id: string,
  type: string
) {
}
  // Skip if already has autocomplete
  if (input.getAttribute(&apos;autocomplete&apos;)) return;

  if (type === &apos;email&apos; || name === &apos;email&apos; || id === &apos;email&apos;) {
}
    input.setAttribute(&apos;autocomplete&apos;, &apos;email&apos;);
  } else if (type === &apos;password&apos; && (name.includes(&apos;confirm&apos;) || id.includes(&apos;confirm&apos;))) {
}
    input.setAttribute(&apos;autocomplete&apos;, &apos;new-password&apos;);
  } else if (type === &apos;password&apos;) {
}
    input.setAttribute(&apos;autocomplete&apos;, &apos;current-password&apos;);
  } else if (name === &apos;username&apos; || id === &apos;username&apos;) {
}
    input.setAttribute(&apos;autocomplete&apos;, &apos;username&apos;);
  } else if (name.includes(&apos;name&apos;) || id.includes(&apos;name&apos;)) {
}
    if (name.includes(&apos;first&apos;) || id.includes(&apos;first&apos;)) {
}
      input.setAttribute(&apos;autocomplete&apos;, &apos;given-name&apos;);
    } else if (name.includes(&apos;last&apos;) || id.includes(&apos;last&apos;)) {
}
      input.setAttribute(&apos;autocomplete&apos;, &apos;family-name&apos;);
    } else {
}
      input.setAttribute(&apos;autocomplete&apos;, &apos;name&apos;);
    }
  } else if (name.includes(&apos;phone&apos;) || id.includes(&apos;phone&apos;) || type === &apos;tel&apos;) {
}
    input.setAttribute(&apos;autocomplete&apos;, &apos;tel&apos;);
  } else if (placeholder.includes(&apos;search&apos;)) {
}
    input.setAttribute(&apos;autocomplete&apos;, &apos;off&apos;);
  }
}

/**
 * Optimizes input type for better mobile experience
 */
function optimizeInputType(
  input: HTMLInputElement | HTMLTextAreaElement,
  placeholder: string,
  name: string,
  id: string
) {
}
  // Only change if it&apos;s a generic text input
  if (input.type !== &apos;text&apos;) return;

  if (placeholder.includes(&apos;email&apos;) || name.includes(&apos;email&apos;) || id.includes(&apos;email&apos;)) {
}
    (input as HTMLInputElement).type = &apos;email&apos;;
  } else if (placeholder.includes(&apos;url&apos;) || placeholder.includes(&apos;website&apos;) || placeholder.includes(&apos;http&apos;)) {
}
    (input as HTMLInputElement).type = &apos;url&apos;;
  } else if (placeholder.includes(&apos;phone&apos;) || placeholder.includes(&apos;tel&apos;)) {
}
    (input as HTMLInputElement).type = &apos;tel&apos;;
  } else if (placeholder.includes(&apos;search&apos;) || name.includes(&apos;search&apos;) || id.includes(&apos;search&apos;)) {
}
    (input as HTMLInputElement).type = &apos;search&apos;;
  }
}

/**
 * React hook for automatically enhancing forms in components
 */
export function useMobileFormEnhancement(
  formRef: React.RefObject<HTMLFormElement | HTMLElement>,
  options: FormEnhancementOptions = {}
) {
}
  React.useEffect(() => {
}
    if (formRef.current) {
}
      enhanceFormForMobile(formRef.current, options);
    }
  }, [formRef, options]);
}

/**
 * React hook for enhancing a single input
 */
export function useMobileInputEnhancement(
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>,
  options: FormEnhancementOptions = {}
) {
}
  React.useEffect(() => {
}
    if (inputRef.current) {
}
      enhanceInput(inputRef.current, options);
    }
  }, [inputRef, options]);
}

// Auto-enhancement for document (call once in app initialization)
export function initializeGlobalFormEnhancement(options: FormEnhancementOptions = {}) {
}
  // Enhanced on DOM content loaded
  if (document.readyState === &apos;loading&apos;) {
}
    document.addEventListener(&apos;DOMContentLoaded&apos;, () => {
}
      enhanceAllFormsInDocument(options);
    });
  } else {
}
    enhanceAllFormsInDocument(options);
  }

  // Watch for dynamically added forms
  const observer = new MutationObserver((mutations: any) => {
}
    mutations.forEach((mutation: any) => {
}
      mutation.addedNodes.forEach((node: any) => {
}
        if (node.nodeType === Node.ELEMENT_NODE) {
}
          const element = node as Element;
          
          // Check if the added element is a form or contains forms
          if (element.tagName === &apos;FORM&apos;) {
}
            enhanceFormForMobile(element as HTMLFormElement, options);
          } else {
}
            const forms = element.querySelectorAll(&apos;form, [data-form-container]&apos;);
            forms.forEach((form: any) => {
}
              enhanceFormForMobile(form as HTMLFormElement, options);
            });
          }
          
          // Also check for individual inputs
          const inputs = element.querySelectorAll(&apos;input, textarea&apos;);
          inputs.forEach((input: any) => {
}
            enhanceInput(input as HTMLInputElement | HTMLTextAreaElement, options);
          });
        }
      });
    });
  });

  observer.observe(document.body, {
}
    childList: true,
    subtree: true
  });

  return () => observer.disconnect();
}

/**
 * Enhances all forms currently in the document
 */
function enhanceAllFormsInDocument(options: FormEnhancementOptions = {}) {
}
  // Enhance all forms
  const forms = document.querySelectorAll(&apos;form, [data-form-container]&apos;);
  forms.forEach((form: any) => {
}
    enhanceFormForMobile(form as HTMLFormElement, options);
  });

  // Enhance standalone inputs
  const inputs = document.querySelectorAll(&apos;input:not(form input), textarea:not(form textarea)&apos;);
  inputs.forEach((input: any) => {
}
    enhanceInput(input as HTMLInputElement | HTMLTextAreaElement, options);
  });
}
