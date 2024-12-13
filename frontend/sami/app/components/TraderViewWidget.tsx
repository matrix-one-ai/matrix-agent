import React, { useEffect, useRef, memo } from "react";

function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: "SOLUSD",
      width: 150,
      height: 150,
      locale: "en",
      dateRange: "1D",
      colorTheme: "light",
      isTransparent: true,
      autosize: false,
      largeChartUrl: "",
    });

    const container = document.querySelector(
      ".tradingview-widget-container__widget"
    );
    if (container) {
      container.innerHTML = "";
      container.appendChild(script);
    }
  }, []);

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}

export default memo(TradingViewWidget);
