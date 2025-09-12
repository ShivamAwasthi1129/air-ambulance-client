import React, { useState , useEffect } from "react";
import { FaEye, FaEyeSlash, FaSpinner, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const LoginModal = ({ isOpen, onClose, onLoginSuccess, initialEmail }) => {
  // ----------------------------------------------------------------
  // States
  // ----------------------------------------------------------------
 const [identifier, setIdentifier] = useState(initialEmail || "");
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
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [userExists, setUserExists] = useState(false);

useEffect(() => {
  if (initialEmail && isOpen) {
    setIdentifier(initialEmail);
  }
}, [initialEmail, isOpen]);


  // ----------------------------------------------------------------
  // Helper Functions
  // ----------------------------------------------------------------
  const resetAllStates = () => {
    setIdentifier("");
    setEmail("");
    setPhoneNumber("");
    setFetchedName("");
    setPassword("");
    setOtpDigits(['', '', '', '', '', '']);
    setEnteredOtp("");
    setIsOtpMode(true);
    setOtpSendStatus("idle");
    setUserExists(false);
    setInfoFetched(false);
    setIsLoggingIn(false);
    setIsVerifying(false);
    setReturnedOtp("");
    setShowPassword(false);
  };

  const handleClose = () => {
    resetAllStates();
    onClose();
  };

  // Auto-fetch user data only when modal opens with prefilled identifier (not while typing)
  useEffect(() => {
    if (!isOpen) return;
    if (initialEmail && identifier === initialEmail && !infoFetched) {
      handleFetchUserData();
    }
  }, [isOpen, initialEmail, identifier, infoFetched]);

  // Auto-send OTP once user is confirmed to exist
  useEffect(() => {
    if (!isOpen) return;
    if (userExists && otpSendStatus === "idle") {
      handleSendOtp();
    }
  }, [isOpen, userExists, otpSendStatus]);

  // Reset OTP send state and existence flags when identifier changes
  useEffect(() => {
    if (!isOpen) return;
    setOtpSendStatus("idle");
    setInfoFetched(false);
    setUserExists(false);
  }, [identifier, isOpen]);

  // ----------------------------------------------------------------
  // Fetch user data (email/phone) from your backend
  // ----------------------------------------------------------------
  const isValidIdentifier = (value) => {
    if (!value) return false;
    const trimmed = value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const digits = trimmed.replace(/[^0-9]/g, "");
    return emailRegex.test(trimmed) || (digits.length >= 7 && digits.length <= 15);
  };

  const handleBlurFetchIfValid = () => {
    if (isValidIdentifier(identifier)) {
      handleFetchUserData();
    }
  };
  const handleFetchUserData = async () => {
    if (!identifier) {
      // If cleared, reset
      setEmail("");
      setPhoneNumber("");
      setFetchedName("");
      setUserExists(false);
      setOtpSendStatus("idle");
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
      setOtpSendStatus("idle");
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
        resetAllStates();
        onLoginSuccess();
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
        resetAllStates();
        onLoginSuccess();
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
        resetAllStates();
        onLoginSuccess();
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

  // Don't render if not open
  if (!isOpen) return null;

  return (
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
            onClick={handleClose}
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
              onBlur={handleBlurFetchIfValid}
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
  );
};

export default LoginModal;