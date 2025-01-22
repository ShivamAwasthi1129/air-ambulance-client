"use client";

import { useState } from "react";
import { Fromto } from "./Fromto";
import { Header } from "./Header";
import Link from "next/link";
import { Icondiv } from "./Icondiv";
import { motion } from "framer-motion"; // For smooth animations
import SpecialFareSelector from "./SpecialFareSelector";
export const Main = () => {
  const [data, setData] = useState({
    from: "",
    to: "",
  });

  const handleData = (updatedData) => {
    setData(updatedData); // Update state with full form data and segments
  };

  const addLocal = () => {
    console.log("Form Data to Submit:", data); // Log full data structure in the console
    localStorage.setItem("myKey", JSON.stringify(data));
  };
  return (
    <div>
      <Header />
      <div className="relative">
        {/* Background Image */}
        <img
          className="absolute top-0 left-0 h-[78vh] w-full object-cover"
          src="https://imgak.mmtcdn.com/pwa_v3/pwa_commons_assets/desktop/bg7.jpg"
          alt="mountains"
        />
        <div className="flex items-center justify-end py-[20px] h-[70px] pr-4">
          {/* Logo */}
          <Link href="/">
            <img
              className="absolute top-[10px] left-[70px] w-[8%]"
              src="https://airportdirectoryworld.com/images/logo.png"
              alt="airport directory world"
            />
          </Link>
          {/* Login Placeholder */}
          <div className="relative">
            <p>login</p>
          </div>
        </div>

        {/* Booking Section */}
        <div className="w-[90%] bg-white rounded-[10px] mx-auto mt-[50px] relative border-2 border-gray-300">
          {/* Icon Div */}
          <div className="relative -top-[40px]">
            <div className="flex justify-start">
              <Icondiv className="icondiv"></Icondiv>
            </div>
          </div>

          {/* From-To Component */}
          <div className="text-black">
            <Fromto handleChange={handleData} />
          </div>

          {/* Special Fare Selector */}
          <div className="flex items-start ">
            <div className="pl-16">
              <SpecialFareSelector />
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center mt-10 ">
            <motion.button
              onClick={addLocal}
              whileHover={{
                y: -5, // Moves the button 5px upwards
                boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
              }}
              className="absolute bottom-[-25px] left-[40%]  w-[200px] h-[50px] text-white font-semibold text-lg rounded-full bg-gradient-to-r from-[#63d1fd] via-[#4891ef] to-[#3339e9] hover:shadow-lg"
            >
              <Link href={"/searchList"} className="text-2xl">SEARCH</Link>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
