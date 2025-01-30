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

  // --------------------------------------------------
  // 1. Load session data at top level (unconditional)
  // --------------------------------------------------
  useEffect(() => {
    try {
      const sessionData = JSON.parse(sessionStorage.getItem("searchData"));
      if (sessionData) {
        setSearchData(sessionData);

        // Initialize segment states
        if (sessionData?.segments?.length) {
          const initialSegmentStates = sessionData.segments.map(() => ({
            fleetData: [],
            filteredData: [],
            selectedTypes: [],
            selectedAmenities: [],
            minPrice: 0,
            maxPrice: 0,
            priceRange: 0,
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

  function cleanAirportName(str) {
    return str.replace(/\s*\(.*?\)\s*/, "").trim();
  }

  // --------------------------------------------------
  // 2. Fetch data for each segment (unconditional)
  // --------------------------------------------------
  useEffect(() => {
    if (!searchData?.segments?.length) return;

    const fetchSegmentFleets = async (segmentIndex) => {
      const segment = searchData.segments[segmentIndex];
      const cleanedFrom = cleanAirportName(segment.from);
      const cleanedTo = cleanAirportName(segment.to);
      const url = `/api/search-flights?from=${cleanedFrom}&to=${cleanedTo}&departureDate=${segment.departureDate}&travelerCount=${segment.passengers}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data?.finalFleet) {
          const withParsedPrices = data.finalFleet.map((flight) => {
            const numeric = parseInt(flight.totalPrice.replace(/\D/g, ""), 10) || 0;
            return { ...flight, _numericPrice: numeric };
          });
          const prices = withParsedPrices.map((f) => f._numericPrice);
          const minP = Math.min(...prices);
          const maxP = Math.max(...prices);

          setSegmentStates((prev) => {
            const newState = [...prev];
            newState[segmentIndex] = {
              ...newState[segmentIndex],
              fleetData: withParsedPrices,
              filteredData: withParsedPrices,
              minPrice: minP,
              maxPrice: maxP,
              priceRange: maxP,
            };
            return newState;
          });
        }
      } catch (error) {
        console.error(`Error fetching data for segment ${segmentIndex}:`, error);
      }
    };

    searchData.segments.forEach((_, i) => fetchSegmentFleets(i));
  }, [searchData]);

  // --------------------------------------------------
  // 3. Filter logic for the current segment
  // --------------------------------------------------
  const handleFilterChange = (segmentIndex, newStates) => {
    setSegmentStates((prev) => {
      const updatedStates = [...prev];
      const currentSegment = updatedStates[segmentIndex];
      const { fleetData } = currentSegment;

      const { selectedTypes, selectedAmenities, priceRange } = newStates;

      const newFiltered = fleetData.filter((flight) => {
        const withinPrice = flight._numericPrice <= priceRange;
        const matchesType =
          selectedTypes.length === 0 ||
          selectedTypes.includes(flight.fleetDetails?.flightType || "");
        const hasAmenities =
          selectedAmenities.length === 0 ||
          selectedAmenities.every((am) => {
            const val = flight.additionalAmenities?.[am]?.value || "not_available";
            return val !== "not_available";
          });
        return withinPrice && matchesType && hasAmenities;
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
        selectedTypes: [],
        selectedAmenities: [],
        priceRange: segState.maxPrice,
        filteredData: segState.fleetData,
      };
      return updated;
    });
  };

  // --------------------------------------------------
  // 4. Selecting Fleets
  // --------------------------------------------------
  const handleFleetSelection = (segmentIndex, flight) => {
    const updated = [...selectedFleets];
    updated[segmentIndex] = flight;
    setSelectedFleets(updated);

    const updatedSearchData = { ...searchData };
    updatedSearchData.segments[segmentIndex].selectedFleet = {
      name: flight?.fleetDetails?.registrationNo,
      model: flight?.fleetDetails?.flightType,
    };
    setSearchData(updatedSearchData);
    sessionStorage.setItem("searchData", JSON.stringify(updatedSearchData));
  };

  // Move to next segment
  const handleNextSegment = () => {
    setCurrentTripIndex((prev) => prev + 1);
  };

  // NEW: Move to previous segment (Back button)
  const handlePreviousSegment = () => {
    setCurrentTripIndex((prev) => prev - 1);
  };

  const navigateToEnquiryPage = () => {
    console.log("Proceeding to enquiry with data:", searchData);
    // e.g. route to /finalEnquiry
  };

  // --------------------------------------------------
  // 5. Precompute derived values (unconditional)
  // --------------------------------------------------
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
    fleetData = [],
    filteredData = [],
  } = currentSegmentState;

  const allFlightTypes = useMemo(() => {
    return [...new Set(fleetData.map((f) => f.fleetDetails?.flightType).filter(Boolean))];
  }, [fleetData]);

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

  // Handlers for current segment
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

  // --------------------------------------------------
  // 6. Return the appropriate UI
  // --------------------------------------------------

  // If no searchData yet, show a loading skeleton. The Hook order is preserved.
  if (!searchData) {
    return (
      <div className="p-4 space-y-6 animate-pulse w-full">
        <div className="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0 md:items-center">
          <div className="bg-gray-300 rounded h-6 w-48" />
          <div className="bg-gray-300 rounded h-6 w-60" />
          <div className="bg-gray-300 rounded h-8 w-32" />
        </div>
        <div className="bg-gray-300 rounded h-6 w-72" />
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4 space-y-4">
            <div className="bg-gray-300 rounded h-6 w-32" />
            <div className="bg-gray-300 rounded h-4 w-full" />
            <div className="bg-gray-300 rounded h-4 w-3/4" />
            <div className="bg-gray-300 rounded h-4 w-2/3" />
            <div className="bg-gray-300 rounded h-4 w-3/4" />
            <div className="bg-gray-300 rounded h-4 w-1/2" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="bg-gray-300 rounded h-20 w-32" />
              <div className="flex-1 space-y-2 ml-4">
                <div className="bg-gray-300 rounded h-4 w-1/2" />
                <div className="bg-gray-300 rounded h-4 w-1/3" />
                <div className="bg-gray-300 rounded h-4 w-1/4" />
              </div>
              <div className="bg-gray-300 rounded h-6 w-16 ml-4" />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="bg-gray-300 rounded h-4 w-24" />
              <div className="bg-gray-300 rounded h-4 w-32" />
              <div className="bg-gray-300 rounded h-4 w-20" />
              <div className="bg-gray-300 rounded h-4 w-28" />
            </div>
            <div className="flex gap-4">
              <div className="bg-gray-300 rounded h-8 w-24" />
              <div className="bg-gray-300 rounded h-8 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main UI
  return (
    <div className="relative w-full mx-auto flex flex-col items-start overflow-hidden shadow-lg">
      {/* Top Panel */}
      <div className="w-full p-6 pt-2 bg-gray-50 border shadow-lg">
        <h1 className="text-2xl font-bold text-center text-blue-700">
          Fleet Selection Panel
        </h1>

        <div className="flex mt-2">
          {/* Selected Fleets */}
          <div className="bg-white p-5 border border-blue-100 rounded-lg shadow-sm w-[35%]">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Selected Fleets
            </h2>
            {selectedFleets.map((fleet, idx) =>
              fleet ? (
                <p
                  key={idx}
                  className="text-sm text-gray-700 mb-2 border-l-4 border-blue-600 pl-2"
                >
                  Trip {idx + 1}:{" "}
                  <span className="font-medium">
                    {fleet?.fleetDetails?.registrationNo} - (
                    {fleet?.fleetDetails?.flightType})
                  </span>
                </p>
              ) : (
                <p
                  key={idx}
                  className="text-sm text-red-500 mb-2 border-l-4 border-red-500 pl-2"
                >
                  Trip {idx + 1}:{" "}
                  <span className="font-medium">No Fleet Selected</span>
                </p>
              )
            )}
          </div>

          {/* Fleet Selection Summary / Buttons */}
          <div className="bg-white p-5 border border-blue-100 rounded-lg shadow-sm w-full ml-4">
            {/* ONE-WAY */}
            {!isMultiCity && (
              <div>
                <h3 className="text-lg font-bold text-blue-600 mb-2">
                  Oneway Trip
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700 mb-2 flex items-center">
                    {searchData.segments[0]?.from} ------
                    <span className="inline-block mx-1">
                      <IoIosAirplane size={34} />
                    </span>
                    ----- {searchData.segments[0]?.to}
                  </p>

                  <button
                    onClick={() =>
                      handleFleetSelection(
                        0,
                        segmentStates[0]?.filteredData?.[0] || null
                      )
                    }
                    disabled={
                      !!selectedFleets[0] ||
                      segmentStates[0]?.filteredData?.length === 0
                    }
                    className={`
                      py-2 px-4 rounded-md shadow-md text-sm font-medium
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
                        Proceed to Enquiry
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
                  {searchData.segments[currentTripIndex]?.from} ------
                  <span className="inline-block mx-1">
                    <IoIosAirplane size={34} />
                  </span>
                  ----- {searchData.segments[currentTripIndex]?.to}
                </p>

                {/* NEW: "Go Back" button, only if not on the first segment */}
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

                {/* "Select Next Fleet" when fleet is chosen and not on last segment */}
                {selectedFleets[currentTripIndex] && currentTripIndex < tripCount - 1 && (
                  <button
                    onClick={handleNextSegment}
                    className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-md shadow-md 
                      focus:outline-none focus:ring-2 focus:ring-blue-400 
                      focus:ring-offset-2 transition-all text-sm font-medium"
                  >
                    Select Next Fleet
                  </button>
                )}

                {/* If on the last segment and a fleet is selected, "Proceed to Enquiry" */}
                {currentTripIndex === tripCount - 1 &&
                  selectedFleets[currentTripIndex] && (
                    <Link href={"/finalEnquiry"}>
                      <button
                        onClick={navigateToEnquiryPage}
                        className="bg-green-600 text-white py-2 px-4 rounded-md shadow-md 
                          hover:bg-green-500 focus:outline-none focus:ring-2 
                          focus:ring-green-400 focus:ring-offset-2 transition-all text-sm font-medium ml-2"
                      >
                        Proceed to Enquiry
                      </button>
                    </Link>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Filters + Fleet Listing (for current trip/segment) */}
      <div className="flex w-full">
        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-[30%] bg-gray-100 p-4 border-r border-gray-300"
        >
          {/* Filter Header */}
          <div className="flex items-center justify-between mb-4">
            <motion.h2
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-xl font-bold text-gray-700"
            >
              Filter Options
              {isMultiCity && ` (Trip ${currentTripIndex + 1})`}
            </motion.h2>

            <button
              onClick={() => handleClearFilters(segmentIndex)}
              className="text-red-600 text-sm underline hover:text-red-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>

          {/* Flight Type Checkboxes */}
          <div className="space-y-4">
            {allFlightTypes.map((type) => {
              const count = fleetData.filter(
                (f) => f.fleetDetails?.flightType === type
              ).length;
              return (
                <motion.div
                  key={type}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => onToggleType(type)}
                    className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
                  />
                  <label className="text-gray-600 cursor-pointer">
                    {type} ({count})
                  </label>
                </motion.div>
              );
            })}
          </div>

          {/* Price Range Slider */}
          <div className="mt-6">
            <label className="block text-gray-600 font-semibold mb-4">
              Price Range:{" "}
              <span className="text-blue-600 font-bold">
                ${minPrice.toLocaleString()}
              </span>
              {" - "}
              <span className="text-blue-600 font-bold">
                ${priceRange.toLocaleString()}
              </span>
            </label>
            <div className="relative w-full">
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={priceRange}
                onChange={(e) => onPriceChange(e.target.value)}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  background: `linear-gradient(to right, #3b82f6 ${((priceRange - minPrice) / (maxPrice - minPrice)) * 100
                    }%, #e5e7eb ${((priceRange - minPrice) / (maxPrice - minPrice)) * 100
                    }%)`,
                }}
              />
            </div>
            {priceRange !== maxPrice && (
              <div className="mt-4 p-2 bg-blue-100 text-blue-800 rounded-lg shadow-md text-sm font-medium">
                Selected Price: ${priceRange.toLocaleString()}
              </div>
            )}
          </div>

          {/* Amenities Filter */}
          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2">Available Services</h3>
            {allAmenities.map((amenity) => {
              const checked = selectedAmenities.includes(amenity);
              return (
                <motion.div
                  key={amenity}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleAmenity(amenity)}
                    className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
                  />
                  <label className="text-gray-600 cursor-pointer">
                    {amenity}
                  </label>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Fleet Listing Section */}
        <div className="w-full bg-white flex flex-col items-center p-4">
          <div className="mb-10 w-full">
            <h3 className="text-lg font-bold mb-2 flex">
              Trip {segmentIndex + 1}: {searchData.segments[segmentIndex].from}
              ------
              <span className="inline-block mx-1">
                <IoIosAirplane size={34} />
              </span>
              ------
              {searchData.segments[segmentIndex].to}
            </h3>

            {filteredData.length === 0 ? (
              // This is the "empty card" or message
              <div className="flex flex-col items-center justify-center mt-10">
                <BsExclamationTriangle className="text-5xl text-gray-400 mb-2" />
                <p className="text-lg text-gray-600">No fleets available</p>
              </div>
            ) : (
              // Otherwise, render FlightCard for each fleet
              filteredData.map((flight) => (
                <FlightCard
                  key={flight.serialNumber}
                  filteredData={[flight]}
                  onSelectFleet={(selectedFleet) =>
                    handleFleetSelection(segmentIndex, selectedFleet)
                  }
                  selectedFleet={selectedFleets[segmentIndex]}
                  tripType={searchData.tripType}
                  segment={searchData.segments[segmentIndex]}
                />
              ))
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterAndFleetListing;
