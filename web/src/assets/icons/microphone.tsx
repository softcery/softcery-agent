import { SVGProps } from "react";

export const MicrophoneIcon = ({
  width = 24,
  height = 24,
  color = "currentColor",
  ...props
}: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke={color}
      {...props}
    >
      <path
        d="M3.75195 7.49414C3.75195 8.88653 4.30508 10.2219 5.28964 11.2065C6.27421 12.191 7.60957 12.7441 9.00195 12.7441M9.00195 12.7441C10.3943 12.7441 11.7297 12.191 12.7143 11.2065C13.6988 10.2219 14.252 8.88653 14.252 7.49414M9.00195 12.7441V15.7441M6.00195 15.7441H12.002M9.00195 1.49414C10.2446 1.49414 11.252 2.5015 11.252 3.74414V7.49414C11.252 8.73678 10.2446 9.74414 9.00195 9.74414C7.75931 9.74414 6.75195 8.73678 6.75195 7.49414V3.74414C6.75195 2.5015 7.75931 1.49414 9.00195 1.49414Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
