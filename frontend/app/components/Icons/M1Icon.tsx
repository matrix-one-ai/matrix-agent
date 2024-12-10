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
      <rect x="0.5" width="20" height="20" fill="url(#pattern0_724_1932)" />
      <defs>
        <pattern
          id="pattern0_724_1932"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_724_1932" transform="scale(0.00444444)" />
        </pattern>
        <image
          id="image0_724_1932"
          width="225"
          height="225"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
};

export default SvgComponent;
