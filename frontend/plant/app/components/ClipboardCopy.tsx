import React, { useCallback } from "react";
import clsx from "clsx";
import toast, { Toaster } from "react-hot-toast";

interface IClipboardCopyProps extends React.HTMLAttributes<HTMLButtonElement> {
  text: string;
}

const ClipboardCopy: React.FC<IClipboardCopyProps> = ({
  className = "",
  children,
  text,
  ...rest
}) => {
  // Handle clipboard copy
  const handleClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast("Copied to Clipboard", {
        position: "bottom-center",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  }, [text]);

  return (
    <button className={clsx("", className)} onClick={handleClick} {...rest}>
      {children}
      <Toaster />
    </button>
  );
};

export default ClipboardCopy;
