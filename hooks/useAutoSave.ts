import { useEffect, useRef, useCallback } from 'react';

interface UseAutoSaveOptions<T> {
  data: T;
  saveFunction: (data: T) => Promise<void>;
  delay?: number;
  enabled?: boolean;
  onSaveStart?: () => void;
  onSaveComplete?: () => void;
  onSaveError?: (error: Error) => void;
  shouldSave?: (data: T) => boolean;
}

export function useAutoSave<T>({
  data,
  saveFunction,
  delay = 2000,
  enabled = true,
  onSaveStart,
  onSaveComplete,
  onSaveError,
  shouldSave
}: UseAutoSaveOptions<T>) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<T>(data);
  const isSavingRef = useRef(false);

  const performSave = useCallback(async (dataToSave: T) => {
    if (isSavingRef.current) return;
    
    try {
      isSavingRef.current = true;
      onSaveStart?.();
      
      await saveFunction(dataToSave);
      lastSavedRef.current = dataToSave;
      
      onSaveComplete?.();
    } catch (error) {
      console.error('Auto-save failed:', error);
      onSaveError?.(error as Error);
    } finally {
      isSavingRef.current = false;
    }
  }, [saveFunction, onSaveStart, onSaveComplete, onSaveError]);

  const scheduleAutoSave = useCallback(() => {
    if (!enabled) return;
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Schedule new save
    timeoutRef.current = setTimeout(() => {
      // Check if data has changed
      const hasChanged = JSON.stringify(data) !== JSON.stringify(lastSavedRef.current);
      const shouldPerformSave = shouldSave ? shouldSave(data) : true;
      
      if (hasChanged && shouldPerformSave && !isSavingRef.current) {
        performSave(data);
      }
    }, delay);
  }, [data, delay, enabled, performSave, shouldSave]);

  // Schedule auto-save when data changes
  useEffect(() => {
    scheduleAutoSave();
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [scheduleAutoSave]);

  // Force immediate save
  const forceSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    return performSave(data);
  }, [performSave, data]);

  // Check if there are unsaved changes
  const hasUnsavedChanges = useCallback(() => {
    return JSON.stringify(data) !== JSON.stringify(lastSavedRef.current);
  }, [data]);

  return {
    forceSave,
    hasUnsavedChanges,
    isSaving: isSavingRef.current
  };
}

export default useAutoSave;