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
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailOTPError, setEmailOTPError] = useState("");
  const [emailOtpTimeLeft, setEmailOtpTimeLeft] = useState(300);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const emailTimerRef = useRef(null);
  const otpInputRefs = useRef([]);

  // User info from sessionStorage
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // ========== On mount, load userInfo from sessionStorage ==========
  useEffect(() => {
    if (!show) return;

    // Load userInfo from sessionStorage
    const saved = sessionStorage.getItem("searchData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.userInfo) {
          if (parsed.userInfo.name) setName(parsed.userInfo.name);
          if (parsed.userInfo.email) setEmail(parsed.userInfo.email);
          if (parsed.userInfo.phone) setPhoneNumber(parsed.userInfo.phone);
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
          setIsResendEnabled(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(emailTimerRef.current);
    };
  }, [show]);

  // ========== Slide navigation ==========
  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };
  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // ========== Handle OTP digit input ==========
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits are entered
    const isComplete = newOtpDigits.every(digit => digit !== "");
    if (isComplete && !isVerifying) {
      handleVerifyOTP(newOtpDigits.join(""));
    }
  };

  // Handle backspace in OTP inputs
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // ========== Verify OTP (GET) ==========
  const handleVerifyOTP = async (otp = null) => {
    const otpToVerify = otp || otpDigits.join("");

    if (!otpToVerify || otpToVerify.length !== 6 || emailOtpTimeLeft <= 0) {
      setEmailOTPError("OTP is expired or invalid.");
      return;
    }

    setIsVerifying(true);
    setEmailOTPError("");

    try {
      const resp = await fetch(
        `/api/otp?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phoneNumber)}&otp=${encodeURIComponent(otpToVerify)}`,
        { method: "GET" }
      );
      const data = await resp.json();

      if (resp.ok && data.message === "OTP verified successfully") {
        setEmailVerified(true);
        setEmailOTPError("");
        clearInterval(emailTimerRef.current);
        sessionStorage.setItem("userVerified", "true");
        sessionStorage.setItem(
          "loginData",
          JSON.stringify({
            name,
            email,
            phone: phoneNumber,
            agreedToPolicy: true,
          })
        );
        window.dispatchEvent(new Event("updateNavbar"));
        setTimeout(() => {
          onClose();
        }, 1500); // Close after 1.5 seconds to show success message briefly

      } else {
        setEmailOTPError(data.message || "Invalid or expired OTP.");
        // Clear OTP on error
        setOtpDigits(["", "", "", "", "", ""]);
        otpInputRefs.current[0]?.focus();
      }
    } catch (err) {
      console.error(err);
      setEmailOTPError("Error verifying OTP.");
      setOtpDigits(["", "", "", "", "", ""]);
      otpInputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  // ========== Resend OTP ==========
  const handleResendOTP = async () => {
    try {
      const response = await fetch("/api/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: phoneNumber,
          email,
        }),
      });

      if (response.ok) {
        // Reset states
        setOtpDigits(["", "", "", "", "", ""]);
        setEmailOTPError("");
        setEmailOtpTimeLeft(300);
        setIsResendEnabled(false);

        // Focus first input
        otpInputRefs.current[0]?.focus();

        // Restart timer
        emailTimerRef.current = setInterval(() => {
          setEmailOtpTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(emailTimerRef.current);
              setIsResendEnabled(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err) {
      console.error("Error resending OTP:", err);
      setEmailOTPError("Failed to resend OTP. Please try again.");
    }
  };

  // ========== Format time helper (mm:ss) ==========
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // If show=false => don't render
  if (!show) return null;

  // If user clicks "Done," mark userVerified in session
  const handleCloseOrDone = () => {
    if (emailVerified) {
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
              onClick={onClose}
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-6">OTP Verification</h2>

            {/* User Info Display */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
              <h3 className="text-sm font-medium text-gray-700 mb-3">User Information</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-600 w-16">Name:</span>
                  <span className="text-sm text-gray-800">{name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-600 w-16">Email:</span>
                  <span className="text-sm text-gray-800">{email}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-600 w-16">Phone:</span>
                  <span className="text-sm text-gray-800">{phoneNumber}</span>
                </div>
              </div>
            </div>

            {/* OTP Input Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Enter the 6-digit OTP sent to your email or whatsapp
              </label>

              {/* 6-digit OTP input boxes */}
              <div className="flex gap-2 mb-4 justify-center">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => otpInputRefs.current[index] = el}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    disabled={emailVerified || isVerifying}
                  />
                ))}
              </div>

              {/* Timer and status */}
              {!emailVerified && !isResendEnabled && (
                <p className="text-sm text-gray-500 text-center mb-2">
                  Time remaining: {formatTime(emailOtpTimeLeft)}
                </p>
              )}

              {/* Resend OTP Button */}
              <div className="text-center mb-4">
                <button
                  onClick={handleResendOTP}
                  disabled={!isResendEnabled}
                  className={`text-sm font-medium ${isResendEnabled
                      ? "text-blue-600 hover:text-blue-800 cursor-pointer"
                      : "text-gray-400 cursor-not-allowed"
                    }`}
                >
                  Resend OTP
                </button>
              </div>

              {/* Loading indicator */}
              {isVerifying && (
                <div className="flex items-center justify-center mb-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span className="text-sm text-gray-600">Verifying...</span>
                </div>
              )}

              {/* Error message */}
              {emailOTPError && (
                <p className="text-red-500 text-sm text-center mb-2">{emailOTPError}</p>
              )}

              {/* Success message */}
              {emailVerified && (
                <p className="text-green-600 text-sm text-center mb-2">
                  ✓ OTP verified successfully!
                </p>
              )}
            </div>
          </div>

          {/* Bottom area: Done/Close button */}
          {/* <div>
            <button
              onClick={handleCloseOrDone}
              disabled={!emailVerified}
              className={`w-full px-4 py-2 text-white font-semibold rounded ${
                emailVerified
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {emailVerified ? "Done" : "Verify to Continue"}
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}