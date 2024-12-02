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
  onArrowClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Card: React.FC<ICardProps> = ({
  className,
  title,
  level = 0,
  maxLevel = 0,
  uncollapsible = false,
  children,
  onArrowClick,
  ...rest
}) => {
  const [isCollapsed, { toggle: toggleIsCollapsed }] = useToggle(false);

  return (
    <div className={clsx("flex flex-col bg-main w-full", className)} {...rest}>
      {/* Header */}
      <CardHeader
        title={title}
        level={level}
        maxLevel={maxLevel}
        onClick={uncollapsible ? undefined : toggleIsCollapsed}
        onArrowClick={onArrowClick}
      />
      {/* Content */}
      <div
        className={clsx(
          "transition-all origin-top w-full overflow-hidden border-2 border-t-0 border-black ",
          isCollapsed
            ? "scale-y-0 opacity-0 h-0 p-0"
            : "scale-y-100 opacity-100 h-auto p-4",
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Card;
