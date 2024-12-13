import React, { SVGProps } from "react";

const SvgComponent: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <rect
        y="0.59082"
        width="20"
        height="20"
        fill="url(#pattern0_377_75846)"
      />
      <defs>
        <pattern
          id="pattern0_377_75846"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_377_75846" transform="scale(0.015625)" />
        </pattern>
        <image
          id="image0_377_75846"
          width="64"
          height="64"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
};

export default SvgComponent;