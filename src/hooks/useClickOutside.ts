import { useEffect, useRef, useCallback } from 'react';

type ClickOutsideHandler = (event: MouseEvent | TouchEvent) => void;

interface UseClickOutsideOptions {
  enabled?: boolean;
  ignoreRefs?: React.RefObject<HTMLElement>[];
}

export function useClickOutside(
  handler: ClickOutsideHandler,
  options: UseClickOutsideOptions = {}
) {
  const { enabled = true, ignoreRefs = [] } = options;
  const ref = useRef<HTMLElement>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!enabled) return;

      const target = event.target as Node;
      const element = ref.current;

      // Check if click is inside the element
      if (element && !element.contains(target)) {
        // Check if click is inside any of the ignored refs
        const isIgnored = ignoreRefs.some(
          (ignoreRef) => ignoreRef.current && ignoreRef.current.contains(target)
        );

        if (!isIgnored) {
          handler(event);
        }
      }
    },
    [enabled, handler, ignoreRefs]
  );

  useEffect(() => {
    if (enabled) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [enabled, handleClickOutside]);

  return ref;
}

// Example usage:
// const ref = useClickOutside(() => {
//   console.log('Clicked outside');
// });
//
// const ref = useClickOutside(
//   () => console.log('Clicked outside'),
//   {
//     enabled: isOpen,
//     ignoreRefs: [menuRef, buttonRef],
//   }
// ); 