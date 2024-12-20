import React from "react";
import {
  Tooltip as MTTooltip,
  TooltipProps as MTTooltipProps,
} from "@material-tailwind/react";
import clsx from "clsx";

interface ITooltipProps extends MTTooltipProps {
  placement?: "top" | "bottom" | "left" | "right"; // Restrict placement to top, bottom, left, or right
}

const Tooltip: React.FC<ITooltipProps> = ({
  children,
  content,
  placement = "top",
  ...rest
}) => {
  return (
    <MTTooltip
      className={clsx(
        "bg-white text-black font-bold max-w-80 mx-2 p-1 rounded-lg drop-shadow-md text-center",
        // TODO: Disabling arrow tail for now
        // placement === "top" &&
        //   "before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-t-white",
        // placement === "bottom" &&
        //   "before:content-[''] before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-b-white",
        // placement === "left" &&
        //   "before:content-[''] before:absolute before:left-full before:top-1/2 before:-translate-y-1/2 before:border-8 before:border-transparent before:border-l-white",
        // placement === "right" &&
        //   "before:content-[''] before:absolute before:right-full before:top-1/2 before:-translate-y-1/2 before:border-8 before:border-transparent before:border-r-white",
      )}
      placement={placement}
      content={content}
      {...rest}
    >
      {children}
    </MTTooltip>
  );
};

export default Tooltip;
