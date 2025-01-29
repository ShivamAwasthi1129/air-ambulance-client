"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { IoIosAirplane } from "react-icons/io";
import FlightCard from "./FleetCard";

const FilterAndFleetListing = ({ refreshKey }) => {
  const [searchData, setSearchData] = useState(null);
  const [fleetData, setFleetData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [priceRange, setPriceRange] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  // NEW: Add 'selectedAmenities' to track user-selected amenities
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const [selectedFleets, setSelectedFleets] = useState([]);

  // 1. Get 'searchData' from Session
  useEffect(() => {
    try {
      const sessionData = JSON.parse(sessionStorage.getItem("searchData"));
      if (sessionData) {
        setSearchData(sessionData);
        setSelectedFleets(Array(sessionData?.segments?.length || 0).fill(null));
      } else {
        console.warn("No session data found in sessionStorage.");
      }
    } catch (error) {
      console.error("Error parsing session data:", error);
    }
  }, [refreshKey]);

  function cleanAirportName(str) {
    return str.replace(/\s*\(.*?\)\s*/, "").trim();
  }

  // 2. Fetch data from API (and parse prices) once we have valid 'searchData'
  useEffect(() => {
    if (!searchData?.segments?.length) return;

    const { from, to, departureDate, passengers } = searchData.segments[0];
    const cleanedFrom = cleanAirportName(from);
    const cleanedTo = cleanAirportName(to);
    const url = `/api/search-flights?from=${cleanedFrom}&to=${cleanedTo}&departureDate=${departureDate}&travelerCount=${passengers}`;

    const fetchFleets = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data?.finalFleet) {
          // Parse numeric price just once
          const withParsedPrices = data.finalFleet.map((flight) => {
            let numeric = 0;
            if (flight.totalPrice) {
              numeric = parseInt(flight.totalPrice.replace(/\D/g, ""), 10) || 0;
            }
            return { ...flight, _numericPrice: numeric };
          });

          // Compute min & max
          const prices = withParsedPrices.map((f) => f._numericPrice);
          const minP = Math.min(...prices);
          const maxP = Math.max(...prices);

          // Set state just once
          setFleetData(withParsedPrices);
          setMinPrice(minP);
          setMaxPrice(maxP);
          setPriceRange(maxP);
          setFilteredData(withParsedPrices);
        }
      } catch (error) {
        console.error("Error fetching fleet data:", error);
      }
    };

    fetchFleets();
  }, [searchData]);

  // 3. Re-filter whenever user moves slider, toggles flight types, or toggles amenities
  useEffect(() => {
    if (!fleetData.length) return;

    const newFiltered = fleetData.filter((flight) => {
      // Check Price
      const withinPrice = flight._numericPrice <= priceRange;

      // Check Flight Type
      const matchesType =
        selectedTypes.length === 0 ||
        selectedTypes.includes(flight.fleetDetails?.flightType || "");

      // NEW: Check Amenities
      // If no amenities are selected, automatically pass. Otherwise, ensure
      // *every* selected amenity is present and not "not_available".
      const hasAmenities =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((amenity) => {
          const amenityValue =
            flight.additionalAmenities?.[amenity]?.value || "not_available";
          return amenityValue !== "not_available";
        });

      return withinPrice && matchesType && hasAmenities;
    });

    setFilteredData(newFiltered);
  }, [priceRange, selectedTypes, selectedAmenities, fleetData]);

  // 4. All flight types
  const allFlightTypes = useMemo(() => {
    const types = fleetData
      .map((f) => f.fleetDetails?.flightType)
      .filter(Boolean);
    return [...new Set(types)];
  }, [fleetData]);

  // NEW: Filter only available amenities
  const allAmenities = useMemo(() => {
    const amenitySet = new Set();
    fleetData.forEach((flight) => {
      if (flight.additionalAmenities) {
        Object.entries(flight.additionalAmenities).forEach(([amenity, details]) => {
          if (details?.value !== "not_available") {
            amenitySet.add(amenity);
          }
        });
      }
    });
    return [...amenitySet];
  }, [fleetData]);


  const handleClearFilters = () => {
    setSelectedTypes([]);
    setSelectedAmenities([]);
    // If you want the slider to go back to its max value:
    setPriceRange(maxPrice);
  };


  // 5. Check/uncheck flight type
  const handleTypeChange = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // NEW: Check/uncheck amenities
  const handleAmenityChange = (amenity) => {
    setSelectedAmenities((prevSelected) =>
      prevSelected.includes(amenity)
        ? prevSelected.filter((a) => a !== amenity)
        : [...prevSelected, amenity]
    );
  };

  // 6. When user selects a fleet for a specific segment
  const handleFleetSelection = (index, flight) => {
    const updatedFleets = [...selectedFleets];
    updatedFleets[index] = flight;
    setSelectedFleets(updatedFleets);

    const updatedSearchData = { ...searchData };
    updatedSearchData.segments[index].selectedFleet = {
      name: flight?.fleetDetails?.registrationNo,
      model: flight?.fleetDetails?.flightType,
    };
    setSearchData(updatedSearchData);
    sessionStorage.setItem("searchData", JSON.stringify(updatedSearchData));
  };

  // 7. Navigate to the Enquiry page (or next step)
  const navigateToEnquiryPage = () => {
    console.log("Proceeding to enquiry with data:", searchData);
    // add your routing logic
  };

  if (!searchData) {
    return <div className="p-4 space-y-6 animate-pulse w-full">
      {/* Top Headings Row */}
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
    </div>;
  }

  return (
    <div className="relative w-full mx-auto flex flex-col items-start overflow-hidden shadow-lg">
      {/* Top Panel */}
      <div className="w-full p-6 pt-2 bg-gray-50 border  shadow-lg ">
        <h1 className="text-2xl font-bold text-center text-blue-700">
          Fleet Selection Panel
        </h1>

        <div className="flex mt-2">
          {/* Selected Fleets */}
          <div className="bg-white p-5 border border-blue-100 rounded-lg shadow-sm w-[35%]">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Selected Fleets
            </h2>
            {selectedFleets.map((fleet, index) =>
              fleet ? (
                <p
                  key={index}
                  className="text-sm text-gray-700 mb-2 border-l-4 border-blue-600 pl-2"
                >
                  Trip {index + 1}:{" "}
                  <span className="font-medium">
                    {fleet?.fleetDetails?.registrationNo}-{fleet?.fleetDetails?.selectedModel}
                  </span>
                </p>
              ) : (
                <p
                  key={index}
                  className="text-sm text-red-500 mb-2 border-l-4 border-red-500 pl-2"
                >
                  Trip {index + 1}:{" "}
                  <span className="font-medium">No Fleet Selected</span>
                </p>
              )
            )}
          </div>

          {/* Fleet Selection Section */}
          <div className="bg-white p-5 border border-blue-100 rounded-lg shadow-sm w-full ml-4">
            {/* Oneway Trip */}
            {searchData.tripType === "oneway" && (
              <div>
                <h3 className="text-lg font-bold text-blue-600 mb-2">
                  Oneway Trip
                </h3>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-700 mb-2 flex items-center">
                    {searchData.segments[0]?.from} ------
                    <span className="inline-block mx-1">
                      <IoIosAirplane size={34} />
                    </span>
                    ----- {searchData.segments[0]?.to}
                  </p>

                  <button
                    onClick={() => handleFleetSelection(0, filteredData[0] || null)}
                    disabled={!!selectedFleets[0] || !filteredData.length}
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
                      focus:ring-green-400 focus:ring-offset-2 transition-all text-sm font-medium"
                  >
                    
                    Proceed to Enquiry
                    
                  </button>
                  </Link>
                )}
                </div>

               
              </div>
            )}

            {/* Multi City */}
            {searchData.tripType === "multicity" && (
              <div>
                <h3 className="text-lg font-bold text-blue-600 mb-2">
                  Multicity Trip
                </h3>
                {searchData.segments.map((segment, index) => (
                  <div key={index} className="mb-5 flex justify-between">
                    <p className="text-md text-gray-700 mb-2 flex items-center">
                      <span className="font-medium">Trip {index + 1}:-</span>
                      &nbsp;{segment.from} ------
                      <span className="inline-block mx-1">
                        <IoIosAirplane size={34} />
                      </span>
                      ----- {segment.to}
                    </p>
                    <button
                      onClick={() =>
                        handleFleetSelection(index, filteredData[0] || null)
                      }
                      disabled={!!selectedFleets[index] || !filteredData.length}
                      className={`
                        py-2 px-4 rounded-md shadow-md text-sm font-medium 
                        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all
                        ${!!selectedFleets[index]
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-500 text-white"
                        }
                      `}
                    >
                      {selectedFleets[index] ? "Fleet Selected" : "Select Fleet"}
                    </button>
                  </div>
                ))}
                {selectedFleets.every((fleet) => fleet) && (
                  <Link href={"/finalEnquiry"}>
                  <button
                    onClick={navigateToEnquiryPage}
                    className="bg-green-600 text-white py-2 px-4 rounded-md shadow-md 
                      hover:bg-green-500 focus:outline-none focus:ring-2 
                      focus:ring-green-400 focus:ring-offset-2 transition-all text-sm font-medium "
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

      {/* Bottom Section: Filters + Fleet Listing */}
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
            </motion.h2>

            {/* NEW Clear Button */}
            <button
              onClick={handleClearFilters}
              className="text-red-600 text-sm underline hover:text-red-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>


          {/* Dynamic Flight Type Checkboxes */}
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
                    onChange={() => handleTypeChange(type)}
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
                onChange={(e) => setPriceRange(Number(e.target.value))}
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

          {/* NEW: Amenities Filter Section */}
          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2">Available Services</h3>
            {allAmenities.map((amenity) => {
              const isChecked = selectedAmenities.includes(amenity);
              return (
                <motion.div
                  key={amenity}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleAmenityChange(amenity)}
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
          {searchData.segments.map((segment, segmentIndex) => (
            <div key={segmentIndex} className="mb-10 w-full">
              <h3 className="text-lg font-bold mb-2 flex">
                Trip {segmentIndex + 1}: {segment.from} ------
                <span className="inline-block mx-1">
                  <IoIosAirplane size={34} />
                </span>
                ----- {segment.to}
              </h3>

              {filteredData.map((flight) => (
                <FlightCard
                  key={flight.serialNumber}
                  filteredData={[flight]}
                  onSelectFleet={(selectedFleet) =>
                    handleFleetSelection(segmentIndex, selectedFleet)
                  }
                  selectedFleet={selectedFleets[segmentIndex]}
                  tripType={searchData.tripType}
                  segment={segment}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterAndFleetListing;
