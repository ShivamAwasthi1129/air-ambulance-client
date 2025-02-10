"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { IoIosAirplane } from "react-icons/io";
import FlightCard from "./FleetCard";
import { BsExclamationTriangle } from "react-icons/bs";
import Image from "next/image";

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
            loading: true,
            noData: false, // <-- NEW: Will indicate if 400/no data
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
    // remove anything in parentheses + extra spaces
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

        // If 400 => No data. Set noData = true, skip parsing
        if (response.status === 400) {
          setSegmentStates((prev) => {
            const newState = [...prev];
            newState[segmentIndex] = {
              ...newState[segmentIndex],
              fleetData: [],
              filteredData: [],
              loading: false,
              noData: true, // <-- Mark that no data was returned
            };
            return newState;
          });
          return; // Stop here
        }

        const data = await response.json();
        if (data?.finalFleet) {
          const withParsedPrices = data.finalFleet.map((flight) => {
            const numeric = parseInt(
              flight.totalPrice.replace(/\D/g, ""),
              10
            ) || 0;
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
              loading: false,
              noData: false, // Data is there
            };
            return newState;
          });
        } else {
          // If finalFleet is empty or missing, mark no data:
          setSegmentStates((prev) => {
            const newState = [...prev];
            newState[segmentIndex] = {
              ...newState[segmentIndex],
              fleetData: [],
              filteredData: [],
              loading: false,
              noData: true,
            };
            return newState;
          });
        }
      } catch (error) {
        console.error(`Error fetching data for segment ${segmentIndex}:`, error);
        // If fetch fails, also set noData to avoid infinite skeleton
        setSegmentStates((prev) => {
          const newState = [...prev];
          newState[segmentIndex] = {
            ...newState[segmentIndex],
            fleetData: [],
            filteredData: [],
            loading: false,
            noData: true,
          };
          return newState;
        });
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
      registrationNo: flight?.fleetDetails?.registrationNo,
      type: flight?.fleetDetails?.flightType,
      model: flight?.fleetDetails?.selectedModel,
      time: flight?.flightTime,
    };
    setSearchData(updatedSearchData);
    sessionStorage.setItem("searchData", JSON.stringify(updatedSearchData));
  };

  // Move to next segment
  const handleNextSegment = () => {
    setCurrentTripIndex((prev) => prev + 1);
  };

  // Move to previous segment
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
    loading = false,
    noData = false, // <-- NEW: indicates no data (400 or empty finalFleet)
  } = currentSegmentState;

  // Distinct flight types
  const allFlightTypes = useMemo(() => {
    return [
      ...new Set(fleetData.map((f) => f.fleetDetails?.flightType).filter(Boolean)),
    ];
  }, [fleetData]);

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

  // Handlers for the current segment filters
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
  // 6. Conditional Rendering
  // --------------------------------------------------

  // A) If no searchData yet => "register & search"
  if (!searchData) {
    return (
      <div className="p-4 space-y-6 w-full max-w-[100rem] h-[30rem] flex flex-col justify-center items-center">
        {/* <p className="text-3xl text-gray-700">
          Register yourself and start search
        </p>
        <Image
          src="https://cdn.pixabay.com/animation/2024/04/21/07/07/07-07-59-513_512.gif"
          alt="Loading..."
          width={600}
          height={100}
        /> */}
      </div>
    );
  }

  // B) If the current segment is still "loading" => skeleton
  if (loading) {
    return (
      <div className="p-4 space-y-6 animate-pulse w-full max-w-[100rem]">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <div className="bg-gray-300 rounded h-6 w-48" />
          <div className="bg-gray-300 rounded h-6 w-60" />
          <div className="bg-gray-300 rounded h-8 w-32" />
        </div>
        <div className="bg-gray-300 rounded h-6 w-3/4" />
        <div className="bg-gray-300 rounded h-4 w-1/2" />

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4 space-y-4">
            <div className="bg-gray-300 rounded h-6 w-36" />
            <div className="bg-gray-300 rounded h-4 w-1/2" />
            <div className="bg-gray-300 rounded h-4 w-3/4" />
            <div className="bg-gray-300 rounded h-4 w-2/3" />
            <div className="bg-gray-300 rounded h-4 w-3/4" />
            <div className="bg-gray-300 rounded h-4 w-1/2" />
            <div className="bg-gray-300 rounded h-4 w-3/4" />
            <div className="bg-gray-300 rounded h-4 w-2/3" />
          </div>

          {/* Right Flight Card Section */}
          <div className="flex-1 space-y-4">
            <div className="bg-gray-300 rounded h-6 w-1/2" />
            <div className="bg-gray-300 rounded h-4 w-1/3" />
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="bg-gray-300 rounded h-40 w-full lg:w-64" />
              <div className="flex-1 space-y-4">
                <div className="bg-gray-300 rounded h-4 w-1/2" />
                <div className="bg-gray-300 rounded h-4 w-1/4" />
                <div className="bg-gray-300 rounded h-4 w-1/3" />
                <div className="flex flex-wrap gap-2">
                  <div className="bg-gray-300 rounded h-4 w-20" />
                  <div className="bg-gray-300 rounded h-4 w-24" />
                  <div className="bg-gray-300 rounded h-4 w-16" />
                  <div className="bg-gray-300 rounded h-4 w-28" />
                </div>
              </div>
            </div>

            {/* "Select Flight" button skeleton */}
            <div className="bg-gray-300 rounded h-8 w-28" />
          </div>
        </div>
      </div>
    );
  }

  // C) If "noData" => show a "No fleets available" card
  if (noData) {
    return (
      <div className="w-full max-w-6xl h-[30rem] flex flex-col justify-center items-center bg-white border border-blue-100 rounded-lg p-8 mt-60">
        <BsExclamationTriangle className="text-7xl text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          No fleets available
        </h2>
        <p className="text-gray-600 text-sm text-center max-w-[40ch]">
          Sorry, we couldn&apos;t find any fleet options for this route or date.
          Please try modifying your search or come back later.
        </p>
      </div>
    );
  }

  // D) Otherwise, show main UI
  return (
    <div className="relative w-full mx-auto flex flex-col items-start overflow-hidden max-w-[100rem] px-6">
      {/* Top Panel */}
      <div className="w-full py-4 ">
        <h1 className="text-2xl font-bold text-center text-white">
          ✈️  Select Your Dream Fleet ✈️
        </h1>
        <div className="flex mt-2 ">
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
                    {fleet?.fleetDetails?.selectedModel})
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
                  ------ {searchData.segments[currentTripIndex]?.to}
                </p>

                {/* "Go Back" button, only if not on the first segment */}
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

                {/* "Select Next Fleet" if current fleet is chosen and not on last segment */}
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
      <div className="flex w-full ">
        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-[30%] p-6 bg-white  px-10 mr-4 border border-blue-100 rounded-xl"
        >
          {/* Heading row */}
          <div className="flex items-center justify-between mb-6 border-b pb-2">
            <motion.h2
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-gray-800"
            >
              <p>Filter Options </p>
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
                const count = fleetData.filter(
                  (f) => f.fleetDetails?.flightType === type
                ).length;
                return (
                  <label
                    key={type}
                    className="inline-flex items-center space-x-2 cursor-pointer"
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

          {/* Amenities */}
          <div>
            <p className="font-semibold text-gray-700 mb-3">Available Services</p>
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
        <div className="w-full bg-white flex flex-col items-center p-4 px-12 border border-blue-100 rounded-xl">
          <div className="mb-10 w-full">
            <h3 className="text-lg font-bold  flex">
              Trip {segmentIndex + 1}: {searchData.segments[segmentIndex].from}
              ------
              <span className="inline-block mx-1">
                <IoIosAirplane size={34} />
              </span>
              ------
              {searchData.segments[segmentIndex].to}
            </h3>

            <p className="text-neutral-800 text-xl mb-4">
              Recommending flights based on convenience and fare
            </p>

            {filteredData.length === 0 ? (
              // This is the "no fleets in filter" or empty card
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
                  onNextSegment={handleNextSegment}
                  currentTripIndex={currentTripIndex}
                  tripCount={tripCount}
                  isMultiCity={isMultiCity}
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
