"use client";
import React, { useEffect, useState } from "react";
import NavBar from "./components/Navbar";
import { SearchBar } from "./components/SearchListBarTest";
import { Bottom } from "./components/Bottom";
import CountryPage from "./components/CountryPage";
import { FaPlane, FaShieldAlt, FaClock, FaGlobe, FaStar, FaHeadset, FaCheckCircle, FaPercent, FaArrowRight } from "react-icons/fa";
import { MdFlightTakeoff, MdLocalOffer } from "react-icons/md";

const Home = () => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countryName, setCountryName] = useState("WorldWide");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const loginData = sessionStorage.getItem("loginData");
    if (loginData) {
      const parsed = JSON.parse(loginData);
      setUserName(parsed.name || parsed.email?.split("@")[0] || "");
    }
  }, []);

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

  if (loading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="premium-loader mx-auto mb-4"></div>
          <p className="text-[#008cff] text-lg font-semibold">Loading flights...</p>
        </div>
      </div>
    );

  if (!apiData || !apiData[0]) return <div>Failed to load data.</div>;

  const heroData = apiData[0].hero;

  const offers = [
    {
      title: "CHARTER DEAL",
      discount: "UP TO 20% OFF",
      desc: "On Private Jet Bookings",
      code: "JETFLY20",
      bg: "from-[#051423] to-[#15457b]",
      validTill: "31 Dec 2025"
    },
    {
      title: "HELICOPTER",
      discount: "FLAT ₹50,000 OFF",
      desc: "On Heli Taxi Services",
      code: "HELI50K",
      bg: "from-[#ff6b00] to-[#ff8f00]",
      validTill: "15 Jan 2026"
    },
    {
      title: "AIR AMBULANCE",
      discount: "PRIORITY BOOKING",
      desc: "24/7 Emergency Service",
      code: "EMERGENCY",
      bg: "from-[#eb2026] to-[#ff4444]",
      validTill: "Always"
    },
    {
      title: "GROUP CHARTER",
      discount: "15% OFF",
      desc: "For 10+ Passengers",
      code: "GROUP15",
      bg: "from-[#2e7d32] to-[#4caf50]",
      validTill: "28 Feb 2026"
    }
  ];

  const popularDestinations = [
    { name: "Dubai", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400", flights: "500+ flights" },
    { name: "Singapore", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400", flights: "320+ flights" },
    { name: "London", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400", flights: "450+ flights" },
    { name: "New York", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400", flights: "380+ flights" },
    { name: "Paris", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400", flights: "290+ flights" },
    { name: "Tokyo", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400", flights: "210+ flights" },
  ];

  const trustBadges = [
    { icon: "✈️", title: "500+ Aircraft", desc: "Verified fleet worldwide", color: "bg-blue-50" },
    { icon: "🛡️", title: "100% Safe", desc: "All safety certified", color: "bg-green-50" },
    { icon: "⏰", title: "24/7 Support", desc: "Round the clock service", color: "bg-orange-50" },
    { icon: "💰", title: "Best Prices", desc: "Price match guarantee", color: "bg-purple-50" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f4f4]">
      {/* Hero Section */}
      <section className="hero-section relative">
        <div className="hero-pattern" />
        
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroData.image}
            alt="Private charter plane"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#051423]/95 to-[#15457b]/90" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-8 pb-32">
          {/* Welcome Message */}
          {userName && (
            <div className="mb-6 animate-fadeIn">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                <span>👋</span>
                Welcome back, <span className="font-semibold">{userName}</span>!
              </span>
            </div>
          )}

          {/* Hero Content */}
          <div className="max-w-3xl animate-slideUp">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Book Private Jets &
              <br />
              <span className="text-[#008cff]">Charter Flights</span>
            </h1>
            <p className="text-xl text-white/80 mb-6">
              {countryName !== "WorldWide" 
                ? `Premium aviation services in ${countryName}. Private jets, helicopters & air ambulance.`
                : "Luxury air travel worldwide. Private jets, helicopters & emergency air ambulance services."
              }
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-[#4caf50]" />
                <span className="text-sm">Instant Confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-[#4caf50]" />
                <span className="text-sm">No Hidden Charges</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-[#4caf50]" />
                <span className="text-sm">24/7 Customer Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Widget */}
      <div className="container mx-auto px-4">
        <SearchBar />
      </div>

      {/* Offers Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title flex items-center gap-2">
              <MdLocalOffer className="text-[#ff6b00]" />
              Exclusive Offers
            </h2>
            <p className="section-subtitle">Grab the best deals on charter flights</p>
          </div>
          <button className="text-[#008cff] font-semibold text-sm hover:underline flex items-center gap-1">
            View All <FaArrowRight className="text-xs" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {offers.map((offer, index) => (
            <div 
              key={index}
              className={`offer-card bg-gradient-to-br ${offer.bg} p-5 text-white hover-scale cursor-pointer`}
            >
              <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded">
                {offer.title}
              </span>
              <h3 className="text-2xl font-bold mt-3 mb-1">{offer.discount}</h3>
              <p className="text-white/80 text-sm mb-3">{offer.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-white/20 px-2 py-1 rounded font-mono">
                  {offer.code}
                </span>
                <span className="text-xs text-white/60">Valid till {offer.validTill}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trustBadges.map((badge, index) => (
            <div key={index} className="trust-badge">
              <div className={`icon ${badge.color}`}>
                {badge.icon}
              </div>
              <div>
                <h4 className="font-bold text-[#1a1a1a]">{badge.title}</h4>
                <p className="text-xs text-[#9b9b9b]">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">Popular Destinations</h2>
            <p className="section-subtitle">Top cities for private charter flights</p>
          </div>
          <button className="text-[#008cff] font-semibold text-sm hover:underline flex items-center gap-1">
            Explore All <FaArrowRight className="text-xs" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularDestinations.map((dest, index) => (
            <div key={index} className="destination-card card-elevated">
              <img src={dest.image} alt={dest.name} />
              <div className="overlay">
                <h3 className="font-bold text-lg">{dest.name}</h3>
                <p className="text-xs text-white/70">{dest.flights}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose Charter Flights Aviation?</h2>
            <p className="section-subtitle">Experience premium air travel like never before</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FaPlane className="text-3xl text-[#008cff]" />,
                title: "500+ Aircraft",
                desc: "Access to the largest fleet of private jets, helicopters and air ambulances worldwide"
              },
              {
                icon: <FaHeadset className="text-3xl text-[#ff6b00]" />,
                title: "24/7 Support",
                desc: "Round-the-clock customer service to assist you at every step of your journey"
              },
              {
                icon: <FaShieldAlt className="text-3xl text-[#4caf50]" />,
                title: "Safety First",
                desc: "All aircraft are fully certified and meet the highest safety standards"
              },
              {
                icon: <FaPercent className="text-3xl text-[#9c27b0]" />,
                title: "Best Prices",
                desc: "Competitive pricing with no hidden charges. Price match guarantee available"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 card-elevated">
                <div className="icon-circle mx-auto mb-4" style={{ background: '#f5f5f5' }}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg mb-2 text-[#1a1a1a]">{feature.title}</h3>
                <p className="text-sm text-[#9b9b9b]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-gradient-to-r from-[#051423] to-[#15457b] py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { number: "50+", label: "Countries Served" },
              { number: "10K+", label: "Happy Travelers" },
              { number: "500+", label: "Aircraft Fleet" },
              { number: "24/7", label: "Support Available" }
            ].map((stat, index) => (
              <div key={index} className="animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                <h3 className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</h3>
                <p className="text-white/70 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Country Page Content */}
      <CountryPage apiData={apiData} />

      {/* Footer */}
      <footer className="relative bottom-0 mt-auto">
        <Bottom />
      </footer>

      {/* WhatsApp Float Button */}
      <a 
        href="https://wa.me/919999999999" 
        target="_blank" 
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Chat on WhatsApp"
      >
        💬
      </a>
    </div>
  );
};

export default Home;
