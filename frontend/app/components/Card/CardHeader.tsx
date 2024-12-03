import React, { useCallback } from "react";
import clsx from "clsx";
import UpRightArrowIcon from "@/app/components/Icons/UpRightArrowIcon";
import AutonomyLevel from "@/app/components/AutonomyLevel";

interface ICardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  level?: number;
  maxLevel?: number;
  onArrowClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const CardHeader: React.FC<ICardHeaderProps> = ({
  className,
  title,
  level = 0,
  maxLevel = 0,
  onClick,
  onArrowClick,
  ...rest
}) => {
  // Handler for up-right arrow click
  const handleArrowClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onArrowClick?.(e);
    },
    [onArrowClick],
  );

  return (
    <div
      className={clsx(
        "bg-black text-white flex justify-between items-center px-4 h-10 cursor-pointer flex-none",
        className,
      )}
      onClick={onClick}
      {...rest}
    >
      {/* Title */}
      <span>{title}</span>
      <div className="flex gap-4 items-center">
        {/* Autonomy level dots */}
        <AutonomyLevel id={title} level={level} maxLevel={maxLevel} />
        {/* Up-right arrow icon button */}
        {onArrowClick && (
          <button
            className="w-5 h-5 flex justify-center items-center hover:bg-white/40"
            onClick={handleArrowClick}
          >
            <UpRightArrowIcon />
          </button>
        )}
      </div>
    </div>
  );
};

export default CardHeader;
