import React, { SVGProps } from "react";

const SvgComponent: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.93164 1.01575C11.1582 6.05481 13.7754 9.68762 16.666 11.3673C19.127 12.7736 22.291 11.9532 23.6973 9.53137C25.1035 7.07043 24.2441 3.94543 21.7832 2.53918C18.8535 0.859496 14.3223 0.429809 8.93164 1.01575ZM4.9082 4.297C2.36914 7.7345 0.923828 10.8986 0.923828 13.5157C0.923828 15.7423 2.7207 17.5392 4.9082 17.5392C7.0957 17.5392 8.89258 15.7423 8.89258 13.5157C8.89258 10.8986 7.36914 7.69543 4.9082 4.297ZM11.4707 12.1876C11.002 16.4454 11.3535 19.922 12.6426 22.1876C13.7363 24.1017 16.1973 24.7657 18.1113 23.672C20.0254 22.5782 20.6504 20.1173 19.5566 18.2032C18.2285 15.9376 15.2988 13.9064 11.4707 12.1876Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default SvgComponent;
