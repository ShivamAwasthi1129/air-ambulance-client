"use client";
import React from "react";
import NavBar from "../components/NavBar";
import { SearchBar } from "../components/SearchListBarTest";
import FilterAndFleetListing from "../components/FilterAndFleetListing";
import { Bottom } from "../components/Bottom";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">

      <img
        src="https://img.freepik.com/free-photo/airplane-runway-airport-sunset-travel-concept_587448-8154.jpg?t=st=1739105999~exp=1739109599~hmac=ab95500395c06198c3f2190d29da1b0c41ca0529e115404f07b822f31749eccc&w=1380"
        alt="Private charter plane in sunset sky"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay gradient (optional) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
      {/* 1) NavBar up top */}
      <NavBar />

      {/* 2) Hero section: background + overlay text */}
      <section className="relative w-full h-[45vh] overflow-hidden flex justify-center">
        {/* 
          Replace /hero-bg.jpg with your actual background image path.
          Make sure it's stored in /public or hosted somewhere 
        */}


        {/* Centered text */}
        <div className="relative z-10 h-full flex flex-col items-start justify-start text-center text-white px-4  w-[75%] py-4">
          <h1 className="text-lg md:text-xl mb-3">
            Welcome to Charter Flights Aviations
          </h1>
          <p className="text-left text-2xl md:text-3xl max-w-2xl font-light">
            ONE STOP SOLUTION FOR ALL YOUR PRIVATE CHARTER NEEDS
          </p>
        </div>
        
        
      </section>

      {/* 3) Wrap the SearchBar in a container that “pulls” it up over the hero, etc. */}
      <div className="z-10">
        {/* You can apply a “container” style if you want it narrower: 
            <div className="max-w-5xl mx-auto"> ... </div> */}
        <SearchBar />
      </div>

      {/* 4) Optionally, the rest of your page content below the search bar */}
      <div className="mt-8 px-4 max-w-6xl mx-auto w-full">
        {/* For example: */}
        {/* <FilterAndFleetListing /> */}
      </div>

      {/* (Optional) Footer or anything else you want */}
      <footer className="mt-auto">
        <Bottom/>
      </footer>
    </div>
  );
};

export default LandingPage;
