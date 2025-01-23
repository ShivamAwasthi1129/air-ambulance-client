"use client"; // For Next.js App Router

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosAirplane } from "react-icons/io";

// Amenity-specific icons
import { FaUserTie, FaCarSide, FaMusic, FaCoffee, FaSeedling } from "react-icons/fa";
import { GiPaintRoller } from "react-icons/gi";
import { MdMonitor, MdOutlineHomeRepairService, MdMicrowave } from "react-icons/md";
import { BsFillLightningFill } from "react-icons/bs";
import { AiOutlineCheckCircle } from "react-icons/ai"; // Fallback or tick icon

// 1) Currency data
const currencyFlags = [
  { code: "INR", label: "🇮🇳" },
  { code: "USD", label: "🇺🇸" },
  { code: "GBP", label: "🇬🇧" },
];
const currencySymbols = {
  INR: "₹",
  USD: "$",
  GBP: "£",
};
// Example exchange rates (1 INR => x):
const exchangeRates = {
  INR: 1,
  USD: 0.012,   // e.g. 1 INR = 0.012 USD
  GBP: 0.0098,  // e.g. 1 INR = 0.0098 GBP
};

// 2) Amenity icons
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

// Helper: chunk an array into sub-arrays of length `size`
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

const FlightCard = ({ filteredData = [], onSelectFleet, selectedFleet }) => {
  const [activeDetailsId, setActiveDetailsId] = useState(null);

  // ----- MODAL states for "See flight Experience ->"
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [experienceModalFlightId, setExperienceModalFlightId] = useState(null);
  const [activeTab, setActiveTab] = useState("interior");

  // ----- Currency states
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  // Toggle flight details on the right panel
  const toggleFlightDetails = (flightId) => {
    setActiveDetailsId((prevId) => (prevId === flightId ? null : flightId));
  };

  // Updated ImageSlider component
  const ImageSlider = ({ aircraftGallery }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Extract the first image from each category (interior, exterior, cockpit)
    const images = [
      aircraftGallery?.exterior
        ? Object.values(aircraftGallery.exterior)[0]
        : null,
      aircraftGallery?.interior
        ? Object.values(aircraftGallery.interior)[0]
        : null,
      aircraftGallery?.cockpit
        ? Object.values(aircraftGallery.cockpit)[0]
        : null,
    ].filter(Boolean); // Remove null if category is missing

    useEffect(() => {
      if (images.length > 1) {
        const interval = setInterval(() => {
          setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 4000);
        return () => clearInterval(interval);
      }
    }, [images]);

    if (!images.length) {
      return (
        <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-500">No image available</span>
        </div>
      );
    }

    return (
      <div className="relative w-full h-64 overflow-hidden">
        <div
          className="flex transition-transform duration-700"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((imgSrc, i) => (
            <img
              key={i}
              src={imgSrc}
              alt={`Aircraft view ${i}`}
              className="w-full h-64 object-cover flex-shrink-0"
            />
          ))}
        </div>
      </div>
    );
  };

  // "See flight Experience ->" triggers the modal
  const handleExperienceClick = (flightId, e) => {
    e.stopPropagation(); // Avoid also selecting the flight
    setExperienceModalFlightId(flightId);
    setShowExperienceModal(true);
    setActiveTab("interior");
  };

  // Close the experience modal
  const closeExperienceModal = () => {
    setShowExperienceModal(false);
    setExperienceModalFlightId(null);
    setActiveTab("interior");
  };

  // Convert price from INR to selected currency
  const convertPrice = (inrPrice, currency) => {
    const rate = exchangeRates[currency] || 1;
    return Math.round(inrPrice * rate);
  };

  // If no flights match, show message
  if (!filteredData.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No flights match the selected criteria.
      </div>
    );
  }

  // Framer-motion variants
  const flightDetailsVariants = {
    hidden: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
    show: { x: 0, opacity: 1 },
  };
  const amenitiesVariants = {
    hidden: { x: 50, opacity: 0 },
    show: { x: 0, opacity: 1 },
    exit: { x: 50, opacity: 0 },
  };

  return (
    <div className="space-y-6 mb-11">
      {filteredData.map((flight) => {
        const isOpen = activeDetailsId === flight.id;

        // 1) Grab all free amenities
        const freeServicesAll = Object.entries(flight.additionalAmenities || {}).filter(
          ([, amenityData]) => amenityData.value === "free"
        );
        // 2) Show up to 7
        const freeServicesToShow = freeServicesAll.slice(0, 7);
        // Split into two lines: first 4, next 3
        const firstLineServices = freeServicesToShow.slice(0, 4);
        const secondLineServices = freeServicesToShow.slice(4, 7);

        // All amenities (for expanded panel)
        const allAmenitiesEntries = Object.entries(flight.additionalAmenities || {});
        const chunkedAmenities = chunkArray(allAmenitiesEntries, 4);

        // Price in INR or fallback
        const flightPriceINR = flight.price || 86404;

        return (
          <div
            key={flight.id}
            className="flex flex-col md:flex-row rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
          >
            {/* LEFT: Image (40% width) + "See flight Experience ->" */}
            <div className="relative w-full md:w-2/5">
              <ImageSlider aircraftGallery={flight.aircraftGallery} />

              {/* BOTTOM LEFT: "See flight Experience ->" text */}
              <p
                onClick={(e) => handleExperienceClick(flight.id, e)}
                className="absolute bottom-2 left-2 text-white text-md bg-black bg-opacity-50 font-bold italic px-2 py-1 cursor-pointer rounded"
              >
                See Flight Experience -&gt;
              </p>
            </div>

            {/* RIGHT: flight details or amenities */}
            <div className="w-full md:w-3/5 relative border border-gray-300">
              <AnimatePresence mode="wait">
                {/* =========== FLIGHT DETAILS (default collapsed) =========== */}
                {!isOpen && (
                  <motion.div
                    key="flight-details"
                    variants={flightDetailsVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    transition={{ duration: 0.4 }}
                    className="bg-white p-4 py-0 h-full"
                  >
                    {/* TOP ROW: Airline Logo / Title / Price + currency */}
                    <div className="flex items-center justify-between border-b border-gray-300 py-2">
                      <div className="flex items-center space-x-2">
                        <img
                          src={
                            flight.logo ||
                            "https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/GF.png?v=19"
                          }
                          alt={flight.title || "Gulf Air"}
                          className="w-10 h-10 md:w-10 md:h-10 object-contain"
                        />
                        <h2 className="text-lg md:text-2xl font-bold text-gray-800">
                          {flight.title || "Gulf Air"}
                        </h2>
                      </div>

                      {/* PRICE + "other currencies" */}
                      <div className="text-right relative inline-block">
                        <p className="text-xs text-gray-500">From</p>
                        <p className="text-xl md:text-2xl font-bold text-gray-700">
                          {currencySymbols[selectedCurrency]}
                          {convertPrice(flightPriceINR, selectedCurrency).toLocaleString()}
                        </p>
                        <p
                          onClick={() => setShowCurrencyDropdown((val) => !val)}
                          className="text-sm text-blue-500 cursor-pointer"
                        >
                          &gt; other currencies
                        </p>
                        {showCurrencyDropdown && (
                          <div className="absolute right-0 top-full mt-1 bg-white border rounded shadow-md w-40 z-10">
                            {currencyFlags.map(({ code, label }) => {
                              const converted = convertPrice(flightPriceINR, code);
                              return (
                                <div
                                  key={code}
                                  onClick={() => {
                                    setSelectedCurrency(code);
                                    setShowCurrencyDropdown(false);
                                  }}
                                  className="cursor-pointer p-2 hover:bg-gray-100 flex items-center justify-between"
                                >
                                  <span className="mr-2">{label}</span>
                                  <span className="text-sm font-bold text-gray-700">
                                    {currencySymbols[code]}
                                    {converted.toLocaleString()}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

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
                      {/* Stops & total duration (if any) */}
                      <p className="text-sm text-gray-500 mt-1 mb-3">
                        {flight.stopsInfo || "Flight Duration • 14h 30m"}
                      </p>
                    </div>



                    {/* Top free amenities (up to 7, splitted as 4 + 3) */}
                    {freeServicesToShow.length > 0 ? (
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold mb-2">In-Flight Amenities</h4>

                        {/* First row (4 items or fewer) */}
                        <ul className="flex space-x-1 mb-1">
                          {firstLineServices.map(([amenityKey]) => {
                            const IconComponent =
                              amenityIcons[amenityKey] || (
                                <AiOutlineCheckCircle className="text-green-500 mr-2" />
                              );
                            return (
                              <li
                                key={amenityKey}
                                className="flex items-center text-sm ml-2 border-r-2 border-gray-300 pr-1"
                              >
                                <span className="mr-2">{IconComponent}</span>
                                <span className="text-xs">{amenityKey}</span>
                              </li>
                            );
                          })}
                        </ul>

                        {/* Second row (remaining 3 items if available) */}
                        {secondLineServices.length > 0 && (
                          <ul className="flex space-x-1">
                            {secondLineServices.map(([amenityKey]) => {
                              const IconComponent =
                                amenityIcons[amenityKey] || (
                                  <AiOutlineCheckCircle className="text-green-500 mr-2" />
                                );
                              return (
                                <li
                                  key={amenityKey}
                                  className="flex items-center text-sm ml-2 border-r-2 border-gray-300 pr-1"
                                >
                                  <span className="mr-2">{IconComponent}</span>
                                  <span className="text-xs">{amenityKey}</span>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs md:text-sm text-gray-600 mb-3">
                        No free services available
                      </p>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center space-x-4 mb-1">
                      {/* SELECT FLIGHT BUTTON */}
                      <button
                        onClick={() => onSelectFleet(flight)}
                        className={`${selectedFleet?.id === flight.id
                            ? "bg-green-600"
                            : "bg-gradient-to-r from-green-500 to-green-700"
                          } text-white text-sm font-semibold px-4 py-2 rounded shadow-md focus:ring-2 focus:ring-green-300`}
                      >
                        {selectedFleet?.id === flight.id
                          ? "Fleet Selected"
                          : "Select Flight"}
                      </button>

                      {/* VIEW DETAILS => toggles amenities panel */}
                      <button
                        onClick={() => toggleFlightDetails(flight.id)}
                        className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-semibold px-4 py-2 rounded shadow-md hover:from-blue-600 hover:to-blue-800 focus:ring-2 focus:ring-blue-300"
                      >
                        View Flight Details
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* =========== AMENITIES PANEL (expanded view) =========== */}
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
                    {/* Top row: flight info */}
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

                      {/* Price block */}
                      <div className="text-right relative inline-block">
                        <p className="text-xs text-gray-500">From</p>
                        <p className="text-xl md:text-2xl font-bold text-gray-700">
                          {currencySymbols[selectedCurrency]}
                          {convertPrice(flightPriceINR, selectedCurrency).toLocaleString()}
                        </p>
                        <p
                          onClick={() => setShowCurrencyDropdown((val) => !val)}
                          className="text-sm text-blue-500 cursor-pointer"
                        >
                          &gt; other currencies
                        </p>
                        {showCurrencyDropdown && (
                          <div className="absolute right-0 top-full mt-1 bg-white border rounded shadow-md w-40 z-10">
                            {currencyFlags.map(({ code, label }) => {
                              const converted = convertPrice(flightPriceINR, code);
                              return (
                                <div
                                  key={code}
                                  onClick={() => {
                                    setSelectedCurrency(code);
                                    setShowCurrencyDropdown(false);
                                  }}
                                  className="cursor-pointer p-2 hover:bg-gray-100 flex items-center justify-between"
                                >
                                  <span className="mr-2">{label}</span>
                                  <span className="text-sm font-bold text-gray-700">
                                    {currencySymbols[code]}
                                    {converted.toLocaleString()}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Additional Amenities in columns of 4 items each (scrollable) */}
                    {allAmenitiesEntries.length > 0 ? (
                      <div>
                        <div className="flex justify-between items-end my-1">
                          <h3 className="text-md font-semibold">Additional Services</h3>
                          <div className="flex items-center">
                            <button
                              onClick={() => toggleFlightDetails(flight.id)}
                              className="text-blue-500"
                            >
                              Hide Flight Details ^
                            </button>
                          </div>
                        </div>

                        <div className="w-full h-36 overflow-x-auto border border-gray-300 rounded p-2 mb-4">
                          <div className="flex flex-row flex-nowrap gap-8">
                            {chunkedAmenities.map((column, colIndex) => (
                              <div
                                key={colIndex}
                                className="flex flex-col space-y-2 min-w-[250px]"
                              >
                                {column.map(([amenityKey, amenityData]) => {
                                  const IconComponent =
                                    amenityIcons[amenityKey] ||
                                    <AiOutlineCheckCircle className="text-green-500" size={20} />;
                                  return (
                                    <div
                                      key={amenityKey}
                                      className="flex items-center space-x-2"
                                    >
                                      <span>{IconComponent}</span>
                                      <span className="font-medium text-sm text-gray-800">
                                        {amenityKey}
                                      </span>
                                      <span
                                        className={`text-xs font-semibold ml-2 px-2 py-1 rounded ${amenityData.value === "free"
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
                      <p className="text-sm text-gray-600">No additional amenities.</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}

      {/* =========== EXPERIENCE MODAL =========== */}
      {showExperienceModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={closeExperienceModal}
        >
          <div
            className="bg-white w-11/12 md:w-4/5 h-[80%] p-5 rounded-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeExperienceModal}
              className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded"
            >
              X
            </button>

            {/* Tabs: interior, exterior, cockpit, aircraftLayout, video */}
            <div className="flex space-x-4 border-b mb-4">
              {["interior", "exterior", "cockpit", "aircraftLayout", "video"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-4 text-sm font-semibold ${activeTab === tab
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Show images or video for the chosen flight's aircraftGallery */}
            {filteredData.map((f) => {
              if (f.id !== experienceModalFlightId) return null; // Only the chosen flight
              const gallery = f.aircraftGallery || {};

              return (
                <div key={f.id} className="overflow-auto h-full">
                  {/* If tab is NOT "video", show images from that category */}
                  {activeTab !== "video" && gallery[activeTab] && (
                    <div className="flex flex-wrap gap-4">
                      {Object.entries(gallery[activeTab]).map(([view, url]) => (
                        <img
                          key={view}
                          src={url}
                          alt={view}
                          className="w-80 h-56 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}

                  {/* If tab is "video," show the flight's .video link */}
                  {activeTab === "video" && gallery.video && (
                    <div className="relative w-full h-[90%]">
                      <video
                        autoPlay
                        controls
                        className="absolute inset-0 w-full h-full object-cover"
                        src={gallery.video}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightCard;
