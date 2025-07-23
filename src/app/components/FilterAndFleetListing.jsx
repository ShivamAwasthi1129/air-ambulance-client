"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { IoIosAirplane } from "react-icons/io";
import FlightCard from "./FleetCard";
import { BsExclamationTriangle } from "react-icons/bs";
const FilterAndFleetListing = ({ refreshKey }) => {
  const [searchData, setSearchData] = useState(null);
  const [segmentStates, setSegmentStates] = useState([]);
  const [currentTripIndex, setCurrentTripIndex] = useState(0);
  const [selectedFleets, setSelectedFleets] = useState([]);
  useEffect(() => {
    try {
      const sessionData = JSON.parse(sessionStorage.getItem("searchData"));
      if (sessionData) {
        setSearchData(sessionData);

        // Initialize segment states
        if (sessionData?.segments?.length) {
          const initialSegmentStates = sessionData.segments.map((seg) => ({
            fleetData: [],
            filteredData: [],
            // IMPORTANT: Start selectedTypes with whatever the user picked in the SearchBar
            selectedTypes: seg.flightTypes || [],
            selectedAmenities: [],
            minPrice: 0,
            maxPrice: 0,
            priceRange: 0,
            minFlightTime: 0,
            maxFlightTime: 0,
            flightTimeRange: 0,
            minMaxSpeed: 0,
            maxMaxSpeed: 0,
            maxSpeedRange: 0,
            loading: true,
            noData: false,
            addOnServices: [],
          }));
          setSegmentStates(initialSegmentStates);

          // Prepare "selected fleets" array
          setSelectedFleets(Array(sessionData.segments.length).fill(null));
        }
      }
    } catch (error) {
      console.error("Error parsing session data:", error);
    }
  }, [refreshKey]);

  // 🔄 unified helper – handles both string airport names and {lat,lng} objects
  function toRapidoParam(
    place // string | {lat:number,lng:number}
  ) {
    if (typeof place === "string") {
      // remove text inside (…) and extra spaces
      const cleaned = place.replace(/\s*\(.*?\)\s*/, "").trim();
      return encodeURIComponent(cleaned);
    }
    // lat/lng object
    return encodeURIComponent(JSON.stringify(place));
  }
  /**
   * Build every Rapido request (and its label) for ONE segment.
   * • Airport → Airport  → keep user-chosen flightTypes.
   * • Any route touching coords → force flightType=Helicopter.
   * • Coordinate part of label =  "lat,lng-(address)"  if address exists,
   *   otherwise just "lat,lng".
   */
  function buildRapidoUrls(seg) {
    /* helpers */
    const stripCode = (s) => s.replace(/\s*\(.*?\)\s*/, "").trim();
    const toRapidoParam = (p) =>
      typeof p === "string"
        ? encodeURIComponent(stripCode(p))
        : encodeURIComponent(JSON.stringify(p));

    const coordOnly = (loc) =>
      `${loc.lat.toFixed(2)},${loc.lng.toFixed(2)}`;

    // 11.93,79.81-(Some Address)
    const fmtPoint = (loc, addr) =>
      addr ? `${coordOnly(loc)}-(${addr})` : coordOnly(loc);

    /* shared query tail */
    const common =
      `departureDate=${seg.departureDate}T${seg.departureTime}:00Z` +
      `&travelerCount=${seg.passengers}`;

    /* assemble one {url,label} object */
    const make = ({ fromArg, toArg, label, heliOnly }) => {
      const fltParam = heliOnly
        ? "&flightType=Helicopter"
        : seg.flightTypes?.length
          ? `&flightType=${encodeURIComponent(seg.flightTypes.join(","))}`
          : "";

      return {
        url: `/api/rapido?from=${fromArg}&to=${toArg}&${common}${fltParam}`,
        label,
      };
    };

    const list = [];

    /* 1️⃣ Airport ➜ Airport */
    if (seg.from && seg.to) {
      list.push(
        make({
          fromArg: toRapidoParam(seg.from),
          toArg: toRapidoParam(seg.to),
          label: `${stripCode(seg.from)} ➜ ${stripCode(seg.to)}`,
          heliOnly: false,
        })
      );
    }

    /* 2️⃣ Coord ➜ Coord */
    if (seg.fromLoc && seg.toLoc) {
      list.push(
        make({
          fromArg: toRapidoParam(seg.fromLoc),
          toArg: toRapidoParam(seg.toLoc),
          label: `${fmtPoint(seg.fromLoc, seg.fromAddress)} ➜ ${fmtPoint(
            seg.toLoc,
            seg.toAddress
          )}`,
          heliOnly: true,
        })
      );
    }

    /* 3️⃣ Airport ➜ Coord */
    // if (seg.from && seg.toLoc) {
    //   list.push(
    //     make({
    //       fromArg: toRapidoParam(seg.from),
    //       toArg: toRapidoParam(seg.toLoc),
    //       label: `${stripCode(seg.from)} ➜ ${fmtPoint(
    //         seg.toLoc,
    //         seg.toAddress
    //       )}`,
    //       heliOnly: true,
    //     })
    //   );
    // }

    /* 4️⃣ (optional) Coord ➜ Airport — uncomment if needed */
    // if (seg.fromLoc && seg.to) {
    //   list.push(
    //     make({
    //       fromArg: toRapidoParam(seg.fromLoc),
    //       toArg: toRapidoParam(seg.to),
    //       label: `${fmtPoint(seg.fromLoc, seg.fromAddress)} ➜ ${stripCode(seg.to)}`,
    //       heliOnly: true,
    //     })
    //   );
    // }

    return list;
  }


  // Fetch data for each segment
  const fetchSegmentFleets = async (segmentIndex) => {
    const seg = searchData.segments[segmentIndex];
    const urlObjs = buildRapidoUrls(seg);           // ← now array of {url,label}

    try {
      const results = await Promise.all(
        urlObjs.map((o) => fetch(o.url).then((r) => (r.ok ? r.json() : null)))
      );

      const fleets = [];
      const addOnServices = [];

      results.forEach((res, i) => {
        if (res?.finalFleet?.length) {
          const label = urlObjs[i].label;           // the human-friendly route
          addOnServices.push(...(res.addOnService || []));
          res.finalFleet.forEach((f) =>
            fleets.push({
              ...f,
              _numericPrice: parseInt(f.totalPrice.replace(/\D/g, ""), 10) || 0,
              _sourceLabel: label,                  // ⭐ keep track of origin
            })
          );
        }
      });

      if (!fleets.length) throw new Error("no-fleets");

      const prices = fleets.map((f) => f._numericPrice);
      const [minP, maxP] = [Math.min(...prices), Math.max(...prices)];
      const flightTimes = fleets.map((f) => {
        const timeStr = f.flightTime || "0h 0m";
        const hours = parseInt(timeStr.match(/(\d+)h/)?.[1] || "0");
        const minutes = parseInt(timeStr.match(/(\d+)m/)?.[1] || "0");
        return hours * 60 + minutes; // Convert to total minutes
      });
      const [minFT, maxFT] = flightTimes.length ? [Math.min(...flightTimes), Math.max(...flightTimes)] : [0, 0];

      const maxSpeeds = fleets.map((f) => parseInt(f.fleetDetails?.maxSpeed || "0"));
      const [minMS, maxMS] = maxSpeeds.length ? [Math.min(...maxSpeeds), Math.max(...maxSpeeds)] : [0, 0];

      setSegmentStates((prev) => {
        const copy = [...prev];
        copy[segmentIndex] = {
          ...copy[segmentIndex],
          fleetData: fleets,
          filteredData: fleets,
          minPrice: minP,
          maxPrice: maxP,
          priceRange: maxP,
          minFlightTime: minFT,
          maxFlightTime: maxFT,
          flightTimeRange: maxFT,
          minMaxSpeed: minMS,
          maxMaxSpeed: maxMS,
          maxSpeedRange: maxMS,
          addOnServices,
          loading: false,
          noData: false,
        };
        return copy;
      });
    } catch (err) {
      setSegmentStates((prev) => {
        const copy = [...prev];
        copy[segmentIndex] = {
          ...copy[segmentIndex],
          fleetData: [],
          filteredData: [],
          loading: false,
          noData: true,
        };
        return copy;
      });
    }
  };

  useEffect(() => {
    if (!searchData?.segments?.length) return;
    searchData.segments.forEach((_, i) => fetchSegmentFleets(i));
  }, [searchData]);




  // Filter logic
  const handleFilterChange = (segmentIndex, newStates) => {
    setSegmentStates((prev) => {
      const updatedStates = [...prev];
      const currentSegment = updatedStates[segmentIndex];
      const { fleetData } = currentSegment;
      const { selectedTypes, selectedAmenities, priceRange, flightTimeRange, maxSpeedRange } = newStates;


      const newFiltered = fleetData.filter((flight) => {
        const withinPrice = flight._numericPrice <= priceRange;

        const flightTimeStr = flight?.flightTime || "0h 0m";
        const hours = parseInt(flightTimeStr.match(/(\d+)h/)?.[1] || "0");
        const minutes = parseInt(flightTimeStr.match(/(\d+)m/)?.[1] || "0");
        const totalMinutes = hours * 60 + minutes;
        const withinFlightTime = totalMinutes <= flightTimeRange;

        // Add max speed filter:
        const flightMaxSpeed = parseInt(flight.fleetDetails?.maxSpeed || "0");
        const withinMaxSpeed = flightMaxSpeed <= maxSpeedRange;
        const matchesType =
          selectedTypes.length === 0 ||
          selectedTypes.includes(flight.fleetDetails?.flightType || "");
        const hasAmenities =
          selectedAmenities.length === 0 ||
          selectedAmenities.every((am) => {
            const val = flight.additionalAmenities?.[am]?.value || "not_available";
            return val !== "not_available";
          });

        return withinPrice && withinFlightTime && withinMaxSpeed && matchesType && hasAmenities;
      });

      updatedStates[segmentIndex] = {
        ...currentSegment,
        ...newStates,
        filteredData: newFiltered,
      };
      return updatedStates;
    });
  };

  const handleClearFilters = (segmentIndex) => {
    setSegmentStates((prev) => {
      const updated = [...prev];
      const segState = updated[segmentIndex];
      updated[segmentIndex] = {
        ...segState,
        // Reset to what it was originally for that segment:
        selectedTypes: searchData.segments[segmentIndex].flightTypes || [],
        selectedAmenities: [],
        priceRange: segState.maxPrice,
        flightTimeRange: segState.maxFlightTime,
        maxSpeedRange: segState.maxMaxSpeed,
        filteredData: segState.fleetData,
      };
      return updated;
    });
  };

  // Selecting Fleets
  const handleFleetSelection = (segmentIndex, flight) => {
    const updated = [...selectedFleets];
    updated[segmentIndex] = flight;
    setSelectedFleets(updated);

    const updatedSearchData = { ...searchData };
    updatedSearchData.segments[segmentIndex].selectedFleet = {
      registrationNo: flight?.fleetDetails?.registrationNo,
      fleetId: flight?._id,
      type: flight?.fleetDetails?.flightType,
      model: flight?.fleetDetails?.selectedModel,
      seatingCapacity: flight?.fleetDetails?.seatCapacity,
      price: flight?.totalPrice,
      time: flight?.flightTime,
      label: flight._sourceLabel,
      // optional: store images, etc.
    };

    setSearchData(updatedSearchData);
    sessionStorage.setItem("searchData", JSON.stringify(updatedSearchData));
  };

  // Next/Prev segment
  const handleNextSegment = () => setCurrentTripIndex((prev) => prev + 1);
  const handlePreviousSegment = () => setCurrentTripIndex((prev) => prev - 1);

  const navigateToEnquiryPage = () => {
    console.log("Proceeding to enquiry with data:", searchData);
    // Or route programmatically, e.g. router.push("/finalEnquiry")
  };

  const isMultiCity = searchData?.tripType === "multicity";
  const tripCount = searchData?.segments?.length || 1;
  const segmentIndex = isMultiCity ? currentTripIndex : 0;
  const currentSegmentState = segmentStates[segmentIndex] || {};

  const {
    selectedTypes = [],
    selectedAmenities = [],
    minPrice = 0,
    maxPrice = 0,
    priceRange = 0,
    minFlightTime = 0,
    maxFlightTime = 0,
    flightTimeRange = 0,
    minMaxSpeed = 0,
    maxMaxSpeed = 0,
    maxSpeedRange = 0,
    fleetData = [],
    filteredData = [],
    loading = false,
    noData = false,
    addOnServices = [],
  } = currentSegmentState;

  // Combine flight types from API data + user-chosen
  const allFlightTypes = useMemo(() => {
    // From the API results
    const fromData = fleetData
      .map((f) => f.fleetDetails?.flightType)
      .filter(Boolean);

    // Ensure user-chosen flight types also appear
    const fromSet = new Set([...fromData, ...selectedTypes]);
    return [...fromSet];
  }, [fleetData, selectedTypes]);
  // ---------- group filtered flights by the label we injected ----------
  const groupedFlights = useMemo(() => {
    const map = {};            // label -> array<flight>
    filteredData.forEach((f) => {
      const label = f._sourceLabel || "Route";
      (map[label] = map[label] || []).push(f);
    });
    return map;                // e.g.  { "SIN ➜ DXB": [..], "SIN ➜ 25.23,55.33":[..] }
  }, [filteredData]);
  // --- list of every label we expect for the CURRENT segment,
  //     even if that label returned 0 fleets --------------------
  const routeLabels = useMemo(() => {
    if (!searchData?.segments?.length) return [];
    return buildRapidoUrls(searchData.segments[segmentIndex]).map(
      (o) => o.label
    );
  }, [searchData, segmentIndex]);



  // Collect all amenities
  const allAmenities = useMemo(() => {
    const amenitySet = new Set();
    fleetData.forEach((f) => {
      if (f.additionalAmenities) {
        Object.entries(f.additionalAmenities).forEach(([am, details]) => {
          if (details?.value !== "not_available") {
            amenitySet.add(am);
          }
        });
      }
    });
    return [...amenitySet];
  }, [fleetData]);

  // Filter handlers
  const onToggleType = (type) => {
    const updated = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    handleFilterChange(segmentIndex, {
      selectedTypes: updated,
      selectedAmenities,
      priceRange,
    });
  };

  const onToggleAmenity = (am) => {
    const updated = selectedAmenities.includes(am)
      ? selectedAmenities.filter((a) => a !== am)
      : [...selectedAmenities, am];
    handleFilterChange(segmentIndex, {
      selectedTypes,
      selectedAmenities: updated,
      priceRange,
    });
  };

  const onPriceChange = (val) => {
    handleFilterChange(segmentIndex, {
      selectedTypes,
      selectedAmenities,
      priceRange: Number(val),
    });
  };
  const onFlightTimeChange = (val) => {
    handleFilterChange(segmentIndex, {
      selectedTypes,
      selectedAmenities,
      priceRange,
      flightTimeRange: Number(val),
      maxSpeedRange,
    });
  };

  const onMaxSpeedChange = (val) => {
    handleFilterChange(segmentIndex, {
      selectedTypes,
      selectedAmenities,
      priceRange,
      flightTimeRange,
      maxSpeedRange: Number(val),
    });
  };

  if (!searchData) {
    return (
      <div className="p-4 space-y-6 w-full max-w-[100rem] h-[30rem] flex flex-col justify-center items-center">
      </div>
    );
  }

  // If loading => skeleton
  if (loading) {
    return (
      <div className="p-4 space-y-6 animate-pulse w-full max-w-6xl mt-40">
        {/* Skeleton UI */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <div className="bg-gray-300 rounded h-6 w-48" />
          <div className="bg-gray-300 rounded h-6 w-60" />
          <div className="bg-gray-300 rounded h-8 w-32" />
        </div>
        {/* etc. (more skeleton placeholders) */}
      </div>
    );
  }

  // If noData => "No fleets"
  if (noData) {
    return (
      <div className="w-full max-w-6xl h-[30rem] flex flex-col justify-center items-center rounded-lg p-8 mt-60">
        <BsExclamationTriangle className="text-7xl text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No fleets available</h2>
        <p className="text-gray-600 text-sm text-center max-w-[40ch]">
          Sorry, we couldn&apos;t find any fleet options for this route or date.
        </p>
      </div>
    );
  }

  // Otherwise, show main UI
  return (
    <div className="relative w-full mx-auto flex flex-col items-start overflow-hidden max-w-[110rem] px-6">
      {/* Top Panel */}
      <div className="w-full py-4">
        <h1 className="text-2xl font-bold text-center text-white">
          ✈️ Select Your Dream Fleet ✈️
        </h1>
        <div className="flex mt-2">
          {/* Selected Fleets */}
          <div className="bg-white p-5 border border-blue-100 rounded-lg shadow-sm w-[35%]">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Selected Fleets</h2>
            {selectedFleets.map((fleet, idx) =>
              fleet ? (
                <p
                  key={idx}
                  className="text-sm text-gray-700 mb-2 border-l-4 border-blue-600 pl-2"
                >
                  Trip {idx + 1}:{" "}
                  <span className="font-medium">
                    {fleet?.fleetDetails?.registrationNo} - (
                    {fleet?.fleetDetails?.selectedModel})
                  </span>
                </p>
              ) : (
                <p
                  key={idx}
                  className="text-sm text-red-500 mb-2 border-l-4 border-red-500 pl-2"
                >
                  Trip {idx + 1}: <span className="font-medium">No Fleet Selected</span>
                </p>
              )
            )}
          </div>

          {/* Summary / Buttons */}
          <div className="bg-white p-5 border border-blue-100 rounded-lg shadow-sm w-full ml-4">
            {/* ONE-WAY */}
            {!isMultiCity && (
              <div>
                <div className="flex items-center"><h3 className="text-lg font-bold text-blue-600 mb-2">Oneway Trip</h3><span className="ml-2 font-bold">SR.No: 635865</span></div>
              
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700 mb-2 flex items-center">
                    {searchData.segments[0]?.from} -----
                    <span className="inline-block mx-1">
                      <IoIosAirplane size={34} />
                    </span>
                    ----- {searchData.segments[0]?.to}
                  </p>
                  <button
                    onClick={() =>
                      handleFleetSelection(0, segmentStates[0]?.filteredData?.[0] || null)
                    }
                    disabled={
                      !!selectedFleets[0] ||
                      segmentStates[0]?.filteredData?.length === 0
                    }
                    className={`py-2 px-4 rounded-md shadow-md text-sm font-medium
                      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all
                      ${!!selectedFleets[0]
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-500 text-white"
                      }
                    `}
                  >
                    {selectedFleets[0] ? "Fleet Selected" : "Select Fleet"}
                  </button>

                  {selectedFleets[0] && (
                    <Link href={"/finalEnquiry"}>
                      <button
                        onClick={navigateToEnquiryPage}
                        className="bg-green-600 text-white py-2 px-4 rounded-md shadow-md 
                          hover:bg-green-500 focus:outline-none focus:ring-2 
                          focus:ring-green-400 focus:ring-offset-2 transition-all text-sm font-medium ml-4"
                      >
                        Proceed to Pay
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* MULTI-CITY */}
            {isMultiCity && (
              <div>
                <h3 className="text-lg font-bold text-blue-600 mb-2">
                  Multicity Trip - Step {currentTripIndex + 1} of {tripCount}
                </h3>
                <p className="text-sm text-gray-700 mb-2 flex items-center">
                  {searchData.segments[currentTripIndex]?.from} -----
                  <span className="inline-block mx-1">
                    <IoIosAirplane size={34} />
                  </span>
                  ----- {searchData.segments[currentTripIndex]?.to}
                </p>

                {currentTripIndex > 0 && (
                  <button
                    onClick={handlePreviousSegment}
                    className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-md shadow-md
                      focus:outline-none focus:ring-2 focus:ring-blue-400
                      focus:ring-offset-2 transition-all text-sm font-medium mr-3"
                  >
                    Go Back
                  </button>
                )}

                {selectedFleets[currentTripIndex] &&
                  currentTripIndex < tripCount - 1 && (
                    <button
                      onClick={handleNextSegment}
                      className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-md shadow-md 
                        focus:outline-none focus:ring-2 focus:ring-blue-400 
                        focus:ring-offset-2 transition-all text-sm font-medium"
                    >
                      Select Next Fleet
                    </button>
                  )}

                {currentTripIndex === tripCount - 1 &&
                  selectedFleets[currentTripIndex] && (
                    <Link href={"/finalEnquiry"}>
                      <button
                        onClick={navigateToEnquiryPage}
                        className="bg-green-600 text-white py-2 px-4 rounded-md shadow-md 
                          hover:bg-green-500 focus:outline-none focus:ring-2 
                          focus:ring-green-400 focus:ring-offset-2 transition-all text-sm font-medium ml-2"
                      >
                        Proceed to Pay
                      </button>
                    </Link>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Filters + Fleet Listing (for current trip/segment) */}
      <div className="flex w-full ">
        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-[25%] p-6 bg-white px-10 mr-4 border border-blue-100 rounded-xl"
        >
          <div className="flex items-center justify-between mb-6 border-b pb-2">
            <motion.h2
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-gray-800"
            >
              <p>Filter Options</p>
              {isMultiCity && ` Trip ${currentTripIndex + 1}`}
            </motion.h2>
            <button
              onClick={() => handleClearFilters(segmentIndex)}
              className="text-red-500 text-sm hover:text-red-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>

          {/* Flight Type */}
          <div className="mb-6">
            <p className="font-semibold text-gray-700 mb-3">Flight Type</p>
            <div className="space-y-2">
              {allFlightTypes.map((type) => {
                const count = filteredData.filter(
                  (f) => f.fleetDetails?.flightType === type
                ).length;
                return (
                  <label
                    key={type}
                    className="inline-flex items-center space-x-2 cursor-pointer mr-4"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => onToggleType(type)}
                      className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
                    />
                    <span className="text-sm text-gray-600">
                      {type} ({count})
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <p className="font-semibold text-gray-700 mb-3">
              Price Range:{" "}
              <span className="text-blue-600 font-bold">
                ${minPrice.toLocaleString()}
              </span>
              {" - "}
              <span className="text-blue-600 font-bold">
                ${priceRange.toLocaleString()}
              </span>
            </p>
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange}
              onChange={(e) => onPriceChange(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              style={{
                background: `linear-gradient(to right, #3b82f6 ${((priceRange - minPrice) / (maxPrice - minPrice)) * 100
                  }%, #e5e7eb ${((priceRange - minPrice) / (maxPrice - minPrice)) * 100
                  }%)`,
              }}
            />
            {priceRange !== maxPrice && (
              <div className="mt-2 text-sm text-blue-700 font-medium">
                Selected Price: ${priceRange.toLocaleString()}
              </div>
            )}
          </div>
          {/* Flight Time Range */}
          <div className="mb-6">
            <p className="font-semibold text-gray-700 mb-3">
              Flight Time Range:{" "}
              <span className="text-blue-600 font-bold">
                {Math.floor(minFlightTime / 60)}h {minFlightTime % 60}m
              </span>
              {" - "}
              <span className="text-blue-600 font-bold">
                {Math.floor(flightTimeRange / 60)}h {flightTimeRange % 60}m
              </span>
            </p>
            <input
              type="range"
              min={minFlightTime}
              max={maxFlightTime}
              value={flightTimeRange}
              onChange={(e) => onFlightTimeChange(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
       focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              style={{
                background: `linear-gradient(to right, #3b82f6 ${((flightTimeRange - minFlightTime) / (maxFlightTime - minFlightTime)) * 100}%, #e5e7eb ${((flightTimeRange - minFlightTime) / (maxFlightTime - minFlightTime)) * 100}%)`,
              }}
            />
          </div>

          {/* Max Speed Range */}
          <div className="mb-6">
            <p className="font-semibold text-gray-700 mb-3">
              Max Speed Range:{" "}
              <span className="text-blue-600 font-bold">
                {minMaxSpeed} km
              </span>
              {" - "}
              <span className="text-blue-600 font-bold">
                {maxSpeedRange} km
              </span>
            </p>
            <input
              type="range"
              min={minMaxSpeed}
              max={maxMaxSpeed}
              value={maxSpeedRange}
              onChange={(e) => onMaxSpeedChange(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
       focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              style={{
                background: `linear-gradient(to right, #3b82f6 ${((maxSpeedRange - minMaxSpeed) / (maxMaxSpeed - minMaxSpeed)) * 100}%, #e5e7eb ${((maxSpeedRange - minMaxSpeed) / (maxMaxSpeed - minMaxSpeed)) * 100}%)`,
              }}
            />
          </div>

          {/* Amenities */}
          <div>
            <p className="font-semibold text-gray-700 mb-3">In Flight Amenities</p>
            <div className="flex flex-wrap gap-4 items-center">
              {allAmenities.map((amenity) => {
                const checked = selectedAmenities.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className="inline-flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleAmenity(amenity)}
                      className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
                    />
                    <span className="text-sm text-gray-600">{amenity}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </motion.div>


        {/* Fleet Listing Section */}
        <div className="w-full bg-white flex flex-col items-center p-4 border border-blue-100 rounded-xl">
          {routeLabels.map((label) => {
            const flights = groupedFlights[label] || [];
            // console.log("label : ",label);
            return (
              <div key={label} className="mb-10 w-full">
                <h3 className="text-lg font-bold flex items-center">{label}</h3>

                <p className="text-neutral-800 text-xl mb-4">
                  Recommending flights based on convenience and fare
                </p>

                {flights.length === 0 ? (
                  /* ---- empty-state card ---- */
                  <div className="w-full bg-gray-100 border border-dashed border-gray-400
                          p-6 rounded-lg flex flex-col items-center justify-center">
                    <BsExclamationTriangle className="text-4xl text-gray-400 mb-2" />
                    <p className="text-md text-gray-700 font-medium text-center">
                      No fleet available&nbsp;for&nbsp;
                      <span className="font-semibold">{label}</span>
                    </p>
                  </div>
                ) : (
                  /* ---- normal card list ---- */
                  <FlightCard
                    filteredData={flights}
                    onSelectFleet={(flight) => handleFleetSelection(segmentIndex, flight)}
                    selectedFleet={selectedFleets[segmentIndex]}
                    onNextSegment={handleNextSegment}
                    currentTripIndex={currentTripIndex}
                    tripCount={tripCount}
                    isMultiCity={isMultiCity}
                    addOnServices={addOnServices}
                    segment={searchData.segments[segmentIndex]}
                    label={label}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterAndFleetListing;
