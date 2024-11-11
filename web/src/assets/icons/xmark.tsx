import { SVGProps } from "react";

export const XMarkIcon = ({
  width = 24,
  height = 24,
  color = "currentColor",
  ...props
}: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 24 24`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke={color}
      {...props}
    >
      <path
        d="M18 5.99414L6 17.9941M6 5.99414L18 17.9941"
        stroke={color}
        strokeOpacity="0.8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
