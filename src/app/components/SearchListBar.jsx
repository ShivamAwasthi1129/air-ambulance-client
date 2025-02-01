"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DeleteIcon from "@mui/icons-material/Delete";

import FilterAndFleetListing from "../components/FilterAndFleetListing";
import BannerSection from "./Banner";
import UserInfoModal from "../components/UserInfoModal";

export const SearchBar = () => {
  // State for airport search
  const [airports, setAirports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedSegmentIndex, setFocusedSegmentIndex] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Trip Type & Multi-City
  const [tripType, setTripType] = useState("oneway");
  const [showMultiCityDetails, setShowMultiCityDetails] = useState(false);
  const [isMultiCityCollapsed, setIsMultiCityCollapsed] = useState(false);

  // Flight Segments
  const [segments, setSegments] = useState([
    {
      from: "Indira Gandhi International Airport (DEL)",
      to: "Heathrow Airport (LHR)",
      departureDate: new Date().toISOString().split("T")[0],
      departureTime: "12:00",
      passengers: 1,
    },
  ]);

  // Misc. state
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 2) Local state to show/hide the user info modal
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);

  // Container ref for outside-click detection (multi-city collapse)
  const containerRef = useRef(null);

  // ================== EFFECTS ==================
  // 1) Outside-click to collapse multi-city
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

  // 2) Outside-click logic for Airport Dropdown
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

  // 3) Load search data from session on mount
  useEffect(() => {
    const savedSearchData = sessionStorage.getItem("searchData");
    if (savedSearchData) {
      const parsedData = JSON.parse(savedSearchData);
      setTripType(parsedData.tripType);
      setSegments(parsedData.segments || []);

      if (parsedData.tripType === "multicity") {
        setShowMultiCityDetails(true);
      }
    }
  }, []);

  // 4) Save tripType/segments to session whenever they change
  useEffect(() => {
    const partialData = { tripType, segments };
    sessionStorage.setItem("searchData", JSON.stringify(partialData));
  }, [tripType, segments]);

  // 5) Fetch airports whenever searchQuery changes
  useEffect(() => {
    async function fetchAirports() {
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

  // ================== HANDLERS ==================
  // A) Trip Type
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

  // B) Changing a segment
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

    // Update session quickly for any immediate retrieval
    sessionStorage.setItem(
      "searchData",
      JSON.stringify({ tripType, segments: updatedSegments })
    );
  };

  // D) Swap from/to (Only for One-Way)
  const handleSwap = (index) => {
    const updated = [...segments];
    const temp = updated[index].from;
    updated[index].from = updated[index].to;
    updated[index].to = temp;
    setSegments(updated);
  };

  // E) Add Multi-City
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

  // F) Remove Multi-City
  const handleRemoveCity = (index) => {
    setSegments((prev) => prev.filter((_, i) => i !== index));
  };

  // G) SEARCH
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      // 1) Check if user info is in session
      const storedDataRaw = sessionStorage.getItem("searchData");
      const storedData = storedDataRaw ? JSON.parse(storedDataRaw) : {};

      if (!storedData?.userInfo) {
        // userInfo not found => open modal & stop
        setIsUserInfoModalOpen(true);
        setIsLoading(false);
        return;
      }

      // 2) If user info is present, build final search data
      const finalSearchData = {
        ...storedData,
        tripType,
        segments,
      };

      // 3) Save final to session
      sessionStorage.setItem("searchData", JSON.stringify(finalSearchData));

      // 4) Send data to your API
      console.log("Final Payload to /api/query:", finalSearchData);
      const response = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalSearchData),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = await response.json();
      console.log("Response from /api/query:", result);

      // 5) Re-render listing
      setRefreshKey((prev) => prev + 1);

      // 6) If multi-city => collapse
      if (tripType === "multicity") {
        setIsMultiCityCollapsed(true);
      }
    } catch (err) {
      console.error("Error in handleSearch:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ================== RENDER ==================
  return (
    <>
      {/* 2) Render the modal if isUserInfoModalOpen = true */}
      {isUserInfoModalOpen && (
        <UserInfoModal
          // This "show" prop will control if the modal is visible
          show={isUserInfoModalOpen}
          onClose={() => setIsUserInfoModalOpen(false)}
        />
      )}

      <div className="flex flex-col items-center w-full">
        {/* SearchBar Container */}
        <div className="w-full sticky top-0 z-30" ref={containerRef}>
          {tripType === "multicity" && isMultiCityCollapsed ? (
            /* -------------- COLLAPSED MULTI-CITY -------------- */
            <div className="bg-[#041422] p-4 rounded-lg shadow-md flex flex-col gap-2 w-full relative">
              <div className="flex flex-wrap items-center justify-start gap-4 w-full">
                {/* Trip Type */}
                <div className="relative w-1/4 min-w-[150px]">
                  <label className="text-md text-[#008cff] mb-1 block">
                    Trip Type
                  </label>
                  <select
                    value={tripType}
                    onChange={(e) => handleTripTypeChange(e.target.value)}
                    className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md cursor-pointer focus:outline-none w-full"
                  >
                    <option className="text-black" value="oneway">
                      One Way
                    </option>
                    <option className="text-black" value="multicity">
                      Multi City
                    </option>
                  </select>
                </div>

                {/* FROM (Trip 1 only) */}
                <div className="flex-1">
                  <label className="text-md text-[#008cff] mb-1">
                    From (Trip 1)
                  </label>
                  <input
                    type="text"
                    className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md 
                               focus:outline-none w-full"
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
            /* -------------- FULL BAR -------------- */
            <div className="bg-[#041422] px-6 py-2 flex flex-col gap-2 relative w-full">
              {tripType === "oneway" ? (
                /* -------------- ONE-WAY Layout -------------- */
                <div className="flex flex-wrap items-end justify-between gap-2 w-full">
                  {/* Trip Type */}
                  <div className="relative flex-2">
                    <label className="text-md text-[#008cff] mb-1 block">
                      Trip Type
                    </label>
                    <select
                      value={tripType}
                      onChange={(e) => handleTripTypeChange(e.target.value)}
                      className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md cursor-pointer focus:outline-none w-full"
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
                      className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md focus:outline-none w-full"
                      value={segments[0].from}
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
                      placeholder="Type departure airport..."
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

                  {/* Swap */}
                  <motion.button
                    onClick={() => handleSwap(0)}
                    whileHover={{ scale: 1.1 }}
                    className="bg-blue-600 p-2 rounded-full shadow-md flex items-center justify-center"
                  >
                    <SwapHorizIcon className="text-white text-2xl" />
                  </motion.button>

                  {/* TO */}
                  <div className="flex-1 relative">
                    <label className="text-md text-[#008cff] mb-1">To</label>
                    <input
                      type="text"
                      className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md focus:outline-none w-full"
                      value={segments[0].to}
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
                      placeholder="Type destination airport..."
                    />
                    {/* Dropdown */}
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

                  {/* Date/Time */}
                  <div className="flex-1">
                    <label className="text-md text-[#008cff] mb-1">
                      Depart
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
                      className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md focus:outline-none w-full"
                    />
                  </div>

                  {/* Passengers */}
                  <div className="flex-1">
                    <label className="text-md text-[#008cff] mb-1">Seat</label>
                    <select
                      value={segments[0].passengers}
                      onChange={(e) =>
                        handleSegmentChange(0, "passengers", Number(e.target.value))
                      }
                      className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md cursor-pointer focus:outline-none w-full"
                    >
                      {[...Array(10).keys()].map((num) => (
                        <option
                          className="text-black"
                          key={num + 1}
                          value={num + 1}
                        >
                          {num + 1} Seat{num > 0 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* SEARCH Button */}
                  <div className="flex items-end">
                    <motion.button
                      onClick={handleSearch}
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-6 py-2 
                                 rounded-md shadow-md hover:from-blue-600 hover:to-blue-400 
                                 transition-all disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Loading...
                        </div>
                      ) : (
                        "SEARCH"
                      )}
                    </motion.button>
                  </div>
                </div>
              ) : (
                /* -------------- MULTI-CITY Layout -------------- */
                <>
                  {/* Top row: Trip Type + SEARCH */}
                  <div className="flex flex-wrap items-end justify-between gap-2 w-full pb-3">
                    <div className="min-w-[150px]">
                      <label className="text-md text-[#008cff] mb-1 block">
                        Trip Type
                      </label>
                      <select
                        value={tripType}
                        onChange={(e) => handleTripTypeChange(e.target.value)}
                        className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md cursor-pointer focus:outline-none w-full"
                      >
                        <option className="text-black" value="oneway">
                          One Way
                        </option>
                        <option className="text-black" value="multicity">
                          Multi City
                        </option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <motion.button
                        onClick={handleSearch}
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-6 py-2
                                   rounded-md shadow-md hover:from-blue-600 hover:to-blue-400 
                                   transition-all disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Loading...
                          </div>
                        ) : (
                          "SEARCH"
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {/* Multi-city segments (if expanded) */}
                  {showMultiCityDetails && (
                    <>
                      {segments.map((segment, index) => (
                        <div
                          key={index}
                          className="flex flex-wrap items-end justify-between gap-2 w-full rounded-lg shadow-md"
                        >
                          <h3 className="text-lg text-[#008cff] font-semibold">
                            Trip {index + 1}:
                          </h3>

                          {/* FROM */}
                          <div className="flex-1 relative">
                            <label className="text-md text-[#008cff] mb-1">
                              From
                            </label>
                            <input
                              type="text"
                              className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md focus:outline-none w-full"
                              value={segment.from}
                              onFocus={() => {
                                setFocusedSegmentIndex(index);
                                setFocusedField("from");
                                setShowDropdown(true);
                                setSearchQuery(segment.from || "");
                              }}
                              onChange={(e) => {
                                handleSegmentChange(
                                  index,
                                  "from",
                                  e.target.value
                                );
                                setSearchQuery(e.target.value);
                              }}
                              placeholder="Type departure airport..."
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
                                        {airport.name} •{" "}
                                        {airport.iata_code || "N/A"}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              )}
                          </div>

                          {/* TO */}
                          <div className="flex-1 relative">
                            <label className="text-md text-[#008cff] mb-1">
                              To
                            </label>
                            <input
                              type="text"
                              className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md focus:outline-none w-full"
                              value={segment.to}
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
                              placeholder="Type destination airport..."
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
                                        {airport.name} •{" "}
                                        {airport.iata_code || "N/A"}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              )}
                          </div>

                          {/* DATE/TIME */}
                          <div className="flex-1">
                            <label className="text-md text-[#008cff] mb-1">
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
                              min={`${
                                new Date().toISOString().split("T")[0]
                              }T00:00`}
                              className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md focus:outline-none w-full"
                            />
                          </div>

                          {/* Passengers */}
                          <div className="flex-1">
                            <label className="text-md text-[#008cff] mb-1">
                              Seat
                            </label>
                            <select
                              value={segment.passengers}
                              onChange={(e) =>
                                handleSegmentChange(
                                  index,
                                  "passengers",
                                  Number(e.target.value)
                                )
                              }
                              className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md cursor-pointer focus:outline-none w-full"
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

                          {/* Add/Remove City (only on last row) */}
                          {index === segments.length - 1 && (
                            <div className="flex items-center gap-4 w-1/7 mt-2">
                              {index > 0 && (
                                <motion.button
                                  onClick={() => handleRemoveCity(index)}
                                  whileHover={{ scale: 1.1 }}
                                  className="bg-red-600 p-2 rounded-full shadow-md flex items-center justify-center"
                                >
                                  <DeleteIcon className="text-white text-xl" />
                                </motion.button>
                              )}

                              <button
                                onClick={handleAddCity}
                                className="text-[#008cff] border border-[#008cff] py-2 px-4 rounded-md hover:bg-[#008cff] hover:text-white transition"
                              >
                                + Add City
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Optional Banner & Fleet Listing */}
        <BannerSection />
        <FilterAndFleetListing key={refreshKey} />
      </div>
    </>
  );
};
