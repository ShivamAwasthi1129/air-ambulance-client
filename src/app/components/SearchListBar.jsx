"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterAndFleetListing from "../components/FilterAndFleetListing";
import BannerSection from "./Banner";
import UserInfoModal from "../components/UserInfoModal"; // We'll open this modal for OTP
import Link from "next/link";

export const SearchBar = () => {
  // ===================== State: Basic Trip Info =====================
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

  // ===================== State: Airport Dropdown =====================
  const [airports, setAirports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedSegmentIndex, setFocusedSegmentIndex] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // ===================== State: Additional Fields =====================
  const [flightType, setFlightType] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);

  // ===================== Check if User Verified OTP =====================
  const [isVerified, setIsVerified] = useState(false);

  // ===================== Misc. State =====================
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // For opening the OTP modal
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);

  // ===================== userInfo State (previously ipData) =====================
  // We'll store the IP info, plus user data, all together here—ONLY on search.
  const [userInfo, setUserInfo] = useState(null);

  const containerRef = useRef(null);

  // ===================== Effects =====================

  // 1) Collapse multi-city if user clicks outside
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

  // 3) Load only tripType and segments from session; do NOT load flightType, email, etc.
  //    Also check userVerified status from session if present.
  useEffect(() => {
    const savedSearchData = sessionStorage.getItem("searchData");
    if (savedSearchData) {
      const parsed = JSON.parse(savedSearchData);
      // We only restore tripType & segments (and userInfo if needed).
      if (parsed.tripType) setTripType(parsed.tripType);
      if (parsed.segments) setSegments(parsed.segments);
      if (parsed.userInfo) setUserInfo(parsed.userInfo);

      if (parsed.tripType === "multicity") {
        setShowMultiCityDetails(true);
      }
    }

    // Check if user is verified from session
    const userHasVerified = sessionStorage.getItem("userVerified");
    if (userHasVerified === "true") {
      setIsVerified(true);
    }
  }, []);

  // 4) Store tripType/segments/userInfo in session on change
  //    (avoid storing personal fields to prevent glimpses on refresh).
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

  // 6) Fetch IP info on mount and store in userInfo
  useEffect(() => {
    async function fetchIP() {
      try {
        const res = await fetch("https://ipinfo.io/json");
        const data = await res.json();
        setUserInfo(data); // store IP data in userInfo
      } catch (err) {
        console.error("Failed to fetch IP info:", err);
      }
    }
    fetchIP();
  }, []);

  // ===================== Handlers =====================

  // A) Change trip type
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

  // B) Segment changes
  const handleSegmentChange = (index, field, value) => {
    const updatedSegments = [...segments];
    updatedSegments[index][field] = value;
    setSegments(updatedSegments);
  };

  // C) Selecting an airport from dropdown
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

  // D) Swap (only for one-way)
  const handleSwap = (index) => {
    if (tripType !== "oneway") return;
    const updated = [...segments];
    const temp = updated[index].from;
    updated[index].from = updated[index].to;
    updated[index].to = temp;
    setSegments(updated);
  };

  // E) Add multi-city segment
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

  // F) Remove multi-city segment
  const handleRemoveCity = (index) => {
    setSegments((prev) => prev.filter((_, i) => i !== index));
  };

  // G) SEARCH => immediately send final data, but still send OTP if not verified
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      // 1) If user not verified, ensure personal fields are filled
      if (!isVerified) {
        if (
          !fullName.trim() ||
          !phoneNumber.trim() ||
          !email.trim() ||
          !flightType ||
          !agreedToPolicy
        ) {
          alert(
            "Please fill out all fields and agree to the policy before searching."
          );
          setIsLoading(false);
          return;
        }
      }

      // 2) Merge IP data + personal fields
      const mergedUserInfo = {
        ...userInfo,
        flightType,
        fullName,
        phoneNumber,
        email,
        agreedToPolicy,
      };

      // 3) Send OTP if user is NOT verified
      if (!isVerified) {
        try {
          // We do this in parallel or in sequence, but we do NOT wait to send final data
          fetch("/api/otp/email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
          fetch("/api/otp/whatsapp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phoneNumber: `+91${phoneNumber}` }),
          });

          // We'll open the modal to let user verify
          setIsUserInfoModalOpen(true);
        } catch (err) {
          console.error("Error sending OTP requests:", err);
          // But do NOT return; we still proceed with final data.
        }
      }

      // 4) Build final data object
      const finalData = {
        tripType,
        segments,
        userInfo: mergedUserInfo,
      };

      // 5) Save final data in session
      sessionStorage.setItem("searchData", JSON.stringify(finalData));

      // 6) Send final data to console (or your API). This is immediate—no waiting for OTP.
      console.log("Final Payload (sent immediately):", finalData);
      // Example: If you want to POST to your server:
      // await fetch("/api/query", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(finalData)
      // });

      // 7) Update local state
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

  // ===================== Render =====================
  return (
    <>
      {isUserInfoModalOpen && (
        <UserInfoModal
          show={isUserInfoModalOpen}
          onClose={() => {
            setIsUserInfoModalOpen(false);
            // Re-check verification
            const userHasVerified = sessionStorage.getItem("userVerified");
            if (userHasVerified === "true") {
              setIsVerified(true);
            }
          }}
        />
      )}

      <div className="flex flex-col items-center w-full">
        <div className="w-full sticky top-0 z-30" ref={containerRef}>
          {/* If multi-city is collapsed */}
          {tripType === "multicity" && isMultiCityCollapsed ? (
            <div className="bg-[#041422] p-4 rounded-lg shadow-md flex flex-col gap-2 w-full relative">
              <div className="flex flex-wrap items-center justify-start gap-4 w-full">
                <div className="relative w-1/4 min-w-[150px]">
                  <label className="text-md text-[#008cff] mb-1 block">
                    Trip Type
                  </label>
                  <select
                    value={tripType}
                    onChange={(e) => handleTripTypeChange(e.target.value)}
                    className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 
                               rounded-md shadow-md cursor-pointer focus:outline-none w-full"
                  >
                    <option className="text-black" value="oneway">
                      One Way
                    </option>
                    <option className="text-black" value="multicity">
                      Multi City
                    </option>
                  </select>
                </div>

                <div className="flex-1">
                  <label className="text-md text-[#008cff] mb-1">
                    From (Trip 1)
                  </label>
                  <input
                    type="text"
                    className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 
                               rounded-md shadow-md focus:outline-none w-full"
                    value={segments[0]?.from || ""}
                    placeholder="Type departure airport..."
                    onFocus={() => {
                      setFocusedSegmentIndex(0);
                      setFocusedField("from");
                      setShowDropdown(true);
                      setSearchQuery(segments[0]?.from || "");
                    }}
                    onChange={(e) => {
                      handleSegmentChange(0, "from", e.target.value);
                      setSearchQuery(e.target.value);
                    }}
                  />
                </div>

                <span className="text-sm text-gray-300 italic">
                  (Currently collapsed, click inside to expand...)
                </span>
              </div>
            </div>
          ) : (
            /* Full bar */
            <div className="bg-[#041422] px-6 py-2 flex flex-col gap-1 relative w-full">
              {/* Top Row: Trip Info + SEARCH Button on the right */}
              {tripType === "oneway" ? (
                /* ------ One-Way Layout ------ */
                <div className="flex flex-wrap items-end gap-2 w-full">
                  {/* Trip Type */}
                  <div className="min-w-[120px]">
                    <label className="text-md text-[#008cff] mb-1 block">
                      Trip Type
                    </label>
                    <select
                      value={tripType}
                      onChange={(e) => handleTripTypeChange(e.target.value)}
                      className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 
                                 rounded-md shadow-md cursor-pointer focus:outline-none w-full"
                    >
                      <option className="text-black" value="oneway">
                        One Way
                      </option>
                      <option className="text-black" value="multicity">
                        Multi City
                      </option>
                    </select>
                  </div>

                  {/* FROM */}
                  <div className="flex-1 relative">
                    <label className="text-md text-[#008cff] mb-1">From</label>
                    <input
                      type="text"
                      className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4
                                 rounded-md shadow-md focus:outline-none w-full"
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
                        <ul
                          className="absolute left-0 mt-1 w-full max-h-48 
                                       overflow-y-auto bg-white text-black 
                                       shadow-md rounded z-50"
                        >
                          {airports.map((airport) => (
                            <li
                              key={airport.id}
                              onClick={() => handleSelectAirport(airport)}
                              className="p-2 cursor-pointer hover:bg-gray-200 
                                         border-b text-sm"
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

                  {/* Swap */}
                  <motion.button
                    onClick={() => handleSwap(0)}
                    whileHover={{ scale: 1.1 }}
                    className="bg-blue-600 p-2 rounded-full shadow-md 
                               flex items-center justify-center mt-6"
                  >
                    <SwapHorizIcon className="text-white text-2xl" />
                  </motion.button>

                  {/* TO */}
                  <div className="flex-1 relative">
                    <label className="text-md text-[#008cff] mb-1">To</label>
                    <input
                      type="text"
                      className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 
                                 px-4 rounded-md shadow-md focus:outline-none 
                                 w-full"
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
                        <ul
                          className="absolute left-0 mt-1 w-full max-h-48 
                                       overflow-y-auto bg-white text-black 
                                       shadow-md rounded z-50"
                        >
                          {airports.map((airport) => (
                            <li
                              key={airport.id}
                              onClick={() => handleSelectAirport(airport)}
                              className="p-2 cursor-pointer hover:bg-gray-200 
                                         border-b text-sm"
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
                  <div className="min-w-[180px]">
                    <label className="text-md text-[#008cff] mb-1">Depart</label>
                    <input
                      type="datetime-local"
                      value={`${segments[0].departureDate}T${
                        segments[0].departureTime || "12:00"
                      }`}
                      onChange={(e) => {
                        const [date, time] = e.target.value.split("T");
                        handleSegmentChange(0, "departureDate", date);
                        handleSegmentChange(0, "departureTime", time);
                      }}
                      min={`${new Date().toISOString().split("T")[0]}T00:00`}
                      className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 
                                 rounded-md shadow-md focus:outline-none w-full"
                    />
                  </div>

                  {/* Passengers */}
                  <div className="min-w-[120px]">
                    <label className="text-md text-[#008cff] mb-1">Seat</label>
                    <select
                      value={segments[0].passengers}
                      onChange={(e) =>
                        handleSegmentChange(0, "passengers", +e.target.value)
                      }
                      className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 
                                 px-4 rounded-md shadow-md cursor-pointer 
                                 focus:outline-none w-full"
                    >
                      {[...Array(10).keys()].map((num) => (
                        <option
                          key={num + 1}
                          value={num + 1}
                          className="text-black"
                        >
                          {num + 1} Seat{num > 0 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* SEARCH Button on the right side */}
                  <div className="mt-6 ml-auto">
                    <motion.button
                      onClick={handleSearch}
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-r from-blue-700 to-blue-500 
                                 text-white px-6 py-2 rounded-md shadow-md 
                                 hover:from-blue-600 hover:to-blue-400 transition-all 
                                 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 border-2 border-white border-t-transparent 
                                       rounded-full animate-spin mr-2"
                          />
                          Loading...
                        </div>
                      ) : (
                        "SEARCH"
                      )}
                    </motion.button>
                  </div>
                </div>
              ) : (
                /* ------ Multi-City Layout ------ */
                <>
                  <div className="flex flex-wrap items-end gap-2 w-full">
                    <div className="min-w-[120px]">
                      <label className="text-md text-[#008cff] mb-1 block">
                        Trip Type
                      </label>
                      <select
                        value={tripType}
                        onChange={(e) => handleTripTypeChange(e.target.value)}
                        className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 
                                   rounded-md shadow-md cursor-pointer 
                                   focus:outline-none w-full"
                      >
                        <option className="text-black" value="oneway">
                          One Way
                        </option>
                        <option className="text-black" value="multicity">
                          Multi City
                        </option>
                      </select>
                    </div>
                    {/* Put the SEARCH button on the right as well */}
                    <div className="ml-auto mt-6">
                      <motion.button
                        onClick={handleSearch}
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-r from-blue-700 to-blue-500 
                                   text-white px-6 py-2 rounded-md shadow-md 
                                   hover:from-blue-600 hover:to-blue-400 transition-all 
                                   disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <div
                              className="w-4 h-4 border-2 border-white border-t-transparent 
                                         rounded-full animate-spin mr-2"
                            />
                            Loading...
                          </div>
                        ) : (
                          "SEARCH"
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {showMultiCityDetails && (
                    <div className="flex flex-col gap-2 mt-2">
                      {segments.map((segment, index) => (
                        <div
                          key={index}
                          className="flex flex-wrap items-end gap-4 p-2 rounded-lg shadow-md bg-[#041422]"
                        >
                          {/* Trip index on the same row as FROM */}
                          <div className="flex items-center">
                            <h3 className="text-lg text-[#008cff] font-semibold">
                              Trip {index + 1}:
                            </h3>
                          </div>

                          {/* FROM */}
                          <div className="min-w-[200px] flex-1 relative">
                            <label className="text-md text-[#008cff] mb-1 block">
                              From
                            </label>
                            <input
                              type="text"
                              className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md 
                                         focus:outline-none w-full"
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
                            {/* Dropdown */}
                            {showDropdown &&
                              focusedSegmentIndex === index &&
                              focusedField === "from" &&
                              airports.length > 0 && (
                                <ul
                                  className="absolute left-0 mt-1 w-full max-h-48 overflow-y-auto bg-white 
                                             text-black shadow-md rounded z-50"
                                >
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
                          <div className="min-w-[200px] flex-1 relative">
                            <label className="text-md text-[#008cff] mb-1 block">
                              To
                            </label>
                            <input
                              type="text"
                              className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md 
                                         focus:outline-none w-full"
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
                            {/* Dropdown */}
                            {showDropdown &&
                              focusedSegmentIndex === index &&
                              focusedField === "to" &&
                              airports.length > 0 && (
                                <ul
                                  className="absolute left-0 mt-1 w-full max-h-48 overflow-y-auto bg-white 
                                             text-black shadow-md rounded z-50"
                                >
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
                          <div className="min-w-[180px]">
                            <label className="text-md text-[#008cff] mb-1 block">
                              Date &amp; Time
                            </label>
                            <input
                              type="datetime-local"
                              value={`${segment.departureDate}T${
                                segment.departureTime || "12:00"
                              }`}
                              onChange={(e) => {
                                const [date, time] = e.target.value.split("T");
                                handleSegmentChange(index, "departureDate", date);
                                handleSegmentChange(index, "departureTime", time);
                              }}
                              min={`${new Date().toISOString().split("T")[0]}T00:00`}
                              className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md 
                                         focus:outline-none w-full"
                            />
                          </div>

                          {/* Passengers */}
                          <div className="min-w-[120px]">
                            <label className="text-md text-[#008cff] mb-1 block">
                              Seat
                            </label>
                            <select
                              value={segment.passengers}
                              onChange={(e) =>
                                handleSegmentChange(index, "passengers", +e.target.value)
                              }
                              className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md 
                                         shadow-md cursor-pointer focus:outline-none w-full"
                            >
                              {[...Array(10).keys()].map((num) => (
                                <option
                                  key={num + 1}
                                  value={num + 1}
                                  className="text-black"
                                >
                                  {num + 1} Seat{num > 0 ? "s" : ""}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* ADD/REMOVE City */}
                          {index === segments.length - 1 && (
                            <div className="flex items-center gap-4 mt-6">
                              {index > 0 && (
                                <motion.button
                                  onClick={() => handleRemoveCity(index)}
                                  whileHover={{ scale: 1.1 }}
                                  className="bg-red-600 p-2 rounded-full shadow-md flex items-center 
                                             justify-center"
                                >
                                  <DeleteIcon className="text-white text-xl" />
                                </motion.button>
                              )}
                              <button
                                onClick={handleAddCity}
                                className="text-[#008cff] border border-[#008cff] py-2 px-4 
                                           rounded-md hover:bg-[#008cff] hover:text-white transition"
                              >
                                + Add City
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* If user is NOT verified, show Additional Fields, else hide */}
              {!isVerified && (
                <div className="p-3 pt-0 bg-[#041422] rounded-lg flex flex-wrap items-end gap-4">
                  {/* Flight Type */}
                  <div className="flex-1 min-w-[180px]">
                    <label className="text-md text-[#008cff] mb-1 block">
                      Flight Type
                    </label>
                    <select
                      value={flightType}
                      onChange={(e) => setFlightType(e.target.value)}
                      className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 
                                 rounded-md shadow-md cursor-pointer 
                                 focus:outline-none w-full"
                    >
                      <option value="" className="text-black">
                        -- Select --
                      </option>
                      <option value="Charter Flight" className="text-black">
                        Charter Flight
                      </option>
                      <option value="AirCharter" className="text-black">
                        AirCharter
                      </option>
                      <option value="Air Ambulance" className="text-black">
                        Air Ambulance
                      </option>
                      <option value="Helicopter" className="text-black">
                        Helicopter
                      </option>
                      <option value="Private Jet" className="text-black">
                        Private Jet
                      </option>
                    </select>
                  </div>

                  {/* Full Name */}
                  <div className="flex-1 min-w-[180px]">
                    <label className="text-md text-[#008cff] mb-1 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your name"
                      className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 
                                 rounded-md shadow-md focus:outline-none w-full"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="flex-1 min-w-[160px]">
                    <label className="text-md text-[#008cff] mb-1 block">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 
                                 rounded-md shadow-md focus:outline-none w-full"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-md text-[#008cff] mb-1 block">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 
                                 rounded-md shadow-md focus:outline-none w-full"
                    />
                  </div>

                  {/* Checkbox */}
                  <div className="flex items-center gap-2 min-w-[200px] mt-6">
                    <input
                      type="checkbox"
                      id="policyCheck"
                      checked={agreedToPolicy}
                      onChange={(e) => setAgreedToPolicy(e.target.checked)}
                      className="w-5 h-5 text-blue-600 bg-gray-200 rounded 
                                 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="policyCheck" className="text-md text-white">
                      <Link href={"/termsAndCondition"} className="flex text-sm">
                        <p>I agree to the&nbsp;</p>
                        <p className="underline underline-offset-1 cursor-pointer">
                          Terms &amp; Condition
                        </p>
                      </Link>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Banner & Fleet Listing below */}
        <BannerSection />
        <FilterAndFleetListing key={refreshKey} />
      </div>
    </>
  );
};
