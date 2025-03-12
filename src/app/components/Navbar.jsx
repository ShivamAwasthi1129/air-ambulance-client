"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaEye, FaEyeSlash, FaSpinner, FaCheckCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NavBar = () => {
  // ----------------------------------------------------------------
  // States
  // ----------------------------------------------------------------
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [fetchedName, setFetchedName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // OTP states
  const [returnedOtp, setReturnedOtp] = useState(""); 
  const [enteredOtp, setEnteredOtp] = useState("");
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpSendStatus, setOtpSendStatus] = useState("idle"); 

  // Dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ----------------------------------------------------------------
  // Effects
  // ----------------------------------------------------------------

  // On mount, load user from session
  useEffect(() => {
    loadUserFromSession();
  }, []);

  // Listen for a custom event to re-load user
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
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else if (sessionStorage.getItem("userVerified") === "true") {
        const storedSearchData = sessionStorage.getItem("searchData");
        if (storedSearchData) {
          const searchData = JSON.parse(storedSearchData);
          if (searchData.userInfo && searchData.userInfo.email) {
            setUser({ email: searchData.userInfo.email });
          }
        }
      }
    } catch (error) {
      console.error("Error loading user from session:", error);
    }
  };

  // ----------------------------------------------------------------
  // Fetch phone number & name from your backend using email
  // ----------------------------------------------------------------
  const handleFetchUserPhone = async () => {
    if (!email) {
      setPhoneNumber("");
      setFetchedName("");
      return;
    }
    try {
      const resp = await fetch(`/api/user/${encodeURIComponent(email)}`, {
        method: "GET",
      });
      if (!resp.ok) {
        throw new Error("Failed to get user phone info");
      }
      const userData = await resp.json();

      if (Array.isArray(userData) && userData.length > 0) {
        setPhoneNumber(userData[0].phone || "");
        setFetchedName(userData[0].name || "");
      } else {
        setPhoneNumber("");
        setFetchedName("");
      }
    } catch (err) {
      console.error("Error fetching phone number:", err);
      setPhoneNumber("");
      setFetchedName("");
    }
  };

  // ----------------------------------------------------------------
  // Normal login with email/password
  // ----------------------------------------------------------------
  const handleLoginClick = async () => {
    // Clear any existing error state
    setIsLoggingIn(true);

    // Check for empty fields
    if (!email || !password) {
      toast.error("Email and password are required.");
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
        // If the response is not 200, handle it
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
        // If successful, store user info
        const userLoginData = {
          email,
          name: data.name,
          phone: phoneNumber,
          token: data.token,
        };

        // Merge into searchData
        const searchDataStr = sessionStorage.getItem("searchData");
        let searchData = searchDataStr ? JSON.parse(searchDataStr) : {};
        searchData.userInfo = { ...searchData.userInfo, ...userLoginData };
        sessionStorage.setItem("searchData", JSON.stringify(searchData));
        sessionStorage.setItem("loginData", JSON.stringify(userLoginData));

        // Optionally send final data to API
        const finalDataFromSession = sessionStorage.getItem("searchData");
        if (finalDataFromSession) {
          const finalDataToSend = JSON.parse(finalDataFromSession);
          await fetch("/api/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finalDataToSend),
          });
        }

        // Mark user as verified
        sessionStorage.setItem("userVerified", "true");
        toast.success("Logged in successfully!");
        
        // Close and reset
        setIsLoginModalOpen(false);
        setEmail("");
        setPassword("");
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
  // Send OTP
  // ----------------------------------------------------------------
  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter an email first.");
      return;
    }
    if (!phoneNumber) {
      toast.error("Unable to fetch phone number. Please check your email.");
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
    if (!email || !phoneNumber || !enteredOtp) {
      toast.error("Please ensure email, phone, and OTP are all provided.");
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

        // Now treat like normal login
        const userLoginData = {
          email,
          name: fetchedName,
          phone: phoneNumber,
        };

        const searchDataStr = sessionStorage.getItem("searchData");
        let searchData = searchDataStr ? JSON.parse(searchDataStr) : {};
        searchData.userInfo = { ...searchData.userInfo, ...userLoginData };
        sessionStorage.setItem("searchData", JSON.stringify(searchData));
        sessionStorage.setItem("loginData", JSON.stringify(userLoginData));
        sessionStorage.setItem("userVerified", "true");

        // Close and reset
        setIsLoginModalOpen(false);
        setEmail("");
        setPhoneNumber("");
        setPassword("");
        setFetchedName("");
        setEnteredOtp("");
        setIsOtpMode(false);
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
  // Logout
  // ----------------------------------------------------------------
  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("userVerified");
    sessionStorage.removeItem("loginData");
    window.location.reload();
  };

  return (
    <>
      {/* ToastContainer at the top level */}
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

      {/* --------------------------------- NAV BAR --------------------------------- */}
      <nav className="w-full z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left side: Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="https://www.charterflightsaviation.com/images/logo.png"
              alt="Logo"
              className="h-16 object-contain mr-2"
            />
          </Link>

          {/* Center: Navigation links */}
          <div className="space-x-6 hidden md:inline-block text-xl">
            <Link href="/" className="text-white hover:text-slate-300">
              Home
            </Link>
            <Link href="/about" className="text-white hover:text-slate-300">
              About
            </Link>
            <Link href="/aircrafts" className="text-white hover:text-slate-300">
              Aircrafts
            </Link>
            <Link href="/partners" className="text-white hover:text-slate-300">
              Partners
            </Link>
            <Link
              href="/termsAnsCondition"
              className="text-white hover:text-slate-300"
            >
              Terms and Conditions
            </Link>
          </div>

          {/* Right side: Login button or user info with dropdown */}
          <div className="relative" ref={dropdownRef}>
            {user ? (
              <>
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-700">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white">{user.email}</span>
                </div>
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-md py-2 w-48 z-10">
                    <Link href="/profile">
                      <div className="px-4 py-2 hover:bg-gray-100">
                        User Profile
                      </div>
                    </Link>
                    <Link href="/travel-history">
                      <div className="px-4 py-2 hover:bg-gray-100">
                        Travel History
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-4 py-2 rounded-xl text-white bg-gradient-to-r from-sky-300 to-green-500 hover:from-sky-400 hover:to-green-600"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* --------------------------------- MODAL --------------------------------- */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            {/* Close modal */}
            <button
              onClick={() => {
                setIsLoginModalOpen(false);
                setEmail("");
                setPhoneNumber("");
                setPassword("");
                setFetchedName("");
                setIsOtpMode(false);
                setEnteredOtp("");
                setOtpSendStatus("idle");
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              aria-label="Close login modal"
            >
              &times;
            </button>

            {/* ---------------------- Toggle normal vs OTP mode --------------------- */}
            <div className="flex justify-center mb-4">
              <button
                onClick={() => {
                  setIsOtpMode(false);
                  setOtpSendStatus("idle");
                }}
                className={`mr-2 px-3 py-1 border ${
                  !isOtpMode ? "bg-gray-300" : "bg-white"
                }`}
              >
                Login via Password
              </button>
              <button
                onClick={() => {
                  setIsOtpMode(true);
                  setOtpSendStatus("idle");
                }}
                className={`px-3 py-1 border ${
                  isOtpMode ? "bg-gray-300" : "bg-white"
                }`}
              >
                Login via OTP
              </button>
            </div>

            {/* --------------------------- COMMON FIELDS ---------------------------- */}
            {/* Email input */}
            <div className="mb-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleFetchUserPhone}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Fetched phone number (read-only) */}
            {phoneNumber && (
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Phone number"
                  value={phoneNumber}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100"
                />
              </div>
            )}

            {/* --------------------------- NORMAL LOGIN ---------------------------- */}
            {!isOtpMode && (
              <>
                <h2 className="text-xl font-bold mb-4">
                  Login with Email/Password
                </h2>

                {/* Password input */}
                <div className="mb-4 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded pr-10"
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <FaEye className="text-gray-500" />
                    ) : (
                      <FaEyeSlash className="text-gray-500" />
                    )}
                  </div>
                </div>

                {/* Normal (password) Login button */}
                <button
                  onClick={handleLoginClick}
                  className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 flex justify-center items-center"
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

            {/* --------------------------- OTP LOGIN ---------------------------- */}
            {isOtpMode && (
              <>
                <h2 className="text-xl font-bold mb-4">Login via OTP</h2>

                {/* Button to send OTP */}
                <button
                  onClick={handleSendOtp}
                  className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4 flex items-center justify-center"
                  disabled={otpSendStatus === "sending" || otpSendStatus === "sent"}
                >
                  {otpSendStatus === "sending" ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Sending OTP..
                    </>
                  ) : otpSendStatus === "sent" ? (
                    <>
                      OTP Sent
                      <FaCheckCircle className="ml-2 text-green-500" />
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>

                {/* Show the verify fields only if OTP was sent successfully */}
                {otpSendStatus === "sent" && (
                  <>
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    {/* Button to verify OTP */}
                    <button
                      onClick={handleVerifyOtp}
                      className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Verify OTP
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
