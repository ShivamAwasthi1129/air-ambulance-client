"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterAndFleetListing from "../components/FilterAndFleetListing";
import BannerSection from "./Banner";
import UserInfoModal from "../components/UserInfoModal";
import Link from "next/link";

import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import InventoryIcon from "@mui/icons-material/Inventory2";
import BusinessIcon from "@mui/icons-material/Business";
import WavesIcon from "@mui/icons-material/Waves";

export const SearchBar = () => {
  // === State ===
  const [tripType, setTripType] = useState("oneway");
  const [showMultiCityDetails, setShowMultiCityDetails] = useState(false);
  const [isMultiCityCollapsed, setIsMultiCityCollapsed] = useState(false);

  const [segments, setSegments] = useState([
    {
      from: "Indira Gandhi International Airport (DEL)",
      to: "Heathrow Airport (LHR)",
      departureDate: new Date().toISOString().split("T")[0],
      departureTime: "12:00",
      passengers: 1,
    },
  ]);

  const [airports, setAirports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedSegmentIndex, setFocusedSegmentIndex] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [flightType, setFlightType] = useState("");
  const [name, setname] = useState("");
  const [phone, setphone] = useState("");
  const [countryCode, setCountryCode] = useState("+91"); // <-- NEW STATE FOR COUNTRY CODE
  const [email, setEmail] = useState("");
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const containerRef = useRef(null);

  // === Effects ===

  // 1) Collapse multi-city when user clicks outside
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

  // 2) Close airport dropdown if user clicks outside
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
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // 3) Load tripType & segments from session
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
    }
    const userHasVerified = sessionStorage.getItem("userVerified");
    if (userHasVerified === "true") {
      setIsVerified(true);
    }
  }, []);

  // 4) Store changes in session
  useEffect(() => {
    const dataToSave = {
      tripType,
      segments,
      userInfo,
    };
    sessionStorage.setItem("searchData", JSON.stringify(dataToSave));
  }, [tripType, segments, userInfo]);

  // 5) Fetch airports when searchQuery changes
  useEffect(() => {
    async function fetchAirports() {
      if (!searchQuery) {
        setAirports([]);
        return;
      }
      try {
        const response = await fetch(`/api/basesearch?query=${searchQuery}`);
        const data = await response.json();
        setAirports(data);
      } catch (error) {
        console.error("Error fetching airport data:", error);
      }
    }
    fetchAirports();
  }, [searchQuery]);

  // 6) Fetch IP info on mount
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

  // === Handlers ===

  const handleTripTypeChange = (type) => {
    setTripType(type);
    if (type === "oneway") {
      setShowMultiCityDetails(false);
      setIsMultiCityCollapsed(false);
      setSegments([
        {
          from: "Indira Gandhi International Airport (DEL)",
          to: "Heathrow Airport (LHR)",
          departureDate: new Date().toISOString().split("T")[0],
          departureTime: "12:00",
          passengers: 1,
        },
      ]);
    } else if (type === "multicity") {
      setShowMultiCityDetails(true);
      setIsMultiCityCollapsed(false);
      setSegments([
        {
          from: "",
          to: "",
          departureDate: new Date().toISOString().split("T")[0],
          departureTime: "12:00",
          passengers: 1,
        },
      ]);
    }
  };

  const handleSegmentChange = (index, field, value) => {
    const updatedSegments = [...segments];
    updatedSegments[index][field] = value;
    setSegments(updatedSegments);
  };

  const handleSelectAirport = (airport) => {
    if (focusedSegmentIndex === null || !focusedField) return;
    const updatedSegments = [...segments];
    if (focusedField === "from") {
      updatedSegments[focusedSegmentIndex] = {
        ...updatedSegments[focusedSegmentIndex],
        from: `${airport.name} (${airport.iata_code})`,
        fromCity: airport.city,
        fromIATA: airport.iata_code,
        fromICAO: airport.icao_code,
      };
    } else if (focusedField === "to") {
      updatedSegments[focusedSegmentIndex] = {
        ...updatedSegments[focusedSegmentIndex],
        to: `${airport.name} (${airport.iata_code})`,
        toCity: airport.city,
        toIATA: airport.iata_code,
        toICAO: airport.icao_code,
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
    setSegments((prev) => [
      ...prev,
      {
        from: prev[prev.length - 1].to || "",
        to: "",
        departureDate: new Date().toISOString().split("T")[0],
        departureTime: "12:00",
        passengers: 1,
      },
    ]);
  };

  const handleRemoveCity = (index) => {
    setSegments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      // (A) If user not verified, ensure personal fields are filled
      if (!isVerified) {
        if (
          !name.trim() ||
          !phone.trim() ||
          !email.trim() ||
          !flightType ||
          !agreedToPolicy
        ) {
          alert("Please fill out all fields and agree to the policy before searching.");
          setIsLoading(false);
          return;
        }
      }
  
      // Append the selected country code to the phone number here
      const fullPhoneNumber = `${countryCode}${phone}`;
  
      const mergedUserInfo = {
        ...userInfo,
        flightType,
        name,
        phone: fullPhoneNumber, // <-- Updated phone number with country code
        email,
        agreedToPolicy,
      };
  
      // (B) If not verified, attempt to send OTP (if needed)
      if (!isVerified) {
        try {
          const response = await fetch("/api/otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              phone: fullPhoneNumber, // using the combined country code and phone
              email,
            }),
          });
          const data = await response.json();
          if (data.message === "user already exists") {
            alert(
              data.message +
                " please try to login via provided credential in your existing email"
            );
            return;
          }
          setIsUserInfoModalOpen(true);
        } catch (err) {
          console.error("Error sending OTP requests:", err);
        }
      }
  
      // (C) Prepare final data and store it in sessionStorage.
      const finalData = {
        tripType,
        segments,
        userInfo: mergedUserInfo,
      };
      sessionStorage.setItem("searchData", JSON.stringify(finalData));
  
      // **NEW LINE:** Also mark the user as verified so that NavBar picks it up
      sessionStorage.setItem("userVerified", "true");
      console.log("Final Payload (sent immediately):", finalData);
      // (D) Dispatch the custom event so NavBar can refresh
      window.dispatchEvent(new Event("updateNavbar"));
      // (E) Continue with any other state updates...
      setUserInfo(mergedUserInfo);
      setRefreshKey((prev) => prev + 1);
  
      if (tripType === "multicity") {
        setIsMultiCityCollapsed(true);
      }
    } catch (err) {
      console.error("Error in handleSearch:", err);
    } finally {
      setIsLoading(false);
    }
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

      {/* Outer container */}
      <div className="w-full flex flex-col items-center relative">
        {/* This container wraps the search bar */}
        <div
          className="p-4 sm:p-6 md:p-8 max-w-6xl w-full rounded-lg bg-white/40 
                     backdrop-blur-md shadow-md -mt-32 relative z-10"
          ref={containerRef}
        >
          {/* (1) Flight-Type Icons row */}
          <div className="flex flex-wrap items-center justify-around gap-3 mb-4 w-1/2 bg-white rounded-xl border-2 border-gray-300 p-2 -mt-20">
            <div
              onClick={() => setFlightType("Charter Flights")}
              className={`cursor-pointer flex flex-col items-center p-2 
                rounded-md transition-colors ${flightType === "Charter Flights"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-300"
                }`}
            >
              <FlightTakeoffIcon />
              <span className="text-sm font-medium mt-1">Charter Flight</span>
            </div>

            <div
              onClick={() => setFlightType("Air Ambulance")}
              className={`cursor-pointer flex flex-col items-center p-2 
                rounded-md transition-colors ${flightType === "Air Ambulance"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-300"
                }`}
            >
              <LocalHospitalIcon />
              <span className="text-sm font-medium mt-1">Air Ambulance</span>
            </div>

            <div
              onClick={() => setFlightType("Air Cargo")}
              className={`cursor-pointer flex flex-col items-center p-2 
                rounded-md transition-colors ${flightType === "Air Cargo"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-300"
                }`}
            >
              <InventoryIcon />
              <span className="text-sm font-medium mt-1">Air Cargo</span>
            </div>

            <div
              onClick={() => setFlightType("Private Jets")}
              className={`cursor-pointer flex flex-col items-center p-2 
                rounded-md transition-colors ${flightType === "Private Jets"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-300"
                }`}
            >
              <BusinessIcon />
              <span className="text-sm font-medium mt-1">Private Jets</span>
            </div>

            <div
              onClick={() => setFlightType("Sea Plane")}
              className={`cursor-pointer flex flex-col items-center p-2 
                rounded-md transition-colors ${flightType === "Sea Plane"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-300"
                }`}
            >
              <WavesIcon />
              <span className="text-sm font-medium mt-1">Sea Plane</span>
            </div>
          </div>

          {/* (2) Trip Type Radio Buttons */}
          <div className="flex items-center justify-start gap-6 mb-6">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                name="tripType"
                value="oneway"
                checked={tripType === "oneway"}
                onChange={() => handleTripTypeChange("oneway")}
                className="form-radio text-blue-600 h-5 w-5"
              />
              <span className="ml-2 text-gray-800 font-medium">One Way</span>
            </label>

            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                name="tripType"
                value="multicity"
                checked={tripType === "multicity"}
                onChange={() => handleTripTypeChange("multicity")}
                className="form-radio text-blue-600 h-5 w-5"
              />
              <span className="ml-2 text-gray-800 font-medium">Multi City</span>
            </label>
          </div>

          {/* Outer box for the search fields */}
          <div className="bg-white rounded-xl border-4 border-gray-300 p-4">
            {/* (3) Main Search Fields (One Way) */}
            {tripType === "oneway" && (
              <div className="flex flex-wrap md:flex-nowrap items-end gap-4 mb-4 border-b-2 border-gray-300 pb-4">
                {/* FROM */}
                <div className="flex-1 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From
                  </label>
                  <input
                    type="text"
                    className="block w-full p-2 border rounded focus:outline-none"
                    value={segments[0].from}
                    placeholder="Type departure airport..."
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
                  {/* Dropdown */}
                  {showDropdown &&
                    focusedSegmentIndex === 0 &&
                    focusedField === "from" &&
                    airports.length > 0 && (
                      <ul className="absolute left-0 mt-1 w-full max-h-48 overflow-y-auto bg-white text-black shadow-md rounded z-50">
                        {airports.map((airport) => (
                          <li
                            key={airport.id}
                            onClick={() => handleSelectAirport(airport)}
                            className="p-2 cursor-pointer hover:bg-gray-200 border-b text-sm"
                          >
                            <div className="font-semibold">
                              {airport.city}, {airport.country}
                            </div>
                            <div className="text-xs text-gray-600">
                              {airport.name} • {airport.iata_code || "N/A"} •{" "}
                              {airport.icao_code || "N/A"}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>

                {/* Swap Icon */}
                <motion.button
                  onClick={() => handleSwap(0)}
                  whileHover={{ scale: 1.1 }}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full h-10 w-10 flex items-center justify-center mt-6"
                >
                  <SwapHorizIcon />
                </motion.button>

                {/* TO */}
                <div className="flex-1 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To
                  </label>
                  <input
                    type="text"
                    className="block w-full p-2 border rounded focus:outline-none"
                    value={segments[0].to}
                    placeholder="Type destination airport..."
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
                  {showDropdown &&
                    focusedSegmentIndex === 0 &&
                    focusedField === "to" &&
                    airports.length > 0 && (
                      <ul className="absolute left-0 mt-1 w-full max-h-48 overflow-y-auto bg-white text-black shadow-md rounded z-50">
                        {airports.map((airport) => (
                          <li
                            key={airport.id}
                            onClick={() => handleSelectAirport(airport)}
                            className="p-2 cursor-pointer hover:bg-gray-200 border-b text-sm"
                          >
                            <div className="font-semibold">
                              {airport.city}, {airport.country}
                            </div>
                            <div className="text-xs text-gray-600">
                              {airport.name} • {airport.iata_code || "N/A"} •{" "}
                              {airport.icao_code || "N/A"}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>

                {/* Depart Date/Time */}
                <div className="w-full sm:w-1/2 md:w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departure Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={`${segments[0].departureDate}T${segments[0].departureTime || "12:00"
                      }`}
                    onChange={(e) => {
                      const [date, time] = e.target.value.split("T");
                      handleSegmentChange(0, "departureDate", date);
                      handleSegmentChange(0, "departureTime", time);
                    }}
                    min={`${new Date().toISOString().split("T")[0]}T00:00`}
                    className="block w-full p-2 border rounded focus:outline-none"
                  />
                </div>

                {/* Seats */}
                <div className="w-full sm:w-1/2 md:w-[140px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seats
                  </label>
                  <select
                    value={segments[0].passengers}
                    onChange={(e) =>
                      handleSegmentChange(0, "passengers", +e.target.value)
                    }
                    className="block w-full p-2 border rounded focus:outline-none"
                  >
                    {[...Array(10).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Multi-City View */}
            {tripType === "multicity" && (
              <>
                {isMultiCityCollapsed ? (
                  <div
                    className="p-4 rounded-md bg-gray-200 text-gray-700 cursor-pointer"
                    onClick={() => setIsMultiCityCollapsed(false)}
                  >
                    <p className="mb-0">
                      <strong>Multi-City</strong> – (click to expand)
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 mb-4">
                    {segments.map((segment, index) => (
                      <div
                        key={index}
                        className="relative bg-gray-50 border-2 border-gray-300 rounded-md p-4"
                      >
                        {/* Purple vertical tab for "Trip X" */}
                        <div
                          className="absolute -left-8 top-1/2 -translate-y-1/2 w-[70px]
                                     bg-purple-600 text-white text-center text-sm font-semibold 
                                     py-1 transform -rotate-90 origin-center rounded-md"
                          style={{ transformOrigin: "center" }}
                        >
                          Trip {index + 1}
                        </div>

                        <div className="ml-10 flex flex-wrap lg:flex-nowrap items-end gap-4">
                          {/* FROM */}
                          <div className="flex-1 relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              From
                            </label>
                            <input
                              type="text"
                              className="block w-full p-2 border rounded focus:outline-none"
                              value={segment.from}
                              placeholder="Type departure airport..."
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
                            {showDropdown &&
                              focusedSegmentIndex === index &&
                              focusedField === "from" &&
                              airports.length > 0 && (
                                <ul className="absolute left-0 mt-1 w-full max-h-48 overflow-y-auto bg-white text-black shadow-md rounded z-50">
                                  {airports.map((airport) => (
                                    <li
                                      key={airport.id}
                                      onClick={() => handleSelectAirport(airport)}
                                      className="p-2 cursor-pointer hover:bg-gray-200 border-b text-sm"
                                    >
                                      <div className="font-semibold">
                                        {airport.city}, {airport.country}
                                      </div>
                                      <div className="text-xs text-gray-600">
                                        {airport.name} • {airport.iata_code || "N/A"}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              )}
                          </div>

                          {/* TO */}
                          <div className="flex-1 relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              To
                            </label>
                            <input
                              type="text"
                              className="block w-full p-2 border rounded focus:outline-none"
                              value={segment.to}
                              placeholder="Type destination airport..."
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
                            {showDropdown &&
                              focusedSegmentIndex === index &&
                              focusedField === "to" &&
                              airports.length > 0 && (
                                <ul className="absolute left-0 mt-1 w-full max-h-48 overflow-y-auto bg-white text-black shadow-md rounded z-50">
                                  {airports.map((airport) => (
                                    <li
                                      key={airport.id}
                                      onClick={() => handleSelectAirport(airport)}
                                      className="p-2 cursor-pointer hover:bg-gray-200 border-b text-sm"
                                    >
                                      <div className="font-semibold">
                                        {airport.city}, {airport.country}
                                      </div>
                                      <div className="text-xs text-gray-600">
                                        {airport.name} • {airport.iata_code || "N/A"}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              )}
                          </div>

                          {/* DATE & TIME */}
                          <div className="w-full sm:w-1/2 md:w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Depart
                            </label>
                            <input
                              type="datetime-local"
                              value={`${segment.departureDate}T${segment.departureTime || "12:00"
                                }`}
                              onChange={(e) => {
                                const [date, time] = e.target.value.split("T");
                                handleSegmentChange(index, "departureDate", date);
                                handleSegmentChange(index, "departureTime", time);
                              }}
                              min={`${new Date().toISOString().split("T")[0]}T00:00`}
                              className="block w-full p-2 border rounded focus:outline-none"
                            />
                          </div>

                          {/* Seats */}
                          <div className="w-full sm:w-1/2 md:w-[140px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Seats
                            </label>
                            <select
                              value={segment.passengers}
                              onChange={(e) =>
                                handleSegmentChange(index, "passengers", +e.target.value)
                              }
                              className="block w-full p-2 border rounded focus:outline-none"
                            >
                              {[...Array(10).keys()].map((num) => (
                                <option key={num + 1} value={num + 1}>
                                  {num + 1}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Delete Button (if more than 1 segment) */}
                          <div className="mt-3 flex items-center gap-4">
                            {segments.length > 1 && (
                              <motion.button
                                onClick={() => handleRemoveCity(index)}
                                whileHover={{ scale: 1.1 }}
                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md flex items-center justify-center"
                              >
                                <DeleteIcon />
                              </motion.button>
                            )}
                          </div>
                        </div>

                        {/* Add Another Flight (only on the last segment) */}
                        {index === segments.length - 1 && (
                          <div className="mt-3 flex items-center gap-4 ml-10">
                            <button
                              type="button"
                              onClick={handleAddCity}
                              className="py-1 px-3 border rounded text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition"
                            >
                              + Add Another Flight
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* (4) User Info Fields (only if not verified) */}
            {!isVerified && (
              <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
                {/* Full Name */}
                <div className="flex-1 min-w-[180px]">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    placeholder="Full Name*"
                    className="block w-full p-2 border rounded focus:outline-none bg-pink-50/50"
                  />
                </div>

                {/* Email */}
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email*"
                    className="block w-full p-2 border rounded focus:outline-none bg-pink-50/50"
                  />
                </div>

                {/* Phone Number with Country Code Select */}
                <div className="flex-1 min-w-[160px] relative">
                  {/* Country Code Select */}
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="absolute inset-y-0 left-0 w-20 bg-transparent border-0 text-gray-700 z-10"
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+61">+61</option>
                  </select>
                  <input
                    type="phone"
                    value={phone}
                    onChange={(e) => setphone(e.target.value)}
                    placeholder="Phone Number*"
                    className="block w-full p-2 border rounded focus:outline-none pl-20 bg-pink-50/50"
                  />
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-center gap-2 mt-5">
                  <input
                    type="checkbox"
                    id="policyCheck"
                    checked={agreedToPolicy}
                    onChange={(e) => setAgreedToPolicy(e.target.checked)}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="policyCheck"
                    className="text-xs text-gray-700 cursor-pointer"
                  >
                    I agree to the{" "}
                    <Link href="/termsAndCondition" className="underline">
                      Terms &amp; Conditions
                    </Link>
                  </label>
                </div>
              </div>
            )}

            {/* (5) Search Button */}
            <div className="flex justify-end mt-4">
              <motion.button
                onClick={handleSearch}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-r from-blue-600 to-blue-400 text-white 
                           px-6 py-2 rounded-md shadow-md transition-all 
                           disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Loading...
                  </div>
                ) : (
                  "Search"
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* 
          (6) Conditionally render FilterAndFleetListing:
              - Only show this if not loading AND user is verified
              - Your backend/data calls can still happen inside FilterAndFleetListing,
                or you can trigger them in the background if you prefer.
        */}
        {!isLoading && isVerified && (
          <>
            {/* <BannerSection /> */}
            <FilterAndFleetListing key={refreshKey} />
          </>
        )}
      </div>
    </>
  );
};
