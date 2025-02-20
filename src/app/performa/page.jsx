"use client";

import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * Helper function to fetch an image from a URL and convert it to a base64 data URL.
 * Logs the result to the console for debugging.
 */
async function urlToBase64(imageUrl) {
  if (!imageUrl) return null;

  try {
    console.log("Attempting to fetch:", imageUrl);
    const response = await fetch(imageUrl, { mode: "cors" });

    // If response not OK, log error & return null
    if (!response.ok) {
      console.error(`Fetch failed with status ${response.status} for image: ${imageUrl}`);
      return null;
    }

    // Convert the response to a Blob, then to base64 via FileReader
    const blob = await response.blob();
    const base64Data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(blob);
    });

    // Log a portion of the base64 string for debugging
    console.log("Fetched base64Data (truncated):", base64Data.slice(0, 50), "...");

    return base64Data;
  } catch (err) {
    console.error("Error converting image to base64:", err);
    return null;
  }
}

const FlightDetails = () => {
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    // Retrieve data from session storage
    const storedData = sessionStorage.getItem("searchData");
    if (storedData) {
      setSessionData(JSON.parse(storedData));
    }
  }, []);

  // If no flight data, show a loading message
  if (!sessionData || !sessionData.segments) {
    return <p className="text-center text-lg">Loading flight details...</p>;
  }

  const flightSegments = sessionData.segments;
  const tripType = sessionData.tripType || "oneway";

  // Convert "1h 26m" to total minutes (e.g. 86)
  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    // For a pattern "1h 26m", split on "h ", then parse
    const [hrs, mins] = timeStr.split("h ").map((t) => parseInt(t) || 0);
    return hrs * 60 + mins;
  };

  // Compute total flying time across all segments
  const totalFlyingTimeMinutes = flightSegments.reduce((acc, flight) => {
    return acc + (flight.selectedFleet?.time ? parseTimeToMinutes(flight.selectedFleet.time) : 0);
  }, 0);

  const totalFlyingHours = `${Math.floor(totalFlyingTimeMinutes / 60)} Hrs ${
    totalFlyingTimeMinutes % 60
  } Min`;

  // Example cost calculation
  const costPerHour = 150000;
  const totalCost = (totalFlyingTimeMinutes / 60) * costPerHour;
  const handlingCost = 114700;
  const crewCost = 40000;
  const subtotal = totalCost + handlingCost + crewCost;
  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;

  /**
   * Generate PDF (note: 'async' because we need to fetch images as base64).
   */
  const generatePDF = async () => {
    const doc = new jsPDF();

    // 1) Header / Title
    doc.setFontSize(18);
    doc.text("Charter Flight Aviations", 14, 15);

    doc.setFontSize(12);
    doc.text(
      "S-3 LEVEL, BLOCK E, INTERNATIONAL TRADE TOWER, NEHRU PLACE, South Delhi, Delhi, 110019",
      14,
      25
    );
    doc.text("Phone: +91-11-40845858 | Email: info@charterflightaviations.in", 14, 35);

    // 2) Flight Details Table
    doc.autoTable({
      startY: 45,
      head: [["Date", "From", "To", "ETD", "Approx. Fly Time", "Pax", "Fleet Model"]],
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

    // 2a) Show total flying hours
    let yPos = doc.lastAutoTable.finalY + 10;
    doc.text(`Total Flying Hours: ${totalFlyingHours}`, 14, yPos);

    // 3) Cost Table
    doc.autoTable({
      startY: yPos + 10,
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

    // 4) Add images for each segment
    yPos = doc.lastAutoTable.finalY + 15;
    for (let i = 0; i < flightSegments.length; i++) {
      const flight = flightSegments[i];
      const { images } = flight.selectedFleet || {};

      // If no images, skip to next
      if (!images) continue;

      doc.setFontSize(14);
      doc.text(
        `Segment ${i + 1}: ${flight.from} -> ${flight.to} (${flight.selectedFleet?.model || ""})`,
        14,
        yPos
      );
      yPos += 8;

      // Fetch images in base64
      const interiorBase64 = await urlToBase64(images.interior);
      const exteriorBase64 = await urlToBase64(images.exterior);
      const cockpitBase64 = await urlToBase64(images.cockpit);
      const layoutBase64 = await urlToBase64(images.layout);

      const imageWidth = 40;
      const imageHeight = 30;

      let xPosLeft = 14;
      let xPosRight = 70;

      // Interior
      if (interiorBase64) {
        doc.setFontSize(10);
        doc.text("Interior", xPosLeft, yPos);
        yPos += 4;
        doc.addImage(interiorBase64, "JPEG", xPosLeft, yPos, imageWidth, imageHeight);
      }

      // Exterior
      if (exteriorBase64) {
        doc.text("Exterior", xPosRight, yPos - 4);
        doc.addImage(exteriorBase64, "JPEG", xPosRight, yPos, imageWidth, imageHeight);
      }

      // Move yPos down below first row of images
      yPos += imageHeight + 10;

      // Cockpit
      if (cockpitBase64) {
        doc.text("Cockpit", xPosLeft, yPos);
        yPos += 4;
        doc.addImage(cockpitBase64, "JPEG", xPosLeft, yPos, imageWidth, imageHeight);
      }

      // Layout
      if (layoutBase64) {
        doc.text("Layout", xPosRight, yPos - 4);
        doc.addImage(layoutBase64, "JPEG", xPosRight, yPos, imageWidth, imageHeight);
      }

      // Move below second row of images
      yPos += imageHeight + 15;

      // If near page bottom, you could add doc.addPage() to continue
      if (yPos > 250) {
        doc.addPage();
        yPos = 15;
      }
    }

    // 5) Footer note
    doc.setFontSize(10);
    doc.text(
      "Note: All quotations are subject to necessary permissions and aircraft availability.",
      14,
      yPos
    );

    // 6) Save PDF
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

      {/* FLIGHT DETAILS TABLE (on-screen) */}
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
              <th className="border border-gray-300 px-4 py-2">Fleet Model</th>
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
            {/* Total flying hours row */}
            <tr>
              <td colSpan="6" className="font-bold text-right px-4 py-2">
                Total Flying Hours:
              </td>
              <td className="font-bold px-4 py-2">{totalFlyingHours}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SIMPLE COST DISPLAY (on-screen) */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-700">Cost Details</h2>
        <p>
          Total Flying Cost (@ ₹{costPerHour.toLocaleString()}/Hr):{" "}
          <strong>₹{totalCost.toLocaleString()}</strong>
        </p>
        <p>Handling Cost: ₹{handlingCost.toLocaleString()}</p>
        <p>Crew Accommodation Cost: ₹{crewCost.toLocaleString()}</p>
        <p>Subtotal: ₹{subtotal.toLocaleString()}</p>
        <p>GST @ 18%: ₹{gst.toLocaleString()}</p>
        <p>
          <strong>
            All Inclusive Charter Package (with GST): ₹{grandTotal.toLocaleString()}
          </strong>
        </p>
      </div>

      {/* DISPLAY IMAGES (on-screen) */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-700">Fleet Images</h2>
        {flightSegments.map((flight, i) => {
          const { images } = flight.selectedFleet || {};
          if (!images) return null;

          return (
            <div key={i} className="mb-8">
              <h3 className="text-md font-bold mb-1 text-gray-700">
                Segment {i + 1}: {flight.from} → {flight.to} ({flight.selectedFleet?.model})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                {/* Interior */}
                <div className="text-center">
                  <p className="text-sm font-semibold mb-1 text-gray-600">Interior</p>
                  <img
                    src={images.interior}
                    alt="Interior"
                    className="w-full h-40 object-cover border"
                  />
                </div>
                {/* Exterior */}
                <div className="text-center">
                  <p className="text-sm font-semibold mb-1 text-gray-600">Exterior</p>
                  <img
                    src={images.exterior}
                    alt="Exterior"
                    className="w-full h-40 object-cover border"
                  />
                </div>
                {/* Cockpit */}
                <div className="text-center">
                  <p className="text-sm font-semibold mb-1 text-gray-600">Cockpit</p>
                  <img
                    src={images.cockpit}
                    alt="Cockpit"
                    className="w-full h-40 object-cover border"
                  />
                </div>
                {/* Layout */}
                <div className="text-center">
                  <p className="text-sm font-semibold mb-1 text-gray-600">Layout</p>
                  <img
                    src={images.layout}
                    alt="Layout"
                    className="w-full h-40 object-cover border"
                  />
                </div>
              </div>
            </div>
          );
        })}
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
