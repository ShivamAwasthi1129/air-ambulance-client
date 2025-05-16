"use client";
import React from 'react';
import { useTypewriter, Cursor } from 'react-simple-typewriter';

const Header = () => {
  const [text] = useTypewriter({
    words: [
      'ONE STOP SOLUTION FOR ALL YOUR PRIVATE CHARTER NEEDS',
      'TAILORED CHARTER SERVICES FOR VIP TRAVELERS',
      'LUXURY AIRCRAFTS AT YOUR DISPOSAL',
      'FLY ANYWHERE, ANYTIME WITH CHARTER FLIGHTS AVIATIONS'
    ],
    loop: true,
    delaySpeed: 1000,
    typeSpeed: 60,
    deleteSpeed: 60,
  });

  return (
    <header className="w-full  text-white  relative overflow-hidden">
      <div className="container mx-auto px-6 text-left relative z-10">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight">
          Welcome to Charter Flights Aviations
        </h1>
        <p className="mt-2 text-md md:text-xl lg:text-2xl font-light uppercase h-12">
          {text}
          <Cursor cursorStyle="|" blinkSpeed={500} />
        </p>
      </div>
      {/* Optional decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        {/* You can add SVG waves or shapes here for extra flair */}
      </div>
    </header>
  );
}
export default Header;
