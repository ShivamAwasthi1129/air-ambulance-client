"use client"; // For Next.js App Router

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosAirplane } from "react-icons/io";

// Amenity-specific icons
import { FaUserTie, FaCarSide, FaMusic, FaCoffee, FaSeedling } from "react-icons/fa";
import { GiPaintRoller } from "react-icons/gi";
import { MdMonitor, MdOutlineHomeRepairService , MdMicrowave } from "react-icons/md";
import { BsFillLightningFill } from "react-icons/bs";
import { AiOutlineCheckCircle } from "react-icons/ai"; // Fallback or tick icon

// Map each amenity name to a specific icon component (must match the exact key from flight data)
const amenityIcons = {
  "Air Hostess / Escorts": <FaUserTie className="text-blue-600" />,
  "Personal Bouquet": <FaSeedling className="text-pink-500" />,
  "Brand new Interior": <MdOutlineHomeRepairService className="text-green-600" />,
  "Brand new Paint": <GiPaintRoller className="text-red-500" />,
  "Espresso Coffee Machine": <FaCoffee className="text-amber-600" />,
  "Personal Microwave": <MdMicrowave className="text-indigo-500" />,
  "Music System Surround Sound": <FaMusic className="text-purple-600" />,
  "New FHD Monitor": <MdMonitor className="text-teal-600" />,
  "Power Supply 110V": <BsFillLightningFill className="text-yellow-600" />,
  "Vvip car Pick & Drop": <FaCarSide className="text-orange-600" />,
};

// Helper function: chunk an array into sub-arrays of length `size`
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

