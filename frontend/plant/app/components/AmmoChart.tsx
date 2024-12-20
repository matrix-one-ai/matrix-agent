import clsx from "clsx";
import React from "react";

interface IAmmoProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  value: number;
  color?: string;
  max?: number;
}

const AmmoProgress: React.FC<IAmmoProgressProps> = ({
  id,
  color = "bg-[#19B0FE]",
  max = 10,
  value,
  className,
  ...rest
}) => {
  return (
    <div className={clsx("flex gap-1 justify-center", className)} {...rest}>
      {[...Array(max)].map((_, i) => (
        <div
          key={`${id}-ammo-progress-${i}`}
          className={clsx(
            "w-1 h-2.5 rounded-2xl",
            i > value ? "bg-white" : color,
          )}
        />
      ))}
    </div>
  );
};

export default AmmoProgress;
