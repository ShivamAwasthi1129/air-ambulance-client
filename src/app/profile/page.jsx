"use client";

import React, { useEffect, useState } from "react";
import NavBar from "../components/Navbar";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Basic user info
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [mailId, setMailId] = useState("");

  // Current password (read-only) and its show/hide toggle
  const [currentPassword, setCurrentPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  // New password fields
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  // Whether user is in "Update Password" mode
  const [editPassword, setEditPassword] = useState(false);

  // On mount, get email from sessionStorage and fetch user data
  useEffect(() => {
    const loginDataRaw = sessionStorage.getItem("loginData");
    if (!loginDataRaw) return;

    const loginData = JSON.parse(loginDataRaw);
    const email = loginData?.email;
    if (!email) return;

    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/user/${email}`);
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }

        // The endpoint returns an array; we take the first user object
        const arr = await res.json();
        if (!Array.isArray(arr) || !arr.length) {
          throw new Error("No user data found");
        }
        const data = arr[0];

        setUserData(data);

        // Populate form fields
        setName(data.name || "");
        setPhone(data.phone || "");
        setMailId(data.email || "");

        // Store the real password - not recommended in real apps
        setCurrentPassword(data.password || "");
        // Do not fill the new password fields until "Update Password" is clicked
        setPassword("");
        setRetypePassword("");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Derive first letter for the profile avatar
  const firstLetter =
    userData?.name?.[0]?.toUpperCase() ||
    (name ? name[0].toUpperCase() : "U");

  // Check if name has changed from the original
  const isNameChanged = userData && name !== userData.name;

  // Are the new password fields filled and matching?
  const passwordsFilled = password.trim().length > 0 && retypePassword.trim().length > 0;
  const passwordsMatch = password === retypePassword;
  const isPasswordChanged = editPassword && passwordsFilled && passwordsMatch;

  // Only enable Save if there's a name change OR a valid password change
  const canSave = isNameChanged || isPasswordChanged;

  const handleSave = async () => {
    // If user is updating password but they do not match, show error & return
    if (editPassword && !passwordsMatch) {
      setError("Passwords do not match!");
      return;
    }
    setError(null);

    try {
      // If we're editing the password, send { name, password }
      // If not editing the password, send { name } only
      const payload = editPassword
        ? { name, password }
        : { name };

      // Make the PUT request
      const res = await fetch(`/api/user/${mailId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to update user");
      }

      const result = await res.json();
      console.log("Update response:", result);

      alert("Profile updated successfully!");

      // If password was updated, end edit mode & clear it out
      if (editPassword) {
        setEditPassword(false);
        setPassword("");
        setRetypePassword("");
      }
      // Update local userData as well (so name matches what we just saved)
      setUserData((prev) => ({ ...prev, name }));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    // Reset fields to the original userData
    if (!userData) return;

    setName(userData.name || "");
    setError(null);

    // Reset password edits
    setEditPassword(false);
    setPassword("");
    setRetypePassword("");
    setShowPassword(false);
    setShowRetypePassword(false);
  };

  // Example logout
  const handleLogout = () => {
    sessionStorage.removeItem("loginData");
    alert("Logged out. Implement your logout logic here.");
  };

  return (
    <div className="min-h-screen relative bg-gray-100">
      {/* Background + Navbar */}
      <div
        className="w-full bg-cover absolute top-0 left-0"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-photo/airplane-runway-airport-sunset-travel-concept_587448-8154.jpg')",
          zIndex: 20,
        }}
      >
        <NavBar />
      </div>

      {/* Main content */}
      <div className="relative z-10 pt-[200px] pb-10 max-w-7xl mx-auto px-4 md:px-8">
        {loading ? (
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <p className="text-gray-700">Loading user info...</p>
          </div>
        ) : error ? (
          <div className="bg-white p-8 rounded-lg shadow-xl text-center text-red-600">
            {error}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:space-x-6">
            {/* Left Card (Profile Info) */}
            <div className="md:w-1/3 bg-gradient-to-b from-blue-400 to-blue-500 text-white p-8 rounded-xl shadow-lg mb-6 md:mb-0">
              {/* Circle Avatar with First Letter */}
              <div className="w-40 h-40 bg-white rounded-full mx-auto flex items-center justify-center text-blue-500 text-6xl font-bold overflow-hidden">
                {firstLetter}
              </div>
              {/* Name */}
              <h2 className="text-center mt-6 text-2xl font-semibold capitalize">
                {userData?.name || "User Name"}
              </h2>
              {/* User ID */}
              {userData?._id && (
                <p className="text-center mt-2 text-sm">
                  User ID: <span className="font-semibold">{userData._id}</span>
                </p>
              )}
              {/* Phone */}
              <div className="mt-4 flex items-center justify-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5h2l2 5l-2.03 2.03c.396 1.09 1.434 2.128 2.525 2.525L14 14l5 2v2M16 3h5m-5 4h2m-9 9v-3a3 3 0 013-3h3"
                  />
                </svg>
                <span>{userData?.phone || "+1 555 555 1234"}</span>
              </div>
              {/* Email */}
              <div className="mt-2 flex items-center justify-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12H8m8 0H8m4 8H8m4 0h4M16 6H8m8 0H8m4-2v2m0 12v2"
                  />
                </svg>
                <span>{userData?.email || "johndoe2025@gmail.com"}</span>
              </div>
            </div>

            {/* Right Form (Generals & Contact) */}
            <div className="md:w-2/3 bg-white p-8 rounded-xl shadow-lg">
              {/* Generals */}
              <h3 className="text-blue-600 text-lg font-bold mb-4">GENERALS</h3>

              {/* Name row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 mb-1 text-sm">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password section */}
              <div className="mt-6">
                <h3 className="text-blue-600 text-lg font-bold mb-4">
                  PASSWORD
                </h3>

                {!editPassword ? (
                  // Show "Current password" with eye toggle + "Update password" button
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-600 mb-1 text-sm">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          readOnly
                          className="w-full border rounded px-3 py-2 text-gray-700 bg-gray-100 focus:outline-none"
                        />
                        <span
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-3 top-3 cursor-pointer text-gray-400"
                        >
                          {showCurrentPassword ? "🙈" : "👁"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditPassword(true);
                          setPassword("");
                          setRetypePassword("");
                        }}
                        className="mt-2 text-blue-500 hover:underline"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                ) : (
                  // Show "New password" + "Confirm password" fields
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-600 mb-1 text-sm">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none"
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 cursor-pointer text-gray-400"
                        >
                          {showPassword ? "🙈" : "👁"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1 text-sm">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showRetypePassword ? "text" : "password"}
                          value={retypePassword}
                          onChange={(e) => setRetypePassword(e.target.value)}
                          className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none"
                        />
                        <span
                          onClick={() =>
                            setShowRetypePassword(!showRetypePassword)
                          }
                          className="absolute right-3 top-3 cursor-pointer text-gray-400"
                        >
                          {showRetypePassword ? "🙈" : "👁"}
                        </span>
                      </div>
                      {/* Show match status if user typed something */}
                      {passwordsFilled && (
                        <p
                          className={
                            passwordsMatch
                              ? "text-green-500 text-sm mt-1"
                              : "text-red-500 text-sm mt-1"
                          }
                        >
                          {passwordsMatch
                            ? "Passwords match"
                            : "Passwords do not match"}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact */}
              <div className="mt-6">
                <h3 className="text-blue-600 text-lg font-bold mb-4">
                  CONTACT
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 mb-1 text-sm">
                      Phone No
                    </label>
                    <input
                      type="text"
                      value={phone}
                      readOnly
                      className="w-full border rounded px-3 py-2 text-gray-500 bg-gray-100 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1 text-sm">
                      Mail ID
                    </label>
                    <input
                      type="text"
                      value={mailId}
                      readOnly
                      className="w-full border rounded px-3 py-2 text-gray-500 bg-gray-100 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex items-center space-x-4">
                <button
                  onClick={handleSave}
                  disabled={!canSave}
                  className={`px-6 py-2 rounded-full font-semibold transition ${
                    canSave
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-800 cursor-not-allowed"
                  }`}
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded-full transition"
                >
                  Cancel
                </button>
                {/*
                <button
                  onClick={handleLogout}
                  className="ml-auto text-red-600 hover:underline"
                >
                  Log out
                </button>
                */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
