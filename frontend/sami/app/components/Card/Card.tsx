"use client";

import React from "react";
import clsx from "clsx";
import CardHeader from "./CardHeader";
import { useToggle } from "@/app/hooks/useToggle";

interface ICardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  level?: number;
  maxLevel?: number;
  uncollapsible?: boolean;
  children?: React.ReactNode;
  contentClassName?: string;
  actionBtnIcon?: React.ReactNode;
  onActionBtnClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Card: React.FC<ICardProps> = ({
  className,
  title,
  level = 0,
  maxLevel = 0,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  uncollapsible = false,
  children,
  contentClassName,
  actionBtnIcon,
  onActionBtnClick,
  ...rest
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isCollapsed, { toggle: toggleIsCollapsed }] = useToggle(false);

  return (
    <div className={clsx("flex flex-col bg-main w-full", className)} {...rest}>
      {/* Header */}
      <CardHeader
        title={title}
        level={level}
        maxLevel={maxLevel}
        actionBtnIcon={actionBtnIcon}
        // TODO: Enable once this collapsible feature is necessary
        // onClick={uncollapsible ? undefined : toggleIsCollapsed}
        onActionBtnClick={onActionBtnClick}
      />
      {/* Content */}
      <div
        className={clsx(
          "transition-all origin-top w-full px-4 overflow-hidden border-2 border-t-0 border-black ",
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
