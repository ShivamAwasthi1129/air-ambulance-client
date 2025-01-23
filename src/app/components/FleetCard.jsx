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
  { code: "USD", label: "🇺🇸" },
  { code: "INR", label: "🇮🇳" },
  { code: "GBP", label: "🇬🇧" },
];

// Change the symbols to your liking
const currencySymbols = {
  USD: "$",
  INR: "₹",
  GBP: "£",
};

// Now base is USD => 1
// Example: 1 USD = ~82 INR, 1 USD = ~0.80 GBP
const exchangeRates = {
  USD: 1,
  INR: 82,   // one USD = 82 INR (approx)
  GBP: 0.80, // one USD = 0.80 GBP (approx)
};

// 2) Amenity icons
const amenityIcons = {
  "Life Jacket": <AiOutlineCheckCircle className="text-gray-600" />,
  "Brand new Paint": <GiPaintRoller className="text-red-500" />,
  "Brand new Interior": <MdOutlineHomeRepairService className="text-green-600" />,
  "Secret Service": <FaUserTie className="text-blue-600" />,
  "Microwave": <MdMicrowave className="text-indigo-500" />,
  "Vip Cab Pick & Drop": <FaCarSide className="text-orange-600" />,
  "Vvip car Pick & Drop": <FaCarSide className="text-orange-600" />,
  "Espresso Coffee Machine": <FaCoffee className="text-amber-600" />,
  "Security": <AiOutlineCheckCircle className="text-gray-600" />,
  "Vvip Car inside Airport": <FaCarSide className="text-orange-600" />,
  "Bouquet": <FaSeedling className="text-pink-500" />,
  "Air Hostess / Escorts": <FaUserTie className="text-blue-600" />,
  "New FHD Monitor": <MdMonitor className="text-teal-600" />,
  "Full Bar": <AiOutlineCheckCircle className="text-gray-600" />,
  "Personal Gate": <AiOutlineCheckCircle className="text-gray-600" />,
  "Red Carpet": <AiOutlineCheckCircle className="text-gray-600" />,
  "Cafe": <FaCoffee className="text-amber-600" />,
  "Airport Pickup": <FaCarSide className="text-orange-600" />,
  "Music System Surround Sound": <FaMusic className="text-purple-600" />,
  "Emergency Evacuation": <AiOutlineCheckCircle className="text-gray-600" />,
  "Hot and Cold Stations": <AiOutlineCheckCircle className="text-gray-600" />,
  "Airport DropOff": <FaCarSide className="text-orange-600" />,
  "Private Security": <AiOutlineCheckCircle className="text-gray-600" />,
  "Power Supply 110V": <BsFillLightningFill className="text-yellow-600" />,
  "Lounge Access": <AiOutlineCheckCircle className="text-gray-600" />,
};

// Helper: chunk array
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

