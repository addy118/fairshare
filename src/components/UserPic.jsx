import React from "react";
import { AvatarFallback } from "./ui/avatar";

export default function UserPic({ name }) {
  return (
    <>
      <AvatarFallback>
        {name
          ?.split(" ")
          .map((n) => n[0])
          .join("")}
      </AvatarFallback>
    </>
  );
}
