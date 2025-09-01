import { useEffect, useCallback } from "react";

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
  category?: string;

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.contentEditable === "true") {
      return;
    }

    const matchingShortcut = shortcuts.find((shortcut: any) => {
      return (
        shortcut.key.toLowerCase() === event.key.toLowerCase() &&
        \!\!shortcut.ctrlKey === event.ctrlKey &&
        \!\!shortcut.altKey === event.altKey &&
        \!\!shortcut.shiftKey === event.shiftKey &&
        \!\!shortcut.metaKey === event.metaKey
      );
    });

    if (matchingShortcut) {
      event.preventDefault();
      matchingShortcut.action();
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
};

export default useKeyboardShortcuts;
