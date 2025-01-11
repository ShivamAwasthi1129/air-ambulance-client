"use client";

import { useState } from "react";
import { Fromto } from "./Fromto";
import { Header } from "./Header";
import Link from "next/link";
import { Icondiv } from "./Icondiv";

export const Main = () => {
  const [data, setData] = useState({
    from: "",
    to: "",
  });

  const handleData = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const addLocal = () => {
    localStorage.setItem("myKey", JSON.stringify(data));
  };

  const handlePopup = () => {
    const popup = document.getElementById("popup");
    popup.classList.toggle("active");
  };

  return (
    <div>
      <Header />
      <div className="relative h-[500px]">
        {/* Lantern Image */}
        <img
          className="absolute top-0 left-0"
          src="https://imgak.mmtcdn.com/pwa_v3/pwa_commons_assets/desktop/bg7.jpg"
          alt="Lantern"
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
        <div className="w-[80%] h-[330px] bg-white rounded-[10px] mx-auto mt-[50px] relative">
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

          {/* Search Button */}
          <div className="flex justify-center mt-10">
            <button
              onClick={addLocal}
              className="w-[200px] h-[50px] text-white font-semibold text-lg rounded-full bg-gradient-to-r from-[#8fdcfa] via-[#619ff0] to-[#3339e9] hover:shadow-lg transition duration-300"
            >
              <Link href="/search">SEARCH</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
