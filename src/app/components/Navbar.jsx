import React from "react";
import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="w-full   z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left side: Logo or brand name */}
        <Link href="/" className="flex items-center">
          {/* If you have a logo image: */}
          <img src="https://www.charterflightsaviation.com/images/logo.png" alt="Logo" className="h-16 object-contain mr-2" />
          {/* Or just text for the brand */}
          {/* <span className="text-xl font-bold text-gray-700">
            Charter Flights Aviation
          </span> */}
        </Link>

        {/* Center nav links (optional). If you only have a few links, just align them as you like */}
        <div className="space-x-6 hidden md:inline-block  text-xl">
          <Link href="/" className="text-white hover:text-slate-300">
            Home
          </Link>
          <Link href="/about" className="text-white hover:text-slate-300">
            About
          </Link>
          <Link href="/aircrafts" className="text-white hover:text-slate-300">
            Aircrafts
          </Link>
          <Link href="/partners" className="text-white hover:text-slate-300">
            Partners
          </Link>
          <Link href="/termsAnsCondition" className="text-white hover:text-slate-300">
            Terms and Conditions
          </Link>
        </div>

        {/* Right side: Sign Up / Login buttons */}
        <div className="space-x-2">
          <Link href="/signup">
            <button className="px-4 py-2 rounded-xl text-white bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600">
              Sign In
            </button>
          </Link>
          <Link href="/login">
            <button className="px-4 py-2 rounded-xl text-white bg-gradient-to-r from-sky-300 to-green-500 hover:from-sky-400 hover:to-green-600">
              Login
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
