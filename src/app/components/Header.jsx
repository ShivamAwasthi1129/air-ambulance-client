"use client";

import FlightIcon from "@mui/icons-material/Flight";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { useState } from "react";
import Link from "next/link";

export const Header = () => {
  const [nav, setNav] = useState(false);

  const handleChange = () => {
    if (window.scrollY >= 100) {
      setNav(true);
    } else {
      setNav(false);
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", handleChange);
  }

  return (
    <div>
      <div
        className={`${
          nav ? "flex" : "hidden"
        } fixed top-0 w-full bg-white z-50 shadow-md items-center justify-between px-6 py-3`}
      >
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <img
              src="https://airportdirectoryworld.com/images/logo.png"
              alt="Logo"
              className="w-32"
            />
          </Link>
        </div>

        {/* Icons Section */}
        <div className="flex space-x-8 items-center">
          {/* Flights Icon */}
          <div className="flex flex-col items-center cursor-pointer group">
            <FlightIcon className="text-gray-500 group-hover:text-blue-500" style={{ fontSize: 30 }} />
            <p className="text-sm text-gray-500 group-hover:text-blue-500 mt-1">Flights</p>
          </div>

          {/* Charter Flights Icon */}
          <div className="flex flex-col items-center cursor-pointer group">
            <FlightTakeoffIcon
              className="text-gray-500 group-hover:text-blue-500"
              style={{ fontSize: 30 }}
            />
            <p className="text-sm text-gray-500 group-hover:text-blue-500 mt-1">
              Charter Flights
            </p>
          </div>
        </div>

        {/* Login Button */}
        <div>
          <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-all">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};
