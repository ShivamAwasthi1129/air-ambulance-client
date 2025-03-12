"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";

const NavBar = () => {
  // ----------------------------------------------------------------
  // Existing login state
  // ----------------------------------------------------------------
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // ----------------------------------------------------------------
  // OTP-related states
  // ----------------------------------------------------------------
  const [showOTPSection, setShowOTPSection] = useState(false);

  // We store phone number from the backend
  const [phoneNumber, setPhoneNumber] = useState("");

  // Single “Send OTP” button that sends both phone & email OTP
  const [isSendingBothOTP, setIsSendingBothOTP] = useState(false);

  // Phone OTP
  const [phoneOTP, setPhoneOTP] = useState("");
  const [phoneOTPError, setPhoneOTPError] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);

  // Email OTP
  const [emailOTP, setEmailOTP] = useState("");
  const [emailOTPError, setEmailOTPError] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  // Optionally for timers, if you want them
  // const [phoneOtpTimeLeft, setPhoneOtpTimeLeft] = useState(0);
  // const [emailOtpTimeLeft, setEmailOtpTimeLeft] = useState(0);
  // const phoneTimerRef = useRef(null);
  // const emailTimerRef = useRef(null);

  // Dropdown ref
  const dropdownRef = useRef(null);

  // ----------------------------------------------------------------
  // Effects
  // ----------------------------------------------------------------
  useEffect(() => {
    loadUserFromSession();
  }, []);

  useEffect(() => {
    const updateHandler = () => {
      loadUserFromSession();
    };
    window.addEventListener("updateNavbar", updateHandler);
    return () => {
      window.removeEventListener("updateNavbar", updateHandler);
    };
  }, []);

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
  // Helper: load user from session (existing logic)
  // ----------------------------------------------------------------
  const loadUserFromSession = () => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (sessionStorage.getItem("userVerified") === "true") {
      const storedSearchData = sessionStorage.getItem("searchData");
      if (storedSearchData) {
        try {
          const searchData = JSON.parse(storedSearchData);
          if (searchData.userInfo && searchData.userInfo.email) {
            setUser({ email: searchData.userInfo.email });
          }
        } catch (error) {
          console.error("Error parsing searchData:", error);
        }
      }
    }
  };

  // ----------------------------------------------------------------
  // Handler: normal email/password login (existing logic)
  // ----------------------------------------------------------------
  const handleLoginClick = async () => {
    setErrorMessage("");
    setIsLoggingIn(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (data.token) {
        // If successful, store user info
        const userLoginData = {
          email,
          name: data.name,
          phone: data.phone,
          token: data.token,
        };

        const searchDataStr = sessionStorage.getItem("searchData");
        let searchData = searchDataStr ? JSON.parse(searchDataStr) : {};
        searchData.userInfo = { ...searchData.userInfo, ...userLoginData };
        sessionStorage.setItem("searchData", JSON.stringify(searchData));
        sessionStorage.setItem("loginData", JSON.stringify(userLoginData));

        // Optionally post final data
        const finalDataFromSession = sessionStorage.getItem("searchData");
        if (finalDataFromSession) {
          const finalDataToSend = JSON.parse(finalDataFromSession);
          console.log("Final Payload (sent immediately):", finalDataToSend);
          await fetch("/api/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finalDataToSend),
          });
        }

        sessionStorage.setItem("userVerified", "true");
        window.location.reload();

        // Cleanup
        setIsLoginModalOpen(false);
        setEmail("");
        setPassword("");
      } else if (data.error) {
        setErrorMessage(data.error);
      }
    } catch (err) {
      console.error("Error during login:", err);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // ----------------------------------------------------------------
  // Handler: logout (existing logic)
  // ----------------------------------------------------------------
  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("userVerified");
    sessionStorage.removeItem("loginData");
    window.location.reload();
  };

  // ----------------------------------------------------------------
  // Handler: fetch user phone from backend for given email
  // ----------------------------------------------------------------
  const handleFetchUserPhone = async () => {
    if (!email) return;
    try {
      const resp = await fetch(`/api/user/${encodeURIComponent(email)}`, {
        method: "GET",
      });
      if (!resp.ok) {
        throw new Error("Failed to get user phone info");
      }
      const userData = await resp.json();

      // userData might be an array
      if (Array.isArray(userData) && userData.length > 0 && userData[0].phone) {
        setPhoneNumber(userData[0].phone);
      } else {
        setPhoneNumber("");
      }
    } catch (err) {
      console.error("Error fetching phone number:", err);
      setPhoneNumber("");
    }
  };

  // ----------------------------------------------------------------
  // Handler: single "Send OTP" for both phone & email
  // ----------------------------------------------------------------
  const handleSendOTP = async () => {
    // Clear previous errors
    setPhoneOTPError("");
    setEmailOTPError("");
    setPhoneOTP("");
    setEmailOTP("");
    setPhoneVerified(false);
    setEmailVerified(false);

    // If there's no email or phone, we can't send
    if (!email && !phoneNumber) {
      setEmailOTPError("Email or phone not found. Please enter valid email.");
      return;
    }

    setIsSendingBothOTP(true);

    // 1) Send OTP to phone (if phoneNumber is present)
    try {
      if (phoneNumber) {
        const respPhone = await fetch(
          `/api/otp/whatsapp?phoneNumber=${encodeURIComponent(phoneNumber)}`,
          { method: "GET" }
        );
        const phoneData = await respPhone.json();
        if (!respPhone.ok) {
          throw new Error(phoneData.message || "Failed to send phone OTP");
        }
        console.log("Phone OTP sent to:", phoneNumber);
        // Optionally start a countdown timer for phone OTP
      }
    } catch (err) {
      console.error(err);
      setPhoneOTPError("Failed to send phone OTP. You can still verify email.");
    }

    // 2) Send OTP to email (if email is present)
    try {
      if (email) {
        const respEmail = await fetch(
          `/api/otp?email=${encodeURIComponent(email)}`,
          { method: "GET" }
        );
        const emailData = await respEmail.json();
        if (!respEmail.ok) {
          throw new Error(emailData.message || "Failed to send email OTP");
        }
        console.log("Email OTP sent to:", email);
        // Optionally start a countdown timer for email OTP
      }
    } catch (err) {
      console.error(err);
      setEmailOTPError("Failed to send email OTP. You can still verify phone.");
    }

    setIsSendingBothOTP(false);
  };

  // ----------------------------------------------------------------
  // Verify phone OTP. If successful => do final login steps
  // ----------------------------------------------------------------
  const handleVerifyPhoneOTP = async () => {
    if (!phoneOTP || phoneOTP.length !== 6) {
      setPhoneOTPError("Phone OTP must be 6 digits.");
      return;
    }
    try {
      const resp = await fetch(
        `/api/otp/whatsapp?otp=${encodeURIComponent(
          phoneOTP
        )}&phoneNumber=${encodeURIComponent(phoneNumber)}`,
        { method: "GET" }
      );
      const data = await resp.json();

      if (resp.ok && data.message === "OTP verified successfully") {
        setPhoneVerified(true);
        setPhoneOTPError("");

        // === Final login logic if *either* OTP is verified ===
        await finalizeOTPLogin({
          token: data.token || "",
          // You might also get name from data, if your backend returns it
          name: data.name || "",
          phone: phoneNumber,
        });
      } else {
        setPhoneOTPError(data.message || "Invalid/expired phone OTP.");
      }
    } catch (err) {
      console.error(err);
      setPhoneOTPError("Error verifying phone OTP.");
    }
  };

  // ----------------------------------------------------------------
  // Verify email OTP. If successful => do final login steps
  // ----------------------------------------------------------------
  const handleVerifyEmailOTP = async () => {
    if (!emailOTP || emailOTP.length !== 6) {
      setEmailOTPError("Email OTP must be 6 digits.");
      return;
    }
    try {
      const resp = await fetch(
        `/api/otp?email=${encodeURIComponent(
          email
        )}&otp=${encodeURIComponent(emailOTP)}`,
        { method: "GET" }
      );
      const data = await resp.json();

      if (resp.ok && data.message === "OTP verified successfully") {
        setEmailVerified(true);
        setEmailOTPError("");

        // === Final login logic if *either* OTP is verified ===
        await finalizeOTPLogin({
          token: data.token || "",
          name: data.name || "",
          phone: phoneNumber,
        });
      } else {
        setEmailOTPError(data.message || "Invalid/expired email OTP.");
      }
    } catch (err) {
      console.error(err);
      setEmailOTPError("Error verifying email OTP.");
    }
  };

  // ----------------------------------------------------------------
  // Helper: merges into searchData, sets userVerified, reloads
  // ----------------------------------------------------------------
  const finalizeOTPLogin = async ({ token, name, phone }) => {
    // Combine with existing session logic
    const userLoginData = {
      email,
      phone,
      name,
      token,
    };

    const searchDataStr = sessionStorage.getItem("searchData");
    let searchData = searchDataStr ? JSON.parse(searchDataStr) : {};
    searchData.userInfo = { ...searchData.userInfo, ...userLoginData };
    sessionStorage.setItem("searchData", JSON.stringify(searchData));
    sessionStorage.setItem("loginData", JSON.stringify(userLoginData));

    // Optionally send final data
    const finalDataFromSession = sessionStorage.getItem("searchData");
    if (finalDataFromSession) {
      const finalDataToSend = JSON.parse(finalDataFromSession);
      console.log("Final Payload (sent via OTP flow):", finalDataToSend);
      await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalDataToSend),
      });
    }

    sessionStorage.setItem("userVerified", "true");
    window.location.reload();
  };

  return (
    <>
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

          {/* Right side: Login button or user info w/ dropdown */}
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
                setErrorMessage("");
                setEmail("");
                setPassword("");
                setShowOTPSection(false);
                setPhoneNumber("");
                setPhoneOTP("");
                setEmailOTP("");
                setPhoneOTPError("");
                setEmailOTPError("");
                setEmailVerified(false);
                setPhoneVerified(false);
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              aria-label="Close login modal"
            >
              &times;
            </button>

            <h2 className="text-xl font-bold mb-4">Login via credentials</h2>

            {/* Email input */}
            <div className="mb-4">
              <input
                type="email"
                placeholder="Enter registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

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

            {/* Toggle “Login via OTP” Section */}
            <p
              className="text-blue-500 text-sm underline cursor-pointer mb-4"
              onClick={async () => {
                // When toggling OTP section on, fetch phone if not already
                setShowOTPSection((prev) => {
                  const willShow = !prev;
                  if (willShow) {
                    handleFetchUserPhone();
                  }
                  return willShow;
                });
              }}
            >
              Login via OTP
            </p>

            {/* -------------------------- OTP SECTION -------------------------- */}
            {showOTPSection && (
              <div className="p-3 border border-gray-300 rounded mb-4">
                {/* Display phone + email (non-editable) */}
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phoneNumber || ""}
                    disabled
                    placeholder="No phone found"
                    className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-gray-700 text-sm mb-1">
                    Email
                  </label>
                  <input
                    type="text"
                    value={email || ""}
                    disabled
                    placeholder="No email?"
                    className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                  />
                </div>

                {/* Single button to send BOTH OTPs */}
                <button
                  onClick={handleSendOTP}
                  disabled={isSendingBothOTP || (!phoneNumber && !email)}
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 w-full"
                >
                  {isSendingBothOTP ? "Sending OTP to both..." : "Send OTP"}
                </button>

                {/* Phone OTP verify */}
                <div className="mt-4">
                  <label className="block text-gray-700 text-sm mb-1">
                    Enter Phone OTP
                  </label>
                  <input
                    type="text"
                    value={phoneOTP}
                    onChange={(e) => setPhoneOTP(e.target.value)}
                    placeholder="6-digit phone OTP"
                    className="w-full p-2 border rounded mb-2"
                  />
                  <button
                    onClick={handleVerifyPhoneOTP}
                    disabled={!phoneOTP}
                    className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                  >
                    Verify Phone OTP
                  </button>
                  {phoneOTPError && (
                    <p className="text-red-500 text-sm mt-2">{phoneOTPError}</p>
                  )}
                </div>

                {/* Email OTP verify */}
                <div className="mt-4">
                  <label className="block text-gray-700 text-sm mb-1">
                    Enter Email OTP
                  </label>
                  <input
                    type="text"
                    value={emailOTP}
                    onChange={(e) => setEmailOTP(e.target.value)}
                    placeholder="6-digit email OTP"
                    className="w-full p-2 border rounded mb-2"
                  />
                  <button
                    onClick={handleVerifyEmailOTP}
                    disabled={!emailOTP}
                    className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                  >
                    Verify Email OTP
                  </button>
                  {emailOTPError && (
                    <p className="text-red-500 text-sm mt-2">{emailOTPError}</p>
                  )}
                </div>
              </div>
            )}

            {/* Normal Login button */}
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

            {/* Show error if normal login fails */}
            {errorMessage && (
              <p className="mt-2 text-red-500 text-center">{errorMessage}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
