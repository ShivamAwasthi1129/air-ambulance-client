"use client";
import { useState, useEffect, useRef } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

export default function UserInfoModal({ show, onClose }) {
  // ========== Left-side slides (optional) ==========
  const slides = [
    {
      title: "Trust Us to Digitise Your Business Travel,",
      subtitle: "Just Like 59K+ Organisations Have!",
      points: [],
      image:
        "https://go-assets.ibcdn.com/u/MMT/images/1729481581086-mybizloginSlider1.webp",
    },
    {
      title: "Business Travel Solutions",
      subtitle: "TAILORED FOR YOU.",
      points: [
        "Smart Dashboard - Real-time Reporting & Analytics",
        "Seamless Integrations - ERP, HRMS & SSO Integrations",
        "Policy Compliance - Easy Setup with Automated/Quick Approvals",
      ],
      image:
        "https://go-assets.ibcdn.com/u/MMT/images/1729481621895-mybizloginSlider2.webp",
    },
    {
      title: "All Your Business Travel Needs,",
      subtitle: "AT ONE PLACE.",
      points: [
        "myBiz Special Fare - Lowest Flight Cancellation Fees",
        "78K+ Corporate-friendly Hotels - Wide Inventory Across Prime Locations",
        "Assured GST Invoices - One-click Download for ITC Claim",
      ],
      image:
        "https://go-assets.ibcdn.com/u/MMT/images/1729481645105-mybizloginSlider3.webp",
    },
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  // ========== OTP states ==========
  // Email
  const [emailOTP, setEmailOTP] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailOTPError, setEmailOTPError] = useState("");
  const [emailOtpTimeLeft, setEmailOtpTimeLeft] = useState(300);
  const emailTimerRef = useRef(null);

  // Phone
  const [phoneOTP, setPhoneOTP] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneOTPError, setPhoneOTPError] = useState("");
  const [phoneOtpTimeLeft, setPhoneOtpTimeLeft] = useState(300);
  const phoneTimerRef = useRef(null);

  // We'll read the actual email/phone from userInfo in sessionStorage
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // ========== On mount, load userInfo.email & userInfo.phoneNumber from sessionStorage ==========
  useEffect(() => {
    if (!show) return; // If modal not showing, skip

    // Load userInfo from sessionStorage
    const saved = sessionStorage.getItem("searchData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.userInfo) {
          if (parsed.userInfo.email) setEmail(parsed.userInfo.email);
          if (parsed.userInfo.phoneNumber) setPhoneNumber(parsed.userInfo.phoneNumber);
        }
      } catch (err) {
        console.error("Error parsing userInfo from sessionStorage:", err);
      }
    }

    // Start a 5-minute countdown (300s) for email OTP
    emailTimerRef.current = setInterval(() => {
      setEmailOtpTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(emailTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start a 5-minute countdown (300s) for phone OTP
    phoneTimerRef.current = setInterval(() => {
      setPhoneOtpTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(phoneTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(emailTimerRef.current);
      clearInterval(phoneTimerRef.current);
    };
  }, [show]);

  // ========== Slide navigation ==========
  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };
  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // ========== Verify Email OTP (GET) ==========
  const handleVerifyEmailOTP = async () => {
    // If no OTP, or length not 6, or timer expired
    if (!emailOTP || emailOTP.length !== 6 || emailOtpTimeLeft <= 0) {
      setEmailOTPError("OTP is expired or invalid.");
      return;
    }

    try {
      // Make GET request to verify
      const resp = await fetch(
        `/api/otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(emailOTP)}`,
        { method: "GET" }
      );
      const data = await resp.json();

      if (resp.ok && data.message === "OTP verified successfully") {
        setEmailVerified(true);
        setEmailOTPError("");
        // Stop the timer
        clearInterval(emailTimerRef.current);
      } else {
        setEmailOTPError(data.message || "Invalid or expired OTP.");
      }
    } catch (err) {
      console.error(err);
      setEmailOTPError("Error verifying Email OTP.");
    }
  };

  // ========== Verify Phone OTP (GET) ==========
  const handleVerifyPhoneOTP = async () => {
    // If no OTP, or length not 6, or timer expired
    if (!phoneOTP || phoneOTP.length !== 6 || phoneOtpTimeLeft <= 0) {
      setPhoneOTPError("OTP is expired or invalid.");
      return;
    }

    try {
      // Make GET request to verify
      const resp = await fetch(
        `/api/otp/whatsapp?otp=${encodeURIComponent(phoneOTP)}&phoneNumber=%2B91${encodeURIComponent(
          phoneNumber
        )}`,
        { method: "GET" }
      );
      const data = await resp.json();

      if (resp.ok && data.message === "OTP verified successfully") {
        setPhoneVerified(true);
        setPhoneOTPError("");
        // Stop the timer
        clearInterval(phoneTimerRef.current);
      } else {
        setPhoneOTPError(data.message || "Invalid or expired OTP.");
      }
    } catch (err) {
      console.error(err);
      setPhoneOTPError("Error verifying Phone OTP.");
    }
  };

  // ========== Format time helper (mm:ss) ==========
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // If show=false or we've already closed => don't render
  if (!show) return null;

  // We only require EITHER email OR phone verified
  const canClose = emailVerified || phoneVerified;

  // If user clicks "Done," mark userVerified in session
  const handleCloseOrDone = () => {
    if (canClose) {
      sessionStorage.setItem("userVerified", "true");
      window.dispatchEvent(new Event("updateNavbar"));
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative w-[90%] max-w-4xl h-[38rem] rounded-lg shadow-md overflow-hidden flex justify-center items-center">
        {/* ========= Left side slides ========= */}
        <div className="w-[43%] h-[95%] overflow-hidden bg-gray-800 text-white rounded-xl absolute left-0">
          <div
            key={currentSlide}
            className="absolute inset-0 h-full w-full transition-all duration-500 ease-in-out flex flex-col justify-center items-center p-8"
            style={{
              backgroundImage: `url(${slides[currentSlide].image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Dark overlay */}
            <div className="bg-black bg-opacity-50 absolute inset-0 z-0" />

            <div className="relative z-10 w-[75%]">
              <h2 className="text-2xl font-bold mb-2">
                {slides[currentSlide].title}
              </h2>
              <h3 className="text-xl font-semibold mb-4">
                {slides[currentSlide].subtitle}
              </h3>
              {!!slides[currentSlide].points.length && (
                <ul className="space-y-2">
                  {slides[currentSlide].points.map((p, idx) => (
                    <li key={idx} className="text-sm">
                      {p}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Slide nav arrows */}
          <button
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-30 p-2 rounded-full hover:bg-opacity-50 z-20"
            onClick={handlePrevSlide}
          >
            <AiOutlineLeft size={20} className="text-white" />
          </button>
          <button
            className="absolute top-1/2 right-8 transform -translate-y-1/2 bg-black bg-opacity-30 p-2 rounded-full hover:bg-opacity-50 z-20"
            onClick={handleNextSlide}
          >
            <AiOutlineRight size={20} className="text-white" />
          </button>
        </div>

        {/* ========= Right side: OTP inputs ========= */}
        <div className="w-[60%] h-full p-6 flex flex-col justify-between rounded-xl bg-white absolute right-0 shadow-black shadow-lg">
          {/* Top area */}
          <div className="overflow-auto">
            {/* Close button */}
            <button
              className="ml-auto mb-4 block text-gray-500 hover:text-gray-700 text-2xl leading-none"
              onClick={onClose} // If user clicks X, we just close
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-6">OTP Verification</h2>

            {/* Email OTP */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter the OTP sent to your Whatsapp / Mobile No. or Email
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={emailOTP}
                  onChange={(e) => setEmailOTP(e.target.value)}
                  placeholder="6-digit OTP"
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none w-32"
                />
                <button
                  onClick={handleVerifyEmailOTP}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
                  disabled={emailVerified}
                >
                  Verify
                </button>
              </div>
              {/* Timer & errors */}
              {!emailVerified && (
                <p className="text-sm text-gray-500 mt-1">
                  Time left: {formatTime(emailOtpTimeLeft)}
                </p>
              )}
              {emailOTPError && (
                <p className="text-red-500 text-sm mt-1">{emailOTPError}</p>
              )}
              {emailVerified && (
                <p className="text-green-600 text-sm mt-1">
                  OTP verified successfully!
                </p>
              )}
            </div>

            {/* Phone OTP */}
            <div className="mb-6">
              {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter the OTP sent to your WhatsApp
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={phoneOTP}
                  onChange={(e) => setPhoneOTP(e.target.value)}
                  placeholder="6-digit OTP"
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none w-32"
                />
                <button
                  onClick={handleVerifyPhoneOTP}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded"
                  disabled={phoneVerified}
                >
                  Verify
                </button>
              </div> */}
              {/* Timer & errors */}
              {/* {!phoneVerified && (
                <p className="text-sm text-gray-500 mt-1">
                  Time left: {formatTime(phoneOtpTimeLeft)}
                </p>
              )}
              {phoneOTPError && (
                <p className="text-red-500 text-sm mt-1">{phoneOTPError}</p>
              )}
              {phoneVerified && (
                <p className="text-green-600 text-sm mt-1">
                  Phone OTP verified successfully!
                </p>
              )} */}
            </div>
          </div>

          {/* Bottom area: Done/Close button */}
          <div>
            <button
              onClick={handleCloseOrDone}
              disabled={!canClose}
              className={`w-full px-4 py-2 text-white font-semibold rounded ${
                canClose
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {canClose ? "Done" : "Verify to Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
