"use client"
import { useEffect, useState } from "react";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CloseIcon from "@mui/icons-material/Close";
export const Fromto = ({ handleChange }) => {
  const [airports, setAirports] = useState([]);
  const [segments, setSegments] = useState([
    { from: "London (LON)", to: "Dubai (DXB)", departureDate: new Date().toISOString().split("T")[0] },
  ]);
  const [formData, setFormData] = useState({
    flightType: "oneway", // Default flight type
    from: "London (LON)", // Default value
    to: "Dubai (DXB)", // Default value
    departureDate: new Date().toISOString().split("T")[0], // Today's date
    returnDate: "", // Empty by default
    travelerCount: 1,
  });

  useEffect(() => {
    const fetchAirports = async () => {
      const data = await fetch(
        "https://raw.githubusercontent.com/ashhadulislam/JSON-Airports-India/master/airports.json"
      );
      const ans = await data.json();
      setAirports(ans.airports);
    };
    fetchAirports();
  }, []);

  // Handle change for all inputs dynamically
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    handleChange && handleChange(e); // Pass changes to parent component if provided
  };
  const addSegment = () => {
    setSegments((prevSegments) => [
      ...prevSegments,
      {
        from: prevSegments[prevSegments.length - 1].to, // Set "From" to the previous segment's "To"
        to: "",
        departureDate: new Date().toISOString().split("T")[0], // Default date
      },
    ]);
  };



  const removeSegment = (index) => {
    setSegments((prevSegments) => prevSegments.filter((_, i) => i !== index));
  };



  const handleSegmentChange = (index, field, value) => {
    setSegments((prevSegments) => {
      const updatedSegments = prevSegments.map((segment, i) =>
        i === index ? { ...segment, [field]: value } : segment
      );

      // Propagate changes to the next segment's "from" field if "to" changes
      if (field === "to" && index < updatedSegments.length - 1) {
        updatedSegments[index + 1].from = value;
      }

      return updatedSegments;
    });
  };



  const handleInterchange = () => {
    setFormData((prevData) => ({
      ...prevData,
      from: prevData.to,
      to: prevData.from,
    }));
  };

  const handleFlightTypeChange = (flightType) => {
    if (flightType === "round_trip") {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      setFormData((prevData) => ({
        ...prevData,
        flightType,
        returnDate: tomorrow.toISOString().split("T")[0],
        from: "London (LON)", // Default for "from"
        to: "Dubai (DXB)", // Default for "to"
        departureDate: today.toISOString().split("T")[0], // Set today's date
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        flightType,
        returnDate: "", // Clear return date
      }));
    }
  };

  const handleClearRoundTrip = () => {
    const today = new Date();
    setFormData((prevData) => ({
      ...prevData,
      flightType: "oneway",
      returnDate: "",
      departureDate: today.toISOString().split("T")[0],
      from: "London (LON)",
      to: "Dubai (DXB)",
    }));
  };


  return (
    <div className="w-[90%] mx-auto">
      {/* Flight Type Selection Box */}
      <div className="flex justify-between w-full font-medium text-gray-700 py-2 rounded-lg px-2">
        {/* Flight Type Options */}
        <div className="flex items-center space-x-6">
          {/* ONEWAY */}
          <label
            htmlFor="oneway"
            className={`flex items-center space-x-2 cursor-pointer group px-4 py-2 rounded-lg transition-all duration-300 ${formData.flightType === "oneway" ? "bg-blue-50" : "bg-white"
              }`}
          >
            <input
              type="radio"
              name="flightType"
              id="oneway"
              value="oneway"
              checked={formData.flightType === "oneway"}
              onChange={() => handleFlightTypeChange("oneway")}
              className="w-[16px] h-[16px] text-blue-500 rounded-full focus:ring-blue-500 transition-transform"
            />
            <span
              className={`text-gray-700 transition-colors duration-300 ${formData.flightType === "oneway" ? "text-blue-500 font-semibold" : ""
                }`}
            >
              One Way
            </span>
          </label>

          {/* ROUNDTRIP */}
          <label
            htmlFor="round_trip"
            className={`flex items-center space-x-2 cursor-pointer group px-4 py-2 rounded-lg transition-all duration-300 ${formData.flightType === "round_trip" ? "bg-blue-50" : "bg-white"
              }`}
          >
            <input
              type="radio"
              name="flightType"
              id="round_trip"
              value="round_trip"
              checked={formData.flightType === "round_trip"}
              onChange={() => handleFlightTypeChange("round_trip")}
              className="w-[16px] h-[16px] text-blue-500 rounded-full focus:ring-blue-500 transition-transform"
            />
            <span
              className={`text-gray-700 transition-colors duration-300 ${formData.flightType === "round_trip" ? "text-blue-500 font-semibold" : ""
                }`}
            >
              Round Trip
            </span>
          </label>

          {/* MULTI CITY */}
          <label
            htmlFor="multicity"
            className={`flex items-center space-x-2 cursor-pointer group px-4 py-2 rounded-lg transition-all duration-300 ${formData.flightType === "multicity" ? "bg-blue-50" : "bg-white"
              }`}
          >
            <input
              type="radio"
              name="flightType"
              id="multicity"
              value="multicity"
              checked={formData.flightType === "multicity"}
              onChange={(e) => handleFlightTypeChange(e.target.value)}
              className="w-[16px] h-[16px] text-blue-500 rounded-full focus:ring-blue-500 transition-transform"
            />
            <span
              className={`text-gray-700 transition-colors duration-300 ${formData.flightType === "multicity" ? "text-blue-500 font-semibold" : ""
                }`}
            >
              Multi City
            </span>
          </label>
        </div>



        {/* Flight Categories */}
        <div className="text-gray-500 text-sm">
          <span className="px-3 py-2 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-500 transition-all cursor-pointer">
            Book National and International Fleets
          </span>
        </div>


      </div>

      {/* Main Search Container */}
      <div className="bg-white shadow-md rounded-lg border border-gray-300 py-4 px-6 flex items-center relative">
        <div className="flex flex-[3]">
          {/* From Section */}
          <div className="flex-[3] border-r border-gray-300 pr-4">

            <p className="text-sm text-gray-500 mb-1">From</p>
            <select
              name="from"
              value={formData.from} // The value is only the city name
              onChange={handleInputChange}
              className="w-full text-lg font-semibold bg-transparent border-none appearance-none focus:outline-none cursor-pointer"
            >
              <option value="" disabled>
                Select Departure
              </option>
              {airports.map((airport) => (
                <option
                  value={airport.city_name} // Use only city_name as value
                  key={airport.IATA_code}
                >
                  {airport.city_name} {/* Display only city_name */}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              {formData.from || "Default: London"}
            </p>
          </div>

          {/* Interchange Icon */}
          {formData.flightType !== "multicity" && (
            <div className="relative transform translate-y-[40%] -translate-x-1/2 z-10 bg-white rounded-full shadow-[0_0_10px_#93c5fd,0_0_20px_#bfdbfe] flex items-center justify-center w-[40px] h-[40px]">
              <button
                onClick={handleInterchange}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <SwapHorizIcon className="text-blue-500 text-2xl" />
              </button>
            </div>
          )}

          {/* To Section */}
          <div className="flex-[3] border-r border-gray-300 px-4">
            <p className="text-sm text-gray-500 mb-1">To</p>
            <select
              name="to"
              value={formData.to} // The value is only the city name
              onChange={handleInputChange}
              className="w-full text-lg font-semibold bg-transparent border-none appearance-none focus:outline-none cursor-pointer"
            >
              <option value="" disabled>
                Select Destination
              </option>
              {airports.map((airport) => (
                <option
                  value={airport.city_name} // Use only city_name as value
                  key={airport.IATA_code}
                >
                  {airport.city_name} {/* Display only city_name */}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              {formData.to || "Default: Dubai"}
            </p>
          </div>
        </div>

        {/* Departure Section */}
        <div className=" border-r border-gray-300 px-4">
          <p className="text-sm text-gray-500 mb-1">Departure</p>
          <input
            type="date"
            name="departureDate"
            value={formData.departureDate}
            onChange={handleInputChange}
            className="w-full text-lg font-semibold bg-transparent border-none appearance-none focus:outline-none cursor-pointer"
            min={new Date().toISOString().split("T")[0]} // Disable past dates
            onKeyDown={(e) => e.preventDefault()} // Prevent manual input
          />
          <p className="text-xs text-gray-400 mt-1">
            {formData.departureDate &&
              new Date(formData.departureDate).toLocaleDateString("en-US", {
                weekday: "long", // Get the full name of the weekday
              })}
          </p>
        </div>

        {/* Return Section */}
        {formData.flightType !== "multicity" && (
          <div className="flex-1 border-r border-gray-300 pl-4  relative">
            <span className="text-sm text-gray-500 mb-1 flex items-center justify-between">
              Return
              {formData.flightType === "round_trip" && (
                <button onClick={handleClearRoundTrip} className="text-gray-500">
                  <CloseIcon />
                </button>
              )}
            </span>
            <input
              type="date"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleInputChange}
              className=" text-lg font-semibold bg-transparent border-none appearance-none focus:outline-none cursor-pointer"
              min={new Date().toISOString().split("T")[0]} // Disable past dates
              onKeyDown={(e) => e.preventDefault()} // Prevent manual input
            />
            <p className="text-xs text-gray-400 mt-1">
              {formData.returnDate
                ? new Date(formData.returnDate).toLocaleDateString("en-US", {
                  weekday: "long", // Get the full name of the weekday
                })
                : "Tap to add a return date for bigger discounts"}
            </p>
          </div>
        )}
        {/* Passengers Section */}
        <div className="flex-1 px-4">
          <p className="text-sm text-gray-500 mb-4">Passengers</p>
          <select
            name="travelerCount"
            value={formData.travelerCount}
            onChange={handleInputChange} // Updates formData.travelerCount dynamically
            className=" text-lg font-semibold bg-transparent border border-gray-300 rounded-lg focus:outline-none cursor-pointer"
          >
            {[...Array(20)].map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1} Passenger{index > 0 ? "s" : ""}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">
            {formData.travelerCount} Passenger{formData.travelerCount > 1 ? "s" : ""}
          </p>
        </div>
      </div>


      {/* Multi-City Segments */}
      {formData.flightType === "multicity" && (
        <div className="multi-city-container mt-4">
          {segments.map((segment, index) => (
            <div
              key={index}
              className="multi-city-segment bg-white shadow-md rounded-lg border border-gray-300 py-4 px-6 mb-4"
            >
              <div className="flex items-center justify-between gap-4">
                {/* From Section */}
                <div className="flex-1 border-r border-gray-300 px-6">
                  <p className="text-sm text-gray-500 mb-1">From</p>
                  <select
                    name="from"
                    value={segment.from}
                    onChange={(e) =>
                      handleSegmentChange(index, "from", e.target.value)
                    }
                    className="w-full text-lg font-semibold bg-transparent border-none appearance-none focus:outline-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Select Departure
                    </option>
                    {airports.map((airport) => (
                      <option value={airport.city_name} key={airport.IATA_code}>
                        {airport.city_name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    {segment.from ? airports.find((a) => a.city_name === segment.from)?.country_name : "Select a city"}
                  </p>
                </div>

                {/* To Section */}
                <div className="flex-1 border-r border-gray-300 px-6">
                  <p className="text-sm text-gray-500 mb-1">To</p>
                  <select
                    name="to"
                    value={segment.to}
                    onChange={(e) =>
                      handleSegmentChange(index, "to", e.target.value)
                    }
                    className="w-full text-lg font-semibold bg-transparent border-none appearance-none focus:outline-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Select Destination
                    </option>
                    {airports.map((airport) => (
                      <option value={airport.city_name} key={airport.IATA_code}>
                        {airport.city_name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    {segment.to ? airports.find((a) => a.city_name === segment.to)?.country_name : "Select a city"}
                  </p>
                </div>


                {/* Departure Section */}
                <div className="flex-1 border-r border-gray-300 px-4">
                  <p className="text-sm text-gray-500 mb-1">Departure</p>
                  <input
                    type="date"
                    value={segment.departureDate}
                    onChange={(e) =>
                      handleSegmentChange(index, "departureDate", e.target.value)
                    }
                    className="w-full text-lg font-semibold bg-transparent border-none appearance-none focus:outline-none cursor-pointer"
                    min={new Date().toISOString().split("T")[0]}
                    onKeyDown={(e) => e.preventDefault()}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {segment.departureDate &&
                      new Date(segment.departureDate).toLocaleDateString("en-US", {
                        weekday: "long", // Get the full name of the weekday
                      })}
                  </p>
                </div>

                {/* Add Another City Button and Remove Segment Button */}
                <div className="flex items-center gap-4">
                  {/* Add Another City Button */}
                  {index === segments.length - 1 && (
                    <button
                      onClick={addSegment}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                      Add Another City
                    </button>
                  )}

                  {/* Border Divider */}
                  {index > 0 && index === segments.length - 1 && (
                    <div className="h-6 w-[1px] bg-gray-300" />
                  )}

                  {/* Remove Segment Button */}
                  {index > 0 && (
                    <button
                      onClick={() => removeSegment(index)}
                      className="flex items-center text-red-500 text-lg gap-1"
                    >
                      <CloseIcon className="text-xl" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};