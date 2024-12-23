import { useRef, useCallback, useEffect } from "react";

/**
 * Hooks for infinite scroll
 * @param callback Callback when reaching the target
 * @param option Option for intersection observer
 * @returns Callback ref
 */
function useInfiniteScroll<T extends HTMLElement>(
  callback: () => void,
  option: IntersectionObserverInit = { threshold: 0.1 },
): React.RefCallback<T> {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetNodeRef = useRef<T | null>(null);

  // Handler for observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (!entries[0].isIntersecting) return;

      // Whenever reaching the target element, call the callback
      callback();
    },
    [callback],
  );

  // Callback ref for target node
  const targetRef = useCallback(
    (node: T | null) => {
      if (
        node === null || // Node should be valid
        (targetNodeRef.current !== null && node === targetNodeRef.current) // Should not be same as previous node
      )
        return;

      targetNodeRef.current = node;
      observerRef.current?.disconnect();
      observerRef.current = new IntersectionObserver(handleObserver, option);
      observerRef.current.observe(node);
    },
    [handleObserver, option],
  );

  // Clear observer when unmounted
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
      targetNodeRef.current = null;
    };
  }, []);

  return targetRef;
}

export default useInfiniteScroll;
