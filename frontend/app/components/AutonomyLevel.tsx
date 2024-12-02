import React from "react";
import clsx from "clsx";

interface IAutonomyLevelProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: number;
  maxLevel?: number;
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
}

const AutonomyLevel: React.FC<IAutonomyLevelProps> = ({
  id,
  className,
  level = 0,
  maxLevel = 5,
  variant = "primary",
  size = "small",
  ...rest
}) => {
  return (
    <div className={clsx("flex gap-1", className)} {...rest}>
      {[...Array(maxLevel)].map((_, i) => (
        <div
          key={`${id}-autonomy-level-${i}`}
          className={clsx(
            "w-[6.75px] h-[6.75px] rounded-full border",
            variant === "primary" ? "border-white" : "border-black",
            i < level && (variant === "primary" ? "bg-white" : "bg-black"),
            size === "medium" && "w-[8.75px] h-[8.75px]",
            size === "large" && "w-[10.75px] h-[10.75px]",
          )}
        />
      ))}
    </div>
  );
};

export default AutonomyLevel;
