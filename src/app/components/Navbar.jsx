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

  // Single input for either email or phone:
  const [identifier, setIdentifier] = useState(""); // user-typed: email or phone
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fetchedName, setFetchedName] = useState("");
  // For password login
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  // OTP states
  const [returnedOtp, setReturnedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  // We want to show "Login via OTP" first, so default:
  const [isOtpMode, setIsOtpMode] = useState(true);
  const [otpSendStatus, setOtpSendStatus] = useState("idle");
  // Dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
      return;
    }

    try {
      // This uses the same API route you mentioned:
      // /api/user/${encodeURIComponent(emailOrPhone)}
      const resp = await fetch(
        `/api/user/${encodeURIComponent(identifier)}`,
        { method: "GET" }
      );
      if (!resp.ok) {
        throw new Error("Failed to get user info");
      }
      const userData = await resp.json();

      // If your API returns an array:
      if (Array.isArray(userData) && userData.length > 0) {
        const userObj = userData[0];
        setPhoneNumber(userObj.phone || "");
        setEmail(userObj.email || "");
        setFetchedName(userObj.name || "");
      }
      // If your API returns an object, adjust accordingly:
      else if (userData && userData.phone) {
        setPhoneNumber(userData.phone || "");
        setEmail(userData.email || "");
        setFetchedName(userData.name || "");
      } else {
        // No data found
        setPhoneNumber("");
        setEmail("");
        setFetchedName("");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setPhoneNumber("");
      setEmail("");
      setFetchedName("");
    }
  };

  // ----------------------------------------------------------------
  // Send OTP
  // ----------------------------------------------------------------
  const handleSendOtp = async () => {
    // We need at least phone or email to send OTP
    // For example, if your OTP is phone-based, phoneNumber must exist
    if (!phoneNumber && !email) {
      toast.error("Please enter a valid phone or email first.");
      return;
    }

    setOtpSendStatus("sending");
    try {
      // Using the same path you had in your snippet:
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
      // Example using your snippet's approach
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

        // Mark user as verified in session
        const userLoginData = {
          email,
          phone: phoneNumber,
          name: fetchedName,
        };

        const searchDataStr = sessionStorage.getItem("searchData");
        let searchData = searchDataStr ? JSON.parse(searchDataStr) : {};
        searchData.userInfo = { ...searchData.userInfo, ...userLoginData };
        sessionStorage.setItem("searchData", JSON.stringify(searchData));
        sessionStorage.setItem("loginData", JSON.stringify(userLoginData));
        sessionStorage.setItem("userVerified", "true");

          // Optionally send final data
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

        // Merge into searchData
        const searchDataStr = sessionStorage.getItem("searchData");
        let searchData = searchDataStr ? JSON.parse(searchDataStr) : {};
        searchData.userInfo = { ...searchData.userInfo, ...userLoginData };
        sessionStorage.setItem("searchData", JSON.stringify(searchData));
        sessionStorage.setItem("loginData", JSON.stringify(userLoginData));
        sessionStorage.setItem("userVerified", "true");

        // Optionally send final data
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
                setIdentifier("");
                setEmail("");
                setPhoneNumber("");
                setPassword("");
                setFetchedName("");
                setEnteredOtp("");
                setIsOtpMode(true);
                setOtpSendStatus("idle");
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              aria-label="Close login modal"
            >
              &times;
            </button>

            {/* Toggle between OTP and Password modes */}
            <div className="flex justify-center mb-4">
              {/* First: OTP Login */}
              <button
                onClick={() => {
                  setIsOtpMode(true);
                  setOtpSendStatus("idle");
                }}
                className={`mr-2 px-3 py-1 border ${
                  isOtpMode ? "bg-gray-300" : "bg-white"
                }`}
              >
                Login via OTP
              </button>

              {/* Second: Password Login */}
              <button
                onClick={() => {
                  setIsOtpMode(false);
                  setOtpSendStatus("idle");
                }}
                className={`px-3 py-1 border ${
                  !isOtpMode ? "bg-gray-300" : "bg-white"
                }`}
              >
                Login via Password
              </button>
            </div>

            {/* The single identifier field (email or phone) */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter phone or email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                onBlur={handleFetchUserData}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* If we fetched an email (when user typed phone), show it read-only */}
            {email && (
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100"
                />
              </div>
            )}

            {/* If we fetched a phone (when user typed email), show it read-only */}
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

            {/* ----------------- OTP LOGIN SECTION ----------------- */}
            {isOtpMode && (
              <>
                <h2 className="text-xl font-bold mb-4">Login via OTP</h2>

                {/* Send OTP button */}
                <button
                  onClick={handleSendOtp}
                  className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4 flex items-center justify-center"
                  disabled={
                    otpSendStatus === "sending" || otpSendStatus === "sent"
                  }
                >
                  {otpSendStatus === "sending" ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Sending OTP...
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

                {/* After OTP is sent, show verification field */}
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

            {/* ----------------- PASSWORD LOGIN SECTION ----------------- */}
            {!isOtpMode && (
              <>
                <h2 className="text-xl font-bold mb-4">Login with Password</h2>

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
    </>
  );
};

export default NavBar;
