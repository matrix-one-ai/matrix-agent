import React, { SVGProps } from "react";

const SvgComponent: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <rect x="0.5" width="20" height="20" fill="url(#pattern0_724_1929)" />
      <defs>
        <pattern
          id="pattern0_724_1929"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0_724_1929"
            transform="translate(0 -0.125) scale(0.000976562)"
          />
        </pattern>
        <image
          id="image0_724_1929"
          width="1024"
          height="1280"
        />
      </defs>
    </svg>
  );
};

export default SvgComponent;