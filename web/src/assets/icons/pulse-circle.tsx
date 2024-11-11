import { SVGProps } from "react";

export const PulseCircle = ({
  width = 24,
  height = 24,
  color = "currentColor",
  ...props
}: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 44 40`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke={color}
      {...props}
    >
      <g filter="url(#filter0_d_1334_4708)">
        <rect
          x="8.56"
          y="6.55414"
          width="26.88"
          height="26.88"
          rx="13.44"
          stroke="#F2E20B"
          strokeOpacity="0.2"
          strokeWidth="1.12"
          shapeRendering="crispEdges"
        />
        <circle
          opacity="0.15"
          cx="22.5"
          cy="19.9941"
          r="13.4583"
          fill="#F2E20B"
          stroke="#F2E20B"
          strokeWidth="1.08333"
        />
        <circle opacity="0.2" cx="22.5" cy="19.9941" r="11" fill="#F2E20B" />
        <circle cx="22.0996" cy="19.9941" r="6" fill="#F2E20B" />
      </g>
      <defs>
        <filter
          id="filter0_d_1334_4708"
          x="-18.88"
          y="-20.8859"
          width="82.26"
          height="81.76"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="13.44" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.94902 0 0 0 0 0.886275 0 0 0 0 0.0431373 0 0 0 0.2 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1334_4708"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1334_4708"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
