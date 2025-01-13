"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // For smooth animations
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DeleteIcon from "@mui/icons-material/Delete";

export const SearchBar = () => {
  const [airports, setAirports] = useState([]);
  const [tripType, setTripType] = useState("oneway"); // Default trip type
  const [segments, setSegments] = useState([
    { from: "", to: "", departureDate: new Date().toISOString().split("T")[0] },
  ]);
  const [showMultiCityDetails, setShowMultiCityDetails] = useState(false); // Tracks if details should be shown

  const [formData, setFormData] = useState({
    returnDate: "",
    passengers: 1,
    fareType: "Regular",
  });

  // Fetch airport data
  useEffect(() => {
    const fetchAirports = async () => {
      const response = await fetch(
        "https://raw.githubusercontent.com/ashhadulislam/JSON-Airports-India/master/airports.json"
      );
      const data = await response.json();
      setAirports(data.airports);
    };
    fetchAirports();
  }, []);

  const handleTripTypeChange = (type) => {
    setTripType(type);
    setShowMultiCityDetails(false); // Reset details visibility for Multi City
    if (type === "oneway") {
      setSegments([{ from: "", to: "", departureDate: new Date().toISOString().split("T")[0] }]);
      setFormData({ ...formData, returnDate: "" });
    } else if (type === "roundtrip") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSegments([{ from: "", to: "", departureDate: new Date().toISOString().split("T")[0] }]);
      setFormData({ ...formData, returnDate: tomorrow.toISOString().split("T")[0] });
    } else if (type === "multicity") {
      setSegments([
        { from: "", to: "", departureDate: new Date().toISOString().split("T")[0] },
      ]);
    }
  };

  const handleSegmentChange = (index, field, value) => {
    const updatedSegments = [...segments];
    updatedSegments[index][field] = value;
    setSegments(updatedSegments);
    if (field === "from" && tripType === "multicity") {
      setShowMultiCityDetails(true); // Show details only when "From" is selected
    }
  };

  const handleSwap = (index) => {
    const updatedSegments = [...segments];
    const temp = updatedSegments[index].from;
    updatedSegments[index].from = updatedSegments[index].to;
    updatedSegments[index].to = temp;
    setSegments(updatedSegments);
  };

  const handleAddCity = () => {
    setSegments((prevSegments) => [
      ...prevSegments,
      {
        from: prevSegments[prevSegments.length - 1].to || "", // Use the 'to' value of the last segment
        to: "",
        departureDate: new Date().toISOString().split("T")[0], // Default departure date
      },
    ]);
  };


  const handleRemoveCity = (index) => {
    setSegments(segments.filter((_, i) => i !== index));
  };

  const handleSearch = () => {
    console.log("Search initiated:", { tripType, segments, formData });
    alert("Search initiated! Check the console for details.");
  };

  return (
    <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-1 rounded-lg w-[80%] ">
      <div className="bg-[#041422] p-6 rounded-lg shadow-md flex flex-col items-center gap-4 relative">
        {/* Primary Search Bar */}
        <div className="flex items-end justify-between gap-4 w-full pb-4">
          {/* Trip Type Dropdown */}
          <div className="relative flex-1">
            <label className="text-md text-[#008cff] mb-1 block">Trip Type</label>
            <select
              value={tripType}
              onChange={(e) => handleTripTypeChange(e.target.value)}
              className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md cursor-pointer focus:outline-none w-full"
            >
              <option value="oneway">One Way</option>
              <option value="roundtrip">Round Trip</option>
              <option value="multicity">Multi City</option>
            </select>
          </div>

          {/* From Field */}
          <div className="flex-1">
            <label className="text-md text-[#008cff] mb-1">From</label>
            <select
              value={segments[0].from}
              onChange={(e) => handleSegmentChange(0, "from", e.target.value)}
              className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md cursor-pointer focus:outline-none w-full"
            >
              <option value="" disabled>
                Select departure city
              </option>
              {airports.map((airport) => (
                <option key={airport.IATA_code} value={airport.city_name}>
                  {airport.city_name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Icon */}
          {tripType !== "multicity" && (
            <motion.button
              onClick={() => handleSwap(0)}
              whileHover={{ scale: 1.1 }}
              className="bg-blue-600 p-2 rounded-full shadow-md flex items-center justify-center"
            >
              <SwapHorizIcon className="text-white text-2xl" />
            </motion.button>
          )}

          {/* To Field */}
          {(tripType === "oneway" || tripType === "roundtrip") && (
            <div className="flex-1">
              <label className="text-md text-[#008cff] mb-1">To</label>
              <select
                value={segments[0].to}
                onChange={(e) => handleSegmentChange(0, "to", e.target.value)}
                className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md cursor-pointer focus:outline-none w-full"
              >
                <option value="" disabled>
                  Select destination city
                </option>
                {airports.map((airport) => (
                  <option key={airport.IATA_code} value={airport.city_name}>
                    {airport.city_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Departure Date */}
          {(tripType === "oneway" || tripType === "roundtrip") && (
            <div className="flex-1">
              <label className="text-md text-[#008cff] mb-1">Depart</label>
              <input
                type="date"
                value={segments[0].departureDate}
                onChange={(e) => handleSegmentChange(0, "departureDate", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md focus:outline-none w-full"
              />
            </div>
          )}

          {/* Return Date (Round Trip Only) */}
          {tripType === "roundtrip" && (
            <div className="flex-1">
              <label className="text-md text-[#008cff] mb-1">Return</label>
              <input
                type="date"
                value={formData.returnDate}
                onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                min={segments[0].departureDate}
                className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md focus:outline-none w-full"
              />
            </div>
          )}

          {/* Passengers */}
          <div className="flex-1">
            <label className="text-md text-[#008cff] mb-1">Passengers</label>
            <select
              value={formData.passengers}
              onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
              className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md cursor-pointer focus:outline-none w-full"
            >
              {[...Array(10).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>
                  {num + 1} Passenger{num > 0 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Multi City */}
        {tripType === "multicity" && showMultiCityDetails && (
          <>
            {segments.map((segment, index) => (
              <div
                key={index}
                className="flex items-end justify-between gap-6 w-full bg-[#061a33] p-4 rounded-lg shadow-md mt-4"
              >
                <h3 className="text-lg text-[#008cff] font-semibold">
                  Trip {index + 1}:
                </h3>

                {/* From Field */}
                <div className="flex-1">
                  <label className="text-md text-[#008cff] mb-1">From</label>
                  <select
                    value={segment.from}
                    onChange={(e) => handleSegmentChange(index, "from", e.target.value)}
                    className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md cursor-pointer focus:outline-none w-full"
                  >
                    <option value="" disabled>
                      Select departure city
                    </option>
                    {airports.map((airport) => (
                      <option key={airport.IATA_code} value={airport.city_name}>
                        {airport.city_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* To Field */}
                <div className="flex-1">
                  <label className="text-md text-[#008cff] mb-1">To</label>
                  <select
                    value={segment.to}
                    onChange={(e) => handleSegmentChange(index, "to", e.target.value)}
                    className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md cursor-pointer focus:outline-none w-full"
                  >
                    <option value="" disabled>
                      Select destination city
                    </option>
                    {airports.map((airport) => (
                      <option key={airport.IATA_code} value={airport.city_name}>
                        {airport.city_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Departure Date */}
                <div className="flex-1">
                  <label className="text-md text-[#008cff] mb-1">Depart</label>
                  <input
                    type="date"
                    value={segment.departureDate}
                    onChange={(e) => handleSegmentChange(index, "departureDate", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md focus:outline-none w-full"
                  />
                </div>

                {/* Buttons for last segment */}
                {index === segments.length - 1 && (
                  <div className="flex items-center gap-4 w-1/7">
                    {index > 0 && (
                      <motion.button
                        onClick={() => handleRemoveCity(index)}
                        whileHover={{ scale: 1.1 }}
                        className="bg-red-600 p-2 rounded-full shadow-md flex items-center justify-center"
                      >
                        <DeleteIcon className="text-white text-xl" />
                      </motion.button>
                    )}

                    <button
                      onClick={handleAddCity}
                      className="text-[#008cff]  border border-[#008cff] py-2 px-4 rounded-md hover:bg-[#008cff] hover:text-white transition"
                    >
                      + Add City
                    </button>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
        {/* Search Button */}
        <motion.button
          onClick={handleSearch}
          whileHover={{ scale: 1.1 }}
          className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:from-blue-600 hover:to-blue-400 transition-all absolute -bottom-5"
        >
          SEARCH
        </motion.button>
      </div>
    </div>

  );
};
