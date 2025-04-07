"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AiOutlineCheckCircle } from "react-icons/ai";
import NavBar from "../components/Navbar";

// Simple Skeleton Loader
const SkeletonLoader = () => {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-6 bg-gray-300 rounded w-1/3"></div>
      <div className="h-6 bg-gray-300 rounded w-2/3"></div>
      <div className="h-6 bg-gray-300 rounded w-1/2"></div>
      <div className="h-6 bg-gray-300 rounded w-full"></div>
      <div className="h-6 bg-gray-300 rounded w-5/6"></div>
    </div>
  );
};

function PaymentSuccessContent() {
  const searchParams = useSearchParams();

  // Query params from the URL
  const orderId = searchParams.get("order_id");
  const currencyParam = searchParams.get("currency");
  const amountParam = searchParams.get("amount");

  // Remove any "searchData" from sessionStorage if present
  if (typeof window !== "undefined" && sessionStorage.getItem("searchData")) {
    sessionStorage.removeItem("searchData");
  }

  // Local component state for the booking details fetch
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch booking details on mount (or when orderId changes)
  useEffect(() => {
    if (!orderId) return;

    const fetchBookingDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/booking/${orderId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch booking data");
        }
        const data = await res.json();
        setBookingData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [orderId]);

  // Safely handle missing data
  const segments = bookingData?.segments || [];
  const userInfo = bookingData?.user_info || {};

  // For display convenience
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 relative">
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
      {/* Main Content Container */}
      <div className="relative z-10 pt-28 pb-10 max-w-6xl mx-auto px-4">
        {loading ? (
          // Show skeleton loader while fetching
          <div className="bg-white p-6 rounded-md shadow-xl">
            <SkeletonLoader />
          </div>
        ) : error ? (
          // Show error if any
          <div className="bg-white p-6 rounded-md shadow-xl text-center text-red-600 font-semibold">
            {error}
          </div>
        ) : bookingData ? (
          // Show booking info if available
          <div className="bg-white p-6 md:p-8 rounded-md shadow-xl">
            {/* Header / Confirmation Row */}
            <div className="flex items-center space-x-4">
              <AiOutlineCheckCircle
                className="text-green-500 animate-bounce"
                size={48}
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Booking In Progress
                </h1>
                <p className="text-gray-600">
                  Thank you for booking your flight with Charter Flights Aviation. We received your booking request, will get in touch with you to confirm the booking
                </p>
              </div>
            </div>

            {/* Two-Column Layout */}
            <div className="mt-8 flex flex-col md:flex-row md:space-x-8">
              {/* Left Column: Segments (Each Trip) */}
              <div className="w-full md:w-2/3 space-y-6">
                {segments.length > 0 ? (
                  segments.map((seg, idx) => {
                    const segFleet = seg.selectedFleet || {};
                    return (
                      <div
                        key={idx}
                        className="border rounded-lg p-4 shadow-sm bg-gray-50"
                      >
                        {/* Top Row: Label + Model */}
                        <div className="mb-3 flex items-center justify-between">
                          <div className="text-gray-700 font-semibold">
                            Trip {idx + 1}
                          </div>
                          <span className="text-sm text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                            {segFleet.model || "N/A"}
                          </span>
                        </div>

                        {/* Flight Type + Trip Type */}
                        <div className="mb-2 text-gray-800 font-bold">
                          {bookingData.flight_type || "Private Jet"} -{" "}
                          {bookingData.trip_type || "One-Way"}
                        </div>

                        {/* Departure Date/Time + Passengers */}
                        <div className="text-gray-600 text-sm mb-2">
                          Departure Date: <b>{formatDate(seg.departureDate)}</b>
                          {" | "}Time: <b>{seg.departureTime || "N/A"}</b>
                          {" | "}Passengers: <b>{seg.passengers || 1}</b>
                        </div>

                        {/* Potential "Approx Time" */}
                        <div className="text-gray-600 text-sm mb-3">
                          Approx Time:{" "}
                          {seg.departureTime
                            ? `${seg.departureTime} -> (Arrival TBD)`
                            : "N/A"}
                        </div>

                        {/* Per-segment price (if any) */}
                        <div className="text-gray-900 font-semibold mb-4">
                          Segment Fleet Price (if any):{" "}
                          $ {segFleet.price || "N/A"}
                        </div>

                        {/* Airport / City Info */}
                        <div className="flex items-center justify-between border-t pt-3">
                          <div>
                            <div className="text-xs font-semibold text-gray-500">
                              From
                            </div>
                            <div className="text-gray-700">
                              {seg.from}
                            </div>
                          </div>
                          <div className="text-gray-500 text-sm">---</div>
                          <div>
                            <div className="text-xs font-semibold text-gray-500">
                              To
                            </div>
                            <div className="text-gray-700">
                              {seg.to}
                            </div>
                          </div>
                          <div className="text-xs font-medium text-gray-500">
                            {segFleet.time || "1h 26m"}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-gray-50 p-4 border rounded-md">
                    No segment details available.
                  </div>
                )}
              </div>

              {/* Right Column: Fare Summary + Status */}
              <div className="w-full md:w-1/3 mt-6 md:mt-0 space-y-6">
                {/* Fare Summary */}
                <div className="border rounded-lg p-4 shadow-sm bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Fare Summary
                  </h2>
                  <div className="flex justify-between py-1 text-sm border-b border-gray-200">
                    <span>Amount Paid</span>
                    <span>
                      {bookingData.currency} {bookingData.amount_paid}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 text-sm border-b border-gray-200">
                    <span>Total Amount</span>
                    <span>
                      {bookingData.currency} {Math.trunc(bookingData.total_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 text-sm">
                    <span>Created At</span>
                    <span>
                      {new Date(bookingData.createdAt).toLocaleString("en-GB")}
                    </span>
                  </div>
                </div>

                {/* Payment Status Card */}
                <div className="border rounded-lg p-4 shadow-sm text-center bg-green-50">
                  <AiOutlineCheckCircle
                    className="text-green-500 mx-auto mb-2"
                    size={32}
                  />
                  <p className="text-green-600 font-semibold">
                    Payment Status:{" "}
                    <span className="uppercase">
                      {bookingData.status || "SUCCESS"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Booking ID: {bookingData._id}
                  </p>
                </div>
              </div>
            </div>

            {/* Passenger & User Info */}
            <div className="mt-8 border rounded-lg p-4 shadow-sm bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Passenger & User Info
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <span className="font-medium">Name: </span>
                  {userInfo.name}
                </div>
                <div>
                  <span className="font-medium">Email: </span>
                  {userInfo.email}
                </div>
                <div>
                  <span className="font-medium">Phone: </span>
                  {userInfo.phone}
                </div>
                <div>
                  <span className="font-medium">City: </span>
                  {userInfo.city}
                </div>
                <div>
                  <span className="font-medium">Region: </span>
                  {userInfo.region}
                </div>
                <div>
                  <span className="font-medium">Country: </span>
                  {userInfo.country}
                </div>
                <div>
                  <span className="font-medium">Postal: </span>
                  {userInfo.postal}
                </div>
                <div>
                  <span className="font-medium">Timezone: </span>
                  {userInfo.timezone}
                </div>
              </div>
            </div>

            {/* Footer: Download / Share / Reference */}
            <div className="mt-8 border-t pt-4 text-gray-600 text-center">
              <p>
                Your Booking Reference No. is{" "}
                <span className="font-semibold">{bookingData._id}</span>.
              </p>
              <p>
                For any changes to your itinerary, please get in touch with our
                support team.
              </p>
              <div className="mt-4 flex justify-center space-x-4">
                <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-full transition">
                  Download Invoice
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-full transition">
                  Share Itinerary
                </button>
              </div>
            </div>
          </div>
        ) : null /* No fallback UI if there's no error & no bookingData */}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
