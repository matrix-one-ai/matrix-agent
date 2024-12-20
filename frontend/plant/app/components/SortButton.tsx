import clsx from "clsx";
import React from "react";

interface ISortButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  direction: "asc" | "desc" | "none";
}

const SortButton: React.FC<ISortButtonProps> = ({
  className,
  direction,
  onClick,
  ...rest
}) => {
  return (
    <button
      className={clsx("flex flex-col gap-[1px] text-secondary", className)}
      onClick={onClick}
      {...rest}
    >
      <div className="relative w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-l-transparent border-r-transparent border-b-black">
        <span
          className={clsx(
            "absolute top-[1.5px] -left-[3px] w-0 h-0 border-l-[3px] border-r-[3px] border-b-[3.5px] border-l-transparent border-r-transparent border-b-secondary",
            direction === "desc" && "border-b-[#989898]",
          )}
        />
      </div>
      <div className="relative w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-black">
        <span
          className={clsx(
            "absolute -top-[5px] -left-[3px] w-0 h-0 border-l-[3px] border-r-[3px] border-t-[3.5px] border-l-transparent border-r-transparent border-t-secondary",
            direction === "asc" && "border-t-[#989898]",
          )}
        />
      </div>
    </button>
  );
};

export default SortButton;
