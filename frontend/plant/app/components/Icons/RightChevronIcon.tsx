import React, { SVGProps } from "react";

const SvgComponent: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="6"
      height="10"
      viewBox="0 0 6 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.125 8.75L4.875 5L1.125 1.25"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SvgComponent;
