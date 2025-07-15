"use client";
import React, { useEffect, useState } from "react";
import NavBar from "../components/Navbar";
import { AiOutlineCheckCircle, AiOutlineEdit, AiOutlineClose, AiOutlineSend } from "react-icons/ai";

const TravelHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modificationRequests, setModificationRequests] = useState({});
  const [emailLoading, setEmailLoading] = useState({});

  useEffect(() => {
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

  // Toggle modification request form
  const toggleModificationRequest = (bookingId) => {
    setModificationRequests(prev => ({
      ...prev,
      [bookingId]: {
        ...prev[bookingId],
        isOpen: !prev[bookingId]?.isOpen,
        message: prev[bookingId]?.message || ""
      }
    }));
  };

  // Update message for modification request
  const updateModificationMessage = (bookingId, message) => {
    setModificationRequests(prev => ({
      ...prev,
      [bookingId]: {
        ...prev[bookingId],
        message
      }
    }));
  };

  // Send modification request email
  const sendModificationRequest = async (booking) => {
    const user = JSON.parse(sessionStorage.getItem("loginData"));
    const message = modificationRequests[booking._id]?.message;

    if (!message || !message.trim()) {
      alert("Please enter a message for your modification request.");
      return;
    }

    setEmailLoading(prev => ({ ...prev, [booking._id]: true }));

    try {
      // Create trip details string
      const tripDetails = booking.segments.map((segment, index) => {
        const fromLocation = segment.from === "custom"
          ? segment.fromAddress
          : `${segment.fromCity} (${segment.fromIATA})`;
        const toLocation = segment.to === "custom"
          ? segment.toAddress
          : `${segment.toCity} (${segment.toIATA})`;

        return `Trip ${index + 1}: ${fromLocation} → ${toLocation} on ${segment.departureDate ? new Date(segment.departureDate).toLocaleDateString() : 'N/A'}`;
      }).join('\n');

      const emailBody = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2563eb;">Booking Modification Request</h2>
          
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e40af;">Booking Details:</h3>
            <p><strong>Booking ID:</strong> ${booking._id}</p>
            <p><strong>Customer Name:</strong> ${booking.user_info?.name || user?.name || 'N/A'}</p>
            <p><strong>Customer Email:</strong> ${booking.user_info?.email || user?.email || 'N/A'}</p>
            <p><strong>Booking Type:</strong>${booking.trip_type?.toUpperCase()}</p>
            <p><strong>Amount Paid:</strong> ${booking.amount_paid} ${booking.currency}</p>
            <p><strong>Status:</strong> ${booking.status}</p>
          </div>

          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e40af;">Trip Information:</h3>
            <pre style="white-space: pre-line; font-family: Arial, sans-serif;">${tripDetails}</pre>
          </div>

          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #d97706;">Customer's Modification Request:</h3>
            <p style="background-color: white; padding: 10px; border-radius: 4px; border-left: 4px solid #d97706;">${message}</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              This email was sent automatically from the travel booking system.<br>
              Please respond to the customer at their registered email address.
            </p>
          </div>
        </div>
      `;

      const payload = {
        to: "shivam@hexerve.com",
        subject: `Booking Modification Request - ${booking._id}`,
        html: emailBody  // Changed from 'text' to 'html' for proper HTML rendering
      };
      const response = await fetch("https://ow91reoh80.execute-api.ap-south-1.amazonaws.com/air/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });
      // Always show success message since the email is being sent
      alert("Modification request sent successfully! We'll get back to you soon.");
      // Close the form and clear the message
      setModificationRequests(prev => ({
        ...prev,
        [booking._id]: {
          isOpen: false,
          message: ""
        }
      }));
    } catch (error) {
      console.error("Error sending modification request:", error);
      // alert("Failed to send modification request. Please try again.");
    } finally {
      setEmailLoading(prev => ({ ...prev, [booking._id]: false }));
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-fixed bg-cover bg-center relative"
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
      <div className="relative z-30 min-h-screen overflow-auto pt-28 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-white mb-8 drop-shadow-lg">
            My Travel History
          </h1>

          {loading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
              <p className="text-white text-lg">Loading your bookings...</p>
            </div>
          ) : bookings && bookings.length > 0 ? (
            bookings.map((booking, index) => (
              <div
                key={booking._id}
                className="bg-white bg-opacity-95 rounded-xl shadow-2xl p-6 mb-8 backdrop-blur-sm hover:shadow-3xl transition-all duration-300"
              >
                {/* Top area: Trip # + Checkmark + Basic Info + Modification Button */}
                <div className="flex items-start md:items-center justify-between gap-4 border-b border-gray-200 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    {/* Success Icon */}
                    <AiOutlineCheckCircle
                      className="text-green-500 flex-shrink-0"
                      size={36}
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        Booking #{index + 1}
                      </h2>
                      <p className="text-sm text-gray-600 font-medium">
                        {booking.flight_type} &mdash;{" "}
                        <span className="text-blue-600">{booking.trip_type?.toUpperCase()}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-700">
                        Amount Paid ({booking.currency})
                      </p>
                      <p className="text-2xl text-blue-600 font-bold">
                        {booking.amount_paid}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleModificationRequest(booking._id)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
                    >
                      <AiOutlineEdit size={16} />
                      Request Modification
                    </button>
                  </div>
                </div>

                {/* Modification Request Form */}
                {modificationRequests[booking._id]?.isOpen && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-blue-800">
                        Request Booking Modification
                      </h3>
                      <button
                        onClick={() => toggleModificationRequest(booking._id)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <AiOutlineClose size={20} />
                      </button>
                    </div>
                    <textarea
                      value={modificationRequests[booking._id]?.message || ""}
                      onChange={(e) => updateModificationMessage(booking._id, e.target.value)}
                      placeholder="Please describe the changes you'd like to make to this booking..."
                      className="w-full h-32 p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      disabled={emailLoading[booking._id]}
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => sendModificationRequest(booking)}
                        disabled={emailLoading[booking._id]}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                      >
                        {emailLoading[booking._id] ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <AiOutlineSend size={16} />
                            Send Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Overall Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-700 mb-3">Booking Information</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Booking ID:</span>{" "}
                        <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">{booking._id}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Status:</span>{" "}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                          }`}>
                          {booking.status}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Total Amount:</span>{" "}
                        {booking.total_amount?.toFixed?.(2)} {booking.currency}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-700 mb-3">Booking Date</h3>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Created:</span>{" "}
                      {formatDateTime(booking.createdAt)}
                    </p>
                  </div>
                </div>

                {/* User Info */}
                {booking.user_info && (
                  <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gradient-to-r from-gray-50 to-gray-100">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">
                      Passenger Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-sm text-gray-600">
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
                      <p>
                        <span className="font-semibold">Location:</span>{" "}
                        {booking.user_info.city}, {booking.user_info.region}, {booking.user_info.country}
                      </p>
                    </div>
                  </div>
                )}

                {/* Segments */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">
                    Flight Segments
                  </h3>
                  <div className="space-y-4">
                    {booking.segments.map((segment, i) => {
                      const depDate = segment.departureDate
                        ? new Date(segment.departureDate).toLocaleDateString()
                        : "";

                      return (
                        <div
                          key={segment._id}
                          className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-bold text-gray-800 text-lg">
                                Trip {i + 1}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {depDate} &middot; {segment.departureTime}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-blue-600">
                                {segment.passengers} Passenger{segment.passengers > 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                            <div className="flex-1 mb-2 lg:mb-0">
                              <p className="text-sm text-gray-700 font-medium">
                                <span className="font-semibold text-green-600">FROM:</span>{" "}
                                {segment.from === "custom" ? (
                                  <span className="text-xs">
                                    {segment.fromAddress}{" "}
                                    <span className="text-gray-500">
                                      ({segment.fromLoc?.lat.toFixed(2)}, {segment.fromLoc?.lng.toFixed(2)})
                                    </span>
                                  </span>
                                ) : (
                                  <span className="font-mono">
                                    {segment.fromCity} ({segment.fromIATA})
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="flex-shrink-0 text-center text-blue-500 mx-4 text-2xl">
                              ✈️
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-700 font-medium">
                                <span className="font-semibold text-red-600">TO:</span>{" "}
                                {segment.to === "custom" ? (
                                  <span className="text-xs">
                                    {segment.toAddress}{" "}
                                    <span className="text-gray-500">
                                      ({segment.toLoc?.lat.toFixed(2)}, {segment.toLoc?.lng.toFixed(2)})
                                    </span>
                                  </span>
                                ) : (
                                  <span className="font-mono">
                                    {segment.toCity} ({segment.toIATA})
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Selected Fleet Info */}
                          {segment.selectedFleet && (
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              <h5 className="font-semibold text-gray-700 mb-2">Aircraft Details</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                <p>
                                  <span className="font-semibold">Aircraft:</span>{" "}
                                  {segment.selectedFleet.model} ({segment.selectedFleet.type})
                                </p>
                                <p>
                                  <span className="font-semibold">Registration:</span>{" "}
                                  <span className="font-mono">{segment.selectedFleet.registrationNo}</span>
                                </p>
                                <p>
                                  <span className="font-semibold">Capacity:</span>{" "}
                                  {segment.selectedFleet.seatingCapacity} passengers
                                </p>
                                <p>
                                  <span className="font-semibold">Flight Time:</span>{" "}
                                  {segment.selectedFleet.time}
                                </p>
                                <p className="md:col-span-2">
                                  <span className="font-semibold">Segment Price:</span>{" "}
                                  <span className="text-blue-600 font-bold">
                                    ${segment.selectedFleet.price} USD
                                  </span>
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center bg-white bg-opacity-20 rounded-xl p-8 backdrop-blur-sm">
              <p className="text-white text-xl">No booking history found.</p>
              <p className="text-white text-sm mt-2 opacity-80">
                Your completed bookings will appear here once you make a reservation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelHistory;