"use client";
import { useState, useEffect, useRef } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import Link from "next/link";

export default function UserInfoModal({ show, onClose }) {
  // Slides for the left-side carousel
  const slides = [
    {
      // Slide 1
      title: "Trust Us to Digitise Your Business Travel,",
      subtitle: "Just Like 59K+ Organisations Have!",
      points: [],
      image:
        "https://go-assets.ibcdn.com/u/MMT/images/1729481581086-mybizloginSlider1.webp",
    },
    {
      // Slide 2
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
      // Slide 3
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

  // ---------- 1) Form States ----------
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // WhatsApp number (without +91)
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // ---------- 2) OTP states: Phone ----------
  const [phoneOTP, setPhoneOTP] = useState(""); // The 6-digit OTP the user enters
  const [phoneOTPSent, setPhoneOTPSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneOTPError, setPhoneOTPError] = useState("");
  // Timer for phone OTP (in seconds)
  const [phoneOtpTimeLeft, setPhoneOtpTimeLeft] = useState(0);
  const phoneTimerRef = useRef(null);

  // ---------- 3) OTP states: Email ----------
  const [emailOTP, setEmailOTP] = useState(""); // The 6-digit OTP the user enters
  const [emailOTPSent, setEmailOTPSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailOTPError, setEmailOTPError] = useState("");
  // Timer for email OTP (in seconds)
  const [emailOtpTimeLeft, setEmailOtpTimeLeft] = useState(0);
  const emailTimerRef = useRef(null);

  // ---------- 4) Effects ----------
  useEffect(() => {
    // If localStorage already has user info, close the modal (don't show).
    const localData = localStorage.getItem("searchData");
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (parsed?.userInfo) {
          // We found user info, so we can close immediately
          onClose();
          return;
        }
      } catch (err) {
        console.error("Error parsing user info from localStorage:", err);
      }
    }

    // Otherwise, no user info stored yet => proceed to load any partial data
    // (If you still want partial data from local storage, do it here)
    // Example: No partial data needed, so just set up cleanup for timers.
    return () => {
      clearInterval(phoneTimerRef.current);
      clearInterval(emailTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- 5) Handle Slide Navigation ----------
  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };
  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // ---------- 6) Phone OTP: Send OTP ----------
  const handleSendPhoneOTP = async () => {
    if (!phone) return;
    try {
      const resp = await fetch("http://localhost:3000/api/otp/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: `+91${phone}`,
        }),
      });
      if (resp.ok) {
        // Reset phone OTP states
        setPhoneOTP("");
        setPhoneOTPSent(true);
        setPhoneVerified(false);
        setPhoneOTPError("");
        // Start a 5-minute timer (300 seconds)
        setPhoneOtpTimeLeft(300);
        clearInterval(phoneTimerRef.current);
        phoneTimerRef.current = setInterval(() => {
          setPhoneOtpTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(phoneTimerRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setPhoneOTPError("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setPhoneOTPError("Error occurred while sending OTP.");
    }
  };

  // ---------- 7) Phone OTP: Verify OTP ----------
  const handleVerifyPhoneOTP = async () => {
    if (!phoneOTP || phoneOTP.length !== 6 || phoneOtpTimeLeft <= 0) {
      setPhoneOTPError("OTP is expired or invalid.");
      return;
    }
    try {
      const resp = await fetch(
        `http://localhost:3000/api/otp/whatsapp?otp=${phoneOTP}&phoneNumber=+91${phone}`
      );
      const data = await resp.json();
      if (resp.ok && data.message === "OTP verified successfully") {
        setPhoneVerified(true);
        setPhoneOTPError("");
        // Stop the timer
        clearInterval(phoneTimerRef.current);
      } else {
        setPhoneOTPError(
          data?.message || "Invalid or expired OTP. Please try again."
        );
      }
    } catch (error) {
      console.error(error);
      setPhoneOTPError("Error verifying OTP. Please try again.");
    }
  };

  // ---------- 8) Email OTP: Send OTP ----------
  const handleSendEmailOTP = async () => {
    if (!email) return;
    try {
      const resp = await fetch("http://localhost:3000/api/otp/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
        }),
      });
      if (resp.ok) {
        // Reset email OTP states
        setEmailOTP("");
        setEmailOTPSent(true);
        setEmailVerified(false);
        setEmailOTPError("");
        // Start a 5-minute timer (300 seconds)
        setEmailOtpTimeLeft(300);
        clearInterval(emailTimerRef.current);
        emailTimerRef.current = setInterval(() => {
          setEmailOtpTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(emailTimerRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setEmailOTPError("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setEmailOTPError("Error occurred while sending OTP.");
    }
  };

  // ---------- 9) Email OTP: Verify OTP ----------
  const handleVerifyEmailOTP = async () => {
    if (!emailOTP || emailOTP.length !== 6 || emailOtpTimeLeft <= 0) {
      setEmailOTPError("OTP is expired or invalid.");
      return;
    }
    try {
      const resp = await fetch(
        `http://localhost:3000/api/otp/email?otp=${emailOTP}&email=${email}`
      );
      const data = await resp.json();
      if (resp.ok && data.message === "OTP verified successfully") {
        setEmailVerified(true);
        setEmailOTPError("");
        // Stop the timer
        clearInterval(emailTimerRef.current);
      } else {
        setEmailOTPError(
          data?.message || "Invalid or expired OTP. Please try again."
        );
      }
    } catch (error) {
      console.error(error);
      setEmailOTPError("Error verifying OTP. Please try again.");
    }
  };

  // ---------- 10) Final Continue ----------
  const handleContinue = async () => {
    // For illustration, let's ensure both phone & email are verified + form filled
    // Adjust logic based on your actual requirements
    const isFormValid =
      name.trim() !== "" &&
      email.trim() !== "" &&
      phone.trim() !== "" &&
      // phoneVerified &&  // <--- Toggle phone verification if you want it mandatory
      emailVerified &&
      agreedToTerms;

    if (!isFormValid) return;

    try {
      // 1) Fetch IP info
      const ipRes = await fetch("https://ipinfo.io/json");
      const ipData = await ipRes.json();

      // 2) Load existing localData
      const localDataRaw = localStorage.getItem("searchData");
      const localData = localDataRaw ? JSON.parse(localDataRaw) : {};

      // 3) Insert or update user info
      localData.userInfo = {
        name,
        email,
        phone: `+91${phone}`,
        ...ipData,
      };

      // 4) Save back to localStorage
      localStorage.setItem("searchData", JSON.stringify(localData));
      console.log("User info saved to localStorage:", localData);

      // 5) Close modal
      onClose();
    } catch (err) {
      console.error("Error fetching IP info or saving user data:", err);
    }
  };

  // Helper: format time from seconds to mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // If parent says not to show (show=false) or we've already closed from useEffect, do not render
  if (!show) return null;

  // Check if the "Continue" button should be enabled (adjust to your needs)
  const canContinue =
    name.trim() !== "" &&
    email.trim() !== "" &&
    phone.trim() !== "" &&
    agreedToTerms &&
    // phoneVerified &&
    emailVerified;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative w-[90%] max-w-4xl h-[38rem] rounded-lg shadow-md overflow-hidden flex justify-center items-center">
        {/* Left Section / Slides */}
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
                  {slides[currentSlide].points.map((point, idx) => (
                    <li key={idx} className="text-sm">
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Slide navigation arrows */}
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

        {/* Right Section / Form */}
        <div className="w-[60%] h-full p-6 flex flex-col justify-between rounded-xl bg-white absolute right-0 shadow-black shadow-lg">
          {/* Top portion (scrollable if needed) */}
          <div className="overflow-auto">
            {/* Close button (bigger) */}
            <button
              className="ml-auto mb-4 block text-gray-500 hover:text-gray-700 text-2xl leading-none"
              onClick={onClose}
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-6">Verification / Login</h2>

            {/* Full Name */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Full Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 
                           focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email with OTP Button */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Enter your email
              </label>
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <input
                    id="email"
                    type="email"
                    className="w-full border border-gray-300 rounded px-3 py-2
                               focus:outline-none focus:ring focus:border-blue-500"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendEmailOTP}
                  className="mb-1 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  disabled={!email} // Only allow sending if email is not empty
                >
                  Send OTP
                </button>
              </div>
              {/* Email OTP input + verify button */}
              {emailOTPSent && (
                <div className="mt-2 flex items-end space-x-2">
                  <input
                    type="text"
                    maxLength={6}
                    className="w-24 border border-gray-300 rounded px-3 py-2 focus:outline-none"
                    placeholder="6-digit"
                    value={emailOTP}
                    onChange={(e) => setEmailOTP(e.target.value)}
                  />
                  <button
                    onClick={handleVerifyEmailOTP}
                    className="inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    disabled={emailVerified}
                  >
                    Verify
                  </button>
                </div>
              )}
              {/* Email OTP status messages */}
              {emailOTPSent && !emailVerified && (
                <div className="text-sm mt-1">
                  <p className="text-gray-500">
                    OTP is valid for 5 minutes. Time left:{" "}
                    <span className="font-bold">
                      {formatTime(emailOtpTimeLeft)}
                    </span>
                  </p>
                </div>
              )}
              {emailOTPError && (
                <p className="text-red-500 text-sm mt-1">{emailOTPError}</p>
              )}
              {emailVerified && (
                <p className="text-green-600 text-sm mt-1">
                  Email OTP verified successfully!
                </p>
              )}
            </div>

            {/* WhatsApp with OTP Button */}
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Enter your WhatsApp number
              </label>
              <div className="flex items-end space-x-2">
                <div className="flex-1 flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-600">
                    +91
                  </span>
                  <input
                    id="phone"
                    type="text"
                    className="w-full border border-gray-300 rounded-r px-3 py-2
                               focus:outline-none focus:ring focus:border-blue-500"
                    placeholder="Enter your WhatsApp number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendPhoneOTP}
                  className="mb-1 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  disabled={!phone} // Only allow sending if phone is not empty
                >
                  Send OTP
                </button>
              </div>
              {/* Phone OTP input + verify button */}
              {phoneOTPSent && (
                <div className="mt-2 flex items-end space-x-2">
                  <input
                    type="text"
                    maxLength={6}
                    className="w-24 border border-gray-300 rounded px-3 py-2 focus:outline-none"
                    placeholder="6-digit"
                    value={phoneOTP}
                    onChange={(e) => setPhoneOTP(e.target.value)}
                  />
                  <button
                    onClick={handleVerifyPhoneOTP}
                    className="inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    disabled={phoneVerified}
                  >
                    Verify
                  </button>
                </div>
              )}
              {/* Phone OTP status messages */}
              {phoneOTPSent && !phoneVerified && (
                <div className="text-sm mt-1">
                  <p className="text-gray-500">
                    OTP is valid for 5 minutes. Time left:{" "}
                    <span className="font-bold">
                      {formatTime(phoneOtpTimeLeft)}
                    </span>
                  </p>
                </div>
              )}
              {phoneOTPError && (
                <p className="text-red-500 text-sm mt-1">{phoneOTPError}</p>
              )}
              {phoneVerified && (
                <p className="text-green-600 text-sm mt-1">
                  Phone OTP verified successfully!
                </p>
              )}
            </div>
          </div>

          {/* Checkbox & Continue */}
          <div>
            <div className="flex items-start mb-4">
              <input
                id="termsCheckbox"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-5 h-5 mt-1 mr-2 border border-gray-300 rounded"
              />
              <label htmlFor="termsCheckbox" className="text-sm text-gray-700">
                By proceeding, you agree to{" "}
                <Link
                  href={"/termsAndCondition"}
                  className="text-blue-600 hover:underline"
                >
                  Air aviations
                </Link>
                ’s{" "}
                <Link
                  href={"/termsAndCondition"}
                  className="text-blue-600 hover:underline"
                >
                  Privacy Policy
                </Link>
                ,{" "}
                <Link
                  href={"/termsAndCondition"}
                  className="text-blue-600 hover:underline"
                >
                  User Agreement
                </Link>{" "}
                and{" "}
                <Link
                  href={"/termsAndCondition"}
                  className="text-blue-600 hover:underline"
                >
                  T&Cs
                </Link>
              </label>
            </div>

            <button
              onClick={handleContinue}
              disabled={!canContinue}
              className={`w-full px-4 py-2 text-white font-semibold rounded ${
                canContinue ? "bg-green-500 hover:bg-green-600" : "bg-gray-300"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
