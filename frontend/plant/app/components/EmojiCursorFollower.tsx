"use client";

import { useEffect, useState } from "react";

type TXYCoord = { x: number; y: number };

const EmojiCursorFollower: React.FC = () => {
  const [position, setPosition] = useState<TXYCoord>({ x: 0, y: 0 }); // Cursor position
  const [smoothPosition, setSmoothPosition] = useState<TXYCoord | null>(null); // Emoji position
  const [visible, setVisible] = useState(false); // Controls visibility

  useEffect(() => {
    // Detect if the device supports mouse events
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return; // Disable emoji follower on touch screens

    const handleMouseMove = (e: MouseEvent) => {
      const newCursorPos = { x: e.clientX, y: e.clientY };
      setPosition(newCursorPos);

      // Show emoji after the first mouse movement
      if (!visible) {
        setSmoothPosition(newCursorPos);
        setVisible(true);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [visible]);

  // Smooth emoji movement
  useEffect(() => {
    let animationFrame: number;

    const updateSmoothPosition = () => {
      setSmoothPosition((prev) => {
        if (prev === null) return null;

        const dx = position.x - prev.x;
        const dy = position.y - prev.y;

        // Apply tension for smooth movement
        const tension = 0.03;
        const snapThreshold = 1;

        return {
          x: Math.abs(dx) < snapThreshold ? position.x : prev.x + dx * tension,
          y: Math.abs(dy) < snapThreshold ? position.y : prev.y + dy * tension,
        };
      });

      animationFrame = requestAnimationFrame(updateSmoothPosition);
    };

    updateSmoothPosition();

    return () => cancelAnimationFrame(animationFrame);
  }, [position]);

  return (
    <>
      {visible && (
        <div className="pointer-events-none fixed top-0 left-0 w-full h-full">
          <div
            className="text-2xl"
            style={{
              position: "absolute",
              transform: `translate(${smoothPosition?.x || 0}px, ${smoothPosition?.y || 0}px)`,
            }}
          >
            💦
          </div>
        </div>
      )}
    </>
  );
};

export default EmojiCursorFollower;
