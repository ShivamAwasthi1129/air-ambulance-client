"use client"; // For Next.js App Router

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";  // <-- Import the Next.js 13+ router
import html2canvas from "html2canvas";

// React-Toastify
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Icons
import { FaWhatsapp, FaArrowLeft, FaArrowRight } from "react-icons/fa";
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
  const router = useRouter();          
  const [activeDetailsId, setActiveDetailsId] = useState(null);
  const [parsedData, setParsedData] = useState(null);

  const flightCardRefs = useRef({});   // flightId -> DOM node

  // For screenshot selection
  const [checkedFlights, setCheckedFlights] = useState({});
  const [snapshots, setSnapshots] = useState({});
  const [combinedPreview, setCombinedPreview] = useState(null);

  // For user data
  const [userSession, setUserSession] = useState({});

  // For "experience" modal
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [experienceModalFlightId, setExperienceModalFlightId] = useState(null);
  const [activeTab, setActiveTab] = useState("interior");

  // For share modals
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // For "Proceed to Pay" spinner
  const [isProceeding, setIsProceeding] = useState(false);

  // Send button states
  // 'idle' | 'sending' | 'sent'
  const [whatsAppSendState, setWhatsAppSendState] = useState("idle");
  const [emailSendState, setEmailSendState] = useState("idle");

  // NEW: Track email input from the modal
  const [emailModalInput, setEmailModalInput] = useState("");

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

  // Initialize email input if userSession has an email
  useEffect(() => {
    if (userSession?.email) {
      setEmailModalInput(userSession.email);
    }
  }, [userSession]);

  // Combine snapshots to show them in share modals
  const generateCombinedPreview = async () => {
    if (!Object.keys(snapshots).length) {
      setCombinedPreview(null);
      return;
    }
    const combined = await combineSnapshotsInOneColumn(snapshots);
    setCombinedPreview(combined);
  };

  // SHARE triggers
  const openWhatsAppModal = async () => {
    await generateCombinedPreview();
    setShowWhatsAppModal(true);
  };
  const openEmailModal = async () => {
    await generateCombinedPreview();
    setShowEmailModal(true);
  };
  const closeWhatsAppModal = () => {
    setShowWhatsAppModal(false);
    setWhatsAppSendState("idle"); // reset state
  };
  const closeEmailModal = () => {
    setShowEmailModal(false);
    setEmailSendState("idle"); // reset state
  };

  // For flight details expand/collapse
  const setCardRef = (flightId, node) => {
    if (node) flightCardRefs.current[flightId] = node;
  };
  const toggleFlightDetails = (flightId) => {
    setActiveDetailsId((prev) => (prev === flightId ? null : flightId));
  };

  // Show/Hide "Experience" modal
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

  // Handle screenshot selection
  const handleCheckboxChange = async (flight, e) => {
    const isChecked = e.target.checked;
    setCheckedFlights((prev) => ({
      ...prev,
      [flight._id]: isChecked,
    }));

    // only capture if not existing yet
    if (isChecked && !snapshots[flight._id]) {
      try {
        const node = flightCardRefs.current[flight._id];
        if (node) {
          const canvas = await html2canvas(node);
          const dataUrl = canvas.toDataURL("image/png");
          const newShots = { ...snapshots, [flight._id]: dataUrl };
          setSnapshots(newShots);
          sessionStorage.setItem("flightShots", JSON.stringify(newShots));
        }
      } catch (err) {
        console.error("Screenshot failed: ", err);
        toast.error("Screenshot capture failed!");
      }
    } else if (!isChecked) {
      // If user unchecks, remove from snapshots:
      const newShots = { ...snapshots };
      delete newShots[flight._id];
      setSnapshots(newShots);
      sessionStorage.setItem("flightShots", JSON.stringify(newShots));
    }
  };

  // Price conversion
  const convertPrice = (usdPrice, currency) => {
    const rate = exchangeRates[currency] || 1;
    return Math.round(usdPrice * rate);
  };

  // Helper to parse times
  function parseTimeString(timeStr) {
    const [hhStr, mmStr] = timeStr.split(":");
    return { hours: Number(hhStr), minutes: Number(mmStr) };
  }
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

  // ---------------------------
  //  Image Slider with arrows
  // ---------------------------
  const ImageSlider = ({ aircraftGallery }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [
      aircraftGallery?.exterior ? Object.values(aircraftGallery.exterior)[0] : null,
      aircraftGallery?.interior ? Object.values(aircraftGallery.interior)[0] : null,
      aircraftGallery?.cockpit ? Object.values(aircraftGallery.cockpit)[0] : null,
    ].filter(Boolean);

    // Auto-slide every 4s
    useEffect(() => {
      if (images.length > 1) {
        const interval = setInterval(() => {
          setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 4000);
        return () => clearInterval(interval);
      }
    }, [images]);

    const handlePrev = (e) => {
      e.stopPropagation();
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = (e) => {
      e.stopPropagation();
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    if (!images.length) {
      return (
        <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-500">No image available</span>
        </div>
      );
    }

    return (
      <div className="relative w-full h-[22rem] overflow-hidden rounded-2xl">
        {/* Slide container */}
        <div
          className="flex transition-transform duration-700 h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((imgSrc, i) => (
            <img
              key={i}
              src={imgSrc}
              alt={`Aircraft view ${i}`}
              className="w-full h-full object-cover flex-shrink-0"
            />
          ))}
        </div>

        {/* Left Arrow */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 
                       bg-black/30 text-white p-2 rounded-full 
                       hover:bg-black/50 z-10"
          >
            <FaArrowLeft size={20} />
          </button>
        )}

        {/* Right Arrow */}
        {/* {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 
                       bg-black/30 text-white p-2 rounded-full 
                       hover:bg-black/50 z-10"
          >
            <FaArrowRight size={20} />
          </button>
        )} */}
      </div>
    );
  };

  // Sending images & data via WhatsApp
  const handleSendWhatsApp = async () => {
    if (!combinedPreview) {
      toast.error("No flights selected!");
      return;
    }

    try {
      setWhatsAppSendState("sending");

      const file = dataURLtoFile(combinedPreview, "combined_flights.png");
      const formData = new FormData();
      formData.append("profile", file);

      // 1) Upload image to S3
      const response = await fetch("/api/user/image", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!result.success) {
        console.error("Upload error:", result);
        toast.error(`Upload error: ${result.error || "Unknown error"}`);
        setWhatsAppSendState("idle");
        return;
      }
      const s3Link = result.secureUrl;
      toast.success("Image uploaded successfully to S3!");

      // 2) Determine user name & phone
      let name = userSession?.name || "";
      let phone = userSession?.phone || "";
      if (!name || !phone) {
        const fallbackName = parsedData?.userInfo?.name || "";
        const fallbackPhone = parsedData?.userInfo?.phone || "";
        if (!name) name = fallbackName;
        if (!phone) phone = fallbackPhone;
      }

      // 3) Send to fleet-enquiry
      try {
        const fleetEnquiryResponse = await fetch("/api/fleet-enquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, phone, imageUrl: s3Link }),
        });

        if (!fleetEnquiryResponse.ok) {
          console.error("Error sending data to fleet-enquiry:", fleetEnquiryResponse);
          toast.error("Failed to send data to fleet-enquiry API.");
          setWhatsAppSendState("idle");
          return;
        }
        const fleetEnquiryData = await fleetEnquiryResponse.json();
        console.log("fleet-enquiry response:", fleetEnquiryData);
        toast.success("Successfully sent data to fleet-enquiry API!");

        // Done sending
        setWhatsAppSendState("sent");
      } catch (err) {
        console.error("Error in POST request to fleet-enquiry API:", err);
        toast.error("Failed to send data to fleet-enquiry API.");
        setWhatsAppSendState("idle");
      }

      // Clean up if you want:
      setCheckedFlights({});
      setSnapshots({});
      sessionStorage.removeItem("flightShots");
      setCombinedPreview(null);
    } catch (err) {
      console.error("Error in uploading (WhatsApp)", err);
      toast.error("Something went wrong uploading images.");
      setWhatsAppSendState("idle");
    }
  };

  // ---------------------------------------------------------------------------------
  // Sending images & data via Email (NEW: add POST to /api/feviamail with S3 link)
  // ---------------------------------------------------------------------------------
  const handleSendEmail = async () => {
    if (!combinedPreview) {
      toast.error("No flights selected!");
      return;
    }

    try {
      setEmailSendState("sending");

      const file = dataURLtoFile(combinedPreview, "combined_flights.png");
      const formData = new FormData();
      formData.append("profile", file);

      // 1) Upload image to S3
      const response = await fetch("/api/user/image", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!result.success) {
        console.error("Upload error:", result);
        toast.error(`Upload error: ${result.error || "Unknown error"}`);
        setEmailSendState("idle");
        return;
      }
      const s3Link = result.secureUrl;
      toast.success("Image uploaded successfully to S3!");

      // 2) Send the link + email address to /api/feviamail
      try {
        // If user typed a different email, we use `emailModalInput`
        const feviamailResponse = await fetch("/api/feviamail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailModalInput,
            imageURL: s3Link,
          }),
        });

        if (!feviamailResponse.ok) {
          console.error("Error sending data to /api/feviamail:", feviamailResponse);
          toast.error("Failed to send data to feviamail API.");
          setEmailSendState("idle");
          return;
        }

        const feviamailData = await feviamailResponse.json();
        console.log("feviamail response:", feviamailData);
        toast.success("Successfully sent data to feviamail API!");
        setEmailSendState("sent");
      } catch (err) {
        console.error("Error in POST request to feviamail API:", err);
        toast.error("Failed to send data to feviamail API.");
        setEmailSendState("idle");
      }

      // Clean up
      setCheckedFlights({});
      setSnapshots({});
      sessionStorage.removeItem("flightShots");
      setCombinedPreview(null);
    } catch (err) {
      console.error("Error in uploading (Email)", err);
      toast.error("Something went wrong uploading images.");
      setEmailSendState("idle");
    }
  };

  // Handle "Proceed to Pay" button
  const handleProceedToPay = () => {
    setIsProceeding(true);
    // For demonstration, wait ~1s then route:
    setTimeout(() => {
      router.push("/finalEnquiry");
    }, 1000);
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
    <div>
      <div className="space-y-6 mb-4">
        {filteredData.map((flight) => {
          const isOpen = activeDetailsId === flight._id;
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
              key={flight._id}
              ref={(node) => setCardRef(flight._id, node)}
              className="relative flex flex-col md:flex-row items-center rounded-2xl p-4 overflow-hidden
                         hover:shadow-[0_0_8px_rgba(0,0,0,0.25)] transition-shadow duration-300"
            >
              {/* LEFT: Image slider */}
              <div className="relative w-full md:w-2/5">
                <ImageSlider aircraftGallery={flight.aircraftGallery} />
                <p
                  onClick={(e) => handleExperienceClick(flight._id, e)}
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
                      key={`flight-details-${flight._id}`}
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
                          <p className="text-sm text-gray-500">approx~</p>
                          <p className="text-xl font-bold text-gray-800">
                            USD {convertPrice(flightPriceUSD, "USD").toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
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
                            {parsedData?.segments?.[currentTripIndex]?.fromIATA ||
                              "DXB"}{" "}
                            -{" "}
                            {parsedData?.segments?.[currentTripIndex]?.departureTime ||
                              "21:35"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {parsedData?.segments?.[currentTripIndex]?.fromCity ||
                              "Dubai"}
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
                                    "DEL"}{" "}
                                  - {arrivalTime}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {parsedData?.segments?.[currentTripIndex]?.toCity ||
                                    "New Delhi"}
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
                          <span className="text-base md:text-lg font-bold text-gray-600 flex items-center">
                            <BsFillLuggageFill size={22} className="mr-1" />
                            {flight.fleetDetails.luggage} | 
                          </span>
                          <span className="text-base md:text-lg font-bold text-gray-600 flex items-center mr-2 ml-2">
                            <IoMdSpeedometer size={22} className="mr-1" />
                            {flight.fleetDetails.maxSpeed} nm 
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
                                onClick={() => toggleFlightDetails(flight._id)}
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
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-4 mt-4 pt-2 border-t border-gray-300">
                          {/* LEFT: checkbox + share */}
                          <div className="flex items-center mt-2">
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="w-4 h-4 mr-2"
                                checked={checkedFlights[flight._id] || false}
                                onChange={(e) => handleCheckboxChange(flight, e)}
                              />
                              <span className="text-sm">Select for sharing</span>
                            </label>

                            <button
                              onClick={openWhatsAppModal}
                              className="flex flex-col items-center text-green-600 hover:text-green-700 mx-3"
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

                          {/* RIGHT: "Select Fleet" & possibly Next step */}
                          <div className="flex items-center space-x-4 mt-4 md:mt-0">
                            <button
                              onClick={() => onSelectFleet(flight)}
                              className={`${
                                selectedFleet?._id === flight._id
                                  ? "bg-red-500 focus:ring-2 focus:ring-red-300"
                                  : "bg-gradient-to-r from-green-500 to-green-700"
                              } text-white text-base font-semibold px-4 py-2 rounded shadow-md`}
                            >
                              {selectedFleet?._id === flight._id
                                ? "Fleet Selected"
                                : "Select Flight"}
                            </button>

                            {/* If this flight is selected, show next step */}
                            {selectedFleet?._id === flight._id && (
                              <>
                                {/* If multi-city and more segments, show "Select Next Fleet" */}
                                {isMultiCity ? (
                                  currentTripIndex < tripCount - 1 ? (
                                    <button
                                      onClick={onNextSegment}
                                      className="bg-blue-600 text-white px-4 py-2 rounded shadow-md"
                                    >
                                      Select Next Fleet
                                    </button>
                                  ) : (
                                    // Otherwise final step -> "Proceed to Pay"
                                    <button
                                      onClick={handleProceedToPay}
                                      disabled={isProceeding}
                                      className="bg-green-600 text-white px-4 py-2 rounded shadow-md flex items-center"
                                    >
                                      {isProceeding ? (
                                        <>
                                          <span className="inline-block w-4 h-4 border-2 border-t-transparent border-white border-solid rounded-full animate-spin mr-2" />
                                          Proceeding...
                                        </>
                                      ) : (
                                        "Proceed to Pay"
                                      )}
                                    </button>
                                  )
                                ) : (
                                  // For one-way, same final button
                                  <button
                                    onClick={handleProceedToPay}
                                    disabled={isProceeding}
                                    className="bg-green-600 text-white px-4 py-2 rounded shadow-md flex items-center"
                                  >
                                    {isProceeding ? (
                                      <>
                                        <span className="inline-block w-4 h-4 border-2 border-t-transparent border-white border-solid rounded-full animate-spin mr-2" />
                                        Proceeding...
                                      </>
                                    ) : (
                                      "Proceed to Pay"
                                    )}
                                  </button>
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
                      key={`amenities-${flight._id}`}
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
                            INR {convertPrice(flightPriceUSD, "INR").toLocaleString()},{" "}
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
                              onClick={() => toggleFlightDetails(flight._id)}
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
              if (f._id !== experienceModalFlightId) return null;
              const gallery = f.aircraftGallery || {};
              return (
                <div key={f._id} className="overflow-auto h-full">
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
              disabled={whatsAppSendState === "sending" || whatsAppSendState === "sent"}
              className="bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center"
            >
              {whatsAppSendState === "sending" ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : whatsAppSendState === "sent" ? (
                <>
                  <AiOutlineCheckCircle className="text-white mr-2" />
                  Sent
                </>
              ) : (
                "Send"
              )}
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

            {/* We bind the input to emailModalInput */}
            <input
              type="email"
              value={emailModalInput}
              onChange={(e) => setEmailModalInput(e.target.value)}
              className="border border-gray-300 w-full p-2 rounded mb-4"
              placeholder="name@example.com"
            />

            <button
              onClick={handleSendEmail}
              disabled={emailSendState === "sending" || emailSendState === "sent"}
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center"
            >
              {emailSendState === "sending" ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : emailSendState === "sent" ? (
                <>
                  <AiOutlineCheckCircle className="text-white mr-2" />
                  Sent
                </>
              ) : (
                "Send"
              )}
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
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        draggable={false}
        style={{
          position: "fixed",
          top: "12%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 100,
        }}
      />
    </div>
  );
};

export default FlightCard;
