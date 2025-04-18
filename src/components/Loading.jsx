import React from "react";

export default function Loading({
  action = "Loading",
  item = "data",
  size = 4,
  thickness = 2,
  bg = "gray-200",
}) {
  return (
    <div className="screen flex items-center justify-center gap-2">
      <span>
        {action} {item}
      </span>
      <span
        className={`h-${size} w-${size} animate-spin rounded-full border-${thickness} border-${bg} border-t-black`}
      ></span>
    </div>
  );
}
