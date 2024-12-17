import React, { SVGProps } from "react";

const SvgComponent: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <mask
        id="mask0_928_6501"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="21"
        height="20"
      >
        <path d="M0.5 0H20.5V20H0.5V0Z" fill="white" />
      </mask>
      <g mask="url(#mask0_928_6501)">
        <path
          d="M16.25 0.937012H19.3171L12.6171 8.61415L20.5 19.0627H14.3286L9.49143 12.727L3.96286 19.0627H0.892857L8.05857 10.8484L0.5 0.93844H6.82857L11.1943 6.72844L16.25 0.937012ZM15.1714 17.2227H16.8714L5.9 2.6813H4.07714L15.1714 17.2227Z"
          fill="black"
        />
      </g>
    </svg>
  );
};

export default SvgComponent;
