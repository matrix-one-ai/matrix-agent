import React from "react";
import clsx from "clsx";

interface IAutonomyLevelProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: number;
  maxLevel?: number;
  variant?: "primary" | "secondary";
}

const AutonomyLevel: React.FC<IAutonomyLevelProps> = ({
  id,
  className,
  level = 0,
  maxLevel = 5,
  variant = "primary",
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
          )}
        />
      ))}
    </div>
  );
};

export default AutonomyLevel;
