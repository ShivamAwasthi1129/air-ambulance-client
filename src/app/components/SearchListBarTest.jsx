"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterAndFleetListing from "../components/FilterAndFleetListing";
import UserInfoModal from "../components/UserInfoModal";
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const SearchBar = () => {
  // === State ===
  const [tripType, setTripType] = useState("oneway");
  const [showMultiCityDetails, setShowMultiCityDetails] = useState(false);
  const [isMultiCityCollapsed, setIsMultiCityCollapsed] = useState(false);

  const [segments, setSegments] = useState([
    {
      from: "Dubai International Airport (DXB)",
      to: "Indira Gandhi International Airport (DEL)",
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
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [email, setEmail] = useState("");
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const containerRef = useRef(null);

  // === Effects ===

  // (A) Load data from session OR set defaults if no saved data
  useEffect(() => {
    const savedSearchData = sessionStorage.getItem("searchData");
    if (savedSearchData) {
      // If session data exists, load it
      const parsed = JSON.parse(savedSearchData);
      if (parsed.tripType) setTripType(parsed.tripType);
      if (parsed.segments) setSegments(parsed.segments);
      if (parsed.userInfo) setUserInfo(parsed.userInfo);
      if (parsed.tripType === "multicity") {
        setShowMultiCityDetails(true);
      }
    } else {
      // No session data => set default "from" (Dubai) and "to" (Delhi)
      setSegments((prev) => {
        const updated = [...prev];

        const dxbAirport = {
          name: "Dubai International Airport",
          iata_code: "DXB",
          icao_code: "OMDB",
          city: "Dubai",
          country: "UAE",
        };
        updated[0] = {
          ...updated[0],
          from: `${dxbAirport.name} (${dxbAirport.iata_code})`,
          fromCity: dxbAirport.city,
          fromIATA: dxbAirport.iata_code,
          fromICAO: dxbAirport.icao_code,
        };

        const delAirport = {
          name: "Indira Gandhi International Airport",
          iata_code: "DEL",
          icao_code: "VIDP",
          city: "New Delhi",
          country: "India",
        };
        updated[0] = {
          ...updated[0],
          to: `${delAirport.name} (${delAirport.iata_code})`,
          toCity: delAirport.city,
          toIATA: delAirport.iata_code,
          toICAO: delAirport.icao_code,
        };
        return updated;
      });
    }

    // Also check if user is verified
    const userHasVerified = sessionStorage.getItem("userVerified");
    if (userHasVerified === "true") {
      setIsVerified(true);
    }
  }, []);

  // (B) Whenever tripType, segments, or userInfo changes, store in session
  useEffect(() => {
    const dataToSave = {
      tripType,
      segments,
      userInfo,
    };
    sessionStorage.setItem("searchData", JSON.stringify(dataToSave));
  }, [tripType, segments, userInfo]);

  // (C) Collapse multi-city when user clicks outside
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

  // (D) Close airport dropdown if user clicks outside
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

  // (E) Fetch airports when searchQuery changes
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

  // (F) Fetch IP info on mount
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
          from: "Dubai International Airport (DXB)",
          to: "Indira Gandhi International Airport (DEL)",
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
          from: "Dubai International Airport (DXB)",
          to: "Indira Gandhi International Airport (DEL)",
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
          toast.error(
            "Please fill out all fields and agree to the policy before searching."
          );
          setIsLoading(false);
          return;
        }
      }
      // Append the selected country code to the phone number
      const fullPhoneNumber = `${countryCode}${phone}`;
      const mergedUserInfo = {
        ...userInfo,
        flightType,
        name,
        phone: fullPhoneNumber,
        email,
        agreedToPolicy,
      };

      // (B) If not verified, attempt to send OTP
      if (!isVerified) {
        try {
          const response = await fetch("/api/otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              phone: fullPhoneNumber,
              email,
            }),
          });
          const data = await response.json();
          if (data.message === "user already exists") {
            toast.info(
              data.message +
                " please try to login via provided credential in your existing email"
            );
            setIsLoading(false);
            return;
          }
          setIsUserInfoModalOpen(true);
        } catch (err) {
          console.error("Error sending OTP request:", err);
        }
      }

      // (C) Prepare final data and store it
      const finalData = {
        tripType,
        segments,
        userInfo: mergedUserInfo,
      };
      sessionStorage.setItem("searchData", JSON.stringify(finalData));
      setUserInfo(mergedUserInfo);
      setRefreshKey((prev) => prev + 1);

      // -- NEW CODE: Immediately fetch the stored session (searchData)
      //    and POST it to /api/query
      const finalDataFromSession = sessionStorage.getItem("searchData");
      if (finalDataFromSession) {
        const finalDataToSend = JSON.parse(finalDataFromSession);
        console.log("Final Payload (sent immediately):", finalDataToSend);
        await fetch("/api/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalDataToSend),
        });
      }

      if (tripType === "multicity") {
        setIsMultiCityCollapsed(true);
      }
    } catch (err) {
      console.error("Error in handleSearch:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // === JSX ===
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
                rounded-md transition-colors ${
                  flightType === "Charter Flights"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-300"
                }`}
            >
              <img
                src="https://s3.ap-south-1.amazonaws.com/aviation.hexerve/header+icons+/0476ea74-7ccd-439b-8a06-38872370b597.png"
                alt="Charter Flight"
                className="w-8 h-8"
              />
              <span className="text-sm font-medium mt-1">Charter Flight</span>
            </div>

            <div
              onClick={() => setFlightType("Private Jets")}
              className={`cursor-pointer flex flex-col items-center p-2 
                rounded-md transition-colors ${
                  flightType === "Private Jets"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-300"
                }`}
            >
              <img
                src="https://s3.ap-south-1.amazonaws.com/aviation.hexerve/header+icons+/Screenshot_19-2-2025_12929_.jpeg"
                alt="Private Jets"
                className="w-12 h-10"
              />
              <span className="text-sm font-medium mt-1">Private Jets</span>
            </div>

            <div
              onClick={() => setFlightType("Air Ambulance")}
              className={`cursor-pointer flex flex-col items-center p-2 
                rounded-md transition-colors ${
                  flightType === "Air Ambulance"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-300"
                }`}
            >
              <img
                src="https://s3.ap-south-1.amazonaws.com/aviation.hexerve/header+icons+/91427a14-4335-48d7-9ee4-7e9fa6a4986c.png"
                alt="Air Ambulance"
                className="w-12 h-8"
              />
              <span className="text-sm font-medium mt-1">Air Ambulance</span>
            </div>

            <div
              onClick={() => setFlightType("Air Cargo")}
              className={`cursor-pointer flex flex-col items-center p-2 
                rounded-md transition-colors ${
                  flightType === "Air Cargo"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-300"
                }`}
            >
              <img
                src="https://s3.ap-south-1.amazonaws.com/aviation.hexerve/header+icons+/4785e20f-3e7e-43bd-a79e-8855af562028.png"
                alt="Air Cargo"
                className="w-10 h-8"
              />
              <span className="text-sm font-medium mt-1">Air Cargo</span>
            </div>

            <div
              onClick={() => setFlightType("Sea Plane")}
              className={`cursor-pointer flex flex-col items-center p-2 
                rounded-md transition-colors ${
                  flightType === "Sea Plane"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-300"
                }`}
            >
              <img
                src="https://s3.ap-south-1.amazonaws.com/aviation.hexerve/header+icons+/fa056278-43d3-402f-868f-771f2de17ebe.png"
                alt="Sea Plane"
                className="w-12 h-8"
              />
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
                  {/* Dropdown - limited to 5 results */}
                  {showDropdown &&
                    focusedSegmentIndex === 0 &&
                    focusedField === "from" &&
                    airports.length > 0 && (
                      <ul className="absolute left-0 mt-1 w-full max-h-48 overflow-y-auto bg-white text-black shadow-md rounded z-50">
                        {airports.slice(0, 5).map((airport) => (
                          <li
                            key={airport.id}
                            onClick={() => handleSelectAirport(airport, 0, "from")}
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
                        {airports.slice(0, 5).map((airport) => (
                          <li
                            key={airport.id}
                            onClick={() => handleSelectAirport(airport, 0, "to")}
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
                    value={`${segments[0].departureDate}T${
                      segments[0].departureTime || "12:00"
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
                                  {airports.slice(0, 5).map((airport) => (
                                    <li
                                      key={airport.id}
                                      onClick={() =>
                                        handleSelectAirport(airport, index, "from")
                                      }
                                      className="p-2 cursor-pointer hover:bg-gray-200 border-b text-sm"
                                    >
                                      <div className="font-semibold">
                                        {airport.city}, {airport.country}
                                      </div>
                                      <div className="text-xs text-gray-600">
                                        {airport.name} •{" "}
                                        {airport.iata_code || "N/A"} •{" "}
                                        {airport.icao_code || "N/A"}
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
                                  {airports.slice(0, 5).map((airport) => (
                                    <li
                                      key={airport.id}
                                      onClick={() =>
                                        handleSelectAirport(airport, index, "to")
                                      }
                                      className="p-2 cursor-pointer hover:bg-gray-200 border-b text-sm"
                                    >
                                      <div className="font-semibold">
                                        {airport.city}, {airport.country}
                                      </div>
                                      <div className="text-xs text-gray-600">
                                        {airport.name} •{" "}
                                        {airport.iata_code || "N/A"} •{" "}
                                        {airport.icao_code || "N/A"}
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
                              value={`${segment.departureDate}T${
                                segment.departureTime || "12:00"
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

                          {/* Delete Button (if multiple segments) */}
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

                        {/* Add Another Flight (last segment only) */}
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
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="absolute inset-y-0 left-0 w-20 bg-transparent border-0 text-gray-700 z-10"
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+61">+61</option>
                    {/* Add any other codes you need */}
                  </select>
                  <input
                    type="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number*"
                    className="block w-full p-2 border rounded focus:outline-none pl-20 bg-pink-50/50"
                  />
                </div>

                {/* Your Name */}
                <div className="flex-1 min-w-[180px]">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name*"
                    className="block w-full p-2 border rounded focus:outline-none bg-pink-50/50"
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

        {/* (6) Conditionally render FilterAndFleetListing */}
        {!isLoading && isVerified && (
          <FilterAndFleetListing key={refreshKey} />
        )}
      </div>
      <ToastContainer
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{
          position: 'fixed',
          top: '12%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 100,
        }}
      />
    </>
  );
};
