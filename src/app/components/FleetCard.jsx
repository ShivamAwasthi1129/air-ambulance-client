"use client"; // For Next.js App Router

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";

// React-Toastify
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Icons
import { FaWhatsapp } from "react-icons/fa";
import { AiOutlineMail, AiOutlineCheckCircle } from "react-icons/ai";
import { IoIosAirplane, IoMdSpeedometer } from "react-icons/io";
import { BsFillLuggageFill, BsFillLightningFill } from "react-icons/bs";
import { FaUserTie, FaCarSide, FaMusic, FaCoffee, FaSeedling } from "react-icons/fa";
import { GiPaintRoller } from "react-icons/gi";
import {
  MdMonitor,
  MdOutlineHomeRepairService,
  MdMicrowave,
  MdAirlineSeatReclineExtra,
} from "react-icons/md";
import Link from "next/link";

// ---------------------------------------------
// Convert dataURL (base64) -> File
// ---------------------------------------------
function dataURLtoFile(dataUrl, filename) {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

// ---------------------------------------------
// Combine all screenshots top-to-bottom
// ---------------------------------------------
async function combineSnapshotsInOneColumn(snapshotMap) {
  const dataUrls = Object.values(snapshotMap);
  if (!dataUrls.length) return null;

  const images = [];
  for (const dataUrl of dataUrls) {
    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });
    images.push(img);
  }

  // Use natural dimensions to avoid CSS scaling issues
  const totalHeight = images.reduce((sum, img) => sum + img.naturalHeight, 0);
  const maxWidth = Math.max(...images.map((img) => img.naturalWidth));

  const canvas = document.createElement("canvas");
  canvas.width = maxWidth;
  canvas.height = totalHeight;
  const ctx = canvas.getContext("2d");

  let yOffset = 0;
  for (const img of images) {
    ctx.drawImage(img, 0, yOffset, img.naturalWidth, img.naturalHeight);
    yOffset += img.naturalHeight;
  }

  return canvas.toDataURL("image/png");
}

// Amenity Icons
const amenityIcons = {
  "Life Jacket": <AiOutlineCheckCircle className="text-gray-600" />,
  "Brand new Paint": <GiPaintRoller className="text-red-500" />,
  "Brand new Interior": <MdOutlineHomeRepairService className="text-green-600" />,
  "Secret Service": <FaUserTie className="text-blue-600" />,
  Microwave: <MdMicrowave className="text-indigo-500" />,
  "Vip Cab Pick & Drop": <FaCarSide className="text-orange-600" />,
  "Vvip car Pick & Drop": <FaCarSide className="text-orange-600" />,
  "Espresso Coffee Machine": <FaCoffee className="text-amber-600" />,
  Security: <AiOutlineCheckCircle className="text-gray-600" />,
  "Vvip Car inside Airport": <FaCarSide className="text-orange-600" />,
  Bouquet: <FaSeedling className="text-pink-500" />,
  "Air Hostess / Escorts": <FaUserTie className="text-blue-600" />,
  "New FHD Monitor": <MdMonitor className="text-teal-600" />,
  "Full Bar": <AiOutlineCheckCircle className="text-gray-600" />,
  "Personal Gate": <AiOutlineCheckCircle className="text-gray-600" />,
  "Red Carpet": <AiOutlineCheckCircle className="text-gray-600" />,
  Cafe: <FaCoffee className="text-amber-600" />,
  "Airport Pickup": <FaCarSide className="text-orange-600" />,
  "Music System Surround Sound": <FaMusic className="text-purple-600" />,
  "Emergency Evacuation": <AiOutlineCheckCircle className="text-gray-600" />,
  "Hot and Cold Stations": <AiOutlineCheckCircle className="text-gray-600" />,
  "Airport DropOff": <FaCarSide className="text-orange-600" />,
  "Private Security": <AiOutlineCheckCircle className="text-gray-600" />,
  "Power Supply 110V": <BsFillLightningFill className="text-yellow-600" />,
  "Lounge Access": <AiOutlineCheckCircle className="text-gray-600" />,
};

// Chunk array helper
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

// Currency rates
const exchangeRates = {
  USD: 1,
  INR: 82,
  GBP: 0.8,
};

