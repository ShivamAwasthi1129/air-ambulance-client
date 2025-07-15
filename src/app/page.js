"use client";
import React from "react";
import NavBar from "./components/Navbar";
import { SearchBar } from "./components/SearchListBarTest";
import { Bottom } from "./components/Bottom";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import CountryPage from "./components/CountryPage";
const Home = () => {
  const [text] = useTypewriter({
    words: [
      "ONE STOP SOLUTION FOR ALL YOUR PRIVATE CHARTER NEEDS",
      "TAILORED CHARTER SERVICES FOR VIP TRAVELERS",
      "LUXURY AIRCRAFTS AT YOUR DISPOSAL",
      "FLY ANYWHERE, ANYTIME WITH CHARTER FLIGHT AVIATIONS",
    ],
    loop: true,
    delaySpeed: 1000,
    typeSpeed: 60,
    deleteSpeed: 60,
  });
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <img
        src="https://images.pexels.com/photos/2245279/pexels-photo-2245279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        alt="Private charter plane in sunset sky"
        className="absolute inset-0 w-full h-[110vh] object-cover"/>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 h-[110vh]" />
      <header className="w-full text-white relative overflow-hidden h-[45vh] flex justify-center">
        <div className="container mx-auto px-6 text-left max-w-6xl relative z-10 mt-6">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight">
            Welcome to Charter Flights Aviations
          </h1>
          <p className="mt-2 text-md md:text-xl lg:text-2xl font-light uppercase h-12">
            {text}
            <Cursor cursorStyle="|" blinkSpeed={500} />
          </p>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20"></div>
      </header>
      <div className="z-10">
        <SearchBar />
      </div>
      <CountryPage />
      <footer className="relative bottom-0 mt-24">
        <Bottom />
      </footer>
    </div>
  );
};

export default Home;
