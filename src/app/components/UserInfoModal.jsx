"use client"; // if you are using Next.js App Router, otherwise remove
import { useState } from "react";
// Example: Install react-icons or swap out with your own icons
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

export default function UserInfoModal({ show, onClose }) {
  // Slides for the left-side carousel
  const slides = [
    {
      title: "Business Travel Solutions",
      subtitle: "TAILORED FOR YOU.",
      points: [
        "Smart Dashboard - Real-time Reporting & Analytics",
        "Seamless Integrations - ERP, HRMS & SSO Integrations",
        "Policy Compliance - Quick Approvals",
      ],
      image: "https://go-assets.ibcdn.com/u/MMT/images/1729481645105-mybizloginSlider3.webp",
    },
    {
      title: "Another Slide Title",
      subtitle: "Some descriptive text here",
      points: ["Bullet #1", "Bullet #2", "Bullet #3"],
      image: "https://go-assets.ibcdn.com/u/MMT/images/1729481621895-mybizloginSlider2.webp",
    },
    {
      title: "Third Slide Title",
      subtitle: "Extra descriptive text",
      points: ["Point A", "Point B", "Point C"],
      image: "https://go-assets.ibcdn.com/u/MMT/images/1729481581086-mybizloginSlider1.webp",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Show/hide OTP boxes
  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [showWhatsappOtp, setShowWhatsappOtp] = useState(false);

  // 6-digit OTP states
  const [emailOtp, setEmailOtp] = useState(new Array(6).fill(""));
  const [whatsappOtp, setWhatsappOtp] = useState(new Array(6).fill(""));

  // Helper to see if at least one OTP is fully filled:
  const isEmailOtpComplete = emailOtp.every((digit) => digit !== "");
  const isWhatsappOtpComplete = whatsappOtp.every((digit) => digit !== "");
  const isAnyOtpComplete = isEmailOtpComplete || isWhatsappOtpComplete;

  // All required fields + OTP check
  const isFormValid =
    fullName.trim() !== "" &&
    email.trim() !== "" &&
    whatsapp.trim() !== "" &&
    isAnyOtpComplete;

  // Slide handlers
  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };
  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handleEmailOtpChange = (value, idx) => {
    const updated = [...emailOtp];
    updated[idx] = value.slice(-1); // only keep last digit typed
    setEmailOtp(updated);
  };

  const handleWhatsappOtpChange = (value, idx) => {
    const updated = [...whatsappOtp];
    updated[idx] = value.slice(-1); // only keep last digit typed
    setWhatsappOtp(updated);
  };

  // You might do something on continue
  const handleContinue = () => {
    if (!isFormValid) return;
    alert("Form submitted!");
    // ... your logic here
  };

  if (!show) return null; // if controlling modal from parent

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white w-[90%] max-w-6xl h-[80vh] rounded-lg shadow-md overflow-hidden flex">
        {/* Left Section / Slides */}
        <div className="w-1/2 relative overflow-hidden bg-gray-800 text-white">
          <div
            key={currentSlide}
            className="absolute inset-0 h-full w-full transition-all duration-500 ease-in-out flex flex-col justify-center p-8"
            // Optional background image
            style={{
              backgroundImage: `url(${slides[currentSlide].image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Overlay to make text readable */}
            <div className="bg-black bg-opacity-40 absolute inset-0 z-0" />
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">
                {slides[currentSlide].title}
              </h2>
              <h3 className="text-xl font-semibold mb-4">
                {slides[currentSlide].subtitle}
              </h3>
              <ul className="space-y-2">
                {slides[currentSlide].points.map((point, idx) => (
                  <li key={idx} className="text-sm">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Slide navigation arrows */}
          <button
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-30 p-2 rounded-full hover:bg-opacity-50 z-20"
            onClick={handlePrevSlide}
          >
            <AiOutlineLeft size={20} className="text-white" />
          </button>
          <button
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-30 p-2 rounded-full hover:bg-opacity-50 z-20"
            onClick={handleNextSlide}
          >
            <AiOutlineRight size={20} className="text-white" />
          </button>
        </div>

        {/* Right Section / Form */}
        <div className="w-1/2 p-6 flex flex-col justify-between">
          <div className="overflow-auto">
            {/* Close button (optional) */}
            <button
              className="ml-auto mb-4 block text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-6">Login / Sign up</h2>

            {/* Full Name */}
            <div className="mb-4">
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Full Name
              </label>
              <input
                id="fullName"
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            {/* Email + Send OTP */}
            <div className="mb-4 flex items-end space-x-2">
              <div className="flex-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Enter your email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowEmailOtp(true)}
                className="mb-1 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Send OTP
              </button>
            </div>

            {/* Email OTP Boxes */}
            {showEmailOtp && (
              <div className="flex space-x-2 mb-4">
                {emailOtp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength="1"
                    className="w-10 h-10 border border-gray-300 text-center rounded"
                    value={digit}
                    onChange={(e) => handleEmailOtpChange(e.target.value, idx)}
                  />
                ))}
              </div>
            )}

            {/* WhatsApp + Send OTP */}
            <div className="mb-4 flex items-end space-x-2">
              <div className="flex-1">
                <label
                  htmlFor="whatsapp"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Enter your WhatsApp number
                </label>
                <input
                  id="whatsapp"
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                  placeholder="Enter your WhatsApp number"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowWhatsappOtp(true)}
                className="mb-1 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Send OTP
              </button>
            </div>

            {/* WhatsApp OTP Boxes */}
            {showWhatsappOtp && (
              <div className="flex space-x-2 mb-4">
                {whatsappOtp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength="1"
                    className="w-10 h-10 border border-gray-300 text-center rounded"
                    value={digit}
                    onChange={(e) =>
                      handleWhatsappOtpChange(e.target.value, idx)
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Continue button */}
          <button
            onClick={handleContinue}
            disabled={!isFormValid}
            className={`mt-4 w-full px-4 py-2 text-white font-semibold rounded ${
              isFormValid ? "bg-green-500 hover:bg-green-600" : "bg-gray-300"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
