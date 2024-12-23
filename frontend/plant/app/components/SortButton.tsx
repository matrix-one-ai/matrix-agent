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
      <div
        className={clsx(
          "relative w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-l-transparent border-r-transparent",
          direction === "desc" ? "border-b-[#989898]" : "border-b-secondary",
        )}
      />
      <div
        className={clsx(
          "relative w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent",
          direction === "asc" ? "border-t-[#989898]" : "border-t-secondary",
        )}
      />
    </button>
  );
};

export default SortButton;
