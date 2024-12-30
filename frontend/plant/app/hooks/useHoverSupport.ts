import { useState, useEffect } from "react";

const useHoverSupport = (): boolean => {
  const [supportsHover, setSupportsHover] = useState<boolean>(false);

  useEffect(() => {
    // Check for hover support only after the component has mounted (client-side)
    const mediaQuery = window.matchMedia("(hover: hover)");
    setSupportsHover(mediaQuery.matches);

    // Listen for changes in hover support
    const handleChange = (event: MediaQueryListEvent) => {
      setSupportsHover(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    // Cleanup listener on unmount
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return supportsHover;
};

export default useHoverSupport;
