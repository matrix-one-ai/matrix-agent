import { useEffect, useRef } from "react";

/**
 * Hooks for handling outside click
 * @param handler Callback
 * @returns
 */
export function useOutsideClick<T extends HTMLElement>(
  handler: (event: PointerEvent) => void,
) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const handleClick = (event: PointerEvent) => {
      if (
        elementRef.current &&
        !elementRef.current.contains(event.target as Node)
      ) {
        handler(event);
      }
    };

    document.addEventListener("pointerup", handleClick);

    return () => {
      document.removeEventListener("pointerup", handleClick);
    };
  }, [handler]);

  return elementRef;
}