const FlightCard = ({ filteredData = [], onSelectFleet, selectedFleet }) => {
  const [activeDetailsId, setActiveDetailsId] = useState(null);

  // For "See flight Experience ->" modal
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [experienceModalFlightId, setExperienceModalFlightId] = useState(null);
  const [activeTab, setActiveTab] = useState("interior");

  // Currency
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  // Toggle flight details
  const toggleFlightDetails = (flightId) => {
    setActiveDetailsId((prevId) => (prevId === flightId ? null : flightId));
  };

  // Simple Image Slider
  const ImageSlider = ({ aircraftGallery }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
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
    ].filter(Boolean);

    useEffect(() => {
      if (images.length > 1) {
        const interval = setInterval(() => {
          setCurrentIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
          );
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

  // Experience Modal
  const handleExperienceClick = (flightId, e) => {
    e.stopPropagation();
    setExperienceModalFlightId(flightId);
    setShowExperienceModal(true);
    setActiveTab("interior");
  };

  const closeExperienceModal = () => {
    setShowExperienceModal(false);
    setExperienceModalFlightId(null);
    setActiveTab("interior");
  };

  // Convert from USD to chosen currency
  const convertPrice = (usdPrice, currency) => {
    const rate = exchangeRates[currency] || 1;
    return Math.round(usdPrice * rate);
  };

  if (!filteredData.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No flights match the selected criteria.
      </div>
    );
  }

  // Motion variants
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
        const isOpen = activeDetailsId === flight.serialNumber;

        // free amenities
        const freeServicesAll = Object.entries(
          flight.additionalAmenities || {}
        ).filter(([, amenityData]) => amenityData.value === "free");

        const freeServicesToShow = freeServicesAll.slice(0, 7);
        const firstLineServices = freeServicesToShow.slice(0, 4);
        const secondLineServices = freeServicesToShow.slice(4, 7);

        const allAmenitiesEntries = Object.entries(
          flight.additionalAmenities || {}
        );
        const chunkedAmenities = chunkArray(allAmenitiesEntries, 4);

        // flightPrice is already in USD
        const flightPriceUSD = flight.totalPrice
          ? parseInt(flight.totalPrice.replace(/\D/g, ""), 10)
          : 0;

        return (
          <div
            key={flight.serialNumber}
            className="flex flex-col md:flex-row rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
          >
            {/* LEFT: Image */}
            <div className="relative w-full md:w-2/5">
              <ImageSlider aircraftGallery={flight.aircraftGallery} />
              {/* "See flight Experience ->" */}
              <p
                onClick={(e) => handleExperienceClick(flight.serialNumber, e)}
                className="absolute bottom-2 left-2 text-white text-md bg-black bg-opacity-50 font-bold italic px-2 py-1 cursor-pointer rounded"
              >
                See Flight Experience -&gt;
              </p>
            </div>

            {/* RIGHT: flight details or amenities */}
            <div className="w-full md:w-3/5 relative border border-gray-300">
              <AnimatePresence mode="wait">
                {/* Collapsed Details */}
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
                    {/* Top Row */}
                    <div className="flex items-center justify-between border-b border-gray-300 py-2">
                      <div className="flex items-center space-x-2">
                        <img
                          src={
                            flight.logo ||
                            "https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/GF.png?v=19"
                          }
                          alt={flight.title || "Airline"}
                          className="w-10 h-10 md:w-10 md:h-10 object-contain"
                        />
                          <h2 className="text-lg md:text-xl font-bold text-gray-800 flex flex-col items-end">
                            {flight.fleetDetails.selectedModel || "Gulf Air"}
                          <p className="text-sm text-gray-800 font-medium">
                               {flight.fleetDetails.registrationNo || "Gulf Air"}
                          </p>
                        </h2>
                      </div>

                      {/* Price + Currency */}
                      <div className="text-right relative inline-block">
                        <p className="text-xs text-gray-500">From</p>
                        <p className="text-xl md:text-2xl font-bold text-gray-700">
                          {currencySymbols[selectedCurrency]}
                          {convertPrice(flightPriceUSD, selectedCurrency).toLocaleString()}
                        </p>
                        <p
                          onClick={() =>
                            setShowCurrencyDropdown((val) => !val)
                          }
                          className="text-sm text-blue-500 cursor-pointer"
                        >
                          &gt; other currencies
                        </p>
                        {showCurrencyDropdown && (
                          <div className="absolute right-0 top-full mt-1 bg-white border rounded shadow-md w-40 z-10">
                            {currencyFlags.map(({ code, label }) => {
                              const converted = convertPrice(
                                flightPriceUSD,
                                code
                              );
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

                    {/* Flight Timings */}
                    <div className="flex items-center space-x-3 md:space-x-8 text-sm text-gray-800 mb-2">
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

                      <div>
                        <p className="text-base font-semibold">
                          {flight.arrivalTime || "LHR 06:35"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {flight.arrivalCity || "London - Heathrow Apt"}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 mb-3">
                        Flight Duration • {flight.flightTime || "not found"}
                      </p>
                    </div>

                    {/* Some free amenities */}
                    {freeServicesToShow.length > 0 ? (
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold mb-2">
                          In-Flight Amenities
                        </h4>
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

                    {/* Actions */}
                    <div className="flex items-center space-x-4 mb-1">
                      <button
                        onClick={() => onSelectFleet(flight)}
                        className={`${
                          selectedFleet?.serialNumber === flight.serialNumber
                            ? "bg-green-600"
                            : "bg-gradient-to-r from-green-500 to-green-700"
                        } text-white text-sm font-semibold px-4 py-2 rounded shadow-md focus:ring-2 focus:ring-green-300`}
                      >
                        {selectedFleet?.serialNumber === flight.serialNumber
                          ? "Fleet Selected"
                          : "Select Flight"}
                      </button>

                      <button
                        onClick={() =>
                          toggleFlightDetails(flight.serialNumber)
                        }
                        className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-semibold px-4 py-2 rounded shadow-md hover:from-blue-600 hover:to-blue-800 focus:ring-2 focus:ring-blue-300"
                      >
                        View Flight Details
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Expanded Amenities */}
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
                          {flight.fleetDetails.registrationNo || "Gulf Air"}
                        </h2>
                      </div>

                      <div className="text-right relative inline-block">
                        <p className="text-xs text-gray-500">From</p>
                        <p className="text-xl md:text-2xl font-bold text-gray-700">
                          {currencySymbols[selectedCurrency]}
                          {convertPrice(flightPriceUSD, selectedCurrency).toLocaleString()}
                        </p>
                        <p
                          onClick={() =>
                            setShowCurrencyDropdown((val) => !val)
                          }
                          className="text-sm text-blue-500 cursor-pointer"
                        >
                          &gt; other currencies
                        </p>
                        {showCurrencyDropdown && (
                          <div className="absolute right-0 top-full mt-1 bg-white border rounded shadow-md w-40 z-10">
                            {currencyFlags.map(({ code, label }) => {
                              const converted = convertPrice(
                                flightPriceUSD,
                                code
                              );
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

                    {allAmenitiesEntries.length > 0 ? (
                      <div>
                        <div className="flex justify-between items-end my-1">
                          <h3 className="text-md font-semibold">
                            Additional Services
                          </h3>
                          <div className="flex items-center">
                            <button
                              onClick={() =>
                                toggleFlightDetails(flight.serialNumber)
                              }
                              className="text-blue-500"
                            >
                              Hide Flight Details ^
                            </button>
                          </div>
                        </div>

                        <div className="max-w-[36rem] h-36 overflow-x-auto border border-gray-300 rounded p-2 mb-4">
                          <div className="flex flex-row flex-nowrap gap-8">
                            {chunkedAmenities.map((column, colIndex) => (
                              <div
                                key={colIndex}
                                className="flex flex-col space-y-2 min-w-[250px]"
                              >
                                {column.map(([amenityKey, amenityData]) => {
                                  const IconComponent =
                                    amenityIcons[amenityKey] || (
                                      <AiOutlineCheckCircle
                                        className="text-green-500"
                                        size={20}
                                      />
                                    );
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

      {/* EXPERIENCE MODAL */}
      {showExperienceModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={closeExperienceModal}
        >
          <div
            className="bg-white w-11/12 md:w-4/5 h-[80%] p-5 rounded-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeExperienceModal}
              className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded"
            >
              X
            </button>

            <div className="flex space-x-4 border-b mb-4">
              {["interior", "exterior", "cockpit", "aircraftLayout", "video"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-4 text-sm font-semibold ${
                      activeTab === tab
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>

            {filteredData.map((f) => {
              if (f.serialNumber !== experienceModalFlightId) return null;
              const gallery = f.aircraftGallery || {};

              return (
                <div key={f.serialNumber} className="overflow-auto h-full">
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
