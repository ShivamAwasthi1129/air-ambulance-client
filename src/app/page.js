"use client";
import React, { useEffect, useState } from "react";
import NavBar from "./components/Navbar";
import { SearchBar } from "./components/SearchListBarTest";
import { Bottom } from "./components/Bottom";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import CountryPage from "./components/CountryPage";
import SkeletonLoader from "./components/SkeletalLoader";

const Home = () => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countryName, setCountryName] = useState("WorldWide");
  useEffect(() => {
    if (!sessionStorage.getItem("country_name")) {
      sessionStorage.setItem("country_name", "WorldWide");
    }
    const updateCountryName = () => {
      const storedCountry = sessionStorage.getItem("country_name");
      setCountryName(storedCountry || "WorldWide");
    };
    window.addEventListener("countryNameChanged", updateCountryName);
    updateCountryName();
    return () => {
      window.removeEventListener("countryNameChanged", updateCountryName);
    };
  }, []);
  useEffect(() => {
    const country = sessionStorage.getItem("country_name") || "WorldWide";
    fetch(
      `https://ow91reoh80.execute-api.ap-south-1.amazonaws.com/air/home?country=${encodeURIComponent(
        country
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        setApiData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [countryName]);
  if (loading) return <div><SkeletonLoader /></div>;
  if (!apiData || !apiData[0]) return <div>Failed to load data.</div>;
  const heroData = apiData[0].hero;
  return (
    <div className="flex flex-col min-h-screen">
      {/* <NavBar /> */}
      {/* Dynamic Background Image */}
      <img
        src={heroData.image}
        alt="Private charter plane background"
        className="absolute inset-0 w-full h-[110vh] object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 h-[110vh]" />
      {/* Hero Section with Dynamic Title and Static Location */}
      <div className="relative z-10 flex flex-col items-center justify-center h-[30vh] text-white text-center px-6">
        {/* Dynamic Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4 tracking-wide">
          {/* {heroData.title} */}
          Private Jet in
        </h1>
        {/* Static Location Text */}
        <div className="relative w-fit">
          <h1
            className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-wider capitalize text-transparent"
            style={{
              WebkitTextStroke: "1px white",
              WebkitTextFillColor: "transparent",
              background: `
        url("data:image/svg+xml,%3Csvg width='200' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='white' d='M0 30 Q 25 10, 50 30 T 100 30 T 150 30 T 200 30 V60 H0 Z'/%3E%3C/svg%3E") repeat-x`,
              backgroundSize: "200% 100%",
              backgroundPosition: "0% 100%",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              animation: "waveFill 8s linear infinite",
            }}
          >
            {countryName}
          </h1>

          <style jsx>{`
            @keyframes waveFill {
              0% {
                background-position: 0% 100%;
              }
              100% {
                background-position: 200% 100%;
              }
            }
          `}</style>
        </div>
      </div>

      {/* Search Bar */}
      <div className="z-10 relative mt-48">
        <SearchBar />
      </div>
      <CountryPage apiData={apiData} />
      <footer className="relative bottom-0 mt-24">
        {/* <Bottom /> */}
      </footer>
    </div>
  );
};

export default Home;
