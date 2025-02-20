"use client";
import React from "react";
import NavBar from "./components/Navbar";
import { SearchBar } from "./components/SearchListBarTest";
import FilterAndFleetListing from "./components/FilterAndFleetListing";
import { Bottom } from "./components/Bottom";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <img
        src="https://img.freepik.com/free-photo/airplane-runway-airport-sunset-travel-concept_587448-8154.jpg?t=st=1739105999~exp=1739109599~hmac=ab95500395c06198c3f2190d29da1b0c41ca0529e115404f07b822f31749eccc&w=1380"
        alt="Private charter plane in sunset sky"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
      <NavBar />
      <section className="relative w-full h-[45vh] overflow-hidden flex justify-center">
        <div className="relative z-10 h-full flex flex-col items-start justify-start text-center text-white px-4  w-[75%] py-4">
          <h1 className="text-lg md:text-xl mb-3">
            Welcome to Charter Flights Aviations
          </h1>
          <p className="text-left text-2xl md:text-3xl max-w-2xl font-light">
            ONE STOP SOLUTION FOR ALL YOUR PRIVATE CHARTER NEEDS
          </p>
        </div>
      </section>
      <div className="z-10">
        <SearchBar />
      </div>
      <footer className="mt-auto">
        <Bottom />
      </footer>
    </div>
  );
};

export default Home;
