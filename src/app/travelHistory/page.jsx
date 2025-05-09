"use client";
import React, { useEffect, useState } from "react";
import NavBar from "../components/Navbar";
import { AiOutlineCheckCircle } from "react-icons/ai";

const TravelHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve user email from wherever you store it (sessionStorage, Redux, etc.)
    const user = JSON.parse(sessionStorage.getItem("loginData"));
    if (user && user.email) {
      fetch(`/api/booking?email=${user.email}`)
        .then((response) => response.json())
        .then((data) => {
          setBookings(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Helper to safely display date/time
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div
      className="h-screen w-full bg-fixed bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-photo/airplane-runway-airport-sunset-travel-concept_587448-8154.jpg')",
      }}
    >
      {/* Dark overlay behind the content */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Navbar (positioned above the overlay) */}
      <div className="absolute w-full top-0 left-0 z-40">
        <NavBar />
      </div>

      {/* Scrollable area for cards */}
      <div className="relative z-30 h-full overflow-auto pt-28 pb-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-white mb-8">
            My Travel History
          </h1>

          {loading ? (
            <p className="text-center text-white">Loading your bookings...</p>
          ) : bookings && bookings.length > 0 ? (
            bookings.map((booking, index) => (
              <div
                key={booking._id}
                className="bg-white bg-opacity-95 rounded-lg shadow-xl p-6 mb-8"
              >
                {/* Top area: Trip # + Checkmark + Basic Info */}
                <div className="flex items-start md:items-center justify-between gap-4 border-b pb-3 mb-4">
                  <div className="flex items-center gap-3">
                    {/* Success Icon */}
                    <AiOutlineCheckCircle
                      className="text-green-500"
                      size={32}
                    />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Booking #{index + 1}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {booking.flight_type} &mdash;{" "}
                        {booking.trip_type?.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-700">
                      Amount Paid ({booking.currency})
                    </p>
                    <p className="text-lg text-blue-600 font-bold">
                      {booking.amount_paid}
                    </p>
                  </div>
                </div>

                {/* Overall Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Booking ID:</span>{" "}
                      {booking._id}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Status:</span>{" "}
                      {booking.status}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Total Amount:</span>{" "}
                      {booking.total_amount?.toFixed?.(2)} {booking.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Created At:</span>{" "}
                      {formatDateTime(booking.createdAt)}
                    </p>
                    {/* <p className="text-sm text-gray-500">
                      <span className="font-semibold">Updated At:</span>{" "}
                      {formatDateTime(booking.updatedAt)}
                    </p> */}
                  </div>
                </div>

                {/* User Info */}
                {booking.user_info && (
                  <div className="border border-gray-200 rounded-md p-4 mb-6 bg-gray-50">
                    <h3 className="text-base font-semibold mb-2 text-gray-700">
                      User Info
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600">
                      <p>
                        <span className="font-semibold">Name:</span>{" "}
                        {booking.user_info.name}
                      </p>
                      <p>
                        <span className="font-semibold">Email:</span>{" "}
                        {booking.user_info.email}
                      </p>
                      <p>
                        <span className="font-semibold">Phone:</span>{" "}
                        {booking.user_info.phone}
                      </p>
                      {/* <p>
                        <span className="font-semibold">IP:</span>{" "}
                        {booking.user_info.ip}
                      </p> */}
                      <p>
                        <span className="font-semibold">City:</span>{" "}
                        {booking.user_info.city}
                      </p>
                      <p>
                        <span className="font-semibold">Region:</span>{" "}
                        {booking.user_info.region}
                      </p>
                      <p>
                        <span className="font-semibold">Country:</span>{" "}
                        {booking.user_info.country}
                      </p>
                    </div>
                  </div>
                )}

                {/* Segments */}
                <h3 className="text-base font-semibold mb-2 text-gray-700">
                  Your Trips
                </h3>
                {booking.segments.map((segment, i) => {
                  const depDate = segment.departureDate
                    ? new Date(segment.departureDate).toLocaleDateString()
                    : "";

                  return (
                    <div
                      key={segment._id}
                      className="border rounded-md p-4 mb-4 bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-700">
                            Trip {i + 1}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {depDate} &middot; {segment.departureTime}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-600">
                          Passengers: {segment.passengers}
                        </p>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                        <div className="mb-2 md:mb-0">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">From:</span>{" "}
                            {segment.from === "custom" ? (
                              <>
                                <span className="text-xs">{segment.fromAddress}</span>{" "}
                                <span className="text-gray-500 text-xs">
                                  ({segment.fromLoc?.lat.toFixed(2)}, {segment.fromLoc?.lng.toFixed(2)})
                                </span>
                              </>
                            ) : (
                              `${segment.fromCity} (${segment.fromIATA})`
                            )}
                          </p>
                        </div>
                        <div className="text-center text-gray-400 mx-2">&rarr;</div>
                        <div>
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">To:</span>{" "}
                            {segment.to === "custom" ? (
                              <>
                                <span className="text-xs">{segment.toAddress}</span>{" "}
                                <span className="text-gray-500 text-xs">
                                  ({segment.toLoc?.lat.toFixed(2)}, {segment.toLoc?.lng.toFixed(2)})
                                </span>
                              </>
                            ) : (
                              `${segment.toCity} (${segment.toIATA})`
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Selected Fleet Info */}
                      {segment.selectedFleet && (
                        <div className="bg-white rounded-md p-3 border">
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Model:</span>{" "}
                            {segment.selectedFleet.model} (
                            {segment.selectedFleet.type})
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">
                              Registration No.:
                            </span>{" "}
                            {segment.selectedFleet.registrationNo}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">
                              Seating Capacity:
                            </span>{" "}
                            {segment.selectedFleet.seatingCapacity}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Flight Time:</span>{" "}
                            {segment.selectedFleet.time}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">
                              Segment Price:
                            </span>{" "}
                            {segment.selectedFleet.price} USD
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          ) : (
            <p className="text-center text-white">
              No booking history found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelHistory;
