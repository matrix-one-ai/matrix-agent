import React, { useCallback, useState } from "react";
import clsx from "clsx";
import DownChevronIcon from "@/app/components/Icons/DownChevronIcon";
import { useToggle } from "@/app/hooks/useToggle";
import { useOutsideClick } from "@/app/hooks/useOutsideClick";

interface IDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  options: string[] | number[];
  value?: string | number;
  onSelectOption: (option: string | number) => void;
  placeholder?: string;
}

const Dropdown: React.FC<IDropdownProps> = ({
  className,
  options,
  value = null,
  onSelectOption,
  placeholder = "",
  ...rest
}) => {
  const [isOpen, { toggleOn: toggleOnIsOpen, toggleOff: toggleOffIsOpen }] =
    useToggle(false);
  const [selectedOption, setSelectedOption] = useState<string | number | null>(
    value,
  );
  const dropdownContentRef = useOutsideClick<HTMLUListElement>(toggleOffIsOpen);

  // Handler for opening dropdown
  const handleOpen = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      toggleOnIsOpen();
    },
    [toggleOnIsOpen],
  );

  // Handler for selecting an option
  const handleOptionClick = useCallback(
    (option: string | number) => {
      setSelectedOption(option);
      onSelectOption(option);
      toggleOffIsOpen();
    },
    [onSelectOption, toggleOffIsOpen],
  );

  return (
    <div className={clsx("relative w-full border-black", className)} {...rest}>
      <button
        onClick={handleOpen}
        className="w-full h-6 flex items-center flex-row-reverse justify-between gap-1 px-4 py-2 text-left border border-inherit rounded-[100px] focus:outline-none bg-primary hover:bg-[#fcedc7]"
      >
        <span className={clsx("float-right", isOpen && "rotate-180")}>
          <DownChevronIcon />
        </span>
        {selectedOption || placeholder}
      </button>

      {isOpen && (
        <ul
          ref={dropdownContentRef}
          className="absolute w-full bottom-full border bg-main border-inherit rounded-[10px] mb-1 max-h-60 overflow-y-auto z-10 bg-primary"
        >
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleOptionClick(option)}
              className="px-4 py-2 cursor-pointer hover:bg-black/10"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
