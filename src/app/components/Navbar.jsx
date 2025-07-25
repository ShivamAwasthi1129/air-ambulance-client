"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaEye, FaEyeSlash, FaSpinner, FaCheckCircle, FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NavBar = () => {
  // ----------------------------------------------------------------
  // States (same as previous code)
  // ----------------------------------------------------------------
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fetchedName, setFetchedName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [returnedOtp, setReturnedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [isOtpMode, setIsOtpMode] = useState(true);
  const [otpSendStatus, setOtpSendStatus] = useState("idle");
  const [infoFetched, setInfoFetched] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("worldwide");
  const [countryPhones, setCountryPhones] = useState([]);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [userExists, setUserExists] = useState(false);

  // fetch full list on mount
  useEffect(() => {
    fetch("https://admin.airambulanceaviation.co.in/api/contact?limit=255")
      .then((r) => r.json())
      .then((json) => {
        setCountries(json.data);
        if (!sessionStorage.getItem("country_name")) {
          sessionStorage.setItem("country_name", "worldwide");
        }
      })
      .catch(console.error);
  }, []);
  // fetch phoneNumbers whenever selection changes (and isn’t “worldwide”)
  useEffect(() => {
    if (selectedCountry === "worldwide") {
      // ─── default load: GET /api/contact and take the first entry’s two numbers ───
      fetch("https://admin.airambulanceaviation.co.in/api/contact")
        .then((r) => r.json())
        .then((json) => {
          const all = json.data;
          if (Array.isArray(all) && all.length > 0) {
            setCountryPhones(all[0].phoneNumbers);
          }
        })
        .catch(console.error);
    } else {
      // ─── user picked a specific country ───
      fetch(
        `https://admin.airambulanceaviation.co.in/api/contact/search?q=${encodeURIComponent(
          selectedCountry
        )}`
      )
        .then((r) => r.json())
        .then((arr) => {
          if (arr.length > 0) setCountryPhones(arr[0].phoneNumbers);
        })
        .catch(console.error);
    }
  }, [selectedCountry]);
  // ----------------------------------------------------------------
  // Effects
  // ----------------------------------------------------------------
  // Load user from session on mount
  useEffect(() => {
    loadUserFromSession();
  }, []);
  // Listen for custom event to re-load user
  useEffect(() => {
    const updateHandler = () => {
      loadUserFromSession();
    };
    window.addEventListener("updateNavbar", updateHandler);
    return () => {
      window.removeEventListener("updateNavbar", updateHandler);
    };
  }, []);

  // Hide dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // ----------------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------------
  const loadUserFromSession = () => {
    try {
      if (sessionStorage.getItem("userVerified") === "true") {
        const storedSearchData = sessionStorage.getItem("searchData");
        const storedLoginData = sessionStorage.getItem("loginData");
        if (storedSearchData) {
          const searchData = JSON.parse(storedSearchData);
          let finalEmail = searchData?.userInfo?.email || "";
          if (!finalEmail && storedLoginData) {
            const loginData = JSON.parse(storedLoginData);
            finalEmail = loginData?.email || "";
          }
          if (finalEmail) {
            setUser({ email: finalEmail });
            return;
          }
        }
        if (storedLoginData) {
          const loginData = JSON.parse(storedLoginData);
          if (loginData?.email) {
            setUser({ email: loginData.email });
            return;
          }
        }
      }
    } catch (error) {
      console.error("Error loading user from session:", error);
    }
  };

  // ----------------------------------------------------------------
  // Fetch user data (email/phone) from your backend
  // ----------------------------------------------------------------
  const handleFetchUserData = async () => {
    if (!identifier) {
      // If cleared, reset
      setEmail("");
      setPhoneNumber("");
      setFetchedName("");
      setUserExists(false);
      return;
    }

    try {
      const resp = await fetch(
        `/api/user/${encodeURIComponent(identifier)}`,
        { method: "GET" }
      );
      if (!resp.ok) {
        throw new Error("Failed to get user info");
      }
      const userData = await resp.json();
      setInfoFetched(true);

      // If API returns an array:
      if (Array.isArray(userData) && userData.length > 0) {
        const userObj = userData[0];
        setPhoneNumber(userObj.phone || "");
        setEmail(userObj.email || "");
        setFetchedName(userObj.name || "");
        setUserExists(true);
      }
      // If API returns an object, adjust accordingly:
      else if (userData && userData.phone) {
        setPhoneNumber(userData.phone || "");
        setEmail(userData.email || "");
        setFetchedName(userData.name || "");
        setUserExists(true);
      } else {
        // No data found
        setPhoneNumber("");
        setEmail("");
        setFetchedName("");
        setUserExists(false);
        toast.error("User doesn't exist. Please use search bar.");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setPhoneNumber("");
      setEmail("");
      setFetchedName("");
      setUserExists(false);
      toast.error("User doesn't exist. Please use search bar.");
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Auto verify when all 6 digits are filled
    if (newOtpDigits.every(digit => digit !== '') && !isVerifying) {
      const otpString = newOtpDigits.join('');
      setEnteredOtp(otpString);
      handleAutoVerifyOtp(otpString);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleAutoVerifyOtp = async (otp) => {
    if ((!phoneNumber && !email) || !otp) {
      return;
    }

    setIsVerifying(true);
    try {
      const query = `/api/user/signin?email=${encodeURIComponent(
        email
      )}&otp=${encodeURIComponent(otp)}&phone=${encodeURIComponent(
        phoneNumber
      )}`;

      const resp = await fetch(query, { method: "GET" });
      if (!resp.ok) {
        throw new Error("Failed to verify OTP");
      }
      const data = await resp.json();
      if (
        data.message &&
        data.message.toLowerCase().includes("otp verified successfully")
      ) {
        toast.success("OTP verified successfully! Logging in...");
        // Same logic as handleVerifyOtp for session storage
        const userLoginData = {
          email,
          phone: phoneNumber,
          name: fetchedName,
          agreedToPolicy: true,
        };

        const searchDataStr = sessionStorage.getItem("searchData");
        let searchData = searchDataStr ? JSON.parse(searchDataStr) : {};
        searchData.userInfo = { ...searchData.userInfo, ...userLoginData };
        sessionStorage.setItem("searchData", JSON.stringify(searchData));
        sessionStorage.setItem("loginData", JSON.stringify(userLoginData));
        sessionStorage.setItem("userVerified", "true");

        const finalDataFromSession = sessionStorage.getItem("searchData");
        if (finalDataFromSession) {
          const finalDataToSend = JSON.parse(finalDataFromSession);
          await fetch("/api/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finalDataToSend),
          });
        }

        // Close and reset
        setIsLoginModalOpen(false);
        setIdentifier("");
        setEmail("");
        setPhoneNumber("");
        setFetchedName("");
        setOtpDigits(['', '', '', '', '', '']);
        setEnteredOtp("");
        setIsOtpMode(true);
        setOtpSendStatus("idle");
        setUserExists(false);

        window.location.reload();
      } else {
        toast.error("Invalid OTP. Please try again.");
        setOtpDigits(['', '', '', '', '', '']);
        setEnteredOtp("");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      toast.error("Please Enter a Valid OTP");
      setOtpDigits(['', '', '', '', '', '']);
      setEnteredOtp("");
    } finally {
      setIsVerifying(false);
    }
  };
  // ----------------------------------------------------------------
  // Send OTP
  // ----------------------------------------------------------------
  const handleSendOtp = async () => {
    // getting at least phone or email to send OTP
    // For example, if our OTP is phone-based, phoneNumber must exist
    if (!phoneNumber && !email) {
      toast.error("Please enter a valid phone or email first.");
      return;
    }

    setOtpSendStatus("sending");
    try {
      const resp = await fetch("/api/user/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fetchedName,
          phone: phoneNumber,
          email: email,
        }),
      });

      if (!resp.ok) {
        throw new Error("Failed to send OTP");
      }
      const data = await resp.json();
      if (data.success) {
        setReturnedOtp(data.otp?.toString() || "");
        toast.success("OTP sent successfully");
        setOtpSendStatus("sent");
      } else {
        toast.error("Failed to send OTP");
        setOtpSendStatus("idle");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      toast.error("Error sending OTP. Please try again.");
      setOtpSendStatus("idle");
    }
  };
  // ----------------------------------------------------------------
  // Verify OTP
  // ----------------------------------------------------------------
  const handleVerifyOtp = async () => {
    // Need phone or email plus the OTP
    if ((!phoneNumber && !email) || !enteredOtp) {
      toast.error("Please provide phone/email and OTP.");
      return;
    }

    try {
      const query = `/api/user/signin?email=${encodeURIComponent(
        email
      )}&otp=${encodeURIComponent(enteredOtp)}&phone=${encodeURIComponent(
        phoneNumber
      )}`;

      const resp = await fetch(query, { method: "GET" });
      if (!resp.ok) {
        throw new Error("Failed to verify OTP");
      }
      const data = await resp.json();
      if (
        data.message &&
        data.message.toLowerCase().includes("otp verified successfully")
      ) {
        toast.success("OTP verified successfully! Logging in...");
        // Marking user as verified in session
        const userLoginData = {
          email,
          phone: phoneNumber,
          name: fetchedName,
          agreedToPolicy: true,
        };

        const searchDataStr = sessionStorage.getItem("searchData");
        let searchData = searchDataStr ? JSON.parse(searchDataStr) : {};
        searchData.userInfo = { ...searchData.userInfo, ...userLoginData };
        sessionStorage.setItem("searchData", JSON.stringify(searchData));
        sessionStorage.setItem("loginData", JSON.stringify(userLoginData));
        sessionStorage.setItem("userVerified", "true");

        // Optionally sending final data
        const finalDataFromSession = sessionStorage.getItem("searchData");
        if (finalDataFromSession) {
          const finalDataToSend = JSON.parse(finalDataFromSession);
          await fetch("/api/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finalDataToSend),
          });
        }

        // Close and reset
        setIsLoginModalOpen(false);
        setIdentifier("");
        setEmail("");
        setPhoneNumber("");
        setFetchedName("");
        setEnteredOtp("");
        setIsOtpMode(true);
        setOtpSendStatus("idle");

        window.location.reload();
      } else {
        toast.error("OTP verification failed. Please try again.");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      toast.error("Error verifying OTP. Please try again.");
    }
  };
  // ----------------------------------------------------------------
  // Normal (Password) login
  // ----------------------------------------------------------------
  const handleLoginClick = async () => {
    setIsLoggingIn(true);

    if (!email) {
      toast.error("A valid email is required for password login.");
      setIsLoggingIn(false);
      return;
    }
    if (!password) {
      toast.error("Password is required.");
      setIsLoggingIn(false);
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error) {
          toast.error(errorData.error);
        } else {
          toast.error("Error logging in. Please try again.");
        }
        return;
      }

      const data = await response.json();
      if (data.token) {
        // If successful
        const userLoginData = {
          email,
          name: data.name || fetchedName,
          phone: phoneNumber,
          token: data.token,
        };
        // Merging into searchData
        const searchDataStr = sessionStorage.getItem("searchData");
        let searchData = searchDataStr ? JSON.parse(searchDataStr) : {};
        searchData.userInfo = { ...searchData.userInfo, ...userLoginData };
        sessionStorage.setItem("searchData", JSON.stringify(searchData));
        sessionStorage.setItem("loginData", JSON.stringify(userLoginData));
        sessionStorage.setItem("userVerified", "true");

        // Optionally sending the final data
        const finalDataFromSession = sessionStorage.getItem("searchData");
        if (finalDataFromSession) {
          const finalDataToSend = JSON.parse(finalDataFromSession);
          await fetch("/api/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finalDataToSend),
          });
        }

        toast.success("Logged in successfully!");
        setIsLoginModalOpen(false);

        // Reset
        setIdentifier("");
        setEmail("");
        setPhoneNumber("");
        setPassword("");
        setFetchedName("");

        window.location.reload();
      } else if (data.error) {
        toast.error(data.error);
      }
    } catch (err) {
      console.error("Error during login:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };
  // ----------------------------------------------------------------
  // Logout
  // ----------------------------------------------------------------
  const handleLogout = () => {
    setUser(null);
    sessionStorage.clear();
    window.location.reload();
  };
  return (
    <div className="z-20">


      {/* Rotating Message Stripe */}
      <div className="bg-[#0883bb] text-white text-sm overflow-hidden whitespace-nowrap z-10">
        <div className="hidden md:flex bg-customBlue py-1 overflow-hidden">
          <div className="animate-marquee">
            <p className="inline-block text-white text-sm md:text-base font-normal">
              2025 Updates in Charter Flights Aviation: Embarking on global journeys 24/7. Introducing secure and fastest private jets, business jets, and helicopters. For additional information, please inquire.
            </p>
          </div>
        </div>
      </div>
      {/* Main Navigation */}
      <nav className=" bg-gradient-to-r from-[#f0f4f8] via-[#e6f2ff] to-[#fff0e6] shadow-lg z-20 ">
        <div className="container mx-auto p-2 flex items-center justify-around">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="https://www.charterflightsaviation.com/images/logo.png"
              alt="Charter Flights Aviation Logo"
              className="h-16 object-contain transition-transform duration-300 hover:scale-105"
            />
          </Link>

          {/* Contact and Dropdown Section */}
          <div className="flex items-center space-x-6">
            {/* Country Dropdown */}
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                sessionStorage.setItem("country_name", e.target.value); 
                window.dispatchEvent(new Event("countryNameChanged"));
              }}
              className="rounded-lg px-3 py-2 text-sm border-2 border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 hover:border-blue-300 transition-all duration-300"
            >
              <option value="worldwide">Worldwide</option>
              {countries.map((c) => (
                <option key={c._id} value={c.country}>
                  {c.country
                    .split("-")
                    .map((w) => w[0].toUpperCase() + w.slice(1))
                    .join(" ")}
                </option>
              ))}
            </select>

            {/* Phone and WhatsApp Numbers */}
            <div className="flex items-center space-x-4">
              {countryPhones.map((num, idx) => (
                <a
                  key={`${num}-${idx}`}
                  href={idx === 0 ? `tel:${num}` : `https://wa.me/${num.replace(/^\+/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 hover:text-blue-600 group transition-all duration-300 transform hover:scale-110"
                >
                  {idx === 0 ? (
                    <FaPhoneAlt className="mr-2 text-gray-600 group-hover:text-blue-500 transition-colors" />
                  ) : (
                    <FaWhatsapp className="mr-2 text-gray-600 group-hover:text-green-500 transition-colors" />
                  )}
                  <span className="font-medium text-sm">{num}</span>
                </a>
              ))}
            </div>


          </div>
          {/* User Login/Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            {user ? (
              <>
                <div
                  className="flex items-center space-x-3 cursor-pointer group"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-200 to-blue-400 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-all duration-300">
                    <span className="text-white font-bold text-lg">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-800 font-semibold text-base group-hover:text-blue-600 transition-colors">
                    {user.email}
                  </span>
                </div>
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 bg-white shadow-2xl rounded-xl py-2 w-56 z-10 border border-gray-100 transform transition-all duration-300 origin-top-right">
                    <Link href="/profile">
                      <div className="px-4 py-3 hover:bg-gradient-to-r from-blue-50 to-blue-100 hover:text-blue-700 transition-all duration-300 cursor-pointer">
                        <span className="font-medium">User Profile</span>
                      </div>
                    </Link>
                    <Link href="/travelHistory">
                      <div className="px-4 py-3 hover:bg-gradient-to-r from-green-50 to-green-100 hover:text-green-700 transition-all duration-300 cursor-pointer">
                        <span className="font-medium">Travel History</span>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 hover:bg-gradient-to-r from-red-50 to-red-100 hover:text-red-700 transition-all duration-300"
                    >
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-6 py-2 rounded-2xl text-white font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Login
              </button>
            )}
          </div>
        </div>
        {/* Navigation Links */}
        <div className="border-t-4 border-[#0883bb] bg-gradient-to-r from-[#f0f8ff] via-[#e6f2ff] to-[#f0f0f0] text-gray-800 py-3 shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center space-x-10">
              {[
                { name: 'HOME', route: '/' },
                { name: 'ABOUT', route: '/' },
                { name: 'AIRCRAFTS', route: '/' },
                { name: 'GET IN TOUCH', route: '/' },
                { name: 'TERMS & CONDITIONS', route: '/termsAndCondition' },
              ].map((item, index) => (
                <React.Fragment key={item.name}>
                  <Link
                    href={item.route}
                    className="uppercase font-bold text-base tracking-wider 
           text-gray-700 
           relative 
           group 
           transition-all 
           duration-300 
           hover:text-transparent 
           hover:bg-clip-text 
           hover:bg-gradient-to-r 
           hover:from-blue-500 
           hover:to-purple-600 
           before:absolute 
           before:bottom-[-3px] 
           before:left-0 
           before:w-0 
           before:h-1 
           before:bg-gradient-to-r 
           before:from-blue-500 
           before:to-purple-600 
           before:transition-all 
           before:duration-300 
           hover:before:w-full"
                  >
                    {item.name}
                  </Link>
                  {index !== 4 && (
                    <div className="h-5 w-px bg-gray-300"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-96 relative overflow-hidden">
            {/* Gradient header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
              <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
              <p className="text-center text-blue-100 mt-1">Sign in to your account</p>
            </div>

            <div className="p-6">
              {/* Close modal */}
              <button
                onClick={() => {
                  setIsLoginModalOpen(false);
                  setIdentifier("");
                  setEmail("");
                  setPhoneNumber("");
                  setPassword("");
                  setFetchedName("");
                  setOtpDigits(['', '', '', '', '', '']);
                  setEnteredOtp("");
                  setIsOtpMode(true);
                  setOtpSendStatus("idle");
                  setUserExists(false);
                }}
                className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl font-bold transition-colors duration-200"
                aria-label="Close login modal"
              >
                &times;
              </button>

              {/* Toggle between OTP and Password modes */}
              <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                <button
                  onClick={() => {
                    setIsOtpMode(true);
                    setOtpSendStatus("idle");
                    setOtpDigits(['', '', '', '', '', '']);
                  }}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${isOtpMode
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                    }`}
                >
                  OTP Login
                </button>
                <button
                  onClick={() => {
                    setIsOtpMode(false);
                    setOtpSendStatus("idle");
                  }}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${!isOtpMode
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                    }`}
                >
                  Password Login
                </button>
              </div>

              {/* Identifier field */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Phone or Email
                </label>
                <input
                  type="text"
                  placeholder="Enter phone or email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  onBlur={handleFetchUserData}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
                />
              </div>

              {/* Fetched email (read-only) */}
              {email && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="text"
                    value={email}
                    readOnly
                    className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50"
                  />
                </div>
              )}

              {/* Fetched phone (read-only) */}
              {phoneNumber && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phoneNumber}
                    readOnly
                    className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50"
                  />
                </div>
              )}

              {/* OTP LOGIN SECTION */}
              {isOtpMode && (
                <>
                  {/* Send OTP button - only show if user exists */}
                  {userExists && (
                    <button
                      onClick={handleSendOtp}
                      className={`w-full py-3 rounded-lg font-medium mb-4 flex items-center justify-center transition-all duration-200 ${otpSendStatus === "sending" || otpSendStatus === "sent"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg"
                        }`}
                      disabled={otpSendStatus === "sending" || otpSendStatus === "sent"}
                    >
                      {otpSendStatus === "sending" ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Sending OTP...
                        </>
                      ) : otpSendStatus === "sent" ? (
                        <>
                          OTP Sent
                          <FaCheckCircle className="ml-2 text-green-400" />
                        </>
                      ) : (
                        "Send OTP"
                      )}
                    </button>
                  )}

                  {/* OTP Input Fields - 6 digit boxes */}
                  {otpSendStatus === "sent" && (
                    <div className="mb-6">
                      <label className="block text-gray-700 text-sm font-medium mb-3 text-center">
                        Enter 6-digit OTP
                      </label>
                      <div className="flex justify-center space-x-3">
                        {otpDigits.map((digit, index) => (
                          <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
                          />
                        ))}
                      </div>
                      {isVerifying && (
                        <div className="flex items-center justify-center mt-4">
                          <FaSpinner className="animate-spin mr-2 text-blue-500" />
                          <span className="text-blue-500 font-medium">Verifying OTP...</span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* PASSWORD LOGIN SECTION */}
              {!isOtpMode && (
                <>
                  <div className="mb-6 relative">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200 pr-12"
                    />
                    <div
                      className="absolute right-3 top-10 cursor-pointer text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                    </div>
                  </div>
                  <button
                    onClick={handleLoginClick}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex justify-center items-center"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Toast notifications */}
      <ToastContainer
        autoClose={4000}
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

export default NavBar;