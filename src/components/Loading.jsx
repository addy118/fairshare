import React from "react";

export default function Loading({ item }) {
  return (
    <div className="screen flex flex-col items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>

      <div>Loading {item}...</div>
    </div>
  );
}
