"use client";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket"; // Replace with the appropriate private jet icon
import MedicalServicesIcon from "@mui/icons-material/MedicalServices"; // Replace with appropriate air ambulance icon
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter"; // Replace with appropriate business jet icon
import FlightClassIcon from "@mui/icons-material/FlightClass"; // Replace with a more appropriate icon if available
import { useState, useEffect } from "react";
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

  useEffect(() => {
    const currentPath = window.location.pathname;

    if (currentPath === "/") {
      // Attach scroll listener only on the home page
      window.addEventListener("scroll", handleChange);
    } else {
      setNav(true); // Always visible on non-home routes
    }

    return () => {
      if (currentPath === "/") {
        window.removeEventListener("scroll", handleChange);
      }
    };
  }, []);

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
          <div className="flex flex-col items-center cursor-pointer group">
            <AirplaneTicketIcon
              className="text-gray-500 group-hover:text-blue-500"
              style={{ fontSize: 30 }}
            />
            <p className="text-sm text-gray-500 group-hover:text-blue-500 mt-1">
              Private Jets
            </p>
          </div>
          <div className="flex flex-col items-center cursor-pointer group">
            <MedicalServicesIcon
              className="text-gray-500 group-hover:text-blue-500"
              style={{ fontSize: 30 }}
            />
            <p className="text-sm text-gray-500 group-hover:text-blue-500 mt-1">
              Air Ambulance
            </p>
          </div>
          <div className="flex flex-col items-center cursor-pointer group">
            <BusinessCenterIcon
              className="text-gray-500 group-hover:text-blue-500"
              style={{ fontSize: 30 }}
            />
            <p className="text-sm text-gray-500 group-hover:text-blue-500 mt-1">
            Business Jets
            </p>
          </div>
          <div className="flex flex-col items-center cursor-pointer group">
            <FlightClassIcon 
              className="text-gray-500 group-hover:text-blue-500"
              style={{ fontSize: 30 }}
            />
            <p className="text-sm text-gray-500 group-hover:text-blue-500 mt-1">
            Air Charter
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
