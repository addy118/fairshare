import React from "react";
import { AvatarFallback } from "./ui/avatar";

export default function UserPic({ name }) {
  return (
    <>
      <AvatarFallback className="bg-gray-800 text-xs text-teal-400">
        {name
          ?.split(" ")
          .map((n) => n[0])
          .join("")}
      </AvatarFallback>
    </>
  );
}
