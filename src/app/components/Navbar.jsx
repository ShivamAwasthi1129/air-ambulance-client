import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

const NavBar = () => {
  // State to control the login modal visibility
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // State to hold the logged in user info (token and email)
  const [user, setUser] = useState(null);
  // State to hold the login form values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // State to hold any error message returned from the API
  const [errorMessage, setErrorMessage] = useState("");
  // State to control the user dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Create a ref for the dropdown container
  const dropdownRef = useRef(null);

  // Initial load: check session storage
  useEffect(() => {
    loadUserFromSession();
  }, []);

  // Listen for the custom "updateNavbar" event to refresh user info
  useEffect(() => {
    const updateHandler = () => {
      loadUserFromSession();
    };

    window.addEventListener("updateNavbar", updateHandler);
    return () => {
      window.removeEventListener("updateNavbar", updateHandler);
    };
  }, []);

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
          console.error("Error parsing searchData from sessionStorage:", error);
        }
      }
    }
  };

 // Click outside detection to hide the dropdown menu
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

  // Handler to submit login credentials
  const handleLoginClick = async () => {
    // Clear any previous error message
    setErrorMessage("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // If a token is returned, login is successful.
      if (data.token) {
        const userData = { email, token: data.token, name: data.name, phone: data.phone};
        setUser(userData);
        // Save user details in session storage to persist across refreshes
        sessionStorage.setItem("user", JSON.stringify(userData));
        // Optionally, track verification with another key
        sessionStorage.setItem("userVerified", "true");
        // Close the modal and clear form values
        setIsLoginModalOpen(false);
        setEmail("");
        setPassword("");
        // Reload the page once to load the latest updates
        window.location.reload();
      } else if (data.error) {
        // Display the error message returned by the API
        setErrorMessage(data.error);
      }
    } catch (err) {
      console.error("Error during login:", err);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  // Handler for logging out
  const handleLogout = () => {
    setUser(null);
    // Remove the user details and verification key from session storage
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("userVerified");
    window.location.reload();
  };


  return (
    <>
      <nav className="w-full z-50">
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
                      {user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white">{user.email}</span>
                </div>
                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-md py-2 w-48">
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

      
      {/* Modal for login */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            {/* Cross icon to close the modal */}
            <button
              onClick={() => {
                setIsLoginModalOpen(false);
                // Clear any error message and form values on close
                setErrorMessage("");
                setEmail("");
                setPassword("");
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              aria-label="Close login modal"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Login via credentials</h2>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              onClick={handleLoginClick}
              className="w-full py-4 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Login
            </button>
            {/* Display error message (if any) below the login button */}
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
