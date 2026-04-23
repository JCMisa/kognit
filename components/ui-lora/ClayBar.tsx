/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

export const ClayBarShape = (props: any) => {
  const { fill, x, y, width, height } = props;
  const radius = 10;

  return (
    <g>
      {/* The main bar with rounded top */}
      <path
        d={`M${x},${y + radius} 
           Q${x},${y} ${x + radius},${y} 
           L${x + width - radius},${y} 
           Q${x + width},${y} ${x + width},${y + radius} 
           L${x + width},${y + height} 
           L${x},${y + height} Z`}
        fill={fill}
        className="transition-all duration-300"
        style={{ filter: "drop-shadow(4px 4px 6px rgba(0,0,0,0.1))" }}
      />
      {/* Inner highlight for "Clay" effect */}
      <path
        d={`M${x + 4},${y + 6} L${x + width - 4},${y + 6}`}
        stroke="white"
        strokeOpacity={0.3}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </g>
  );
};
