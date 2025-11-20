import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  callback: () => void;
  description?: string;
}

/**
 * Hook to register keyboard shortcuts
 * @param shortcuts Array of keyboard shortcuts to register
 * @param enabled Whether shortcuts are enabled (default: true)
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when user is typing in an input
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Allow Escape key even in inputs
        if (event.key !== 'Escape') {
          return;
        }
      }

      shortcuts.forEach((shortcut) => {
        const ctrlKeyMatch = shortcut.ctrlKey ? event.ctrlKey : !event.ctrlKey;
        const shiftKeyMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
        const metaKeyMatch = shortcut.metaKey ? event.metaKey : !event.metaKey;

        if (
          event.key === shortcut.key &&
          ctrlKeyMatch &&
          shiftKeyMatch &&
          metaKeyMatch
        ) {
          event.preventDefault();
          shortcut.callback();
        }
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}

/**
 * Hook to add Escape key handler
 * @param callback Function to call when Escape is pressed
 * @param enabled Whether the handler is enabled (default: true)
 */
export function useEscapeKey(callback: () => void, enabled: boolean = true) {
  useKeyboardShortcuts(
    [
      {
        key: 'Escape',
        callback,
        description: 'Close or cancel',
      },
    ],
    enabled
  );
}
