"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaWhatsapp, FaPhoneAlt, FaBars, FaTimes, FaPlane, FaUser, FaSignOutAlt, FaHistory, FaChevronDown, FaGlobe } from "react-icons/fa";
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
    { name: 'HOME', route: '/' },
    { name: 'ABOUT', route: '/aboutUs' },
    { name: 'GET IN TOUCH', route: '/getInTouch' },
    { name: 'TERMS & CONDITIONS', route: '/termsAndCondition' },
  ];

  return (
    <div className="z-50 relative w-full">
      {/* Top Announcement Bar */}
      <div className="bg-[#0a1628] text-white overflow-hidden">
        <div className="flex items-center justify-center py-2 px-4">
          <div className="animate-marquee whitespace-nowrap">
            <span className="inline-flex items-center gap-2 text-sm">
              <span className="text-[#d4af37]">✈️</span>
              2025 Updates in Charter Flights Aviation: Embarking on global journeys 24/7. 
              Introducing secure and fastest private jets, business jets, and helicopters.
              <span className="text-[#d4af37] ml-4">|</span>
              <span className="ml-4">📞 24/7 Support Available</span>
              <span className="text-[#d4af37] ml-4">|</span>
              <span className="ml-4">🌍 Worldwide Coverage</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-lg border-b-4 border-[#d4af37]">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0a1628] to-[#1e4976] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <FaPlane className="text-[#d4af37] text-xl" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-[#0a1628] leading-tight">Charter Flights</h1>
                <p className="text-xs text-gray-500">Aviation®</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Country Selector */}
              <div className="relative">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:border-[#d4af37] transition-colors">
                  <FaGlobe className="text-[#d4af37]" />
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
                    className="bg-transparent text-sm font-medium text-[#0a1628] focus:outline-none cursor-pointer"
                  >
                    <option value="worldwide">Worldwide</option>
                    {countries.map((c) => (
                      <option key={c._id} value={c.country}>
                        {c.country.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact Numbers */}
              <div className="flex items-center gap-4">
                {countryPhones.map((num, idx) => (
                  <a
                    key={`${num}-${idx}`}
                    href={idx === 0 ? `tel:${num}` : `https://wa.me/${num.replace(/^\+/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                      idx === 0 
                        ? "bg-[#0a1628] text-white hover:bg-[#1e4976]" 
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {idx === 0 ? <FaPhoneAlt /> : <FaWhatsapp />}
                    <span className="hidden xl:inline">{num}</span>
                  </a>
                ))}
              </div>

              {/* User Section */}
              <div className="relative" ref={dropdownRef}>
                {user ? (
                  <>
                    <button
                      onClick={() => setIsDropdownOpen((prev) => !prev)}
                      className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0a1628] to-[#1e4976] text-white hover:shadow-lg transition-all"
                    >
                      <div className="w-8 h-8 bg-[#d4af37] rounded-full flex items-center justify-center font-bold">
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden xl:inline text-sm font-medium max-w-[120px] truncate">
                        {user.email}
                      </span>
                      <FaChevronDown className={`text-xs transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden">
                        <div className="px-4 py-3 bg-gradient-to-r from-[#0a1628] to-[#1e4976] text-white mb-2">
                          <p className="text-xs text-white/70">Signed in as</p>
                          <p className="font-medium text-sm truncate">{user.email}</p>
                        </div>
                        <Link href="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                          <FaUser className="text-[#d4af37]" />
                          <span className="font-medium text-gray-700">Profile</span>
                        </Link>
                        <Link href="/travelHistory" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                          <FaHistory className="text-[#d4af37]" />
                          <span className="font-medium text-gray-700">Travel History</span>
                        </Link>
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-red-50 transition-colors text-red-600"
                          >
                            <FaSignOutAlt />
                            <span className="font-medium">Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="px-6 py-2.5 rounded-xl font-bold bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a1628] hover:shadow-lg transition-all duration-300"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              className="lg:hidden p-2 rounded-xl bg-gray-100 text-[#0a1628] hover:bg-[#d4af37] hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen((o) => !o)}
            >
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center justify-center gap-8 mt-4 pt-4 border-t border-gray-100">
            {navLinks.map((item, index) => (
              <Link
                key={item.name}
                href={item.route}
                className="relative text-sm font-semibold text-gray-600 hover:text-[#0a1628] transition-colors group py-2"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d4af37] group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85%] bg-white shadow-2xl overflow-y-auto">
            {/* Mobile Menu Header */}
            <div className="bg-gradient-to-r from-[#0a1628] to-[#1e4976] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FaPlane className="text-[#d4af37] text-2xl" />
                  <span className="text-white font-bold">Charter Flights</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-white/10 text-white"
                >
                  <FaTimes />
                </button>
              </div>
              
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#d4af37] rounded-full flex items-center justify-center font-bold text-[#0a1628]">
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
                  className="w-full py-3 rounded-xl font-bold bg-[#d4af37] text-[#0a1628]"
                >
                  Login / Sign Up
                </button>
              )}
            </div>

            {/* Mobile Menu Content */}
            <div className="p-6 space-y-6">
              {/* User Links (if logged in) */}
              {user && (
                <div className="space-y-2 pb-4 border-b border-gray-100">
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50"
                  >
                    <FaUser className="text-[#d4af37]" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  <Link
                    href="/travelHistory"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50"
                  >
                    <FaHistory className="text-[#d4af37]" />
                    <span className="font-medium">Travel History</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 rounded-xl bg-red-50 text-red-600 w-full"
                  >
                    <FaSignOutAlt />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              )}

              {/* Country Selector */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Region</label>
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
                  className="w-full mt-2 p-3 rounded-xl border-2 border-gray-200 focus:border-[#d4af37] focus:outline-none"
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
              <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Us</label>
                {countryPhones.map((num, idx) => (
                  <a
                    key={`${num}-${idx}`}
                    href={idx === 0 ? `tel:${num}` : `https://wa.me/${num.replace(/^\+/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-3 rounded-xl font-medium ${
                      idx === 0 ? "bg-[#0a1628] text-white" : "bg-green-500 text-white"
                    }`}
                  >
                    {idx === 0 ? <FaPhoneAlt /> : <FaWhatsapp />}
                    <span>{num}</span>
                  </a>
                ))}
              </div>

              {/* Navigation Links */}
              <div className="space-y-2 pt-4 border-t border-gray-100">
                {navLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.route}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block p-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
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
