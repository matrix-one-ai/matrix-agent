import { useCallback, useEffect, useRef, useState } from "react";

interface IToggle {
  set: (a: boolean) => void;
  reset: () => void;
  toggle: () => void;
  toggleOn: () => void;
  toggleOff: () => void;
}

/**
 * Hooks for boolean state with toggling methods
 * @param initial [Optional] initial state
 * @returns [boolean, IToggle]
 */
export const useToggle = (initial = false): [boolean, IToggle] => {
  const [on, setToggle] = useState(initial);

  const reset = useCallback(() => setToggle(initial), [initial]);
  const toggle = useCallback(() => setToggle((prev) => !prev), []);
  const toggleOn = useCallback(() => setToggle(true), []);
  const toggleOff = useCallback(() => setToggle(false), []);

  useEffect(() => {
    return () => {
      setToggle(false);
    };
  }, []);

  return [on, { set: setToggle, reset, toggle, toggleOn, toggleOff }];
};

/**
 * Hooks for boolean state that toggle only once
 * @param initial [Optional] initial state
 * @returns [boolean, () => void]
 */
export function useToggleOnce(initial = false): [boolean, () => void] {
  const [on, { toggle }] = useToggle(initial);
  const hasRun = useRef(false);

  const callback = useCallback(() => {
    if (hasRun.current) return;

    hasRun.current = true;

    toggle();
  }, [toggle]);

  return [on, callback];
}
