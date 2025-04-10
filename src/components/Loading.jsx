import React from "react";

export default function Loading({ item }) {
  return (
    <div className="screen flex items-center justify-center gap-2">
      <span>Loading {item}</span>
      <span className="h-5 w-5 animate-spin rounded-full border-3 border-gray-200 border-t-black"></span>
    </div>
  );
}
