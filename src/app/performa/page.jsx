"use client";

import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const FlightDetails = () => {
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    // Retrieve data from session storage
    const storedData = sessionStorage.getItem("searchData");
    if (storedData) {
      setSessionData(JSON.parse(storedData));
    }
  }, []);

  if (!sessionData || !sessionData.segments) {
    return <p className="text-center text-lg">Loading flight details...</p>;
  }

  const flightSegments = sessionData.segments;

  // Convert fleet time to minutes for calculation
  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [hrs, mins] = timeStr.split("h ").map((t) => parseInt(t.replace("m", "")) || 0);
    return hrs * 60 + mins;
  };

  // Compute total flying time
  const totalFlyingTimeMinutes = flightSegments.reduce((total, flight) => {
    return total + (flight.selectedFleet?.time ? parseTimeToMinutes(flight.selectedFleet.time) : 0);
  }, 0);

  const totalFlyingHours = `${Math.floor(totalFlyingTimeMinutes / 60)} Hrs ${
    totalFlyingTimeMinutes % 60
  } Min`;

  // Cost Calculation
  const costPerHour = 150000;
  const totalCost = (totalFlyingTimeMinutes / 60) * costPerHour;
  const handlingCost = 114700;
  const crewCost = 40000;
  const subtotal = totalCost + handlingCost + crewCost;
  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;

  // PDF Download Function
  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Charter Flight Aviations", 14, 15);
    doc.setFontSize(12);
    doc.text(
      "S-3 LEVEL, BLOCK E, INTERNATIONAL TRADE TOWER, NEHRU PLACE, South Delhi, Delhi, 110019",
      14,
      25
    );
    doc.text("Phone: +91-11-40845858 | Email: info@charterflightaviations.in", 14, 35);

    // Flight Details Table
    doc.autoTable({
      startY: 45,
      head: [["Date", "From", "To", "ETD", "Approx. Fly Time", "Pax", "Fleet Type"]],
      body: flightSegments.map((flight) => [
        flight.departureDate,
        flight.from,
        flight.to,
        flight.departureTime,
        flight.selectedFleet?.time || "N/A",
        flight.passengers,
        flight.selectedFleet?.model || "Unknown",
      ]),
    });

    // Total Flying Hours
    doc.text(`Total Flying Hours: ${totalFlyingHours}`, 14, doc.lastAutoTable.finalY + 10);

    // Cost Table
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Description", "Amount (₹)"]],
      body: [
        ["Total Flying Cost (@ ₹150000/Hr)", totalCost.toLocaleString()],
        ["Total Handling Cost", handlingCost.toLocaleString()],
        ["Crew Accommodation Cost", crewCost.toLocaleString()],
        ["Subtotal", subtotal.toLocaleString()],
        ["GST @ 18%", gst.toLocaleString()],
        ["All Inclusive Charter Package (with GST)", grandTotal.toLocaleString()],
      ],
    });

    // Footer
    doc.text(
      "Note: All quotations are subject to necessary permissions and aircraft availability.",
      14,
      doc.lastAutoTable.finalY + 10
    );

    doc.save("FlightDetails.pdf");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center text-gray-800">
        Charter Flight Aviations
      </h1>
      <p className="text-center text-gray-600">
        S-3 LEVEL, BLOCK E, INTERNATIONAL TRADE TOWER, NEHRU PLACE, South Delhi, Delhi, 110019
      </p>
      <p className="text-center text-gray-600">
        Phone: +91-11-40845858 | E-mail: info@charterflightaviations.in
      </p>

      {/* Flight Details Table */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-700">Flight Details</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">From</th>
              <th className="border border-gray-300 px-4 py-2">To</th>
              <th className="border border-gray-300 px-4 py-2">ETD</th>
              <th className="border border-gray-300 px-4 py-2">Approx. Fly Time</th>
              <th className="border border-gray-300 px-4 py-2">Pax</th>
              <th className="border border-gray-300 px-4 py-2">Fleet Type</th>
            </tr>
          </thead>
          <tbody>
            {flightSegments.map((flight, index) => (
              <tr key={index} className="text-center border border-gray-300">
                <td className="border border-gray-300 px-4 py-2">{flight.departureDate}</td>
                <td className="border border-gray-300 px-4 py-2">{flight.from}</td>
                <td className="border border-gray-300 px-4 py-2">{flight.to}</td>
                <td className="border border-gray-300 px-4 py-2">{flight.departureTime}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {flight.selectedFleet?.time || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">{flight.passengers}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {flight.selectedFleet?.model || "Unknown"}
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="6" className="font-bold text-right px-4 py-2">Total Flying Hours:</td>
              <td className="font-bold px-4 py-2">{totalFlyingHours}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PDF Download Button */}
      <button
        onClick={generatePDF}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Download PDF
      </button>
    </div>
  );
};

export default FlightDetails;
