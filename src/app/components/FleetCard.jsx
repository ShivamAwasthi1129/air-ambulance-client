"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import ImageSlider from "./imageSlider";
// React-Toastify
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Icons
import { FaArrowLeft, FaArrowRight, FaWhatsapp } from "react-icons/fa";
import { AiOutlineCheckCircle, AiOutlineMail } from "react-icons/ai";
import { IoIosAirplane, IoMdSpeedometer } from "react-icons/io";
import { BsFillLuggageFill, BsFillLightningFill } from "react-icons/bs";
import {
  MdAirlineSeatReclineExtra,
  MdOutlineHomeRepairService,
  MdMicrowave,
  MdMonitor,
} from "react-icons/md";
import { GiPaintRoller } from "react-icons/gi";
import { FaUserTie, FaCarSide, FaMusic, FaCoffee, FaSeedling } from "react-icons/fa";

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

  // Use natural dimensions
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



// Helper to parse times
function parseTimeString(timeStr) {
  const [hhStr, mmStr] = timeStr.split(":");
  return { hours: Number(hhStr), minutes: Number(mmStr) };
}
function parseDurationString(durationStr) {
  // e.g. "1h 26m"
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
export default function FlightCard({
  filteredData = [],
  onSelectFleet,
  selectedFleet,
  onNextSegment,
  currentTripIndex,
  tripCount,
  isMultiCity,
  addOnServices = [],
  readOnly = false,
  segment,
  label,
}) {
  const router = useRouter();
  // ------------------------------------------------
  // States & Refs
  // ------------------------------------------------
  const [parsedData, setParsedData] = useState(null);
  const [userSession, setUserSession] = useState({});

  const [checkedFlights, setCheckedFlights] = useState({});
  const [snapshots, setSnapshots] = useState({});
  const [combinedPreview, setCombinedPreview] = useState(null);

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
  const [whatsAppSendState, setWhatsAppSendState] = useState("idle");
  const [emailSendState, setEmailSendState] = useState("idle");
  const [emailModalInput, setEmailModalInput] = useState("");

  // Exchange Rates
  const [exchangeRates, setExchangeRates] = useState(() => {
    const storedRates = sessionStorage.getItem("exchangeRates");
    return storedRates ? JSON.parse(storedRates) : { inrRate: 0, gbpRate: 0 };
  });

  // Each flight has its own amenity offset for the carousel
  const [amenityOffsets, setAmenityOffsets] = useState({});

  // Refs
  const flightCardRefs = useRef({}); // flightId -> DOM node

  // ------------------------------------------------
  // Load from Session Storage
  // ------------------------------------------------
  useEffect(() => {
    const data = sessionStorage.getItem("searchData");
    if (data) {
      setParsedData(JSON.parse(data));
    }

    const userData = sessionStorage.getItem("loginData");
    if (userData) {
      setUserSession(JSON.parse(userData));
    }

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
  // If user session has an email, prefill
  useEffect(() => {
    if (userSession?.email) {
      setEmailModalInput(userSession.email);
    }
  }, [userSession]);

  // ------------------------------------------------
  // Fetch Exchange Rates if needed
  // ------------------------------------------------
  useEffect(() => {
    async function fetchRates() {
      try {
        const inrRes = await fetch(
          "https://1zukmeixgi.execute-api.ap-south-1.amazonaws.com/v1/currencies/convert?from=USD&to=INR&amount=1"
        );
        const inrData = await inrRes.json();
        const inrRate = inrData?.conversion?.result || 0;
        const gbpRes = await fetch(
          "https://1zukmeixgi.execute-api.ap-south-1.amazonaws.com/v1/currencies/convert?from=USD&to=GBP&amount=1"
        );
        const gbpData = await gbpRes.json();
        const gbpRate = gbpData?.conversion?.result || 0;

        const newRates = { inrRate, gbpRate };
        setExchangeRates(newRates);
        sessionStorage.setItem("exchangeRates", JSON.stringify(newRates));
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    }

    if (!exchangeRates.inrRate || !exchangeRates.gbpRate) {
      fetchRates();
    }
  }, [exchangeRates]);

  // ------------------------------------------------
  // Screenshot Selections
  // ------------------------------------------------
  const setCardRef = (flightId, node) => {
    if (node) flightCardRefs.current[flightId] = node;
  };

  const handleCheckboxChange = async (flight, e) => {
    const isChecked = e.target.checked;
    setCheckedFlights((prev) => ({
      ...prev,
      [flight._id]: isChecked,
    }));

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
      const newShots = { ...snapshots };
      delete newShots[flight._id];
      setSnapshots(newShots);
      sessionStorage.setItem("flightShots", JSON.stringify(newShots));
    }
  };

  // Combine snapshots for share modals
  const generateCombinedPreview = async () => {
    if (!Object.keys(snapshots).length) {
      setCombinedPreview(null);
      return;
    }
    const combined = await combineSnapshotsInOneColumn(snapshots);
    setCombinedPreview(combined);
  };

  // ------------------------------------------------
  // Share modals
  // ------------------------------------------------
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
    setWhatsAppSendState("idle");
  };
  const closeEmailModal = () => {
    setShowEmailModal(false);
    setEmailSendState("idle");
  };

  // WhatsApp sending
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

      // 1) Upload image
      const response = await fetch("/api/user/image", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!result.success) {
        toast.error(`Upload error: ${result.error || "Unknown error"}`);
        setWhatsAppSendState("idle");
        return;
      }
      const s3Link = result.secureUrl;
      // toast.success("Image uploaded successfully!");

      // 2) Send to your backend
      let name = userSession?.name || parsedData?.userInfo?.name || "User";
      let phone = userSession?.phone || parsedData?.userInfo?.phone || "";
      const fleetEnquiryResponse = await fetch("/api/fleet-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, imageUrl: s3Link }),
      });
      if (!fleetEnquiryResponse.ok) {
        toast.error("Failed to send data to fleet-enquiry API.");
        setWhatsAppSendState("idle");
        return;
      }
      toast.success("Image Sent Successfully!");
      setWhatsAppSendState("sent");

      // Clean up
      setCheckedFlights({});
      setSnapshots({});
      sessionStorage.removeItem("flightShots");
      setCombinedPreview(null);
    } catch (err) {
      console.error("Error uploading (WhatsApp):", err);
      toast.error("Something went wrong uploading images.");
      setWhatsAppSendState("idle");
    }
  };

  // Email sending
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

      // 1) Upload image
      const response = await fetch("/api/user/image", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!result.success) {
        toast.error(`Upload error: ${result.error || "Unknown error"}`);
        setEmailSendState("idle");
        return;
      }
      const s3Link = result.secureUrl;
      // toast.success("Image uploaded successfully!");

      // 2) Send to your email API
      const feviamailResponse = await fetch("/api/feviamail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailModalInput,
          imageURL: s3Link,
        }),
      });
      if (!feviamailResponse.ok) {
        toast.error("Failed to send data to feviamail API.");
        setEmailSendState("idle");
        return;
      }
      toast.success("Details Shared Successfully!");
      setEmailSendState("sent");

      // Clean up
      setCheckedFlights({});
      setSnapshots({});
      sessionStorage.removeItem("flightShots");
      setCombinedPreview(null);
    } catch (err) {
      console.error("Error uploading (Email):", err);
      toast.error("Something went wrong uploading images.");
      setEmailSendState("idle");
    }
  };

  // ------------------------------------------------
  // Experience Modal
  // ------------------------------------------------
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

  // ------------------------------------------------
  // Proceed to Pay
  // ------------------------------------------------
  const handleProceedToPay = () => {
    setIsProceeding(true);
    setTimeout(() => {
      router.push("/finalEnquiry");
    }, 1000);
  };

  // ------------------------------------------------
  // Image Slider (interior/exterior/cockpit)
  // ------------------------------------------------


  // ------------------------------------------------
  // Amenity Carousel: Infinite wrap-around
  // ------------------------------------------------
  const getAmenityOffset = (flightId) => amenityOffsets[flightId] || 0;

  const shiftAmenityLeft = (flightId, length) => {
    let offset = getAmenityOffset(flightId);
    offset--;
    // wrap
    if (offset < 0) offset = length - 1;
    setAmenityOffsets((prev) => ({ ...prev, [flightId]: offset }));
  };

  const shiftAmenityRight = (flightId, length) => {
    let offset = getAmenityOffset(flightId);
    offset++;
    // wrap
    if (offset >= length) offset = 0;
    setAmenityOffsets((prev) => ({ ...prev, [flightId]: offset }));
  };
  // ------------------------------------------------
  // Render
  // ------------------------------------------------
  if (!filteredData.length) {
    return (
      <div className="text-center text-gray-600 py-6">
        No flights match the selected criteria.
      </div>
    );
  }
  if (!parsedData?.segments) {
    return <div>Loading flight data…</div>;
  }

  return (
    <div className="bg-[#d5e3f4] p-4 md:p-8">
      <div className="space-y-6">
        {filteredData.map((flight) => {
          const flightId = flight._id;
          // Price calculations
          const flightPriceUSD = flight.totalPrice
            ? parseInt(flight.totalPrice.replace(/\D/g, ""), 10)
            : 0;
          const inrPrice = Math.round(flightPriceUSD * exchangeRates.inrRate);
          const gbpPrice = Math.round(flightPriceUSD * exchangeRates.gbpRate);

          // Times
          const depTime =
            parsedData?.segments?.[currentTripIndex]?.departureTime || "12:00";
          const flightTime = flight.flightTime || "N/A";
          const arrTime = calculateArrivalTime(depTime, flightTime);
          const fromCity =
            parsedData?.segments?.[currentTripIndex]?.fromCity || "Dubai";
          const fromIATA =
            parsedData?.segments?.[currentTripIndex]?.fromIATA || "DXB";
          const toCity =
            parsedData?.segments?.[currentTripIndex]?.toCity || "New Delhi";
          const toIATA =
            parsedData?.segments?.[currentTripIndex]?.toIATA || "DEL";
          // Amenities
          const allAmenities = Object.entries(flight.additionalAmenities || {});
          const offset = getAmenityOffset(flightId);
          const itemWidth = 64; // px
          // If no amenities, we'll just skip the carousel
          const length = allAmenities.length;
          const containerWidth = 7 * itemWidth; // show 7 icons
          const translateX = -(offset * itemWidth);
          // Add this helper function inside the component

          const isCoordinate = (str) => /^-?\d+\.\d+,-?\d+\.\d+$/.test(str.trim().split("-(")[0]);
          const [fromPart, toPart] = (label || "").split(" ➜ ");
          // console.log("fromPart:", fromPart);
          // console.log("toPart:", toPart);

          let fromTopLabel, fromBottomLabel, toTopLabel, toBottomLabel;

          // Handle "from" side
          if (isCoordinate(fromPart)) {
            const coordsMatch = fromPart.match(/^(-?\d+\.\d+,-?\d+\.\d+)/);
            const addressMatch = fromPart.match(/\-\((.*?)\)$/);
            fromTopLabel = coordsMatch ? coordsMatch[1].trim() : "N/A";
            fromBottomLabel = addressMatch ? addressMatch[1].trim() : "N/A";
          } else {
            fromTopLabel = segment.fromIATA || "N/A";
            fromBottomLabel = segment.fromCity || "N/A";
          }

          // Handle "to" side
          if (isCoordinate(toPart)) {
            const coordsMatch = toPart.match(/^(-?\d+\.\d+,-?\d+\.\d+)/);
            const addressMatch = toPart.match(/\-\((.*?)\)$/);
            toTopLabel = coordsMatch ? coordsMatch[1].trim() : "N/A";
            toBottomLabel = addressMatch ? addressMatch[1].trim() : "N/A";
          } else {
            toTopLabel = segment.toIATA || "N/A";
            toBottomLabel = segment.toCity || "N/A";
          }

          return (
            <div
              key={flightId}
              ref={(node) => setCardRef(flightId, node)}
              className="relative flex flex-col md:flex-row items-stretch 
                         bg-white shadow-md rounded-3xl overflow-hidden "
            >
              {/* LEFT - Image Area */}
              <div className="relative w-full md:w-[27%] p-2 md:self-stretch flex">
                <div className="w-full h-44 md:h-full md:min-h-[300px] overflow-hidden rounded-2xl flex">
                  <ImageSlider
                    aircraftGallery={flight.aircraftGallery}
                    onExperience={(e) => handleExperienceClick(flightId, e)}
                  />
                </div>
              </div>

              {/* MIDDLE - Vertical timeline / line (design only on larger screens) */}
              <div className="hidden md:flex flex-col items-center justify-center px-1 pr-0 relative ">
                <div className="w-16 h-16 bg-[#d5e3f4] rounded-full -translate-y-8" />
                <div
                  style={{ height: "70%" }}
                  className="border-dashed border-l-4 border-gray-300"
                />
                <div className="w-16 h-16 bg-[#d5e3f4] rounded-full translate-y-8" />
              </div>
              {/* RIGHT - Details */}
              <div className="w-full md:w-[72%] relative flex lg:flex-row flex-col">
                {/* Top row: Fleet Info + Price + Select button */}
                <div className="flex w-full md:w-[22rem] flex-col justify-center items-center md:justify-evenly md:items-center ">
                  {/* Fleet info */}
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src={
                        flight.logo ||
                        "https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/GF.png"
                      }
                      alt="Fleet Logo"
                      className="w-16 h-16 object-contain"
                    />
                    <div className="flex flex-col items-center">
                      <h2 className="text-lg md:text-xl font-bold text-gray-800 text-center">
                        {flight.fleetDetails.selectedModel || "Gulfstream G700"}
                      </h2>
                      {/* <p className="text-md my-1">JET X 2(Twin Engine) Private Jet</p> */}
                      <p className="text-md my-1">{flight.fleetDetails.engineType} - {flight.fleetDetails.flightType}</p>
                      <p className="text-md text-gray-700 font-medium">
                        Reg. No: {flight.fleetDetails.registrationNo || "N/A"}
                      </p>
                    </div>
                    <div className="text-left flex flex-col justify-center items-center mt-6">
                      <p className="text-sky-400 font-bold text-base md:text-xl">Approx Time</p>
                      <div className="flex items-center justify-center gap-3 whitespace-normal md:whitespace-nowrap">
                        {/* Departure */}
                        <div className="flex flex-col items-center leading-tight">
                          <span className="text-xl md:text-2xl font-bold text-gray-800">{depTime}</span>
                          <span className="text-[12px] text-gray-600 mt-0.5">ETD</span>
                        </div>
                        {/* Divider */}
                        <div className="flex items-center justify-center text-gray-700">
                          <span className="text-xl font-bold text-gray-800 mr-1">--</span>
                          <IoIosAirplane size={24} className="text-gray-700 mt-2" />
                          <span className="text-xl font-bold text-gray-800 ml-1">--</span>
                        </div>
                        {/* Arrival */}
                        <div className="flex flex-col items-center leading-tight">
                          <span className="text-xl md:text-2xl font-bold text-gray-800">{arrTime}</span>
                          <span className="text-[12px] text-gray-600 mt-0.5">ETA</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Middle / Bottom content */}
                <div className="flex justify-between md:justify-around w-full items-center flex-col bg-stone-50 p-3 md:p-0 overflow-x-hidden">
                  <div className="flex w-full flex-col md:flex-row items-center justify-between md:justify-around gap-4 pl-2">
                    <div className="order-2 md:order-1 w-full">
                      {/* Seats, Luggage, Speed row */}
                      <div className="flex items-center space-x-3 md:space-x-5 mt-2 md:mt-4">
                        <div className="flex items-center text-gray-600">
                          <MdAirlineSeatReclineExtra className="mr-1" size={24} />
                          <span className="font-bold text-md">
                            {flight.fleetDetails.seatCapacity || 0}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <BsFillLuggageFill className="mr-1" size={18} />
                          <span className="font-bold text-md">
                            {flight.fleetDetails.luggage || 0}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <IoMdSpeedometer className="mr-1" size={24} />
                          <span className="font-bold text-md">
                            {/* {Math.trunc(flight.fleetDetails.maxSpeed * 1.852) || 0} km/h */}
                            {Math.trunc(flight.fleetDetails.maxSpeed) || 0} km/h
                          </span>
                        </div>
                      </div>
                      {/* Times row (Large times + flight duration) */}

                      {/* Flight Details */}
                       <div className="flex flex-col items-start justify-between my-2 mb-0">
                        <div className="text-right flex justify-center items-center my-2 font-bold">
                          {/* ORIGIN */}
                          <div className="flex flex-col items-start text-sm text-gray-500 mr-4">
                            <p
                              className={`font-bold text-black ${isCoordinate(fromTopLabel) ? "text-md" : "text-xl"
                                }`}
                            >
                              {fromTopLabel}
                            </p>
                            {fromBottomLabel && (
                              <p
                                 className={`${isCoordinate(fromTopLabel) ? "text-md" : "text-xl"} text-gray-900 font-normal cursor-pointer `}
                                title={fromBottomLabel} // Tooltip for full content
                              >
                                {isCoordinate(fromTopLabel)
                                  ? fromBottomLabel.split(" ").slice(0, 2).join(" ") + "..."
                                  : fromBottomLabel}
                              </p>
                            )}
                          </div>

                          <div className="text-center text-gray-500">
                            <p className="text-md font-bold text-gray-800">
                              - - - {flight.flightTime || "N/A"} - - -
                            </p>
                          </div>

                          {/* DESTINATION */}
                         <div className="flex flex-col items-start text-sm text-gray-500 ml-2">
                            <p
                              className={`font-bold text-black ${isCoordinate(toTopLabel) ? "text-md" : "text-xl"
                                }`}
                            >
                              {toTopLabel}
                            </p>
                            {toBottomLabel && (
                              <p
                                  className={`${isCoordinate(toTopLabel) ? "text-md" : "text-xl"} text-gray-900 font-normal cursor-pointer`}
                                title={toBottomLabel} // Tooltip for full content
                              >
                                {isCoordinate(toTopLabel)
                                  ? toBottomLabel.split(" ").slice(0, 2).join(" ") + "..."
                                  : toBottomLabel}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-sky-600 text-sm md:text-base">Refuel on Fly - 3.30hr | Cabin Height - {flight.fleetDetails.cabinHeight} ft</p>
                      {/* <p className="text-sky-600">Refuel on Fly - 3.30hr | Cabin Height - 6ft</p> */}
                    </div>
                    {/* Price & Select */}
                    <div className="order-1 md:order-2 mt-3 sm:mt-0 text-center md:text-right flex flex-col items-center md:items-end ml-0 md:ml-2 w-full md:w-auto bg-white rounded-xl p-3 shadow-sm md:bg-transparent md:shadow-none">
                      <p className="text-xs text-gray-400">Approx~</p>
                      <p className="text-xl font-bold text-gray-800">
                        USD {flightPriceUSD.toLocaleString()}
                      </p>
                      <div className="flex font-medium flex-col">
                        <p className="text-sm text-gray-600">
                          INR {inrPrice.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          GBP {gbpPrice.toLocaleString()}
                        </p>
                      </div>

                      {!readOnly && (
                        <button
                          onClick={() => onSelectFleet(flight)}
                          className={`mt-3 px-8 py-1 rounded font-semibold text-white
                          ${selectedFleet?._id === flightId
                              ? "bg-red-500"
                              : "bg-blue-600"
                            } shadow-sm`}
                        >
                          {selectedFleet?._id === flightId
                            ? "Selected"
                            : "Select"}
                        </button>
                      )}
                      {/* If this flight is selected, show next step or proceed */}
                      {!readOnly && selectedFleet?._id === flightId && (
                        <div className="my-2">
                          {isMultiCity ? (
                            currentTripIndex < tripCount - 1 ? (
                              <button
                                onClick={onNextSegment}
                                className="w-full md:w-auto px-6 py-2 rounded 
                                     bg-green-600 text-white font-semibold shadow-sm"
                              >
                                Select Next Fleet
                              </button>
                            ) : (
                              <button
                                onClick={handleProceedToPay}
                                disabled={isProceeding}
                                className="w-full md:w-auto px-6 py-2 rounded bg-green-600 text-white font-semibold shadow-sm flex items-center justify-center"
                              >
                                {isProceeding ? (
                                  <>
                                    <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
                                    Proceeding...
                                  </>
                                ) : (
                                  "Proceed to Pay"
                                )}
                              </button>
                            )
                          ) : (
                            <button
                              onClick={handleProceedToPay}
                              disabled={isProceeding}
                              className="w-full md:w-auto px-2 py-1 rounded
                                   bg-green-600 text-white font-semibold
                                   shadow-sm flex items-center justify-center"
                            >
                              {isProceeding ? (
                                <>
                                  <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
                                  Proceeding...
                                </>
                              ) : (
                                "Proceed to Pay"
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="">
                    {/* Amenities row (carousel) */}
                    <div className="flex flex-col items-center flex-wrap ">
                      <p className="font-medium text-sm md:text-base">In-Flight Amenities</p>
                      {length === 0 ? (
                        <div className="text-sm text-gray-500">
                          No amenities listed.
                        </div>
                      ) : (
                        <div className="relative flex items-center h-12">
                          {/* Left Arrow (always visible) */}
                          {length >= 4 && (
                            <button
                              onClick={() => shiftAmenityLeft(flightId, length)}
                              className="mr-2 bg-white p-1 rounded-full border hover:bg-gray-50 shadow"
                            >
                              <FaArrowLeft />
                            </button>
                          )}
                          {/* Carousel window */}
                          <div className="h-[8rem] flex items-center overflow-hidden w-full max-w-[18rem] sm:max-w-[26rem]">
                            {/* Amenity row */}
                            <div
                              className="flex transition-transform duration-300 ease-out"
                              style={{
                                transform: `translateX(${translateX}px)`,
                                width: `${length * itemWidth}px`,
                              }}
                            >
                              {allAmenities.map(([aKey, aVal], idx) => {
                                const IconComp =
                                  amenityIcons[aKey] || <AiOutlineCheckCircle />;
                                // console.log("aKey , aVal",aKey , aVal)
                                return (
                                  <div
                                    key={aKey + idx}
                                    style={{ width: "50px" }}
                                    className="group relative h-16 flex items-center justify-center"
                                  >
                                    {/* The icon */}
                                    <span className="text-2xl text-gray-600 cursor-pointer">
                                      {IconComp}
                                    </span>
                                    <div
                                      className="opacity-0 group-hover:opacity-100
                                      absolute bg-black text-white text-sm 
                                      py-1 px-2 rounded bottom-full left-1/2 -translate-x-0 
                                       whitespace-nowrap z-auto mb-1"
                                    >
                                      {aKey} - {aVal.value}

                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Right Arrow (always visible) */}
                          {length >= 4 && (
                            <button
                              onClick={() => shiftAmenityRight(flightId, length)}
                              className="ml-2 bg-white p-1 rounded-full border hover:bg-gray-50 shadow"
                            >
                              <FaArrowRight />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    {/* —— Add-on Facilities row —— */}
                    <div className="text-center mt-4">
                      <p className="font-medium text-sm md:text-base">Add-on Facilities</p>

                      {addOnServices.length === 0 ? (
                        <p className="font-extralight italic text-xs">
                          No additional facilities available…
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-4 justify-center mt-2">
                          {addOnServices.map((svc) => (
                            <div
                              key={svc._id}
                              className="group relative w-16 h-16 flex items-center justify-center"
                            >
                              {/* the icon / image */}
                              <img
                                src={svc.images[0]}
                                alt={svc.business_name}
                                className="w-10 h-10 object-contain"
                              />

                              {/* tooltip on hover */}
                              <div
                                className="opacity-0 group-hover:opacity-100
                       absolute bottom-full mb-1 px-2 py-1 rounded
                       bg-black text-white text-xs whitespace-nowrap"
                              >
                                {svc.business_name}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* SHARE and SELECT-FOR-SHARING row */}

                    <div className="flex flex-col md:flex-row items-center justify-between w-full gap-2 md:gap-0 ">
                      <p className="text-xs text-gray-600 text-center ml-2">
                        *Note: All Parameters are subject to change time to time.
                      </p>
                      {/* Left: share icons + "Share" text */}
                      {!readOnly && (
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="flex gap-2  items-center">

                            <div
                              className="flex flex-col items-center text-blue-600 cursor-pointer"
                              onClick={openWhatsAppModal}
                            >
                              <FaWhatsapp size={24} />
                            </div>
                            <div
                              className="flex flex-col items-center text-gray-600 cursor-pointer"
                              onClick={openEmailModal}
                            >
                              <AiOutlineMail size={24} />
                            </div>
                            <div className="flex">
                              <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4"
                                  checked={checkedFlights[flightId] || false}
                                  onChange={(e) => handleCheckboxChange(flight, e)}
                                />
                              </label>
                              <p className="text-xs text-gray-600 text-center ml-2">
                                Share
                              </p>
                            </div>
                          </div>
                        </div>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* EXPERIENCE MODAL */}
      {showExperienceModal && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={closeExperienceModal}
        >
          <div
            className="relative bg-white w-11/12 md:w-4/5 h-3/4 rounded-md p-5 overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeExperienceModal}
              className="absolute top-3 right-3 bg-gray-200 text-gray-700 px-2 py-1 rounded"
            >
              X
            </button>
            {/* Tabs */}
            <div className="flex space-x-4 border-b pb-2 mb-4">
              {["interior", "exterior", "cockpit", "aircraftLayout", "video"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-1 px-3 font-semibold ${activeTab === tab
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
                <div key={f._id}>
                  {activeTab !== "video" && gallery[activeTab] && (
                    <div className="flex flex-wrap gap-4">
                      {Object.entries(gallery[activeTab])
                        .filter(([view]) => view !== "_id")
                        .map(([view, url]) => (
                          <img
                            key={view}
                            src={url || null}
                            alt={view}
                            className="w-72 h-48 object-cover rounded"
                          />
                        ))}
                    </div>
                  )}
                  {activeTab === "video" && gallery.video && (
                    <div className="w-full h-[80%] relative border-none">
                      <video
                        controls
                        autoPlay
                        // muted
                        loop
                        src={gallery.video}
                        className="absolute inset-0 w-full h-[60vh] object-cover border-none"
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
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={closeWhatsAppModal}
        >
          <div
            className="relative bg-white w-11/12 md:w-1/2 p-5 rounded-md"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeWhatsAppModal}
              className="absolute top-3 right-3 bg-gray-200 text-gray-700 px-2 py-1 rounded"
            >
              X
            </button>
            <h2 className="text-xl font-semibold mb-4">Share via WhatsApp</h2>
            {combinedPreview ? (
              <div className="max-h-64 overflow-auto border p-2 rounded mb-4">
                <img
                  src={combinedPreview}
                  alt="Selected flights"
                  className="w-full"
                />
              </div>
            ) : (
              <p className="text-gray-600">No flights selected.</p>
            )}

            <input
              type="text"
              defaultValue={userSession?.phone || parsedData?.userInfo?.phone}
              className="border border-gray-300 w-full p-2 rounded mb-4"
              placeholder="+1 234 567 890"
            />

            <button
              onClick={handleSendWhatsApp}
              disabled={
                whatsAppSendState === "sending" || whatsAppSendState === "sent"
              }
              className="bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center"
            >
              {whatsAppSendState === "sending" ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : whatsAppSendState === "sent" ? (
                <>
                  <AiOutlineCheckCircle className="mr-2" />
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
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={closeEmailModal}
        >
          <div
            className="relative bg-white w-11/12 md:w-1/2 p-5 rounded-md"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeEmailModal}
              className="absolute top-3 right-3 bg-gray-200 text-gray-700 px-2 py-1 rounded"
            >
              X
            </button>
            <h2 className="text-xl font-semibold mb-4">Share via Email</h2>
            {combinedPreview ? (
              <div className="max-h-64 overflow-auto border p-2 rounded mb-4">
                <img
                  src={combinedPreview}
                  alt="Selected flights"
                  className="w-full"
                />
              </div>
            ) : (
              <p className="text-gray-600">No flights selected.</p>
            )}

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
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : emailSendState === "sent" ? (
                <>
                  <AiOutlineCheckCircle className="mr-2" />
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
}   