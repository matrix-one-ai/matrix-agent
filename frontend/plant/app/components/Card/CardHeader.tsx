import React from "react";
import clsx from "clsx";

interface ICardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
}

const CardHeader: React.FC<ICardHeaderProps> = ({
  className,
  title,
  onClick,
  ...rest
}) => {
  return (
    <div
      className={clsx(
        "bg-secondary flex items-center px-4 h-9 cursor-pointer text-black font-bold",
        className,
      )}
      onClick={onClick}
      {...rest}
    >
      {/* Title */}
      <span className="truncate">{title}</span>
    </div>
  );
};

export default CardHeader;