const FlightCard = ({
  filteredData = [],
  onSelectFleet,
  selectedFleet,
  onNextSegment,
  currentTripIndex,
  tripCount,
  isMultiCity,
  readOnly = false,
}) => {
  const [activeDetailsId, setActiveDetailsId] = useState(null);
  const [parsedData, setParsedData] = useState(null);

  // flightId -> DOM node
  const flightCardRefs = useRef({});

  // checkbox state
  const [checkedFlights, setCheckedFlights] = useState({});
  // store screenshots in state + session
  const [snapshots, setSnapshots] = useState({});

  // combined tall image
  const [combinedPreview, setCombinedPreview] = useState(null);

  // user data
  const [userSession, setUserSession] = useState({});

  // Experience modal
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [experienceModalFlightId, setExperienceModalFlightId] = useState(null);
  const [activeTab, setActiveTab] = useState("interior");

  // Share modals
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // On mount, load searchData + user + old snapshots
  useEffect(() => {
    const data = sessionStorage.getItem("searchData");
    if (data) setParsedData(JSON.parse(data));

    const userData = sessionStorage.getItem("loginData");
    if (userData) setUserSession(JSON.parse(userData));

    const storedShots = sessionStorage.getItem("flightShots");
    if (storedShots) {
      try {
        const parsedShots = JSON.parse(storedShots);
        setSnapshots(parsedShots);
      } catch (e) {
        console.error("Error parsing stored screenshots:", e);
      }
    }
  }, []);

  const setCardRef = (flightId, node) => {
    if (node) {
      flightCardRefs.current[flightId] = node;
    }
  };

  const toggleFlightDetails = (flightId) => {
    setActiveDetailsId((prev) => (prev === flightId ? null : flightId));
  };

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

  // Combine all snapshots into one (top to bottom)
  const generateCombinedPreview = async () => {
    if (!Object.keys(snapshots).length) {
      setCombinedPreview(null);
      return;
    }
    const combined = await combineSnapshotsInOneColumn(snapshots);
    setCombinedPreview(combined);
  };

  // open share => generate
  const openWhatsAppModal = async () => {
    await generateCombinedPreview();
    setShowWhatsAppModal(true);
  };
  const openEmailModal = async () => {
    await generateCombinedPreview();
    setShowEmailModal(true);
  };
  const closeWhatsAppModal = () => setShowWhatsAppModal(false);
  const closeEmailModal = () => setShowEmailModal(false);

  const convertPrice = (usdPrice, currency) => {
    const rate = exchangeRates[currency] || 1;
    return Math.round(usdPrice * rate);
  };

  // parse e.g. "21:35"
  function parseTimeString(timeStr) {
    const [hhStr, mmStr] = timeStr.split(":");
    return { hours: Number(hhStr), minutes: Number(mmStr) };
  }
  // parse flightTime e.g. "9h 30m"
  function parseDurationString(durationStr) {
    let durationHours = 0;
    let durationMinutes = 0;
    const hoursMatch = durationStr.match(/(\d+)h/);
    if (hoursMatch) durationHours = Number(hoursMatch[1]);
    const minutesMatch = durationStr.match(/(\d+)m/);
    if (minutesMatch) durationMinutes = Number(minutesMatch[1]);
    return { hours: durationHours, minutes: durationMinutes };
  }
  function calculateArrivalTime(departureTimeStr, flightDurationStr) {
    const { hours: depH, minutes: depM } = parseTimeString(departureTimeStr);
    const { hours: durH, minutes: durM } = parseDurationString(flightDurationStr);

    let totalHours = depH + durH;
    let totalMinutes = depM + durM;
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;
    totalHours = totalHours % 24;

    const hh = String(totalHours).padStart(2, "0");
    const mm = String(totalMinutes).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  // Simple slider
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
      <div className="relative w-full h-[22rem] overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-700"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((imgSrc, i) => (
            <img
              key={i}
              src={imgSrc}
              alt={`Aircraft view ${i}`}
              className="h-[22rem] object-cover flex-shrink-0"
            />
          ))}
        </div>
      </div>
    );
  };

  // user checks a flight => screenshot if not existing
  const handleCheckboxChange = async (flight, e) => {
    const isChecked = e.target.checked;
    setCheckedFlights((prev) => ({
      ...prev,
      [flight.serialNumber]: isChecked,
    }));

    // only capture if we do not have it yet
    if (isChecked && !snapshots[flight.serialNumber]) {
      try {
        const node = flightCardRefs.current[flight.serialNumber];
        if (node) {
          const canvas = await html2canvas(node);
          const dataUrl = canvas.toDataURL("image/png");

          // store in local + session
          const newShots = { ...snapshots, [flight.serialNumber]: dataUrl };
          setSnapshots(newShots);
          sessionStorage.setItem("flightShots", JSON.stringify(newShots));
        }
      } catch (err) {
        console.error("Screenshot failed: ", err);
        toast.error("Screenshot capture failed!");
      }
    }
  };

  // Send via WhatsApp
  const handleSendWhatsApp = async () => {
    if (!combinedPreview) {
      toast.error("No flights selected!");
      return;
    }

    try {
      // Convert DataURL to file
      const file = dataURLtoFile(combinedPreview, "combined_flights.png");
      const formData = new FormData();
      formData.append("profile", file);

      // 1) Upload image to S3 via /api/user/image
      const response = await fetch("/api/user/image", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!result.success) {
        console.error("Upload error:", result);
        toast.error(`Upload error: ${result.error || "Unknown error"}`);
        return;
      }

      const s3Link = result.secureUrl;
      console.log("WhatsApp S3 link:", s3Link);
      toast.success("Image uploaded successfully to S3!");

      // 2) Determine user name & phone from loginData or searchData
      let name = userSession?.name || "";
      let phone = userSession?.phone || "";

      if (!name || !phone) {
        // fallback to searchData userInfo
        const fallbackName = parsedData?.userInfo?.name || "";
        const fallbackPhone = parsedData?.userInfo?.phone || "";

        if (!name) name = fallbackName;
        if (!phone) phone = fallbackPhone;
      }

      // 3) Send name, phone, and imageUrl to fleet-enquiry API
      try {
        const fleetEnquiryResponse = await fetch("/api/fleet-enquiry", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            phone,
            imageUrl: s3Link,
          }),
        });

        if (!fleetEnquiryResponse.ok) {
          console.error("Error sending data to fleet-enquiry:", fleetEnquiryResponse);
          toast.error("Failed to send data to fleet-enquiry API.");
          return;
        }

        const fleetEnquiryData = await fleetEnquiryResponse.json();
        console.log("fleet-enquiry response:", fleetEnquiryData);

        toast.success("Successfully sent data to fleet-enquiry API!");
      } catch (err) {
        console.error("Error in POST request to fleet-enquiry API:", err);
        toast.error("Failed to send data to fleet-enquiry API.");
      }

      // Optionally clear your selections / state
      setCheckedFlights({});
      setSnapshots({});
      sessionStorage.removeItem("flightShots");
      setCombinedPreview(null);
      closeWhatsAppModal();
    } catch (err) {
      console.error("Error in uploading (WhatsApp)", err);
      toast.error("Something went wrong uploading images.");
    }
  };

  // Send via Email
  const handleSendEmail = async () => {
    if (!combinedPreview) {
      toast.error("No flights selected!");
      return;
    }
    try {
      const file = dataURLtoFile(combinedPreview, "combined_flights.png");
      const formData = new FormData();
      formData.append("profile", file);

      const response = await fetch("/api/user/image", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!result.success) {
        console.error("Upload error:", result);
        toast.error(`Upload error: ${result.error || "Unknown error"}`);
        return;
      }
      const s3Link = result.secureUrl;
      console.log("Email S3 link:", s3Link);
      toast.success("Image uploaded successfully to S3!");

      // You might also send an email here or do another fetch call
      // to your backend with the S3 link.

      setCheckedFlights({});
      setSnapshots({});
      sessionStorage.removeItem("flightShots");
      setCombinedPreview(null);
      closeEmailModal();
    } catch (err) {
      console.error("Error in uploading (Email)", err);
      toast.error("Something went wrong uploading images.");
    }
  };

  if (!filteredData.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No flights match the selected criteria.
      </div>
    );
  }

  // motion variants
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
    <>
      <div className="space-y-6 mb-4">
        {filteredData.map((flight) => {
          const isOpen = activeDetailsId === flight.serialNumber;
          const allAmenities = Object.entries(flight.additionalAmenities || {});
          const freeAmenities = allAmenities.filter(
            ([, data]) => data.value === "free"
          );
          const freeServicesToShow = freeAmenities.slice(0, 7);
          const firstLineServices = freeServicesToShow.slice(0, 4);
          const secondLineServices = freeServicesToShow.slice(4, 7);

          const chunkedAmenities = chunkArray(allAmenities, 4);
          const flightPriceUSD = flight.totalPrice
            ? parseInt(flight.totalPrice.replace(/\D/g, ""), 10)
            : 0;

          return (
            <div
              key={flight.serialNumber}
              ref={(node) => setCardRef(flight.serialNumber, node)}
              className="relative flex flex-col md:flex-row items-center rounded-2xl p-4 overflow-hidden
                         hover:shadow-[0_0_8px_rgba(0,0,0,0.25)] transition-shadow duration-300"
            >
              {/* LEFT: Image slider */}
              <div className="relative w-full md:w-2/5">
                <ImageSlider aircraftGallery={flight.aircraftGallery} />
                <p
                  onClick={(e) => handleExperienceClick(flight.serialNumber, e)}
                  className="absolute bottom-2 left-2 text-white text-xl font-semibold italic px-2 py-1 cursor-pointer rounded"
                >
                  See Flight Experience -&gt;
                </p>
              </div>

              {/* RIGHT: flight details or amenities */}
              <div className="w-full md:w-[65%] absolute right-4 rounded-xl bg-stone-50 border border-stone-100">
                <AnimatePresence mode="wait">
                  {/* Collapsed details */}
                  {!isOpen && (
                    <motion.div
                      key="flight-details"
                      variants={flightDetailsVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      transition={{ duration: 0.4 }}
                      className="p-4 py-0 h-full rounded-xl"
                    >
                      {/* Top row */}
                      <div className="flex items-center justify-between border-b border-gray-300 py-2">
                        <div className="flex items-center space-x-2">
                          <img
                            src={
                              flight.logo ||
                              "https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/GF.png?v=19"
                            }
                            alt={flight.title || "Airline"}
                            className="w-10 h-10 object-contain"
                          />
                          <div className="flex flex-col items-end">
                            <h2 className="text-xl font-bold text-gray-800">
                              {flight.fleetDetails.selectedModel || "Gulf Air"}
                            </h2>
                            <p className="text-sm text-gray-700 font-medium">
                              Reg. No:{" "}
                              {flight.fleetDetails.registrationNo || "n/a"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <p className="text-md text-gray-700 flex flex-col items-center">
                            <span>Flight - Duration</span>
                            <span>{flight.flightTime || "n/a"}</span>
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-500">Starting from</p>
                          <p className="text-xl font-bold text-gray-800">
                            USD {convertPrice(flightPriceUSD, "USD").toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            INR {convertPrice(flightPriceUSD, "INR").toLocaleString()},
                            GBP {convertPrice(flightPriceUSD, "GBP").toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Timings row */}
                      <div className="flex items-center space-x-4 md:space-x-8 text-base text-gray-800 mt-2 mb-3">
                        {/* FROM */}
                        <div>
                          <p className="font-semibold">
                            {parsedData?.segments?.[currentTripIndex]?.fromIATA || "DEL"}{" "}
                            -{" "}
                            {parsedData?.segments?.[currentTripIndex]?.departureTime ||
                              "21:35"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {parsedData?.segments?.[currentTripIndex]?.fromCity ||
                              "New Delhi"}
                          </p>
                        </div>

                        <div className="text-sm text-gray-500 text-center">
                          <p className="text-lg text-gray-700 mb-2 flex items-center">
                            ----{" "}
                            <span className="inline-block mx-1">
                              <IoIosAirplane size={32} />
                            </span>{" "}
                            ----
                          </p>
                        </div>

                        {/* TO */}
                        <div>
                          {(() => {
                            const departureTime =
                              parsedData?.segments?.[currentTripIndex]
                                ?.departureTime || "21:35";
                            const flightTime = flight.flightTime || "0h 0m";
                            const arrivalTime = calculateArrivalTime(
                              departureTime,
                              flightTime
                            );
                            return (
                              <>
                                <p className="font-semibold">
                                  {parsedData?.segments?.[currentTripIndex]?.toIATA ||
                                    "LHR"}{" "}
                                  - {arrivalTime}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {parsedData?.segments?.[currentTripIndex]?.toCity ||
                                    "Not found"}
                                </p>
                              </>
                            );
                          })()}
                        </div>

                        {/* Stats: seats, speed, luggage */}
                        <div className="flex">
                          <span className="text-base md:text-lg font-bold text-gray-600 flex items-center mr-2">
                            <MdAirlineSeatReclineExtra size={22} className="mr-1" />
                            {flight.fleetDetails.seatCapacity} | 
                          </span>
                          <span className="text-base md:text-lg font-bold text-gray-600 flex items-center mr-2">
                            <IoMdSpeedometer size={22} className="mr-1" />
                            {flight.fleetDetails.maxSpeed} nm |
                          </span>
                          <span className="text-base md:text-lg font-bold text-gray-600 flex items-center">
                            <BsFillLuggageFill size={22} className="mr-1" />
                            {flight.fleetDetails.luggage}
                          </span>
                        </div>
                      </div>

                      {/* Some free amenities */}
                      {freeServicesToShow.length > 0 ? (
                        <div className="mb-2">
                          <h4 className="text-base font-semibold mb-2">
                            In-Flight Amenities
                          </h4>
                          <ul className="flex space-x-1 mb-1 flex-wrap">
                            {firstLineServices.map(([amenityKey]) => {
                              const IconComp =
                                amenityIcons[amenityKey] || (
                                  <AiOutlineCheckCircle className="text-green-500 mr-2" />
                                );
                              return (
                                <li
                                  key={amenityKey}
                                  className="flex items-center text-base border-r-2 border-gray-300 pr-2 mr-2"
                                >
                                  <span className="mr-1">{IconComp}</span>
                                  <span>{amenityKey}</span>
                                </li>
                              );
                            })}
                          </ul>
                          {secondLineServices.length > 0 && (
                            <ul className="flex space-x-1 flex-wrap">
                              {secondLineServices.map(([amenityKey]) => {
                                const IconComp =
                                  amenityIcons[amenityKey] || (
                                    <AiOutlineCheckCircle className="text-green-500 mr-2" />
                                  );
                                return (
                                  <li
                                    key={amenityKey}
                                    className="flex items-center text-base border-r-2 border-gray-300 pr-2 mr-2"
                                  >
                                    <span className="mr-1">{IconComp}</span>
                                    <span>{amenityKey}</span>
                                  </li>
                                );
                              })}
                              <button
                                onClick={() => toggleFlightDetails(flight.serialNumber)}
                                className="text-base text-blue-700 font-semibold hover:underline"
                              >
                                See more...
                              </button>
                            </ul>
                          )}
                        </div>
                      ) : (
                        <p className="text-base text-gray-600 mb-3">
                          No free services available
                        </p>
                      )}

                      {/* Bottom actions: check/share/select */}
                      {!readOnly && (
                        <div className="flex items-start justify-between mb-4 mt-4 pt-2 border-t border-gray-300">
                          {/* LEFT: checkbox + share */}
                          <div className="flex items-end">
                            <label className="flex items-start flex-col">
                              <input
                                type="checkbox"
                                className="w-4 h-4"
                                checked={checkedFlights[flight.serialNumber] || false}
                                onChange={(e) => handleCheckboxChange(flight, e)}
                              />
                              <span className="text-xs">Select for sharing</span>
                            </label>

                            <button
                              onClick={openWhatsAppModal}
                              className="flex flex-col items-center text-green-600 hover:text-green-700 mx-2"
                            >
                              <FaWhatsapp className="text-2xl" />
                              <span className="text-xs mt-1">Send via WhatsApp</span>
                            </button>

                            <button
                              onClick={openEmailModal}
                              className="flex flex-col items-center text-gray-700 hover:text-gray-900"
                            >
                              <AiOutlineMail className="text-2xl" />
                              <span className="text-xs mt-1">Send via Email</span>
                            </button>
                          </div>

                          {/* RIGHT: "Select Fleet" & possibly Next Enquiry */}
                          <div className="flex items-center space-x-4 mt-4 md:mt-0">
                            <button
                              onClick={() => onSelectFleet(flight)}
                              className={`${
                                selectedFleet?.serialNumber === flight.serialNumber
                                  ? "bg-red-500 focus:ring-2 focus:ring-red-300"
                                  : "bg-gradient-to-r from-green-500 to-green-700"
                              } text-white text-base font-semibold px-4 py-2 rounded shadow-md`}
                            >
                              {selectedFleet?.serialNumber === flight.serialNumber
                                ? "Fleet Selected"
                                : "Select Flight"}
                            </button>

                            {selectedFleet?.serialNumber === flight.serialNumber && (
                              <>
                                {isMultiCity ? (
                                  currentTripIndex < tripCount - 1 ? (
                                    <button
                                      onClick={onNextSegment}
                                      className="bg-blue-600 text-white px-4 py-2 rounded shadow-md"
                                    >
                                      Select Next Fleet
                                    </button>
                                  ) : (
                                    <Link href="/finalEnquiry">
                                      <button className="bg-green-600 text-white px-4 py-2 rounded shadow-md">
                                        Proceed to Enquiry
                                      </button>
                                    </Link>
                                  )
                                ) : (
                                  <Link href="/finalEnquiry">
                                    <button className="bg-green-600 text-white px-4 py-2 rounded shadow-md">
                                      Proceed to Enquiry
                                    </button>
                                  </Link>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      )}
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
                      className="bg-white p-4 pb-0 h-full rounded-xl"
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
                          <div className="flex flex-col items-end">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                              {flight.fleetDetails.selectedModel || "Gulf Air"}
                            </h2>
                            <p className="text-sm text-gray-700 font-medium">
                              Reg. No:{" "}
                              {flight.fleetDetails.registrationNo || "Gulf Air"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Starting from</p>
                          <p className="text-2xl font-bold text-gray-800">
                            USD {convertPrice(flightPriceUSD, "USD").toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            INR {convertPrice(flightPriceUSD, "INR").toLocaleString()},
                            GBP {convertPrice(flightPriceUSD, "GBP").toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {allAmenities.length > 0 ? (
                        <div className="mt-3">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold">
                              Additional Services
                            </h3>
                            <button
                              onClick={() => toggleFlightDetails(flight.serialNumber)}
                              className="text-base text-blue-500"
                            >
                              Hide Flight Details ^
                            </button>
                          </div>

                          <div
                            className="max-w-[40rem] h-32 relative border border-gray-300 rounded p-2 group"
                            style={{ overflowX: "auto" }}
                          >
                            <style>
                              {`
                                .group::-webkit-scrollbar {
                                  width: 6px;
                                  height: 6px;
                                }
                                .group::-webkit-scrollbar-track {
                                  background: #f0f0f0;
                                  border-radius: 6px;
                                }
                                .group::-webkit-scrollbar-thumb {
                                  background-color: #bfbfbf;
                                  border-radius: 6px;
                                }
                                .group:hover::-webkit-scrollbar-thumb {
                                  background-color: #999;
                                }
                              `}
                            </style>

                            <div className="flex flex-row flex-nowrap gap-8">
                              {chunkedAmenities.map((column, colIndex) => (
                                <div
                                  key={colIndex}
                                  className="flex flex-col space-y-2 min-w-[250px]"
                                >
                                  {column.map(([amenityKey, amenityData]) => {
                                    const IconComp =
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
                                        <span>{IconComp}</span>
                                        <span className="font-medium text-base text-gray-800">
                                          {amenityKey}
                                        </span>
                                        <span
                                          className={`text-sm font-semibold ml-2 px-2 py-1 rounded ${
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
                        <p className="text-base text-gray-600 mt-3">
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

      {/* WHATSAPP MODAL */}
      {showWhatsAppModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeWhatsAppModal}
        >
          <div
            className="bg-white w-11/12 md:w-1/2 p-5 rounded-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeWhatsAppModal}
              className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded"
            >
              X
            </button>
            <h2 className="text-xl font-semibold mb-4">Send via WhatsApp</h2>

            {combinedPreview ? (
              <div className="max-h-64 overflow-auto border p-2 rounded mb-4">
                <img
                  src={combinedPreview}
                  alt="All selected flights"
                  className="w-full h-auto"
                />
              </div>
            ) : (
              <p className="text-gray-600 mb-4">No flights selected.</p>
            )}

            <input
              type="text"
              defaultValue={userSession?.phone || parsedData?.userInfo?.phone}
              className="border border-gray-300 w-full p-2 rounded mb-4"
              placeholder="+1234567890"
            />
            <button
              onClick={handleSendWhatsApp}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* EMAIL MODAL */}
      {showEmailModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeEmailModal}
        >
          <div
            className="bg-white w-11/12 md:w-1/2 p-5 rounded-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeEmailModal}
              className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded"
            >
              X
            </button>
            <h2 className="text-xl font-semibold mb-4">Send via Email</h2>

            {combinedPreview ? (
              <div className="max-h-64 overflow-auto border p-2 rounded mb-4">
                <img
                  src={combinedPreview}
                  alt="All selected flights"
                  className="w-full h-auto"
                />
              </div>
            ) : (
              <p className="text-gray-600 mb-4">No flights selected.</p>
            )}

            <input
              type="email"
              defaultValue={userSession?.email || ""}
              className="border border-gray-300 w-full p-2 rounded mb-4"
              placeholder="name@example.com"
            />
            <button
              onClick={handleSendEmail}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* React-Toastify container */}
      <ToastContainer
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{
          position: "fixed",
          top: "12%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 100,
        }}
      />
    </>
  );
};

export default FlightCard;
