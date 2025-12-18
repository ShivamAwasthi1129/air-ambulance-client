"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterAndFleetListing from "../components/FilterAndFleetListing";
import UserInfoModal from "../components/UserInfoModal";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Icondiv } from "./Icondiv";
import GoogleMapModal from "./GoogleMapModal";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { FaMapLocationDot } from "react-icons/fa6";
import { FaPlane, FaCalendarAlt, FaUsers, FaSearch, FaMapMarkerAlt, FaExchangeAlt, FaPlus, FaTrash } from "react-icons/fa";
import LoginModal from './LoginModal';

export const SearchBar = () => {
  // === State ===
  const [tripType, setTripType] = useState("oneway");
  const [showMultiCityDetails, setShowMultiCityDetails] = useState(false);
  const [isMultiCityCollapsed, setIsMultiCityCollapsed] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoadingNearbyAirports, setIsLoadingNearbyAirports] = useState(false);
  const [nearbyAirports, setNearbyAirports] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loginModalEmail, setLoginModalEmail] = useState("");
  const [loginModalData, setLoginModalData] = useState({ email: "", phone: "" });
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [dateSelected, setDateSelected] = useState(false);
  const [multiCityDateSelected, setMultiCityDateSelected] = useState({});
  const [mapModal, setMapModal] = useState({ open: false, segIdx: null, field: null, });
  const [showTroubleSigningIn, setShowTroubleSigningIn] = useState(false);
  const segmentHasHeli = (seg) =>
    (seg.flightTypes || []).some((t) => t.toLowerCase() === "air ambulance" || t.toLowerCase() === "helicopter");

  const [segments, setSegments] = useState([
    {
      from: "Dubai International Airport",
      to: "Indira Gandhi International Airport",
      departureDate: new Date().toISOString().split("T")[0],
      departureTime: "08:00",
      passengers: 1,
      flightTypes: ["Private Jet"],
    },
  ]);

  useEffect(() => {
    setSegments((prevSegments) => {
      return prevSegments.map((segment) => {
        if (!segment.flightTypes || segment.flightTypes.length === 0) {
          return { ...segment, flightTypes: ["Private Jet"] };
        }
        return segment;
      });
    });
  }, []);

  const [airports, setAirports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedSegmentIndex, setFocusedSegmentIndex] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [toastShown, setToastShown] = useState(false);
  const containerRef = useRef(null);
  const toastTriggeredRef = useRef(false);

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation function  
  const validatePhone = (phone) => {
    const phoneDigits = phone?.replace(/\D/g, '') || '';
    return phoneDigits.length >= 10;
  };

  // Handle email validation with debounce
  const handleEmailValidation = (value) => {
    if (value.trim() === "") {
      setEmailError("");
      return;
    }
    if (!validateEmail(value)) {
      setEmailError("Entered Email format is incorrect please enter correct email format");
    } else {
      setEmailError("");
    }
  };

  // Handle phone validation with debounce
  const handlePhoneValidation = (value) => {
    if (!value) {
      setPhoneError("");
      return;
    }
    if (!validatePhone(value)) {
      setPhoneError("Phone number format incorrect please correct the format");
    } else {
      setPhoneError("");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (email) {
        handleEmailValidation(email);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [email]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (phone) {
        handlePhoneValidation(phone);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [phone]);

  const fetchUserLocation = async () => {
    try {
      const response = await fetch('https://ipinfo.io/json');
      const data = await response.json();
      if (data.loc) {
        const [lat, lng] = data.loc.split(',');
        return { lat: parseFloat(lat), lng: parseFloat(lng) };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user location:', error);
      return null;
    }
  };

  useEffect(() => {
    async function fetchIPAndLocation() {
      try {
        const res = await fetch("https://ipinfo.io/json");
        const data = await res.json();
        setUserInfo(data);
        if (data.loc) {
          const [lat, lng] = data.loc.split(',');
          setUserLocation({ lat: parseFloat(lat), lng: parseFloat(lng) });
        }
      } catch (err) {
        console.error("Failed to fetch IP info:", err);
        const location = await fetchUserLocation();
        if (location) {
          setUserLocation(location);
        }
      }
    }
    fetchIPAndLocation();
  }, []);

  const fetchNearbyAirports = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://ow91reoh80.execute-api.ap-south-1.amazonaws.com/air/station?lat=${lat}&lng=${lng}`
      );
      const data = await response.json();
      return data.airports || [];
    } catch (error) {
      console.error('Error fetching nearby airports:', error);
      return [];
    }
  };

  useEffect(() => {
    const savedSearchData = sessionStorage.getItem("searchData");
    if (savedSearchData) {
      const parsed = JSON.parse(savedSearchData);
      if (parsed.tripType) setTripType(parsed.tripType);
      if (parsed.segments) setSegments(parsed.segments);
      if (parsed.userInfo) setUserInfo(parsed.userInfo);
      if (parsed.tripType === "multicity") {
        setShowMultiCityDetails(true);
      }
    } else {
      setSegments((prev) => {
        const updated = [...prev];
        updated[0] = {
          ...updated[0],
          from: "Dubai International Airport",
          fromCity: "Dubai",
          fromIATA: "DXB",
          fromICAO: "OMDB",
          to: "Indira Gandhi International Airport",
          toCity: "New Delhi",
          toIATA: "DEL",
          toICAO: "VIDP",
          flightTypes: ["Private Jet"],
        };
        return updated;
      });
    }
    const userHasVerified = sessionStorage.getItem("userVerified");
    if (userHasVerified === "true") {
      setIsVerified(true);
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      tripType,
      segments,
      userInfo,
    };
    sessionStorage.setItem("searchData", JSON.stringify(dataToSave));
  }, [tripType, segments, userInfo]);

  useEffect(() => {
    function handleDocClick(e) {
      if (!containerRef.current) return;
      const clickedInside = containerRef.current.contains(e.target);
      if (tripType === "multicity") {
        if (clickedInside && isMultiCityCollapsed) {
          setIsMultiCityCollapsed(false);
        } else if (!clickedInside && !isMultiCityCollapsed) {
          setIsMultiCityCollapsed(true);
        }
      }
    }
    document.addEventListener("mousedown", handleDocClick);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
    };
  }, [tripType, isMultiCityCollapsed]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        showDropdown &&
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
        setFocusedSegmentIndex(null);
        setFocusedField(null);
        setHasSearched(false);
        setIsLoadingNearbyAirports(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  useEffect(() => {
    if (!showDropdown) return;
    const handler = setTimeout(() => {
      async function fetchAirports() {
        if (searchQuery && searchQuery.trim()) {
          setHasSearched(false);
          try {
            const response = await fetch(
              `https://ow91reoh80.execute-api.ap-south-1.amazonaws.com/air/station?query=${searchQuery}`
            );
            const data = await response.json();
            const searchResults = data.airports || [];
            if (searchResults.length === 0 && userLocation) {
              setIsLoadingNearbyAirports(true);
              const nearby = await fetchNearbyAirports(userLocation.lat, userLocation.lng);
              setAirports(nearby);
              setIsLoadingNearbyAirports(false);
              setHasSearched(true);
            } else {
              setAirports(searchResults);
              setHasSearched(true);
            }
          } catch (error) {
            console.error("Error fetching airport data:", error);
            setAirports([]);
            setHasSearched(true);
          }
        } else if (showDropdown && userLocation) {
          setIsLoadingNearbyAirports(true);
          setHasSearched(false);
          const nearby = await fetchNearbyAirports(userLocation.lat, userLocation.lng);
          setAirports(nearby);
          setIsLoadingNearbyAirports(false);
          setHasSearched(true);
        } else {
          setAirports([]);
          setHasSearched(false);
        }
      }
      fetchAirports();
    }, 200);
    return () => clearTimeout(handler);
  }, [searchQuery, showDropdown, userLocation]);

  useEffect(() => {
    async function fetchIP() {
      try {
        const res = await fetch("https://ipinfo.io/json");
        const data = await res.json();
        setUserInfo(data);
      } catch (err) {
        console.error("Failed to fetch IP info:", err);
      }
    }
    fetchIP();
  }, []);

  const handleTripTypeChange = (type) => {
    setTripType(type);
    if (type === "oneway") {
      setShowMultiCityDetails(false);
      setIsMultiCityCollapsed(false);
      setSegments([
        {
          from: "Dubai International Airport",
          to: "Indira Gandhi International Airport",
          departureDate: new Date().toISOString().split("T")[0],
          departureTime: "08:00",
          passengers: 1,
          flightTypes: ["Private Jet"],
        },
      ]);
    } else if (type === "multicity") {
      setShowMultiCityDetails(true);
      setIsMultiCityCollapsed(false);
      setSegments([
        {
          from: "Dubai International Airport",
          to: "Indira Gandhi International Airport",
          departureDate: new Date().toISOString().split("T")[0],
          departureTime: "08:00",
          passengers: 1,
          flightTypes: ["Private Jet"],
        },
      ]);
    }
  };

  const handleSegmentChange = (index, field, value) => {
    const updatedSegments = [...segments];
    updatedSegments[index][field] = value;
    setSegments(updatedSegments);
  };

  const handleSelectAirport = (
    airport,
    index = focusedSegmentIndex,
    field = focusedField
  ) => {
    if (index === null || !field) return;
    const updatedSegments = [...segments];
    if (field === "from") {
      updatedSegments[index] = {
        ...updatedSegments[index],
        from: `${airport.name} (${airport.iata_code})`,
        fromCity: airport.city || "Dubai",
        fromIATA: airport.iata_code || "DXB",
        fromICAO: airport.icao_code || "OMDB",
      };
    } else if (field === "to") {
      updatedSegments[index] = {
        ...updatedSegments[index],
        to: `${airport.name} (${airport.iata_code})`,
        toCity: airport.city || "New Delhi",
        toIATA: airport.iata_code || "DEL",
        toICAO: airport.icao_code || "VIDP",
      };
    }
    setSegments(updatedSegments);
    setShowDropdown(false);
    setFocusedSegmentIndex(null);
    setFocusedField(null);
    setSearchQuery("");
  };

  const handleSwap = (index) => {
    if (tripType !== "oneway") return;
    const updated = [...segments];
    const temp = updated[index].from;
    updated[index].from = updated[index].to;
    updated[index].to = temp;
    setSegments(updated);
  };

  const handleAddCity = () => {
    setSegments((prev) => {
      const lastSegment = prev[prev.length - 1];
      let lastDateObj = new Date(lastSegment.departureDate);
      if (isNaN(lastDateObj.getTime())) {
        lastDateObj = new Date();
      }
      lastDateObj.setDate(lastDateObj.getDate() + 1);
      const nextDayISO = lastDateObj.toISOString().split("T")[0];
      return [
        ...prev,
        {
          from: lastSegment.to || "",
          to: "",
          departureDate: nextDayISO,
          departureTime: "08:00",
          passengers: 1,
          flightTypes: [],
        },
      ];
    });
  };

  const handleRemoveCity = (index) => {
    setSegments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveCoords = (coords, address, segIdx, field) => {
    setSegments((prev) => {
      const updated = [...prev];
      if (!updated[segIdx]) return prev;
      const otherField = field === "from" ? "toLoc" : "fromLoc";
      if (
        updated[segIdx][otherField] &&
        updated[segIdx][otherField].lat === coords.lat &&
        updated[segIdx][otherField].lng === coords.lng
      ) {
        if (!toastTriggeredRef.current) {
          toast.error("Selected coordinates of destination and arrival cannot be the same.");
          toastTriggeredRef.current = true;
          setTimeout(() => {
            toastTriggeredRef.current = false;
          }, 3000);
        }
        return prev;
      }
      if (field === "from") {
        updated[segIdx].fromLoc = { lat: coords.lat, lng: coords.lng };
        updated[segIdx].fromAddress = address;
      } else if (field === "to") {
        updated[segIdx].toLoc = { lat: coords.lat, lng: coords.lng };
        updated[segIdx].toAddress = address;
      }
      return updated;
    });
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      if (isVerified) {
        const storedLoginData = sessionStorage.getItem("loginData");
        if (storedLoginData) {
          const parsedLoginData = JSON.parse(storedLoginData);
          if (!name.trim()) setName(parsedLoginData.name || "");
          if (!phone.trim()) setPhone(parsedLoginData.phone || "");
          if (!email.trim()) setEmail(parsedLoginData.email || "");
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 0));
      const currentName = name.trim();
      const currentPhone = phone.trim();
      const currentEmail = email.trim();
      const storedLoginData = sessionStorage.getItem("loginData");
      if (!storedLoginData && (!currentName || !currentPhone || !currentEmail || !agreedToPolicy)) {
        toast.error(
          "Name, phone, email, and agreeing to Terms & Conditions are required."
        );
        setIsLoading(false);
        return;
      }
      const fullPhoneNumber = `${currentPhone}`;
      const mergedUserInfo = {
        ...userInfo,
        name: currentName,
        phone: fullPhoneNumber,
        email: currentEmail,
        agreedToPolicy,
      };

      if (!storedLoginData) {
        try {
          const response = await fetch("/api/otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: currentName,
              phone: fullPhoneNumber,
              email: currentEmail,
            }),
          });
          const data = await response.json();
          if (response.ok) {
            if (data.message === "user already exists") {
              toast.info(
                data.message +
                " with email : " +
                currentEmail +
                " Check your email for credentials"
              );
              setIsLoading(false);
              setIsLoginModalOpen(true);
              return;
            }
            if (!isVerified && !sessionStorage.getItem("loginData")) {
              setIsUserInfoModalOpen(true);
            }
          } else {
            setIsLoading(false);
            if (response.status === 500) {
              setShowTroubleSigningIn(true);
            }
            if (data.error.includes("Phone number already exists")) {
              toast.error("This phone number is already linked with another email account.");
              setLoginModalData({ email: "", phone: fullPhoneNumber });
            } else if (data.error.includes("Email already exists")) {
              toast.error("This email ID is already linked with another phone number.");
              setLoginModalData({ email: currentEmail, phone: "" });
            } else {
              toast.error("Duplicate entry found. Please check your phone number and email.");
              setLoginModalData({ email: currentEmail, phone: fullPhoneNumber });
            }
            return;
          }
        } catch (err) {
          console.error("Error sending OTP request:", err);
          setIsLoading(false);
          toast.error("Network error. Please check your connection and try again.");
          return;
        }
      }

      const finalData = {
        tripType,
        segments,
        userInfo: mergedUserInfo,
      };
      sessionStorage.setItem("searchData", JSON.stringify(finalData));
      setUserInfo(mergedUserInfo);
      setRefreshKey((prev) => prev + 1);

      const finalDataFromSession = sessionStorage.getItem("searchData");
      if (finalDataFromSession) {
        const finalDataToSend = JSON.parse(finalDataFromSession);
        const queryResponse = await fetch("/api/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalDataToSend),
        });
        if (queryResponse.ok) {
          const queryData = await queryResponse.json();
          if (queryData.id) {
            sessionStorage.setItem("queryId", queryData.id);
          }
        }
      }
      if (tripType === "multicity") {
        setIsMultiCityCollapsed(true);
      }
    } catch (err) {
      console.error("Error in handleSearch:", err);
      toast.error("Something went wrong while searching. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Airport Dropdown Component
  const AirportDropdown = ({ segmentIndex, field }) => {
    if (!showDropdown || focusedSegmentIndex !== segmentIndex || focusedField !== field) {
      return null;
    }

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute left-0 mt-2 w-full max-h-64 overflow-y-auto bg-white shadow-2xl rounded-2xl z-50 border border-gray-100"
        >
          {isLoadingNearbyAirports ? (
            <div className="p-6 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mr-3"></div>
              <span className="text-gray-600">Finding nearby airports...</span>
            </div>
          ) : airports.length > 0 ? (
            airports.map((airport, i) => (
              <motion.div
                key={airport.id ?? `airport-${field}-${segmentIndex}-${i}`}
                whileHover={{ backgroundColor: "rgba(212, 175, 55, 0.1)" }}
                onClick={() => handleSelectAirport(airport, segmentIndex, field)}
                className="p-4 cursor-pointer border-b border-gray-50 last:border-b-0"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#0a1628] to-[#1e4976] flex items-center justify-center flex-shrink-0">
                    <FaPlane className="text-[#d4af37] text-sm" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-[#0a1628]">
                      {airport.city}, {airport.country}
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5">
                      {airport.name}
                    </div>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-[#d4af37]/20 text-[#0a1628] px-2 py-0.5 rounded-full font-medium">
                        {airport.iata_code || "N/A"}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {airport.icao_code || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : hasSearched ? (
            <div className="p-6 text-center text-gray-500">
              <FaPlane className="text-3xl text-gray-300 mx-auto mb-2" />
              No airports found
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <>
      {isUserInfoModalOpen && (
        <UserInfoModal
          show={isUserInfoModalOpen}
          onClose={() => {
            setIsUserInfoModalOpen(false);
            const userHasVerified = sessionStorage.getItem("userVerified");
            if (userHasVerified === "true") {
              setIsVerified(true);
            }
          }}
        />
      )}

      <div className="w-full flex flex-col items-center relative px-4">
        {/* Main Search Container */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-6xl"
        >
          {/* Glass Card Container */}
          <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Gold Top Accent */}
            <div className="h-1.5 bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37]" />

            <div className="p-6 md:p-8">
              {/* Flight Type Icons - Only for One Way */}
              {tripType === "oneway" && (
                <div className="mb-6">
                  <Icondiv
                    flightTypes={segments[0].flightTypes}
                    setFlightTypes={(updatedFlightTypes) =>
                      handleSegmentChange(0, "flightTypes", updatedFlightTypes)
                    }
                  />
                </div>
              )}

              {/* Trip Type Selector */}
              <div className="flex items-center gap-4 mb-8">
                <div className="inline-flex bg-gray-100 p-1 rounded-full">
                  {[
                    { type: "oneway", label: "One Way", icon: "→" },
                    { type: "multicity", label: "Multi City", icon: "⟷" },
                  ].map((option) => (
                    <button
                      key={option.type}
                      onClick={() => handleTripTypeChange(option.type)}
                      className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                        tripType === option.type
                          ? "bg-[#0a1628] text-white shadow-lg"
                          : "text-gray-600 hover:text-[#0a1628]"
                      }`}
                    >
                      <span>{option.icon}</span>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* One Way Search Fields */}
              {tripType === "oneway" && (
                <div className="space-y-6">
                  {/* Main Fields Row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    {/* FROM */}
                    <div className="md:col-span-4 relative">
                      <label className="flex items-center gap-2 text-sm font-semibold text-[#0a1628] mb-2">
                        <FaMapMarkerAlt className="text-[#d4af37]" />
                        From
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#d4af37] focus:bg-white transition-all text-[#0a1628] font-medium"
                          value={segments[0].from}
                          placeholder="Departure airport..."
                          onFocus={() => {
                            setFocusedSegmentIndex(0);
                            setFocusedField("from");
                            setShowDropdown(true);
                            setSearchQuery(segments[0].from || "");
                          }}
                          onChange={(e) => {
                            handleSegmentChange(0, "from", e.target.value);
                            setSearchQuery(e.target.value);
                          }}
                        />
                        {segmentHasHeli(segments[0]) && (
                          <button
                            type="button"
                            onClick={() => setMapModal({ open: true, segIdx: 0, field: "from" })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#d4af37] hover:text-[#b87333] transition-colors"
                          >
                            <FaMapLocationDot size={22} />
                          </button>
                        )}
                      </div>
                      {segments[0].fromLoc && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <FaMapMarkerAlt className="text-[#d4af37]" />
                          {segments[0].fromLoc.lat.toFixed(2)}, {segments[0].fromLoc.lng.toFixed(2)}
                        </p>
                      )}
                      <AirportDropdown segmentIndex={0} field="from" />
                    </div>

                    {/* Swap Button */}
                    <div className="hidden md:flex md:col-span-1 justify-center pb-4">
                      <motion.button
                        onClick={() => handleSwap(0)}
                        whileHover={{ scale: 1.1, rotate: 180 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                      >
                        <FaExchangeAlt className="text-[#0a1628]" />
                      </motion.button>
                    </div>

                    {/* TO */}
                    <div className="md:col-span-4 relative">
                      <label className="flex items-center gap-2 text-sm font-semibold text-[#0a1628] mb-2">
                        <FaMapMarkerAlt className="text-[#d4af37]" />
                        To
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#d4af37] focus:bg-white transition-all text-[#0a1628] font-medium"
                          value={segments[0].to}
                          placeholder="Destination airport..."
                          onFocus={() => {
                            setFocusedSegmentIndex(0);
                            setFocusedField("to");
                            setShowDropdown(true);
                            setSearchQuery(segments[0].to || "");
                          }}
                          onChange={(e) => {
                            handleSegmentChange(0, "to", e.target.value);
                            setSearchQuery(e.target.value);
                          }}
                        />
                        {segmentHasHeli(segments[0]) && (
                          <button
                            type="button"
                            onClick={() => setMapModal({ open: true, segIdx: 0, field: "to" })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#d4af37] hover:text-[#b87333] transition-colors"
                          >
                            <FaMapLocationDot size={22} />
                          </button>
                        )}
                      </div>
                      {segments[0].toLoc && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <FaMapMarkerAlt className="text-[#d4af37]" />
                          {segments[0].toLoc.lat.toFixed(2)}, {segments[0].toLoc.lng.toFixed(2)}
                        </p>
                      )}
                      <AirportDropdown segmentIndex={0} field="to" />
                    </div>

                    {/* Date & Time */}
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-[#0a1628] mb-2">
                        <FaCalendarAlt className="text-[#d4af37]" />
                        Departure
                      </label>
                      <input
                        type="datetime-local"
                        value={`${segments[0].departureDate}T${segments[0].departureTime || "08:00"}`}
                        onFocus={() => setDateSelected(false)}
                        onChange={(e) => {
                          const [date, time] = e.target.value.split("T");
                          if (!dateSelected) {
                            handleSegmentChange(0, "departureDate", date);
                            setDateSelected(true);
                          } else {
                            handleSegmentChange(0, "departureTime", time);
                            e.target.blur();
                            setDateSelected(false);
                          }
                        }}
                        min={`${new Date().toISOString().split("T")[0]}T00:00`}
                        className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#d4af37] focus:bg-white transition-all text-[#0a1628] font-medium"
                      />
                    </div>

                    {/* Passengers */}
                    <div className="md:col-span-1">
                      <label className="flex items-center gap-2 text-sm font-semibold text-[#0a1628] mb-2">
                        <FaUsers className="text-[#d4af37]" />
                        Seats
                      </label>
                      <select
                        value={segments[0].passengers}
                        onChange={(e) => handleSegmentChange(0, "passengers", e.target.value)}
                        className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#d4af37] focus:bg-white transition-all text-[#0a1628] font-medium appearance-none cursor-pointer"
                      >
                        {[...Array(32).keys()].map((num) => (
                          <option key={num + 1} value={num + 1}>{num + 1}</option>
                        ))}
                        <option value="33">33+</option>
                        <option value="45">45+</option>
                        <option value="80">80+</option>
                        <option value="100">100+</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Multi-City View */}
              {tripType === "multicity" && (
                <>
                  {isMultiCityCollapsed ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-6 rounded-2xl bg-gradient-to-r from-[#0a1628] to-[#1e4976] cursor-pointer"
                      onClick={() => setIsMultiCityCollapsed(false)}
                    >
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                          <FaPlane className="text-[#d4af37]" />
                          <span className="font-semibold">Multi-City Trip</span>
                          <span className="bg-[#d4af37] text-[#0a1628] px-2 py-0.5 rounded-full text-xs font-bold">
                            {segments.length} Flights
                          </span>
                        </div>
                        <span className="text-[#d4af37] text-sm">Click to expand</span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-6">
                      {segments.map((segment, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative bg-gray-50 rounded-2xl p-6 border-2 border-gray-200"
                        >
                          {/* Trip Badge */}
                          <div className="absolute -left-3 top-6 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a1628] px-4 py-1 rounded-r-full font-bold text-sm shadow-lg">
                            Flight {index + 1}
                          </div>

                          {/* Icon div for each segment */}
                          <div className="mb-6 mt-4">
                            <Icondiv
                              flightTypes={segment.flightTypes}
                              setFlightTypes={(updatedFlightTypes) =>
                                handleSegmentChange(index, "flightTypes", updatedFlightTypes)
                              }
                            />
                          </div>

                          {/* Fields Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            {/* FROM */}
                            <div className="md:col-span-4 relative">
                              <label className="flex items-center gap-2 text-sm font-semibold text-[#0a1628] mb-2">
                                <FaMapMarkerAlt className="text-[#d4af37]" />
                                From
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#d4af37] transition-all text-[#0a1628] font-medium"
                                  value={segment.from}
                                  placeholder="Departure airport..."
                                  onFocus={() => {
                                    setFocusedSegmentIndex(index);
                                    setFocusedField("from");
                                    setShowDropdown(true);
                                    setSearchQuery(segment.from || "");
                                  }}
                                  onChange={(e) => {
                                    handleSegmentChange(index, "from", e.target.value);
                                    setSearchQuery(e.target.value);
                                  }}
                                />
                                {segmentHasHeli(segment) && (
                                  <button
                                    type="button"
                                    onClick={() => setMapModal({ open: true, segIdx: index, field: "from" })}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#d4af37]"
                                  >
                                    <FaMapLocationDot size={20} />
                                  </button>
                                )}
                              </div>
                              <AirportDropdown segmentIndex={index} field="from" />
                            </div>

                            {/* TO */}
                            <div className="md:col-span-4 relative">
                              <label className="flex items-center gap-2 text-sm font-semibold text-[#0a1628] mb-2">
                                <FaMapMarkerAlt className="text-[#d4af37]" />
                                To
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#d4af37] transition-all text-[#0a1628] font-medium"
                                  value={segment.to}
                                  placeholder="Destination airport..."
                                  onFocus={() => {
                                    setFocusedSegmentIndex(index);
                                    setFocusedField("to");
                                    setShowDropdown(true);
                                    setSearchQuery(segment.to || "");
                                  }}
                                  onChange={(e) => {
                                    handleSegmentChange(index, "to", e.target.value);
                                    setSearchQuery(e.target.value);
                                  }}
                                />
                                {segmentHasHeli(segment) && (
                                  <button
                                    type="button"
                                    onClick={() => setMapModal({ open: true, segIdx: index, field: "to" })}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#d4af37]"
                                  >
                                    <FaMapLocationDot size={20} />
                                  </button>
                                )}
                              </div>
                              <AirportDropdown segmentIndex={index} field="to" />
                            </div>

                            {/* Date & Time */}
                            <div className="md:col-span-2">
                              <label className="flex items-center gap-2 text-sm font-semibold text-[#0a1628] mb-2">
                                <FaCalendarAlt className="text-[#d4af37]" />
                                Depart
                              </label>
                              <input
                                type="datetime-local"
                                value={`${segment.departureDate}T${segment.departureTime || "08:00"}`}
                                onFocus={() => setMultiCityDateSelected(prev => ({ ...prev, [index]: false }))}
                                onChange={(e) => {
                                  const [date, time] = e.target.value.split("T");
                                  if (!multiCityDateSelected[index]) {
                                    handleSegmentChange(index, "departureDate", date);
                                    setMultiCityDateSelected(prev => ({ ...prev, [index]: true }));
                                  } else {
                                    handleSegmentChange(index, "departureTime", time);
                                    e.target.blur();
                                    setMultiCityDateSelected(prev => ({ ...prev, [index]: false }));
                                  }
                                }}
                                min={`${new Date().toISOString().split("T")[0]}T00:00`}
                                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#d4af37] transition-all text-[#0a1628] font-medium"
                              />
                            </div>

                            {/* Seats */}
                            <div className="md:col-span-1">
                              <label className="flex items-center gap-2 text-sm font-semibold text-[#0a1628] mb-2">
                                <FaUsers className="text-[#d4af37]" />
                                Seats
                              </label>
                              <select
                                value={segment.passengers}
                                onChange={(e) => handleSegmentChange(index, "passengers", e.target.value)}
                                className="w-full px-3 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#d4af37] transition-all text-[#0a1628] font-medium"
                              >
                                {[...Array(32).keys()].map((num) => (
                                  <option key={num + 1} value={num + 1}>{num + 1}</option>
                                ))}
                                <option value="33+">33+</option>
                              </select>
                            </div>

                            {/* Remove Button */}
                            {segments.length > 1 && (
                              <div className="md:col-span-1 flex justify-center">
                                <motion.button
                                  onClick={() => handleRemoveCity(index)}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center justify-center shadow-lg transition-colors"
                                >
                                  <FaTrash className="text-sm" />
                                </motion.button>
                              </div>
                            )}
                          </div>

                          {/* Add Flight Button - Only on last segment */}
                          {index === segments.length - 1 && (
                            <motion.button
                              onClick={handleAddCity}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="mt-4 w-full py-3 border-2 border-dashed border-[#d4af37] rounded-xl text-[#d4af37] font-semibold hover:bg-[#d4af37]/10 transition-colors flex items-center justify-center gap-2"
                            >
                              <FaPlus />
                              Add Another Flight
                            </motion.button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* User Info Fields - Only if not verified */}
              {!isVerified && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200"
                >
                  <h4 className="text-sm font-bold text-[#0a1628] mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-[#d4af37] rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    Quick Verification
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Email */}
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address*"
                        className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:border-[#d4af37] transition-all ${
                          emailError ? "border-red-400" : "border-gray-200"
                        }`}
                      />
                      {emailError && (
                        <p className="text-red-500 text-xs mt-1">{emailError}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <PhoneInput
                        value={phone}
                        onChange={setPhone}
                        defaultCountry="IN"
                        international
                        countryCallingCodeEditable={false}
                        className={`phone-input-premium w-full px-4 py-3 bg-white border-2 rounded-xl focus:outline-none ${
                          phoneError ? "border-red-400" : "border-gray-200"
                        }`}
                      />
                      {phoneError && (
                        <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                      )}
                    </div>

                    {/* Name */}
                    <div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name*"
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#d4af37] transition-all"
                      />
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="mt-4 flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="policyCheck"
                      checked={agreedToPolicy}
                      onChange={(e) => setAgreedToPolicy(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-[#d4af37] focus:ring-[#d4af37]"
                    />
                    <label htmlFor="policyCheck" className="text-sm text-gray-600 cursor-pointer">
                      I agree to the{" "}
                      <Link href="/termsAndCondition" className="text-[#d4af37] font-semibold hover:underline">
                        Terms & Conditions
                      </Link>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Search Button */}
              <div className="mt-8 flex justify-end items-center gap-4">
                {showTroubleSigningIn && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setShowTroubleSigningIn(false);
                    }}
                    className="text-[#d4af37] hover:text-[#b87333] underline text-sm font-medium transition-colors"
                  >
                    Trouble signing in?
                  </button>
                )}

                <motion.button
                  onClick={handleSearch}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className="relative px-10 py-4 bg-gradient-to-r from-[#0a1628] to-[#1e4976] text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group"
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Searching...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <FaSearch />
                      Search Flights
                    </div>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Flight Listing */}
        {!isLoading && isVerified && <FilterAndFleetListing key={refreshKey} />}

        {/* Login Modal */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => {
            setIsLoginModalOpen(false);
            setLoginModalEmail("");
          }}
          onLoginSuccess={() => {
            setIsLoginModalOpen(false);
            setIsVerified(true);
            setShowTroubleSigningIn(false);
            setLoginModalEmail("");
            setRefreshKey((prev) => prev + 1);
            window.dispatchEvent(new Event("updateNavbar"));
          }}
          initialEmail={loginModalData.email || loginModalData.phone || loginModalEmail || email}
          source="searchbar"
        />
      </div>

      <GoogleMapModal
        open={mapModal.open}
        onClose={() => setMapModal({ open: false, segIdx: null, field: null })}
        onSave={(coords, address) => handleSaveCoords(coords, address, mapModal.segIdx, mapModal.field)}
      />

      {/* Custom Phone Input Styles */}
      <style jsx global>{`
        .phone-input-premium .PhoneInputInput {
          border: none !important;
          outline: none !important;
          background: transparent !important;
          font-size: 1rem;
          width: 100%;
        }
        .phone-input-premium .PhoneInputCountry {
          margin-right: 0.5rem;
        }
      `}</style>
    </>
  );
};
