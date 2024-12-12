import { useCallback, useEffect } from "react";
import { useToggle } from "./useToggle";

interface TwitterAPI {
  events: {
    bind(event: string, callback: () => void): void;
    unbind(event: string, callback: () => void): void;
    off(event: string, callback: () => void): void;
  };
  widgets: {
    load(): void;
  };
}

declare global {
  interface Window {
    twttr?: TwitterAPI;
  }
}

/**
 * Hooks for detecting tweet widget loading status
 * @returns
 */
export function useTweetWidget(
  dependencies: React.DependencyList = [],
): boolean {
  const [
    loadingWidget,
    { toggleOn: toggleOnLoadingWidget, toggleOff: toggleOffLoadingWidget },
  ] = useToggle(true);

  // Listener when widget is rendered
  const onTwttrWidgetRendered = useCallback(() => {
    toggleOffLoadingWidget();
  }, [toggleOffLoadingWidget]);

  // Listener when script is loaded
  const onTwttrScriptLoaded = useCallback(() => {
    window.twttr?.events.bind("rendered", onTwttrWidgetRendered);
  }, [onTwttrWidgetRendered]);

  useEffect(() => {
    toggleOnLoadingWidget();

    // Load Twitter widget script
    if (!window.twttr) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.onload = onTwttrScriptLoaded;
      document.body.appendChild(script);
    } else {
      // If script is already loaded, directly set up widgets
      window.twttr.widgets.load();
      onTwttrScriptLoaded();
    }

    // Clean up listener if needed
    return () => {
      // window.twttr?.events.unbind("loaded", onTwttrScriptLoaded);
      window.twttr?.events.unbind("rendered", onTwttrWidgetRendered);
    };
  }, [
    onTwttrScriptLoaded,
    onTwttrWidgetRendered,
    toggleOnLoadingWidget,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...dependencies,
  ]);

  return loadingWidget;
}
