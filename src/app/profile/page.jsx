"use client";

import React, { useEffect, useState } from "react";
import NavBar from "../components/Navbar";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form fields
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [phone, setPhone] = useState("");
  const [mailId, setMailId] = useState("");

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
        setPassword(data.password || "");
        setRetypePassword(data.password || "");
        setPhone(data.phone || "");
        setMailId(data.email || "");
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

  // Stub for Save Changes
  const handleSave = () => {
    // Possibly PUT/PATCH updated fields
    alert("Save Changes clicked! Implement your update logic here.");
  };

  // Stub for Cancel
  const handleCancel = () => {
    alert("Cancel clicked! Implement your reset or navigation logic here.");
  };

  // Stub for Log out
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                <div>
                  <label className="block text-gray-600 mb-1 text-sm">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 text-sm">
                    Re-Type Password
                  </label>
                  <input
                    type="password"
                    value={retypePassword}
                    onChange={(e) => setRetypePassword(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Contact */}
              <h3 className="text-blue-600 text-lg font-bold mb-4">CONTACT</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 mb-1 text-sm">
                    Phone No
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 text-sm">
                    Mail ID
                  </label>
                  <input
                    type="text"
                    value={mailId}
                    onChange={(e) => setMailId(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex items-center space-x-4">
                <button
                  onClick={handleSave}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-full transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded-full transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="ml-auto text-red-600 hover:underline"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
