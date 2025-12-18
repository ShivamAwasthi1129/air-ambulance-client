"use client";
import React, { useEffect, useState } from "react";
import NavBar from "./components/Navbar";
import { SearchBar } from "./components/SearchListBarTest";
import { Bottom } from "./components/Bottom";
import CountryPage from "./components/CountryPage";
import SkeletonLoader from "./components/SkeletalLoader";
import { FaPlane, FaShieldAlt, FaClock, FaGlobe, FaStar, FaQuoteLeft } from "react-icons/fa";
import { motion } from "framer-motion";

const Home = () => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countryName, setCountryName] = useState("WorldWide");
  const [currentTime, setCurrentTime] = useState("");
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("");

  // Get user name and personalized greeting
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting("Good Morning");
      else if (hour < 17) setGreeting("Good Afternoon");
      else setGreeting("Good Evening");
    };

    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };

    // Check for logged in user
    const loginData = sessionStorage.getItem("loginData");
    if (loginData) {
      const parsed = JSON.parse(loginData);
      setUserName(parsed.name || parsed.email?.split("@")[0] || "");
    }

    updateGreeting();
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
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
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-center">
          <div className="premium-loader mx-auto mb-4"></div>
          <p className="text-[#d4af37] text-lg font-medium">Loading your journey...</p>
        </div>
      </div>
    );

  if (!apiData || !apiData[0]) return <div>Failed to load data.</div>;

  const heroData = apiData[0].hero;

  const stats = [
    { number: "500+", label: "Aircraft Fleet", icon: FaPlane },
    { number: "50+", label: "Countries", icon: FaGlobe },
    { number: "24/7", label: "Support", icon: FaClock },
    { number: "100%", label: "Safety Record", icon: FaShieldAlt },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0a1628]">
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={heroData.image}
            alt="Private charter plane"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-gradient" />
          
          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent" />
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-[#d4af37]/10 blur-3xl animate-float" />
        <div className="absolute bottom-40 left-10 w-96 h-96 rounded-full bg-[#1e4976]/30 blur-3xl animate-float delay-300" />

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
          {/* Personalized Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 glass-card px-5 py-3 mb-6">
              <span className="text-[#d4af37] text-sm font-medium">{currentTime}</span>
              <span className="w-1 h-1 bg-[#d4af37] rounded-full" />
              <span className="text-white/80 text-sm">
                {greeting}{userName ? `, ${userName}` : ""}! ✨
              </span>
            </div>
          </motion.div>

          {/* Main Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl"
          >
            {/* Tagline */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-[#d4af37] to-transparent" />
              <span className="text-[#d4af37] text-sm uppercase tracking-[0.3em] font-semibold">
                Premium Aviation Services
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
              Private Jets in
            </h1>

            {/* Animated Country Name */}
            <div className="relative inline-block mb-8">
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight">
                <span className="gradient-text-gold capitalize">{countryName}</span>
              </h2>
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-transparent rounded-full" />
            </div>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/70 font-light max-w-2xl mb-10 leading-relaxed">
              Experience unparalleled luxury. Book private jets, helicopters & air ambulance services with world-class comfort.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-16">
              <button className="btn-gold flex items-center gap-2 text-lg animate-pulse-glow">
                <FaPlane className="text-sm" />
                Book Now
              </button>
              <button className="px-8 py-3 rounded-full border-2 border-white/30 text-white font-semibold hover:bg-white/10 hover:border-[#d4af37] transition-all duration-300">
                Explore Fleet
              </button>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="stat-card group cursor-pointer"
              >
                <stat.icon className="text-[#d4af37] text-2xl mb-3 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.number}</h3>
                <p className="text-white/60 text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Search Bar Section */}
        <div className="relative z-20 -mt-10">
          <SearchBar />
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/50 text-xs uppercase tracking-widest">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-[#d4af37] rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Trust Badges Section */}
      <section className="relative z-10 bg-gradient-to-b from-[#0a1628] to-white py-20">
        <div className="container mx-auto px-6">
          {/* Trust Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass-card-dark p-8 md:p-12 mb-16"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Trusted by <span className="gradient-text-gold">10,000+</span> Travelers
                </h3>
                <p className="text-white/60">Join the elite who choose excellence in aviation</p>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b87333] border-2 border-[#0a1628] flex items-center justify-center text-white font-bold"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <FaStar key={i} className="text-[#d4af37] text-lg" />
                  ))}
                  <span className="text-white ml-2 font-semibold">4.9/5</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "✈️",
                title: "Instant Booking",
                desc: "Book your private jet in under 5 minutes with our streamlined process",
              },
              {
                icon: "🛡️",
                title: "Verified Aircraft",
                desc: "Every aircraft in our fleet meets the highest safety standards",
              },
              {
                icon: "💎",
                title: "VIP Experience",
                desc: "Personalized service from booking to landing, tailored just for you",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="feature-card gold-border text-center"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-bold text-[#0a1628] mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
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
    </div>
  );
};

export default Home;
