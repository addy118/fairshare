import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center text-xl font-bold text-white">
      <img src={logo} alt="FairShare Logo" className="h-8 w-8 mr-2" />
      <span className="text-white">FairShare</span>
    </Link>
  );
}
