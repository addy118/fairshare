import React from "react";

export default function Loading({
  action = "Loading",
  item = "data",
  className = "",
  size = 4,
  thickness = 2,
  bg = "gray-700",
}) {
  return (
    <div
      className={`flex h-full items-center justify-center gap-2 bg-[#111828] text-[#4cdede] ${className}`}
    >
      <span className="text-gray-300">
        {action} {item}
      </span>
      <span
        className={`h-${size} w-${size} animate-spin rounded-full border-${thickness} border-${bg} border-t-teal-400`}
      ></span>
    </div>
  );
}
