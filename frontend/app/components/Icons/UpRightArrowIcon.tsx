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
        d="M2.25 11.25V10.5H3V9.75H3.75V9H4.5V8.25H5.25V7.5H6V6.75H6.75V6H7.5V5.25H8.25V4.5H9V3.75H9.75V8.25H11.25V0.75H3.75V2.25H8.25V3H7.5V3.75H6.75V4.5H6V5.25H5.25V6H4.5V6.75H3.75V7.5H3V8.25H2.25V9H1.5V9.75H0.75V11.25H2.25Z"
        fill="#D9D9D9"
      />
    </svg>
  );
};

export default SvgComponent;
