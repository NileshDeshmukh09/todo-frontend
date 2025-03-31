import { useEffect, useCallback } from 'react';

export const useKeyboardShortcuts = (shortcuts) => {
  const handleKeyDown = useCallback(
    (event) => {
      const key = event.key.toLowerCase();
      const ctrlKey = event.ctrlKey || event.metaKey;
      const shiftKey = event.shiftKey;
      const altKey = event.altKey;

      const shortcut = Object.entries(shortcuts).find(([_, config]) => {
        const { key: shortcutKey, ctrl, shift, alt } = config;
        return (
          shortcutKey.toLowerCase() === key &&
          !!ctrl === ctrlKey &&
          !!shift === shiftKey &&
          !!alt === altKey
        );
      });

      if (shortcut) {
        event.preventDefault();
        shortcut[1].action();
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

export const useEscapeKey = (callback) => {
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        callback();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [callback]);
};

export const useEnterKey = (callback) => {
  useEffect(() => {
    const handleEnterKey = (event) => {
      if (event.key === 'Enter') {
        callback();
      }
    };

    window.addEventListener('keydown', handleEnterKey);
    return () => window.removeEventListener('keydown', handleEnterKey);
  }, [callback]);
};

export const useArrowKeys = (callbacks) => {
  useEffect(() => {
    const handleArrowKeys = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          callbacks.onUp?.();
          break;
        case 'ArrowDown':
          callbacks.onDown?.();
          break;
        case 'ArrowLeft':
          callbacks.onLeft?.();
          break;
        case 'ArrowRight':
          callbacks.onRight?.();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleArrowKeys);
    return () => window.removeEventListener('keydown', handleArrowKeys);
  }, [callbacks]);
}; 