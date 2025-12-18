"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
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

  // Each segment has `flightTypes` (an array) for multi-select
  const [segments, setSegments] = useState([
    {
      // from: "Dubai International Airport (DXB)",
      from: "Dubai International Airport",
      // to: "Indira Gandhi International Airport (DEL)",
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
          return { ...segment, flightTypes: ["Private Jet"] }; // Default to "Private Jet"
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
  // Personal info fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  // const [countryCode, setCountryCode] = useState("+91");
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
  // === Effects ===
  // (A) Load from session or set defaults

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation function  
  const validatePhone = (phone) => {
    // This will check if phone has at least 10 digits (excluding country code symbols)
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

  // Debounced email validation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (email) {
        handleEmailValidation(email);
      }
    }, 1000); // 1 second delay after user stops typing

    return () => clearTimeout(timer);
  }, [email]);

  // Debounced phone validation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (phone) {
        handlePhoneValidation(phone);
      }
    }, 1000); // 1 second delay after user stops typing

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

  // (F) Fetch IP info and location on mount
  useEffect(() => {
    async function fetchIPAndLocation() {
      try {
        const res = await fetch("https://ipinfo.io/json");
        const data = await res.json();
        setUserInfo(data);

        // Extract location for nearby airports
        if (data.loc) {
          const [lat, lng] = data.loc.split(',');
          setUserLocation({ lat: parseFloat(lat), lng: parseFloat(lng) });
        }
      } catch (err) {
        console.error("Failed to fetch IP info:", err);
        // Try to get location separately if IP info fails
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
      // No session data => set default from/to
      setSegments((prev) => {
        const updated = [...prev];
        updated[0] = {
          ...updated[0],
          // from: "Dubai International Airport (DXB)",
          from: "Dubai International Airport",
          fromCity: "Dubai",
          fromIATA: "DXB",
          fromICAO: "OMDB",
          // to: "Indira Gandhi International Airport (DEL)",
          to: "Indira Gandhi International Airport",
          toCity: "New Delhi",
          toIATA: "DEL",
          toICAO: "VIDP",
          flightTypes: ["Private Jet"],
        };
        return updated;
      });
    }

    // Check if user is verified
    const userHasVerified = sessionStorage.getItem("userVerified");
    if (userHasVerified === "true") {
      setIsVerified(true);
    }
  }, []);

  // (B) Save to session whenever these change
  useEffect(() => {
    const dataToSave = {
      tripType,
      segments,
      userInfo,
    };
    sessionStorage.setItem("searchData", JSON.stringify(dataToSave));
  }, [tripType, segments, userInfo]);

  // (C) Collapse multi-city if user clicks outside container
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
        setHasSearched(false);
        setIsLoadingNearbyAirports(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // (E) Fetch airports when searchQuery changes
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
    }, 200); // 400ms debounce

    return () => clearTimeout(handler);
  }, [searchQuery, showDropdown, userLocation]);

  // (F) Fetch IP info on mount (optional)
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
  // Toggle trip type (oneway/multicity)
  const handleTripTypeChange = (type) => {
    setTripType(type);

    if (type === "oneway") {
      setShowMultiCityDetails(false);
      setIsMultiCityCollapsed(false);
      setSegments([
        {
          // from: "Dubai International Airport (DXB)",
          from: "Dubai International Airport",
          to: "Indira Gandhi International Airport",
          // to: "Indira Gandhi International Airport (DEL)",
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
          // from: "Dubai International Airport (DXB)",
          from: "Dubai International Airport",
          to: "Indira Gandhi International Airport",
          // to: "Indira Gandhi International Airport (DEL)",
          departureDate: new Date().toISOString().split("T")[0],
          departureTime: "08:00",
          passengers: 1,
          flightTypes: ["Private Jet"],
        },
      ]);
    }
  };
  // Update any field in a given segment
  const handleSegmentChange = (index, field, value) => {
    const updatedSegments = [...segments];
    updatedSegments[index][field] = value;
    setSegments(updatedSegments);
  };
  // On selecting an airport from dropdown
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
  // Swap "from" & "to" in one-way mode
  const handleSwap = (index) => {
    if (tripType !== "oneway") return;
    const updated = [...segments];
    const temp = updated[index].from;
    updated[index].from = updated[index].to;
    updated[index].to = temp;
    setSegments(updated);
  };
  // Multi-city: add new segment with next-day date
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
  // Remove a segment (multi-city only)
  const handleRemoveCity = (index) => {
    setSegments((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSaveCoords = (coords, address, segIdx, field) => {
    setSegments((prev) => {
      const updated = [...prev];
      if (!updated[segIdx]) return prev;

      // Check if "From" and "To" coordinates are the same
      const otherField = field === "from" ? "toLoc" : "fromLoc";
      if (
        updated[segIdx][otherField] &&
        updated[segIdx][otherField].lat === coords.lat &&
        updated[segIdx][otherField].lng === coords.lng
      ) {
        if (!toastTriggeredRef.current) {
          toast.error("Selected coordinates of destination and arrival cannot be the same.");
          toastTriggeredRef.current = true; // Prevent further toasts
          setTimeout(() => {
            toastTriggeredRef.current = false; // Reset after 3 seconds
          }, 3000);
        }
        return prev;
      }

      // Update the selected field
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


  // Final "Search" button
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      // If verified, try to pull name/email/phone from loginData in session
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

      // Basic validations if user is not verified and not logged in
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

      // Only send OTP and open UserInfoModal if not logged in
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

            // Only show OTP modal if NOT verified and loginData is not present
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

      // Build final payload (each segment includes flightTypes array)
      const finalData = {
        tripType,
        segments,
        userInfo: mergedUserInfo,
      };

      sessionStorage.setItem("searchData", JSON.stringify(finalData));
      setUserInfo(mergedUserInfo);
      setRefreshKey((prev) => prev + 1);

      // POST to /api/query for flight listing
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
  // === Render ===
  return (
    <>
      {/* OTP Modal (if needed) */}
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
      <div className="w-full flex flex-col items-center relative">
        {/* Main Container */}
        <div
          ref={containerRef}
          className="p-4 sm:p-6 md:p-4 max-w-6xl w-full rounded-lg bg-white/40 
                     backdrop-blur-md shadow-md -mt-32 relative z-10"
        >
          {/* (1) Icon bar for ONE-WAY tripType =>  segments[0] */}
          {tripType === "oneway" && (
            <Icondiv
              flightTypes={segments[0].flightTypes}
              setFlightTypes={(updatedFlightTypes) =>
                handleSegmentChange(0, "flightTypes", updatedFlightTypes)
              }
            />
          )}
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
          {/* (3) Main Fields Box */}
          <div className="bg-white rounded-xl border-4 border-gray-300 p-4">
            {/* One Way Fields */}
            {tripType === "oneway" && (
              <div className="flex flex-col md:flex-row md:flex-nowrap items-start gap-4 mb-4 border-b-2 border-gray-300 pb-4">
                {/* FROM */}
                <div className="w-full md:flex-1 relative">
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
                      const currentValue = segments[0].from || "";
                      setSearchQuery(currentValue);
                    }}
                    onChange={(e) => {
                      handleSegmentChange(0, "from", e.target.value);
                      setSearchQuery(e.target.value);
                    }}

                  />
                  {segments[0].fromLoc && (
                    <p className="text-xs text-gray-500 mt-1">
                      Selected Coordinates: {segments[0].fromLoc.lat.toFixed(2)}, {segments[0].fromLoc.lng.toFixed(2)}
                    </p>
                  )}


                  {segmentHasHeli(segments[0]) && (
                    <button
                      type="button"
                      onClick={() => setMapModal({ open: true, segIdx: 0, field: "from" })}
                      className="absolute right-2 top-8 text-blue-600 hover:text-blue-800"
                    >
                      <FaMapLocationDot size={26} />
                    </button>
                  )}


                  {/* Dropdown */}

                  {showDropdown &&
                    focusedSegmentIndex === 0 &&
                    focusedField === "from" && (
                      <div className="absolute left-0 mt-1 w-full max-h-48 overflow-y-auto bg-white text-black shadow-md rounded z-50">
                        {isLoadingNearbyAirports ? (
                          <div className="p-4 flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                            <span className="text-sm text-gray-600">Trying to search nearby airports...</span>
                          </div>
                        ) : airports.length > 0 ? (
                          airports.map((airport, i) => (
                            <li
                              key={airport.id ?? `airport-from-${i}`}
                              onClick={() => handleSelectAirport(airport, 0, "from")}
                              className="p-2 cursor-pointer hover:bg-gray-200 border-b text-sm"
                            >
                              <div className="font-semibold">
                                {airport.city}, {airport.country}
                              </div>
                              <div className="text-xs text-gray-600">
                                {airport.name} • {airport.iata_code || "N/A"} • {airport.icao_code || "N/A"}
                              </div>
                            </li>
                          ))
                        ) : hasSearched ? (
                          <div className="p-4 text-center text-gray-500 text-sm">
                            No airports found
                          </div>
                        ) : null}
                      </div>
                    )
                  }
                </div>

                {/* Swap Icon */}
                <motion.button
                  onClick={() => handleSwap(0)}
                  whileHover={{ scale: 1.1 }}
                  className="hidden md:flex bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full 
             h-10 w-10 items-center justify-center mt-6"
                >
                  <SwapHorizIcon />
                </motion.button>

                {/* TO */}
                <div className="w-full md:flex-1 relative">
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
                      const currentValue = segments[0].to || "";
                      setSearchQuery(currentValue);
                    }}
                    onChange={(e) => {
                      handleSegmentChange(0, "to", e.target.value);
                      setSearchQuery(e.target.value);
                    }}

                  />
                  {segments[0].toLoc && (
                    <p className="text-xs text-gray-500 mt-1">
                      Selected Coordinates: {segments[0].toLoc.lat.toFixed(2)}, {segments[0].toLoc.lng.toFixed(2)}
                    </p>
                  )}
                  {segmentHasHeli(segments[0]) && (
                    <button
                      type="button"
                      onClick={() => setMapModal({ open: true, segIdx: 0, field: "to" })}
                      className="absolute right-2 top-8 text-blue-600 hover:text-blue-800"
                    >
                      <FaMapLocationDot size={26} />
                    </button>
                  )}
                  {showDropdown &&
                    focusedSegmentIndex === 0 &&
                    focusedField === "to" && (
                      <div className="absolute left-0 mt-1 w-full max-h-48 overflow-y-auto bg-white text-black shadow-md rounded z-50">
                        {isLoadingNearbyAirports ? (
                          <div className="p-4 flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                            <span className="text-sm text-gray-600">Trying to search nearby airports...</span>
                          </div>
                        ) : airports.length > 0 ? (
                          airports.map((airport, i) => (
                            <li
                              key={airport.id ?? `airport-to-${i}`}
                              onClick={() => handleSelectAirport(airport, 0, "to")}
                              className="p-2 cursor-pointer hover:bg-gray-200 border-b text-sm"
                            >
                              <div className="font-semibold">
                                {airport.city}, {airport.country}
                              </div>
                              <div className="text-xs text-gray-600">
                                {airport.name} • {airport.iata_code || "N/A"} • {airport.icao_code || "N/A"}
                              </div>
                            </li>
                          ))
                        ) : hasSearched ? (
                          <div className="p-4 text-center text-gray-500 text-sm">
                            No airports found
                          </div>
                        ) : null}
                      </div>
                    )
                  }
                </div>
                {/* Departure Date & Time */}
                <div className="w-full sm:w-1/2 md:w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departure Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={`${segments[0].departureDate}T${segments[0].departureTime || "08:00"}`}
                    onFocus={() => setDateSelected(false)}
                    onChange={(e) => {
                      const [date, time] = e.target.value.split("T");
                      if (!dateSelected) {
                        // first pick => update date only
                        handleSegmentChange(0, "departureDate", date);
                        setDateSelected(true);
                      } else {
                        // second pick => update time, then blur
                        handleSegmentChange(0, "departureTime", time);
                        e.target.blur();
                        setDateSelected(false);
                      }
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
                      handleSegmentChange(0, "passengers", e.target.value)
                    }
                    className="block w-full p-2 border rounded focus:outline-none"
                  >
                    {[...Array(32).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1}
                      </option>
                    ))}
                    <option value="33">33+</option>
                    <option value="45">45+</option>
                    <option value="80">80+</option>
                    <option value="100">100+</option>
                    <option value="200">200+</option>
                    <option value="300">300+</option>
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
                        className="relative bg-gray-50 border-2 border-gray-300 
                                   rounded-md p-4"
                      >
                        {/* Purple vertical label for "Trip X" */}
                        <div
                          className="absolute -left-12 top-1/2 -translate-y-1/2 w-[100px]
                                     bg-purple-600 text-white text-center text-sm font-semibold
                                     py-1 transform -rotate-90 origin-center rounded-md"
                          style={{ transformOrigin: "center" }}
                        >
                          Trip {index + 1}
                        </div>

                        {/* Icon div for each segment */}
                        <div className="mt-20 ml-10">
                          <Icondiv
                            flightTypes={segment.flightTypes}
                            setFlightTypes={(updatedFlightTypes) =>
                              handleSegmentChange(index, "flightTypes", updatedFlightTypes)
                            }
                          /></div>

                        {/* Actual fields */}
                        <div className="ml-10 flex flex-wrap lg:flex-nowrap items-start gap-4 mt-4">
                          {/* FROM */}
                          <div className="w-full md:flex-1 relative">
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
                                const currentValue = segment.from || "";
                                setSearchQuery(currentValue);
                              }}
                              onChange={(e) => {
                                handleSegmentChange(index, "from", e.target.value);
                                setSearchQuery(e.target.value);
                              }}
                            />
                            {segment.fromLoc && (
                              <p className="text-xs text-gray-500 mt-1">
                                Selected Coordinates: {segment.fromLoc.lat.toFixed(2)}, {segment.fromLoc.lng.toFixed(2)}
                              </p>
                            )}
                            {segmentHasHeli(segment) && (
                              <button
                                type="button"
                                onClick={() => setMapModal({ open: true, segIdx: index, field: "from" })}
                                className="absolute right-2 top-8 text-blue-600 hover:text-blue-800"
                              >
                                <FaMapLocationDot size={26} />
                              </button>
                            )}
                            {/* Dropdown */}
                            {showDropdown &&
                              focusedSegmentIndex === index &&
                              focusedField === "from" && (
                                <div className="absolute left-0 mt-1 w-full max-h-48 overflow-y-auto bg-white text-black shadow-md rounded z-50">
                                  {isLoadingNearbyAirports ? (
                                    <div className="p-4 flex items-center justify-center">
                                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                      <span className="text-sm text-gray-600">Trying to search nearby airports...</span>
                                    </div>
                                  ) : airports.length > 0 ? (
                                    airports.map((airport, i) => (
                                      <li
                                        key={airport.id ?? `airport-from-${index}-${i}`}
                                        onClick={() => handleSelectAirport(airport, index, "from")}
                                        className="p-2 cursor-pointer hover:bg-gray-200 border-b text-sm"
                                      >
                                        <div className="font-semibold">
                                          {airport.city}, {airport.country}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                          {airport.name} • {airport.iata_code || "N/A"} • {airport.icao_code || "N/A"}
                                        </div>
                                      </li>
                                    ))
                                  ) : hasSearched ? (
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                      No airports found
                                    </div>
                                  ) : null}
                                </div>
                              )
                            }
                          </div>
                          {/* TO */}
                          <div className="w-full md:flex-1 relative">
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
                                const currentValue = segment.to || "";
                                setSearchQuery(currentValue);
                              }}
                              onChange={(e) => {
                                handleSegmentChange(index, "to", e.target.value);
                                setSearchQuery(e.target.value);
                              }}
                            />
                            {segment.toLoc && (
                              <p className="text-xs text-gray-500 mt-1">
                                Selected Coordinates: {segment.toLoc.lat.toFixed(2)}, {segment.toLoc.lng.toFixed(2)}
                              </p>
                            )}
                            {segmentHasHeli(segment) && (
                              <button
                                type="button"
                                onClick={() => setMapModal({ open: true, segIdx: index, field: "to" })}
                                className="absolute right-2 top-8 text-blue-600 hover:text-blue-800"
                              >
                                <FaMapLocationDot size={26} />
                              </button>
                            )}
                            {showDropdown &&
                              focusedSegmentIndex === index &&
                              focusedField === "to" && (
                                <div className="absolute left-0 mt-1 w-full max-h-48 overflow-y-auto bg-white text-black shadow-md rounded z-50">
                                  {isLoadingNearbyAirports ? (
                                    <div className="p-4 flex items-center justify-center">
                                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                      <span className="text-sm text-gray-600">Trying to search nearby airports...</span>
                                    </div>
                                  ) : airports.length > 0 ? (
                                    airports.map((airport, i) => (
                                      <li
                                        key={airport.id ?? `airport-to-${index}-${i}`}
                                        onClick={() => handleSelectAirport(airport, index, "to")}
                                        className="p-2 cursor-pointer hover:bg-gray-200 border-b text-sm"
                                      >
                                        <div className="font-semibold">
                                          {airport.city}, {airport.country}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                          {airport.name} • {airport.iata_code || "N/A"} • {airport.icao_code || "N/A"}
                                        </div>
                                      </li>
                                    ))
                                  ) : hasSearched ? (
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                      No airports found
                                    </div>
                                  ) : null}
                                </div>
                              )
                            }
                          </div>
                          {/* DATE & TIME */}
                          <div className="w-full sm:w-1/2 md:w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                handleSegmentChange(index, "passengers", e.target.value)
                              }
                              className="block w-full p-2 border rounded focus:outline-none"
                            >
                              {[...Array(32).keys()].map((num) => (
                                <option key={num + 1} value={num + 1}>
                                  {num + 1}
                                </option>
                              ))}
                              <option value="33+">33+</option>
                            </select>
                          </div>

                          {/* Remove segment (if more than 1) */}
                          <div className="mt-3 flex items-center gap-4">
                            {segments.length > 1 && (
                              <motion.button
                                onClick={() => handleRemoveCity(index)}
                                whileHover={{ scale: 1.1 }}
                                className="bg-red-500 hover:bg-red-600 text-white p-2 
                                           rounded-md flex items-center justify-center"
                              >
                                <DeleteIcon />
                              </motion.button>
                            )}
                          </div>
                        </div>

                        {/* Add Another Flight (only on last segment) */}
                        {index === segments.length - 1 && (
                          <div className="mt-3 flex items-center gap-4 ml-10">
                            <button
                              type="button"
                              onClick={handleAddCity}
                              className="py-1 px-3 border rounded text-blue-600 
                                         border-blue-600 hover:bg-blue-600 
                                         hover:text-white transition"
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

            {/* Show these fields only if NOT verified */}
            {!isVerified && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
                {/* Email */}
                <div className="w-full sm:flex-1 min-w-[200px]">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email*"
                    className={`block w-full p-2 border rounded focus:outline-none bg-pink-50/50 ${emailError ? 'border-red-500' : ''
                      }`}
                  />
                  <div className="h-5 mt-1">
                    {emailError && (
                      <p className="text-red-500 text-xs">{emailError}</p>
                    )}
                  </div>
                </div>

                <div className="relative w-full sm:flex-1 min-w-[160px]">
                  <label
                    htmlFor="phone"
                    className="absolute left-1 -top-[14%] text-gray-500 text-xs transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-focus:text-pink-600 px-1"
                  >
                    Whatsapp / Mobile Number*
                  </label>

                  <PhoneInput
                    id="phone"
                    value={phone}
                    onChange={setPhone}
                    defaultCountry="IN"
                    international
                    countryCallingCodeEditable={false}
                    className={`peer block w-full p-2 border rounded focus:outline-none bg-pink-50/50 ${phoneError ? 'border-red-500' : ''
                      }`}
                  />
                  <div className="h-5 mt-1">
                    {phoneError && (
                      <p className="text-red-500 text-xs">{phoneError}</p>
                    )}
                  </div>
                </div>



                {/* Name */}
                <div className="w-full sm:flex-1 min-w-[180px]">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name*"
                    className="block w-full p-2 border rounded focus:outline-none bg-pink-50/50"
                  />
                  <div className="h-5 mt-1">
                    {/* Empty div to maintain consistent spacing */}
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-center gap-2 mt-0">
                  <input
                    type="checkbox"
                    id="policyCheck"
                    checked={agreedToPolicy}
                    onChange={(e) => setAgreedToPolicy(e.target.checked)}
                    className="h-5 w-5 text-blue-600 border-gray-300 
                               rounded focus:ring-blue-500"
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

            {/* (5) Search Button and Trouble Signing In */}
            <div className="flex justify-end items-center gap-4 mt-4">
              {/* Trouble signing in button - only show when there's been a 500 error */}
              {showTroubleSigningIn && (
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setShowTroubleSigningIn(false); // Hide the button after clicking
                    // loginModalEmail is already set from the error handling
                  }}
                  className="text-blue-600 hover:text-blue-800 underline text-sm font-medium transition-colors"
                >
                  Trouble signing in?
                </button>
              )}

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
                    <div className="w-4 h-4 border-2 border-white 
                       border-t-transparent rounded-full 
                       animate-spin mr-2"
                    />
                    Loading...
                  </div>
                ) : (
                  "Search"
                )}
              </motion.button>
            </div>
          </div>
        </div>
        {/* (6) Conditionally render the flight listing (if verified) */}
        {!isLoading && isVerified && <FilterAndFleetListing key={refreshKey} />}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => {
            setIsLoginModalOpen(false);
            setLoginModalEmail(""); // Clear the stored email when closing
          }}
          onLoginSuccess={() => {
            setIsLoginModalOpen(false);
            setIsVerified(true);
            setShowTroubleSigningIn(false); // Hide trouble signing in button on successful login
            setLoginModalEmail(""); // Clear the stored email on successful login
            setRefreshKey(prev => prev + 1);
            window.dispatchEvent(new Event("updateNavbar"));
          }}
          initialEmail={loginModalData.email || loginModalData.phone || loginModalEmail || email} // Pass phone if present
          source="searchbar"  // Add this line
        />
      </div >
      < GoogleMapModal
        open={mapModal.open}
        onClose={() => setMapModal({ open: false, segIdx: null, field: null })}
        onSave={(coords, address) => handleSaveCoords(coords, address, mapModal.segIdx, mapModal.field)}
      />
    </>
  );
};
