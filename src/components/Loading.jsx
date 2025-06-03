import React from "react";

export default function Loading({
  action = "Loading",
  item = "data",
  className = "",
  size = 4,
  thickness = 2,
  bg = "gray-700",
}) {
  // map size and thickness to Tailwind classes
  const sizeClass =
    {
      2: "h-2 w-2",
      4: "h-4 w-4",
      6: "h-6 w-6",
      8: "h-8 w-8",
      10: "h-10 w-10",
      12: "h-12 w-12",
    }[size] || "h-4 w-4";

  const thicknessClass =
    {
      2: "border-2",
      4: "border-4",
      8: "border-8",
    }[thickness] || "border-2";

  const bgClass = `border-${bg}`;

  return (
    <div
      className={`flex h-full items-center justify-center gap-2 bg-[#111828] text-[#4cdede] ${className}`}
    >
      <span className="text-gray-300">
        {action} {item}
      </span>
      <span
        className={`${sizeClass} animate-spin rounded-full ${thicknessClass} ${bgClass} border-t-[#00bcff]`}
      ></span>
    </div>
  );
}