const FlightCard = ({ filteredData = [], onSelectFleet, selectedFleet }) => {
  const [activeDetailsId, setActiveDetailsId] = useState(null);

  // Toggle which flight’s details are open
  const toggleFlightDetails = (flightId) => {
    setActiveDetailsId((prevId) => (prevId === flightId ? null : flightId));
  };

  // Simple image slider
  const ImageSlider = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      if (images && images.length > 1) {
        const interval = setInterval(() => {
          setCurrentIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
          );
        }, 4000);
        return () => clearInterval(interval);
      }
    }, [images]);

    if (!images || images.length === 0) {
      return (
        <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-500">No image</span>
        </div>
      );
    }

    return (
      <div className="relative w-full h-64 overflow-hidden">
        <div
          className="flex transition-transform duration-700"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, i) => (
            <img
              key={i}
              src={image}
              alt={`Flight image ${i}`}
              className="w-full h-64 object-cover flex-shrink-0"
            />
          ))}
        </div>
      </div>
    );
  };

  // If no flights match, show message
  if (filteredData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No flights match the selected criteria.
      </div>
    );
  }

  // Motion variants for flight details (slide left on exit)
  const flightDetailsVariants = {
    hidden: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
    show: { x: 0, opacity: 1 },
  };

  // Motion variants for amenities (slide in from right)
  const amenitiesVariants = {
    hidden: { x: 50, opacity: 0 },
    show: { x: 0, opacity: 1 },
    exit: { x: 50, opacity: 0 },
  };

  return (
    <div className="space-y-6">
      {filteredData.map((flight) => {
        const isOpen = activeDetailsId === flight.id;

        // Grab FREE amenities for the flight (to show in default panel)
        const freeServicesAll = Object.entries(flight.additionalAmenities || {}).filter(
          ([, amenityData]) => amenityData.value === "free"
        );
        // Show only up to 4 free amenities
        const freeServicesToShow = freeServicesAll.slice(0, 4);

        // Prepare the entire list of amenities for the expanded panel
        const allAmenitiesEntries = Object.entries(flight.additionalAmenities || {});
        // Break them into columns of 4 items
        const chunkedAmenities = chunkArray(allAmenitiesEntries, 4);

        return (
          <div
            key={flight.id}
            className="flex flex-col md:flex-row rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
          >
            {/* LEFT: Image (40% width) */}
            <div className="relative w-full md:w-2/5">
              <ImageSlider images={flight.images} />

              {/* Optional overlay text */}
              <div className="absolute top-4 left-4 text-white">
                <h3 className="text-xl font-bold">Falcon Gold</h3>
                <p className="text-sm">Experience our Airbus A321neo</p>
              </div>
            </div>

            {/* RIGHT: AnimatePresence toggles between flight details and amenities */}
            <div className="w-full md:w-3/5 relative">
              <AnimatePresence mode="wait">
                {/* FLIGHT DETAILS (default view) */}
                {!isOpen && (
                  <motion.div
                    key="flight-details"
                    variants={flightDetailsVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    transition={{ duration: 0.4 }}
                    className="bg-white p-4 pb-0 h-full"
                  >
                    {/* TOP ROW: Airline Logo / Title / Price */}
                    <div className="flex items-start justify-between border-b border-gray-300 pb-2">
                      <div className="flex items-center space-x-2">
                        <img
                          src={
                            flight.logo ||
                            "https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/GF.png?v=19"
                          }
                          alt={flight.title || "Gulf Air"}
                          className="w-8 h-8 md:w-10 md:h-10 object-contain"
                        />
                        <h2 className="text-lg md:text-xl font-bold text-gray-800">
                          {flight.title || "Gulf Air"}
                        </h2>
                      </div>
                      <div className="text-right">
                        <p className="text-xl md:text-2xl font-bold text-gray-700">
                          ₹
                          {flight.price ? flight.price.toLocaleString() : "86,404"}
                          <span className="text-sm text-gray-500"> /adult</span>
                        </p>
                      </div>
                    </div>

                    {/* Stops & total duration */}
                    <p className="text-sm text-gray-500 mt-1 mb-3">
                      {flight.stopsInfo || "Flight Duration • 14h 30m"}
                    </p>

                    {/* Flight timings row */}
                    <div className="flex items-center space-x-3 md:space-x-8 text-sm text-gray-800 mb-2">
                      {/* Departure Info */}
                      <div>
                        <p className="text-base font-semibold">
                          {flight.departureTime || "DEL 21:35"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {flight.departureCity || "New Delhi"}
                        </p>
                      </div>

                      <div className="text-xs text-gray-500 text-center">
                        <p className="text-md text-gray-700 mb-2 flex items-center">
                          ------{" "}
                          <span className="inline-block mx-1">
                            <IoIosAirplane size={34} />
                          </span>{" "}
                          -----
                        </p>
                      </div>

                      {/* Arrival Info */}
                      <div>
                        <p className="text-base font-semibold">
                          {flight.arrivalTime || "LHR 06:35"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {flight.arrivalCity || "London - Heathrow Apt"}
                        </p>
                      </div>
                    </div>

                    {/* Top 4 FREE amenities in place of "Fully flat-bed" */}
                    {freeServicesToShow.length > 0 ? (
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold mb-2">In-Flight Amenities</h4>
                        <ul className="space-y-1 flex">
                          {freeServicesToShow.map(([amenityKey]) => {
                            const IconComponent =
                              amenityIcons[amenityKey] || (
                                <AiOutlineCheckCircle className="text-green-500 mr-2" />
                              );
                            return (
                              <li
                                key={amenityKey}
                                className="flex items-center text-sm ml-2 border-r-2 border-gray-300 pr-2"
                              >
                                {/* Icon */}
                                <span className="mr-2">
                                  {IconComponent}
                                </span>
                                {/* Amenity Name */}
                                <span className="text-xs">{amenityKey}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-xs md:text-sm text-gray-600 mb-3">
                        No free services available
                      </p>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center space-x-4 mb-3">
                      {/* SELECT FLIGHT BUTTON */}
                      <button
                        onClick={() => onSelectFleet(flight)}
                        className={`${
                          selectedFleet?.id === flight.id
                            ? "bg-green-600"
                            : "bg-gradient-to-r from-green-500 to-green-700"
                        } text-white text-sm font-semibold px-4 py-2 rounded shadow-md focus:ring-2 focus:ring-green-300`}
                      >
                        {selectedFleet?.id === flight.id
                          ? "Fleet Selected"
                          : "Select Flight"}
                      </button>

                      {/* VIEW DETAILS => toggles amenities */}
                      <button
                        onClick={() => toggleFlightDetails(flight.id)}
                        className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-semibold px-4 py-2 rounded shadow-md hover:from-blue-600 hover:to-blue-800 focus:ring-2 focus:ring-blue-300"
                      >
                        View Flight Details
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* AMENITIES PANEL (open view) */}
                {isOpen && (
                  <motion.div
                    key="amenities"
                    variants={amenitiesVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    transition={{ duration: 0.4 }}
                    className="bg-white p-4 pb-0 h-full"
                  >
                    {/* Top row: flight info (optional) */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={
                            flight.logo ||
                            "https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/GF.png?v=19"
                          }
                          alt={flight.title || "Gulf Air"}
                          className="w-8 h-8 md:w-10 md:h-10 object-contain"
                        />
                        <h2 className="text-lg md:text-xl font-bold text-gray-800">
                          {flight.title || "Gulf Air"}
                        </h2>
                      </div>
                      <div className="text-right">
                        <p className="text-xl md:text-2xl font-bold text-gray-700">
                          ₹
                          {flight.price ? flight.price.toLocaleString() : "86,404"}
                          <span className="text-sm text-gray-500"> /adult</span>
                        </p>
                      </div>
                    </div>

                    {/* Additional Amenities in columns of 4 items each, horizontally scrollable */}
                    {allAmenitiesEntries.length > 0 ? (
                      <div>
                     <div className="flex justify-between items-end my-1">
                     <h3 className="text-md font-semibold">Additional Services</h3>
                        {/* HIDE DETAILS button => returns to flight details */}
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleFlightDetails(flight.id)}
                        className=" text-blue-500"
                      >
                        Hide Flight Details ^
                      </button>
                    </div>
                     </div>
                        
                        {/* Fixed height & horizontal scroll container */}
                        <div className="w-full h-36 overflow-x-auto border border-gray-300 rounded p-2 mb-4">
                          {/* No wrap => columns displayed side by side */}
                          <div className="flex flex-row flex-nowrap gap-8">
                            {chunkedAmenities.map((column, colIndex) => (
                              <div
                                key={colIndex}
                                className="flex flex-col space-y-2 min-w-[250px]"
                              >
                                {column.map(([amenityKey, amenityData]) => {
                                  // If there's no matching icon, fall back to a check-circle
                                  const IconComponent =
                                    amenityIcons[amenityKey] ||
                                    <AiOutlineCheckCircle className="text-green-500" size={20} />;
                                  return (
                                    <div
                                      key={amenityKey}
                                      className="flex items-center space-x-2"
                                    >
                                      {/* Icon */}
                                      <span>{IconComponent}</span>
                                      {/* Amenity Name */}
                                      <span className="font-medium text-sm text-gray-800">
                                        {amenityKey}
                                      </span>
                                      {/* Free or Chargeable Badge */}
                                      <span
                                        className={`text-xs font-semibold ml-2 px-2 py-1 rounded ${
                                          amenityData.value === "free"
                                            ? "bg-green-100 text-green-600"
                                            : "bg-red-100 text-red-600"
                                        }`}
                                      >
                                        {amenityData.value === "free"
                                          ? "Free"
                                          : "Chargeable"}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">
                        No additional amenities.
                      </p>
                    )}

                    
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FlightCard;
