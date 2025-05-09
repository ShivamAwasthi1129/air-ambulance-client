"use client";
import React, { useEffect, useState } from "react";
import { FaPlaneDeparture, FaPlaneArrival, FaMapMarkerAlt, FaClock, FaUser, FaDollarSign } from "react-icons/fa";

const SelectedFleetCard = ({ label, tripNumber }) => {
  const [segment, setSegment] = useState(null);
  const [inrRate, setInrRate] = useState(0);

  useEffect(() => {
    // Fetch segment data from sessionStorage
    const storedData = sessionStorage.getItem("searchData");
    const exchangeRates = sessionStorage.getItem("exchangeRates");

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const matchedSegment = parsedData.segments.find(
        (segment) => segment.selectedFleet?.label === label
      );
      setSegment(matchedSegment);
    }

    if (exchangeRates) {
      const parsedRates = JSON.parse(exchangeRates);
      setInrRate(parsedRates.inrRate || 0);
    }
  }, [label]);

  if (!segment) return null;

  const { selectedFleet, fromAddress, toAddress, fromLoc, toLoc, fromIATA, toIATA, fromCity, toCity, passengers, departureDate, departureTime } = segment;

  // Helper function to check if the label contains coordinates
  const isCoordinate = (str) => /^-?\d+\.\d+,-?\d+\.\d+$/.test(str.trim().split("-(")[0]);

  // Extract from and to parts from the label
  const [fromPart, toPart] = (label || "").split(" ➜ ");

  // Determine whether to show address/coordinates or IATA/city
  const showAddressAndCoordinates = isCoordinate(fromPart) && isCoordinate(toPart);

  // Calculate INR price
  const inrPrice = selectedFleet?.price ? (parseFloat(selectedFleet.price) * inrRate).toFixed(2) : "N/A";

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-blue-100 flex flex-col items-start px-6 py-6 border border-blue-200 rounded-xl shadow-lg">
      {/* Display the label */}
      <h3 className="text-md font-bold mb-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-md shadow-md">
        {tripNumber}: {label}
      </h3>

      {/* Fleet details */}
      <div className="w-full">
        <table className="w-full text-left border-collapse">
          <tbody>
            <tr>
              <th className="py-2 px-4 border-b font-medium text-gray-600">Model</th>
              <td className="py-2 px-4 border-b">{selectedFleet?.model || "N/A"}</td>
            </tr>
            <tr>
              <th className="py-2 px-4 border-b font-medium text-gray-600">Type</th>
              <td className="py-2 px-4 border-b">{selectedFleet?.type || "N/A"}</td>
            </tr>
            <tr>
              <th className="py-2 px-4 border-b font-medium text-gray-600">Registration No</th>
              <td className="py-2 px-4 border-b">{selectedFleet?.registrationNo || "N/A"}</td>
            </tr>
            <tr>
              <th className="py-2 px-4 border-b font-medium text-gray-600">Seating Capacity</th>
              <td className="py-2 px-4 border-b">{selectedFleet?.seatingCapacity || "N/A"}</td>
            </tr>
            <tr>
              <th className="py-2 px-4 border-b font-medium text-gray-600">Price</th>
              <td className="py-2 px-4 border-b">
                <FaDollarSign className="inline-block text-green-500 mr-1" />
                {selectedFleet?.price || "N/A"}
                <span className="text-xs text-gray-500 ml-2">(~₹ {inrPrice})</span>
              </td>
            </tr>
            <tr>
              <th className="py-2 px-4 border-b font-medium text-gray-600">Flight Time</th>
              <td className="py-2 px-4 border-b">
                <FaClock className="inline-block text-blue-500 mr-1" />
                {selectedFleet?.time || "N/A"}
              </td>
            </tr>
            <tr>
              <th className="py-2 px-4 border-b font-medium text-gray-600">Departure Date</th>
              <td className="py-2 px-4 border-b">{departureDate || "N/A"}</td>
            </tr>
            <tr>
              <th className="py-2 px-4 border-b font-medium text-gray-600">Departure Time</th>
              <td className="py-2 px-4 border-b">{departureTime || "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Conditional rendering for From/To details */}
      <div className="mt-4 w-full">
        {showAddressAndCoordinates ? (
          <>
            <p className="text-sm text-gray-600">
              <FaMapMarkerAlt className="inline-block text-red-500 mr-1" />
              <span className="font-semibold">From Address:</span> {fromAddress || "N/A"}
              <span className="text-xs text-gray-500 ml-2">
                ({fromLoc?.lat?.toFixed(2) || "N/A"}, {fromLoc?.lng?.toFixed(2) || "N/A"})
              </span>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <FaMapMarkerAlt className="inline-block text-green-500 mr-1" />
              <span className="font-semibold">To Address:</span> {toAddress || "N/A"}
              <span className="text-xs text-gray-500 ml-2">
                ({toLoc?.lat?.toFixed(2) || "N/A"}, {toLoc?.lng?.toFixed(2) || "N/A"})
              </span>
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600">
              <FaPlaneDeparture className="inline-block text-blue-500 mr-1" />
              <span className="font-semibold">From:</span> {fromIATA || "N/A"} ({fromCity || "N/A"})
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <FaPlaneArrival className="inline-block text-green-500 mr-1" />
              <span className="font-semibold">To:</span> {toIATA || "N/A"} ({toCity || "N/A"})
            </p>
          </>
        )}
        <p className="text-sm text-gray-600 mt-2">
          <FaUser className="inline-block text-purple-500 mr-1" />
          <span className="font-semibold">Passengers:</span> {passengers || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default SelectedFleetCard;