"use client";
import { useState, useEffect } from "react";
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
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState(""); 
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const isFormValid =
    name.trim() !== "" &&
    email.trim() !== "" &&
    whatsapp.trim() !== "" &&
    agreedToTerms;

  useEffect(() => {
    const savedData = sessionStorage.getItem("searchData");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed?.userInfo) {
          setname(parsed.userInfo.name || "");
          setEmail(parsed.userInfo.email || "");
          setWhatsapp(parsed.userInfo.phone || "");
        }
      } catch (err) {
        console.error("Error parsing searchData from sessionStorage:", err);
      }
    }
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };
  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handleContinue = async () => {
    if (!isFormValid) return;

    try {
      // 1) Fetch IP info
      const ipRes = await fetch("https://ipinfo.io/json");
      const ipData = await ipRes.json();

      // 2) Load existing searchData from session
      const storedDataRaw = sessionStorage.getItem("searchData");
      const storedData = storedDataRaw ? JSON.parse(storedDataRaw) : {};

      // 3) Insert or update user info
      if (!storedData.userInfo) {
        storedData.userInfo = {
          name,
          email,
          phone: whatsapp,
          ...ipData,
        };
      }
      // 4) Save back to session
      sessionStorage.setItem("searchData", JSON.stringify(storedData));
      console.log("User info saved to sessionStorage:", storedData);

      // 5) Close modal
      onClose();
    } catch (err) {
      console.error("Error fetching IP info or saving user data:", err);
    }
  };

  // ---------- 6) Early return if modal isn't visible ----------
  if (!show) return null;

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
            {/* Close button */}
            <button
              className="ml-auto mb-4 block text-gray-500 hover:text-gray-700"
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
                onChange={(e) => setname(e.target.value)}
              />
            </div>

            {/* Email with OTP Button */}
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
                  className="w-full border border-gray-300 rounded px-3 py-2
                             focus:outline-none focus:ring focus:border-blue-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => console.log("Send email OTP")}
                className="mb-1 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Send OTP
              </button>
            </div>

            {/* WhatsApp with OTP Button */}
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
                  className="w-full border border-gray-300 rounded px-3 py-2
                             focus:outline-none focus:ring focus:border-blue-500"
                  placeholder="Enter your WhatsApp number"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => console.log("Send WhatsApp OTP")}
                className="mb-1 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Send OTP
              </button>
            </div>
          </div>

          {/* Checkbox & Continue */}
          <div>
            {/* Checkbox row */}
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
                </Link>
                and{" "}
                <Link
                  href={"/termsAndCondition"}
                  className="text-blue-600 hover:underline"
                >
                  T&Cs{" "}
                </Link>
              </label>
            </div>

            <button
              onClick={handleContinue}
              disabled={!isFormValid}
              className={`w-full px-4 py-2 text-white font-semibold rounded ${
                isFormValid
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-300"
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
