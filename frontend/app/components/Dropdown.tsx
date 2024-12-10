import React, { useCallback, useState } from "react";
import clsx from "clsx";
import { useToggle } from "@/app/hooks/useToggle";
import { useOutsideClick } from "@/app/hooks/useOutsideClick";

interface IDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  options: string[];
  onSelectOption: (option: string) => void;
  placeholder?: string;
}

const Dropdown: React.FC<IDropdownProps> = ({
  className,
  options,
  onSelectOption,
  placeholder = "",
  ...rest
}) => {
  const [isOpen, { toggle: toggleIsOpen, toggleOff: toggleOffIsOpen }] =
    useToggle(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const dropdownContentRef = useOutsideClick<HTMLUListElement>(toggleOffIsOpen);

  // Handler for opening dropdown
  const handleOpen = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      toggleIsOpen();
    },
    [toggleIsOpen],
  );

  // Handler for selecting an option
  const handleOptionClick = useCallback(
    (option: string) => {
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
        className="w-full h-9 flex items-center flex-row-reverse justify-between px-4 py-2 text-left border border-inherit focus:outline-none"
      >
        <span className="float-right transform transition-transform duration-200 text-xs scale-y-50">
          {isOpen ? "▲" : "▼"}
        </span>
        {selectedOption || placeholder}
      </button>

      {isOpen && (
        <ul
          ref={dropdownContentRef}
          className="absolute w-full border bg-main border-inherit border-t-0 max-h-60 overflow-y-auto z-10"
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
