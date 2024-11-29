import React from "react";
import clsx from "clsx";

interface ICardHeaderProps extends React.HTMLAttributes<HTMLButtonElement> {
  title: string;
  level?: number;
  maxLevel?: number;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const CardHeader: React.FC<ICardHeaderProps> = ({
  className,
  title,
  level = 0,
  maxLevel = 5,
  onClick,
  ...rest
}) => {
  return (
    <button
      className={clsx(
        "bg-black text-white flex justify-between items-center px-4",
        className,
      )}
      onClick={onClick}
      {...rest}
    >
      {/* Title */}
      <span>{title}</span>
      <div className="flex gap-2">
        {/* Autonomy level dots */}
        <div className="flex gap-1">
          {[...Array(maxLevel)].map((_, i) => (
            <div
              key={`${title}-autonomy-level-${i}`}
              className={clsx(
                "w-[6.75px] h-[6.75px] rounded-full border border-white",
                i < level && "bg-white",
              )}
            />
          ))}
        </div>
      </div>
    </button>
  );
};

export default CardHeader;
