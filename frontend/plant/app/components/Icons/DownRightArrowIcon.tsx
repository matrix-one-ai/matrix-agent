import React, { SVGProps } from "react";

const SvgComponent: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0.749999 2.25L1.5 2.25L1.5 3L2.25 3L2.25 3.75L3 3.75L3 4.5L3.75 4.5L3.75 5.25L4.5 5.25L4.5 6L5.25 6L5.25 6.75L6 6.75L6 7.5L6.75 7.5L6.75 8.25L7.5 8.25L7.5 9L8.25 9L8.25 9.75L3.75 9.75L3.75 11.25L11.25 11.25L11.25 3.75L9.75 3.75L9.75 8.25L9 8.25L9 7.5L8.25 7.5L8.25 6.75L7.5 6.75L7.5 6L6.75 6L6.75 5.25L6 5.25L6 4.5L5.25 4.5L5.25 3.75L4.5 3.75L4.5 3L3.75 3L3.75 2.25L3 2.25L3 1.5L2.25 1.5L2.25 0.75L0.75 0.75L0.749999 2.25Z"
        fill="#D9D9D9"
      />
    </svg>
  );
};

export default SvgComponent;
