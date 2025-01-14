"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // For smooth animations
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterAndFleetListing from '../components/FilterAndFleetListing'

export const SearchBar = () => {
  const [airports, setAirports] = useState([]);
  const [tripType, setTripType] = useState("oneway"); // Default trip type
  const [refreshKey, setRefreshKey] = useState(0); // State to trigger re-render
  const [segments, setSegments] = useState([
    { from: "", to: "", departureDate: new Date().toISOString().split("T")[0], departureTime: "12:00", passengers: 1 },
  ]);
  const [showMultiCityDetails, setShowMultiCityDetails] = useState(false); // Tracks if details should be shown

  const [formData, setFormData] = useState({
    passengers: 1,

  });
  const searchData = { tripType, segments };

  useEffect(() => {
    const savedSearchData = sessionStorage.getItem("searchData");
    if (savedSearchData) {
      const parsedData = JSON.parse(savedSearchData);
      setTripType(parsedData.tripType); // Restore trip type
      setSegments(parsedData.segments); // Restore segments
    }
  }, []);

  useEffect(() => {
    const searchData = { tripType, segments }; // Combine tripType and segments
    sessionStorage.setItem("searchData", JSON.stringify(searchData)); // Save to sessionStorage
  }, [tripType, segments]);


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
      setSegments([
        {
          from: "",
          to: "",
          departureDate: new Date().toISOString().split("T")[0],
          departureTime: "12:00",
          passengers: formData.passengers, // Add passengers from formData
        },
      ]);
    } else if (type === "roundtrip") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1); // Calculate next day's date
      setSegments([
        {
          from: "",
          to: "",
          departureDate: new Date().toISOString().split("T")[0],
          departureTime: "12:00",
          returnDate: tomorrow.toISOString().split("T")[0], // Set default return date
          returnTime: "12:00", // Set default return time
          passengers: formData.passengers, // Add passengers from formData
        },
      ]);
    } else if (type === "multicity") {
      setSegments([
        {
          from: "",
          to: "",
          departureDate: new Date().toISOString().split("T")[0],
          departureTime: "12:00",
          passengers: 1, // Default to 1 passenger for multicity
        },
      ]);
    }
  };

  const handleSegmentChange = (index, field, value) => {
    const updatedSegments = [...segments];
    updatedSegments[index][field] = value;
    setSegments(updatedSegments);

    // Sync passengers with formData for roundtrip and oneway
    if (field === "passengers" && (tripType === "oneway" || tripType === "roundtrip")) {
      setFormData({ ...formData, passengers: value });
      updatedSegments[0].passengers = value; // Update passengers in segments
      setSegments(updatedSegments);
    }

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
        departureTime: "12:00", // Default departure time
        passengers: 1, // Explicitly set default passengers
      },
    ]);
  };



  const handleRemoveCity = (index) => {
    setSegments(segments.filter((_, i) => i !== index));
  };

  const handleSearch = () => {
    const searchData = { tripType, segments }; // Combine data
    sessionStorage.setItem("searchData", JSON.stringify(searchData)); // Save as a single object
    console.log("Stored Search Data:", JSON.parse(sessionStorage.getItem("searchData")));
    // alert("Search initiated! Check the console for details.");

    // Trigger re-render of <FilterAndFleetListing />
    setRefreshKey((prev) => prev + 1); // Increment the key to force a re-render
  };
  return (
    <div className="flex flex-col items-center">

      <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-1 rounded-lg w-[90%] mb-8 sticky top-20 z-30">
        <div className="bg-[#041422] p-6 rounded-lg shadow-md flex flex-col items-center gap-4 relative">
          {/* Primary Search Bar */}
          <div className="flex items-end justify-between gap-4 w-full pb-1">
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

            {/* Departure Date and Time */}
            {(tripType === "oneway" || tripType === "roundtrip") && (
              <div className="flex-1">
                <label className="text-md text-[#008cff] mb-1">Depart</label>
                <input
                  type="datetime-local"
                  value={`${segments[0].departureDate}T${segments[0].departureTime || "12:00"}`}
                  onChange={(e) => {
                    const [date, time] = e.target.value.split("T");
                    handleSegmentChange(0, "departureDate", date);
                    handleSegmentChange(0, "departureTime", time);
                  }}
                  min={`${new Date().toISOString().split("T")[0]}T00:00`}
                  className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md focus:outline-none w-full"
                />
              </div>
            )}

            {/* Return Date and Time (Round Trip Only) */}
            {tripType === "roundtrip" && (
              <div className="flex-1">
                <label className="text-md text-[#008cff] mb-1">Return</label>
                <input
                  type="datetime-local"
                  value={`${segments[0].returnDate}T${segments[0].returnTime || "12:00"}`}
                  onChange={(e) => {
                    const [date, time] = e.target.value.split("T");
                    handleSegmentChange(0, "returnDate", date);
                    handleSegmentChange(0, "returnTime", time);
                  }}
                  min={`${segments[0].departureDate}T${segments[0].departureTime || "00:00"}`}
                  className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md focus:outline-none w-full"
                />
              </div>
            )}



            {/* Passengers */}
            <div className="flex-1">
              <label className="text-md text-[#008cff] mb-1">Passengers</label>
              <select
                value={segments[0].passengers} // Use passengers from segments array
                onChange={(e) => handleSegmentChange(0, "passengers", Number(e.target.value))}
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
                  className="flex flex-wrap items-end justify-between gap-6 w-full rounded-lg shadow-md"
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

                  {/* Departure Date and Time */}
                  <div className="flex-1">
                    <label className="text-md text-[#008cff] mb-1">Date & Time</label>
                    <input
                      type="datetime-local"
                      value={`${segment.departureDate}T${segment.departureTime || "12:00"}`}
                      onChange={(e) => {
                        const [date, time] = e.target.value.split("T");
                        handleSegmentChange(index, "departureDate", date);
                        handleSegmentChange(index, "departureTime", time);
                      }}
                      min={`${new Date().toISOString().split("T")[0]}T00:00`}
                      className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md focus:outline-none w-full"
                    />
                  </div>
                  {/* Passenger Selection */}
                  <div className="flex-1">
                    <label className="text-md text-[#008cff] mb-1">Passengers</label>
                    <select
                      value={segment.passengers} // Correctly bind to the passengers field
                      onChange={(e) => handleSegmentChange(index, "passengers", Number(e.target.value))} // Update passengers
                      className="bg-[hsla(0,0%,100%,0.1)] text-white py-2 px-4 rounded-md shadow-md cursor-pointer focus:outline-none w-full"
                    >
                      {[...Array(10).keys()].map((num) => (
                        <option key={num + 1} value={num + 1}>
                          {num + 1} Passenger{num > 0 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>


                  {/* Add/Remove Buttons */}
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
                        className="text-[#008cff] border border-[#008cff] py-2 px-4 rounded-md hover:bg-[#008cff] hover:text-white transition"
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
            className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:from-blue-600 hover:to-blue-400 transition-all absolute -bottom-5 "
          >
            SEARCH
          </motion.button>
        </div>
      </div>
      {/* Pass `refreshKey` as a prop to FilterAndFleetListing */}
      <FilterAndFleetListing key={refreshKey} />
    </div>


  );
};
