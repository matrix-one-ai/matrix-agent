"use client";

import React from "react";
import clsx from "clsx";
import CardHeader from "./CardHeader";
import { useToggle } from "@/app/hooks/useToggle";

interface ICardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  uncollapsible?: boolean;
  children?: React.ReactNode;
  contentClassName?: string;
}

const Card: React.FC<ICardProps> = ({
  className,
  title,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  uncollapsible = false,
  children,
  contentClassName,
  ...rest
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isCollapsed, { toggle: toggleIsCollapsed }] = useToggle(false);

  return (
    <div
      className={clsx(
        "flex flex-col bg-primary w-full overflow-hidden rounded-[20px] border-2 border-black",
        className,
      )}
      {...rest}
    >
      {/* Header */}
      <CardHeader
        title={title}
        // TODO: Enable once this collapsible feature is necessary
        // onClick={uncollapsible ? undefined : toggleIsCollapsed}
      />
      {/* Content */}
      <div
        className={clsx(
          "transition-all origin-top w-full px-4 overflow-hidden border-t-2 border-black ",
          isCollapsed
            ? "scale-y-0 opacity-0 !h-0 py-0"
            : "scale-y-100 opacity-100 h-auto py-4",
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Card;
