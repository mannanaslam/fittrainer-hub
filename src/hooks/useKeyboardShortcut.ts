import { useEffect, useCallback } from 'react';

type KeyCombo = string | string[];
type KeyHandler = (event: KeyboardEvent) => void;

interface UseKeyboardShortcutOptions {
  enabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  target?: EventTarget;
}

export function useKeyboardShortcut(
  keyCombo: KeyCombo,
  callback: KeyHandler,
  options: UseKeyboardShortcutOptions = {}
) {
  const {
    enabled = true,
    preventDefault = true,
    stopPropagation = false,
    target = window,
  } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const keys = Array.isArray(keyCombo) ? keyCombo : [keyCombo];
      const pressedKey = event.key.toLowerCase();
      const modifierKeys = {
        ctrl: event.ctrlKey,
        shift: event.shiftKey,
        alt: event.altKey,
        meta: event.metaKey,
      };

      const isMatch = keys.some((key) => {
        const [modifier, mainKey] = key.toLowerCase().split('+');
        if (mainKey) {
          return (
            modifierKeys[modifier as keyof typeof modifierKeys] &&
            pressedKey === mainKey
          );
        }
        return pressedKey === key;
      });

      if (isMatch) {
        if (preventDefault) {
          event.preventDefault();
        }
        if (stopPropagation) {
          event.stopPropagation();
        }
        callback(event);
      }
    },
    [keyCombo, callback, enabled, preventDefault, stopPropagation]
  );

  useEffect(() => {
    target.addEventListener('keydown', handleKeyDown);
    return () => {
      target.removeEventListener('keydown', handleKeyDown);
    };
  }, [target, handleKeyDown]);
}

// Example usage:
// useKeyboardShortcut('ctrl+s', (event) => {
//   console.log('Save shortcut pressed');
// });
//
// useKeyboardShortcut(['ctrl+c', 'meta+c'], (event) => {
//   console.log('Copy shortcut pressed');
// });
//
// useKeyboardShortcut('shift+enter', (event) => {
//   console.log('Shift + Enter pressed');
// }, {
//   preventDefault: true,
//   stopPropagation: true,
//   target: document.querySelector('.editor'),
// }); 