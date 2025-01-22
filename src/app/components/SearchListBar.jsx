"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterAndFleetListing from "../components/FilterAndFleetListing";

export const SearchBar = () => {
  const [airports, setAirports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedSegmentIndex, setFocusedSegmentIndex] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Flight type, default oneway
  const [tripType, setTripType] = useState("oneway");

  // Trigger re-render of FilterAndFleetListing
  const [refreshKey, setRefreshKey] = useState(0);

  // Show/hide multi-city form
  const [showMultiCityDetails, setShowMultiCityDetails] = useState(false);

  // collapse multi-city after confirm
  const [isMultiCityCollapsed, setIsMultiCityCollapsed] = useState(false);

  // Flight segments
  const [segments, setSegments] = useState([
    {
      from: "Indira Gandhi International Airport (DEL)",
      to: "Heathrow Airport (LHR)",
      departureDate: new Date().toISOString().split("T")[0],
      departureTime: "12:00",
      passengers: 1,
    },
  ]);

  // If you want to store "global" passenger data
  const [formData, setFormData] = useState({ passengers: 1 });

  // We'll store user contact info & IP data here
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // IP data from "https://ipinfo.io/json"
  const [ipData, setIpData] = useState(null);

  // For the "search" modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // === containerRef for entire search bar ===
  const containerRef = useRef(null);

  // =============== 1) Outside Click to Collapse or Inside Click to Expand (Multicity) ===============
  useEffect(() => {
    function handleDocClick(e) {
      if (!containerRef.current) return;

      const clickedInside = containerRef.current.contains(e.target);

      // Only apply this logic for multi-city
      if (tripType === "multicity") {
        if (clickedInside) {
          // If currently collapsed, expand
          if (isMultiCityCollapsed) {
            setIsMultiCityCollapsed(false);
          }
        } else {
          // Clicked outside
          // If currently expanded, collapse
          if (!isMultiCityCollapsed) {
            setIsMultiCityCollapsed(true);
          }
        }
      }
    }

    document.addEventListener("mousedown", handleDocClick);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
    };
  }, [tripType, isMultiCityCollapsed]);

  // =============== 2) Outside click logic for Airport Dropdown ===============
  useEffect(() => {
    function handleClickOutside(e) {
      // If dropdown is open and click is outside the container => close dropdown
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

  // =============== 3) Load from sessionStorage on mount ===============
  useEffect(() => {
    const savedSearchData = sessionStorage.getItem("searchData");
    if (savedSearchData) {
      const parsedData = JSON.parse(savedSearchData);
      setTripType(parsedData.tripType);
      setSegments(parsedData.segments);

      // If they previously had multi-city, show the form
      if (parsedData.tripType === "multicity") {
        setShowMultiCityDetails(true);
      }
    }
  }, []);

  // =============== 4) Save to sessionStorage whenever tripType/segments changes ===============
  useEffect(() => {
    const partialData = { tripType, segments };
    sessionStorage.setItem("searchData", JSON.stringify(partialData));
  }, [tripType, segments]);

  // =============== 5) Fetch airports on keystroke ===============
  useEffect(() => {
    async function fetchAirports() {
      try {
        if (!searchQuery) return; // Only fetch if not empty
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
  // (A) Trip Type
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
          passengers: formData.passengers,
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

  // (B) Changing a segment field
  const handleSegmentChange = (index, field, value) => {
    const updatedSegments = [...segments];
    updatedSegments[index][field] = value;
    setSegments(updatedSegments);

    // Sync passenger count for one-way
    if (field === "passengers" && tripType === "oneway") {
      setFormData({ ...formData, passengers: value });
      updatedSegments[0].passengers = value;
      setSegments(updatedSegments);
    }

    // If user types in "from" or "to," show dropdown
    if (field === "from" || field === "to") {
      setSearchQuery(value);
      setFocusedSegmentIndex(index);
      setFocusedField(field);
      setShowDropdown(true);
    }
  };

  // (C) Selecting an airport from dropdown
  const handleSelectAirport = (airport) => {
    if (focusedSegmentIndex === null || !focusedField) return;
    const label = `${airport.name} (${airport.iata_code})`;
    handleSegmentChange(focusedSegmentIndex, focusedField, label);
    setShowDropdown(false);
    setFocusedSegmentIndex(null);
    setFocusedField(null);
    setSearchQuery("");
  };

  // (D) Swap from/to (only relevant for one-way)
  const handleSwap = (index) => {
    const updated = [...segments];
    const temp = updated[index].from;
    updated[index].from = updated[index].to;
    updated[index].to = temp;
    setSegments(updated);
  };

  // (E) Add Multi-City Segment
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

  // (F) Remove Multi-City Segment
  const handleRemoveCity = (index) => {
    setSegments((prev) => prev.filter((_, i) => i !== index));
  };

  // ================== 2-STEP SEARCH (MODAL) ==================
  // Step 1: open modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Check if user info is complete
  const isUserInfoComplete = userInfo.name && userInfo.email && userInfo.phone;

  // Step 2: confirm => fetch IP, store, **AND** send to /api/query
  const handleModalConfirm = async () => {
    try {
      // 1) Fetch IP data
      const res = await fetch("https://ipinfo.io/json");
      const ipResult = await res.json();
      setIpData(ipResult);

      // 2) Combine user & IP data
      const finalUserObject = {
        ...userInfo,
        ...ipResult,
      };

      // 3) Build final search data
      const finalSearchData = {
        tripType,
        segments,
        userInfo: finalUserObject,
      };

      // 4) Store in session
      sessionStorage.setItem("searchData", JSON.stringify(finalSearchData));

      // --- NEW PART: Console the payload and send POST request to /api/query ---
      console.log("Final Payload to /api/query:", finalSearchData);

      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalSearchData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Response from /api/query:", result);
      // --- END NEW PART ---

      // 5) Close modal
      setIsModalOpen(false);

      // 6) Trigger re-render
      setRefreshKey((prev) => prev + 1);

      // 7) If multi-city => collapse
      if (tripType === "multicity") {
        setIsMultiCityCollapsed(true);
      }
    } catch (err) {
      console.error("Error fetching IP data or sending data:", err);
      // handle error if needed
    }
  };

  // ================== RENDER ==================
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-full mb-8 sticky top-0 z-30"
        ref={containerRef}
      >
        {tripType === "multicity" && isMultiCityCollapsed ? (
          // ===================== COLLAPSED MULTI-CITY =====================
          <div className="bg-[#041422] p-4 rounded-lg shadow-md flex flex-col gap-4 w-full relative">
            <div className="flex flex-wrap items-center justify-start gap-4 w-full">
              {/* Trip Type */}
              <div className="relative w-1/4 min-w-[150px]">
                <label className="text-md text-[#008cff] mb-1 block">Trip Type</label>
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
                <label className="text-md text-[#008cff] mb-1">From (Trip 1)</label>
                <input
                  type="text"
                  className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md 
                             focus:outline-none w-full"
                  value={segments[0]?.from || ""}
                  placeholder="Type departure airport..."
                  onChange={(e) => handleSegmentChange(0, "from", e.target.value)}
                />
              </div>

              <span className="text-sm text-gray-300 italic">
                (Currently collapsed, click inside to expand...)
              </span>
            </div>
          </div>
        ) : (
          // ===================== FULL BAR (ONEWAY or MULTICITY expanded) =====================
          <div className="bg-[#041422] p-6 py-3 rounded-lg shadow-md flex flex-col items-center gap-4 relative w-full">
            {/* Top Row: Trip Type + Possibly Oneway Fields */}
            <div className="flex flex-wrap items-end justify-between gap-4 w-full pb-1">
              {/* Trip Type */}
              <div className="relative flex-2">
                <label className="text-md text-[#008cff] mb-1 block">Trip Type</label>
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

              {/* ONE-WAY fields */}
              {tripType === "oneway" && (
                <>
                  {/* FROM */}
                  <div className="flex-1 relative">
                    <label className="text-md text-[#008cff] mb-1">From</label>
                    <input
                      type="text"
                      className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md focus:outline-none w-full"
                      value={segments[0].from}
                      onChange={(e) => handleSegmentChange(0, "from", e.target.value)}
                      placeholder="Type departure airport..."
                    />

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
                      onChange={(e) => handleSegmentChange(0, "to", e.target.value)}
                      placeholder="Type destination airport..."
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

                  {/* Date/Time */}
                  <div className="flex-1">
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
                      className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md focus:outline-none w-full"
                    />
                  </div>

                  {/* Passengers + "Search" */}
                  <div className="flex items-end gap-3 flex-1">
                    <div className="w-full">
                      <label className="text-md text-[#008cff] mb-1">Passengers</label>
                      <select
                        value={segments[0].passengers}
                        onChange={(e) =>
                          handleSegmentChange(0, "passengers", Number(e.target.value))
                        }
                        className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md cursor-pointer focus:outline-none w-full"
                      >
                        {[...Array(10).keys()].map((num) => (
                          <option className="text-black" key={num + 1} value={num + 1}>
                            {num + 1} Passenger{num > 0 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    <motion.button
                      onClick={handleOpenModal}
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:from-blue-600 hover:to-blue-400 transition-all"
                    >
                      SEARCH
                    </motion.button>
                  </div>
                </>
              )}
            </div>

            {/* MultiCity UI (expanded) */}
            {tripType === "multicity" && showMultiCityDetails && (
              <>
                {segments.map((segment, index) => (
                  <div
                    key={index}
                    className="flex flex-wrap items-end justify-between gap-6 w-full rounded-lg shadow-md mt-3"
                  >
                    <h3 className="text-lg text-[#008cff] font-semibold">
                      Trip {index + 1}:
                    </h3>

                    {/* FROM */}
                    <div className="flex-1 relative">
                      <label className="text-md text-[#008cff] mb-1">From</label>
                      <input
                        type="text"
                        className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md focus:outline-none w-full"
                        value={segment.from}
                        onChange={(e) => handleSegmentChange(index, "from", e.target.value)}
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
                                  {airport.name} • {airport.iata_code || "N/A"}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>

                    {/* TO */}
                    <div className="flex-1 relative">
                      <label className="text-md text-[#008cff] mb-1">To</label>
                      <input
                        type="text"
                        className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md focus:outline-none w-full"
                        value={segment.to}
                        onChange={(e) => handleSegmentChange(index, "to", e.target.value)}
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
                                  {airport.name} • {airport.iata_code || "N/A"}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>

                    {/* DATE/TIME */}
                    <div className="flex-1">
                      <label className="text-md text-[#008cff] mb-1">Date &amp; Time</label>
                      <input
                        type="datetime-local"
                        value={`${segment.departureDate}T${segment.departureTime || "12:00"}`}
                        onChange={(e) => {
                          const [date, time] = e.target.value.split("T");
                          handleSegmentChange(index, "departureDate", date);
                          handleSegmentChange(index, "departureTime", time);
                        }}
                        min={`${new Date().toISOString().split("T")[0]}T00:00`}
                        className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md focus:outline-none w-full"
                      />
                    </div>

                    {/* Passengers + SEARCH (last segment only) */}
                    <div className="flex items-end gap-3 flex-1">
                      <div className="w-full">
                        <label className="text-md text-[#008cff] mb-1">Passengers</label>
                        <select
                          value={segment.passengers}
                          onChange={(e) =>
                            handleSegmentChange(index, "passengers", Number(e.target.value))
                          }
                          className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md cursor-pointer focus:outline-none w-full"
                        >
                          {[...Array(10).keys()].map((num) => (
                            <option className="text-black" key={num + 1} value={num + 1}>
                              {num + 1} Passenger{num > 0 ? "s" : ""}
                            </option>
                          ))}
                        </select>
                      </div>

                      {index === segments.length - 1 && (
                        <motion.button
                          onClick={handleOpenModal}
                          whileHover={{ scale: 1.05 }}
                          className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:from-blue-600 hover:to-blue-400 transition-all"
                        >
                          SEARCH
                        </motion.button>
                      )}
                    </div>

                    {/* Add/Remove City (last row) */}
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
          </div>
        )}
      </div>

      {/* Rerender listing when refreshKey changes */}
      <FilterAndFleetListing key={refreshKey} />

      {/* =================== MODAL for Name/Email/Phone =================== */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black bg-opacity-60">
          <div className="bg-white p-6 rounded-lg w-80 shadow-md relative">
            <h2 className="text-xl font-semibold mb-4">Enter Your Info</h2>

            {/* Name */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={userInfo.name}
                onChange={(e) =>
                  setUserInfo((prev) => ({ ...prev, name: e.target.value }))
                }
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={userInfo.email}
                onChange={(e) =>
                  setUserInfo((prev) => ({ ...prev, email: e.target.value }))
                }
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={userInfo.phone}
                onChange={(e) =>
                  setUserInfo((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="mr-3 text-red-500 hover:text-red-600 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleModalConfirm}
                disabled={!isUserInfoComplete}
                className={`px-4 py-2 rounded text-white font-semibold ${
                  !isUserInfoComplete
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
