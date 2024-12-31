import React, { SVGProps } from "react";

const SvgComponent: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.5 5H7.505M7.5 10V6.875M13.75 7.5C13.75 10.9519 10.9519 13.75 7.5 13.75C4.04813 13.75 1.25 10.9519 1.25 7.5C1.25 4.04813 4.04813 1.25 7.5 1.25C10.9519 1.25 13.75 4.04813 13.75 7.5Z"
        stroke="black"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SvgComponent;
