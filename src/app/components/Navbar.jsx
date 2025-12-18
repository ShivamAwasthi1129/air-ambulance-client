"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaWhatsapp, FaPhoneAlt, FaBars, FaTimes, FaPlane, FaUser, FaSignOutAlt, FaHistory, FaChevronDown, FaGlobe, FaHelicopter, FaAmbulance } from "react-icons/fa";
import { MdFlight, MdLocalOffer } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginModal from "./LoginModal";

const NavBar = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fetchedName, setFetchedName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [returnedOtp, setReturnedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [isOtpMode, setIsOtpMode] = useState(true);
  const [otpSendStatus, setOtpSendStatus] = useState("idle");
  const [infoFetched, setInfoFetched] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("worldwide");

  useEffect(() => {
    const storedCountry = sessionStorage.getItem("country_name") || "worldwide";
    setSelectedCountry(storedCountry);
  }, []);

  const [countryPhones, setCountryPhones] = useState([]);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("https://admin.airambulanceaviation.co.in/api/contact?limit=255")
      .then((r) => r.json())
      .then((json) => {
        setCountries(json.data);
        if (!sessionStorage.getItem("country_name")) {
          sessionStorage.setItem("country_name", "worldwide");
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedCountry === "worldwide") {
      fetch("https://admin.airambulanceaviation.co.in/api/contact")
        .then((r) => r.json())
        .then((json) => {
          const all = json.data;
          if (Array.isArray(all) && all.length > 0) {
            setCountryPhones(all[0].phoneNumbers);
          }
        })
        .catch(console.error);
    } else {
      fetch(
        `https://admin.airambulanceaviation.co.in/api/contact/search?q=${encodeURIComponent(selectedCountry)}`
      )
        .then((r) => r.json())
        .then((arr) => {
          if (arr.length > 0) setCountryPhones(arr[0].phoneNumbers);
        })
        .catch(console.error);
    }
  }, [selectedCountry]);

  useEffect(() => {
    loadUserFromSession();
  }, []);

  useEffect(() => {
    const updateHandler = () => {
      loadUserFromSession();
    };
    window.addEventListener("updateNavbar", updateHandler);
    return () => {
      window.removeEventListener("updateNavbar", updateHandler);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const loadUserFromSession = () => {
    try {
      if (sessionStorage.getItem("userVerified") === "true") {
        const storedSearchData = sessionStorage.getItem("searchData");
        const storedLoginData = sessionStorage.getItem("loginData");
        if (storedSearchData) {
          const searchData = JSON.parse(storedSearchData);
          let finalEmail = searchData?.userInfo?.email || "";
          if (!finalEmail && storedLoginData) {
            const loginData = JSON.parse(storedLoginData);
            finalEmail = loginData?.email || "";
          }
          if (finalEmail) {
            setUser({ email: finalEmail });
            return;
          }
        }
        if (storedLoginData) {
          const loginData = JSON.parse(storedLoginData);
          if (loginData?.email) {
            setUser({ email: loginData.email });
            return;
          }
        }
      }
    } catch (error) {
      console.error("Error loading user from session:", error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.clear();
    window.location.reload();
  };

  const navLinks = [
    { name: 'Home', route: '/' },
    { name: 'About Us', route: '/aboutUs' },
    { name: 'Contact', route: '/getInTouch' },
    { name: 'T&C', route: '/termsAndCondition' },
  ];

  return (
    <div className="z-50 relative w-full">
      {/* Top Bar - MMT Style */}
      <div className="bg-[#051423] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-2 text-sm">
            {/* Left - Offers */}
            <div className="hidden md:flex items-center gap-6">
              <span className="flex items-center gap-1 text-xs text-white/80">
                <MdLocalOffer className="text-[#ff6b00]" />
                Exclusive Deals Available!
              </span>
            </div>

            {/* Right - Contact & Country */}
            <div className="flex items-center gap-4 ml-auto">
              {/* Country Selector */}
              <div className="hidden md:flex items-center gap-1 text-xs">
                <FaGlobe className="text-white/70" />
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    const country = e.target.value;
                    setSelectedCountry(country);
                    sessionStorage.setItem("country_name", country);
                    window.dispatchEvent(new Event("countryNameChanged"));
                    if (country !== "worldwide") {
                      window.open(`/${country.toLowerCase()}`, "_blank");
                    }
                  }}
                  className="bg-transparent text-white/90 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="worldwide" className="text-gray-800">Worldwide</option>
                  {countries.map((c) => (
                    <option key={c._id} value={c.country} className="text-gray-800">
                      {c.country.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contact Numbers */}
              {countryPhones.slice(0, 2).map((num, idx) => (
                <a
                  key={`${num}-${idx}`}
                  href={idx === 0 ? `tel:${num}` : `https://wa.me/${num.replace(/^\+/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1 text-xs text-white/80 hover:text-white transition-colors"
                >
                  {idx === 0 ? <FaPhoneAlt className="text-[10px]" /> : <FaWhatsapp className="text-green-400" />}
                  <span>{num}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-[#008cff] rounded-lg flex items-center justify-center">
                <FaPlane className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#1a1a1a] leading-tight">Charter<span className="text-[#008cff]">Flights</span></h1>
                <p className="text-[10px] text-gray-500 -mt-1">Aviation®</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.route}
                  className="text-sm font-semibold text-gray-600 hover:text-[#008cff] transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Services Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-[#008cff] transition-colors py-2">
                  Services <FaChevronDown className="text-[10px]" />
                </button>
                <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2">
                    {[
                      { icon: <MdFlight className="text-[#008cff]" />, label: "Private Jets", desc: "Luxury air travel" },
                      { icon: <FaHelicopter className="text-[#ff6b00]" />, label: "Helicopters", desc: "Point to point" },
                      { icon: <FaAmbulance className="text-[#eb2026]" />, label: "Air Ambulance", desc: "Emergency services" },
                    ].map((service, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                          {service.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-[#1a1a1a]">{service.label}</p>
                          <p className="text-xs text-gray-500">{service.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* User Section */}
              <div className="relative" ref={dropdownRef}>
                {user ? (
                  <>
                    <button
                      onClick={() => setIsDropdownOpen((prev) => !prev)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <div className="w-8 h-8 bg-[#008cff] rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate hidden xl:inline">
                        {user.email?.split("@")[0]}
                      </span>
                      <FaChevronDown className={`text-[10px] text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-slideDown">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-xs text-gray-400">Signed in as</p>
                          <p className="font-semibold text-sm text-[#1a1a1a] truncate">{user.email}</p>
                        </div>
                        <Link href="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                          <FaUser className="text-[#008cff]" />
                          <span className="font-medium text-gray-700 text-sm">My Profile</span>
                        </Link>
                        <Link href="/travelHistory" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                          <FaHistory className="text-[#008cff]" />
                          <span className="font-medium text-gray-700 text-sm">My Trips</span>
                        </Link>
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-red-50 transition-colors text-red-500"
                          >
                            <FaSignOutAlt />
                            <span className="font-medium text-sm">Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="px-5 py-2.5 rounded-lg font-bold text-sm bg-gradient-to-r from-[#008cff] to-[#0057a8] text-white hover:shadow-lg transition-all"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              className="lg:hidden p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-[#008cff] hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen((o) => !o)}
            >
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85%] bg-white shadow-2xl overflow-y-auto animate-slideDown">
            {/* Mobile Menu Header */}
            <div className="bg-gradient-to-r from-[#051423] to-[#15457b] p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FaPlane className="text-white text-xl" />
                  <span className="text-white font-bold">CharterFlights</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-white/10 text-white"
                >
                  <FaTimes />
                </button>
              </div>
              
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#008cff] rounded-full flex items-center justify-center font-bold text-white">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs text-white/70">Welcome back</p>
                    <p className="text-white font-medium text-sm truncate max-w-[180px]">{user.email}</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-lg font-bold bg-[#ff6b00] text-white"
                >
                  Login / Sign Up
                </button>
              )}
            </div>

            {/* Mobile Menu Content */}
            <div className="p-5 space-y-6">
              {/* User Links (if logged in) */}
              {user && (
                <div className="space-y-2 pb-4 border-b border-gray-100">
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                  >
                    <FaUser className="text-[#008cff]" />
                    <span className="font-medium">My Profile</span>
                  </Link>
                  <Link
                    href="/travelHistory"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                  >
                    <FaHistory className="text-[#008cff]" />
                    <span className="font-medium">My Trips</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 rounded-lg bg-red-50 text-red-500 w-full"
                  >
                    <FaSignOutAlt />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              )}

              {/* Country Selector */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Region</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    const country = e.target.value;
                    setSelectedCountry(country);
                    sessionStorage.setItem("country_name", country);
                    window.dispatchEvent(new Event("countryNameChanged"));
                    if (country !== "worldwide") {
                      window.open(`/${country.toLowerCase()}`, "_blank");
                    }
                  }}
                  className="w-full mt-2 p-3 rounded-lg border border-gray-200 focus:border-[#008cff] focus:outline-none"
                >
                  <option value="worldwide">Worldwide</option>
                  {countries.map((c) => (
                    <option key={c._id} value={c.country}>
                      {c.country.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Us</label>
                {countryPhones.map((num, idx) => (
                  <a
                    key={`${num}-${idx}`}
                    href={idx === 0 ? `tel:${num}` : `https://wa.me/${num.replace(/^\+/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-3 rounded-lg font-medium ${
                      idx === 0 ? "bg-[#008cff] text-white" : "bg-green-500 text-white"
                    }`}
                  >
                    {idx === 0 ? <FaPhoneAlt /> : <FaWhatsapp />}
                    <span>{num}</span>
                  </a>
                ))}
              </div>

              {/* Navigation Links */}
              <div className="space-y-1 pt-4 border-t border-gray-100">
                {navLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.route}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block p-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsLoginModalOpen(false);
          window.location.reload();
        }}
        source="navbar"
      />

      <ToastContainer
        autoClose={12000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        draggable={false}
        style={{
          position: "fixed",
          top: "12%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 100,
        }}
      />
    </div>
  );
};

export default NavBar;
