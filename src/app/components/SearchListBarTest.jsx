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
  const [hasSearched, setHasSearched] = useState(false); // Add this new state

  const [dateSelected, setDateSelected] = useState(false);
  const [multiCityDateSelected, setMultiCityDateSelected] = useState({});
  const [mapModal, setMapModal] = useState({ open: false, segIdx: null, field: null, });
  const segmentHasHeli = (seg) =>
    (seg.flightTypes || []).some((t) => t.toLowerCase() === "helicopter");

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
  // In your existing useEffect for closing dropdown
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
        setHasSearched(false); // Add this line
        setIsLoadingNearbyAirports(false); // Add this line
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
      // If there's a search query, use existing logic
      if (searchQuery && searchQuery.trim()) {
        setHasSearched(false); // Reset before search
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
      }
      // If no search query but dropdown is focused, show nearby airports
      else if (showDropdown && userLocation) {
        setIsLoadingNearbyAirports(true);
        setHasSearched(false);
        const nearby = await fetchNearbyAirports(userLocation.lat, userLocation.lng);
        setAirports(nearby);
        setIsLoadingNearbyAirports(false);
        setHasSearched(true);
      }
      else {
        setAirports([]);
        setHasSearched(false);
      }
    }
    fetchAirports();
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
          // Overwrite if empty
          if (!name.trim()) setName(parsedLoginData.name || "");
          if (!phone.trim()) setPhone(parsedLoginData.phone || "");
          if (!email.trim()) setEmail(parsedLoginData.email || "");
        }
      }

      // Ensure setState is processed
      await new Promise((resolve) => setTimeout(resolve, 0));
      const currentName = name.trim();
      const currentPhone = phone.trim();
      const currentEmail = email.trim();

      // Basic validations if user is not verified
      // if (!currentName || !currentPhone || !currentEmail || !agreedToPolicy) {
      //   toast.error(
      //     "Name, phone, email, and agreeing to Terms & Conditions are required."
      //   );
      //   setIsLoading(false);
      //   return;
      // }
      const storedLoginData = sessionStorage.getItem("loginData");
      if (!storedLoginData && (!currentName || !currentPhone || !currentEmail || !agreedToPolicy)) {
        toast.error(
          "Name, phone, email, and agreeing to Terms & Conditions are required."
        );
        setIsLoading(false);
        return;
      }
      const fullPhoneNumber = `${currentPhone}`;

      // Merge user info
      const mergedUserInfo = {
        ...userInfo,
        name: currentName,
        phone: fullPhoneNumber,
        email: currentEmail,
        agreedToPolicy,
      };

      // Save the merged user info to sessionStorage as loginData
      // sessionStorage.setItem(
      //   "loginData",
      //   JSON.stringify({
      //     name: currentName,
      //     phone: fullPhoneNumber,
      //     email: currentEmail,
      //     agreedToPolicy,
      //   })
      // );

      // If not verified, send OTP
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

        // Handle successful response
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
          // Show OTP modal only on success
          setIsUserInfoModalOpen(true);
        }
        // Handle error responses (500, 400, etc.)
        else {
          setIsLoading(false);

          // Check if it's a duplicate key error
          if (data.error && data.error.includes("E11000 duplicate key error")) {
            if (data.error.includes("phone_1 dup key")) {
              toast.error("This phone number is already linked with another email account.");
            } else if (data.error.includes("email_1 dup key")) {
              toast.error("This email ID is already linked with another phone number.");
            } else {
              toast.error("Duplicate entry found. Please check your phone number and email.");
            }
          } else {
            // Handle other types of errors
            toast.error(data.message || data.error || "Failed to send OTP. Please try again.");
          }
          return;
        }
      } catch (err) {
        console.error("Error sending OTP request:", err);
        setIsLoading(false);
        toast.error("Network error. Please check your connection and try again.");
        return;
      }

      // Build final payload (each segment includes flightTypes array)
      const finalData = {
        tripType,
        segments, // => each has flightTypes: [...]
        userInfo: mergedUserInfo,
      };

      // Store in session
      sessionStorage.setItem("searchData", JSON.stringify(finalData));
      setUserInfo(mergedUserInfo);
      setRefreshKey((prev) => prev + 1);

      // POST to /api/query for flight listing
      const finalDataFromSession = sessionStorage.getItem("searchData");
      console.log("final payload : ", finalDataFromSession);
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

      // If multi-city, collapse after searching
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
              <div className="flex flex-wrap md:flex-nowrap items-start gap-4 mb-4 border-b-2 border-gray-300 pb-4">
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
                          airports.slice(0, 5).map((airport, i) => (
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
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full 
                             h-10 w-10 flex items-center justify-center mt-6"
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
                          airports.slice(0, 5).map((airport, i) => (
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
                                    airports.slice(0, 5).map((airport, i) => (
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
                                    airports.slice(0, 5).map((airport, i) => (
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

                {/* Phone Number + Country Code */}
                {/* <div className="flex-1 min-w-[160px] relative">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="absolute inset-y-0 left-0 w-20 bg-transparent 
                               border-0 text-gray-700 z-10"
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+61">+61</option>
                  </select>
                  <input
                    type="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number*"
                    className="block w-full p-2 border rounded focus:outline-none
                               pl-20 bg-pink-50/50"
                  />
                </div> */}

                <div className="flex-1 min-w-[160px]">
                  <PhoneInput
                    value={phone}
                    onChange={setPhone}
                    placeholder="Phone Number*"
                    className="block w-full p-2 border rounded focus:outline-none bg-pink-50/50"
                    defaultCountry="IN"
                    international
                    countryCallingCodeEditable={false}
                  />
                </div>

                {/* Name */}
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
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={() => {
            setIsLoginModalOpen(false);
            setIsVerified(true);
            setRefreshKey(prev => prev + 1);
            window.dispatchEvent(new Event("updateNavbar"));
          }}
          initialEmail={email}
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
