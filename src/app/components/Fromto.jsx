import { useEffect, useState } from "react";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CloseIcon from "@mui/icons-material/Close";


export const Fromto = ({ handleChange }) => {
  const [airports, setAirports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [segments, setSegments] = useState([
    { from: "London (LON)", to: "Dubai (DXB)", departureDate: new Date().toISOString().split("T")[0] },
  ]);
  const [formData, setFormData] = useState({
    flightType: "oneway",
    from: "Indira Gandhi International Airport",
    to: "Heathrow Airport",
    departureDate: new Date().toISOString().split("T")[0],
    travelerCount: 1,
  });

  // Set default selected airports
  const [selectedAirport, setSelectedAirport] = useState({
    city: "Delhi",
    name: "Indira Gandhi International Airport",
    iata_code: "DEL",
  });

  const [selectedToAirport, setSelectedToAirport] = useState({
    city: "London",
    name: "Heathrow Airport",
    iata_code: "LHR",
  });

  useEffect(() => {
    const fetchAirports = async () => {
      if (searchQuery.length > 1) {
        try {
          const response = await fetch(
            `/api/basesearch?query=${searchQuery}`
          );
          const data = await response.json();
          setAirports(data);
        } catch (error) {
          console.error("Error fetching airport data:", error);
        }
      } else {
        setAirports([]); // Clear list if query is empty
      }
    };

    fetchAirports();
  }, [searchQuery]); // Trigger fetch when searchQuery updates


  useEffect(() => {
    // Pass full form data and segments to the parent when they change
    handleChange && handleChange({ formData, segments });
  }, [formData, segments]);


  // Handle change for all inputs dynamically
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "from") {
      setSearchQuery(value);
      setShowFromDropdown(true);
      setShowToDropdown(false); // Close 'To' dropdown when typing in 'From'
    } else if (name === "to") {
      setSearchQuery(value);
      setShowToDropdown(true);
      setShowFromDropdown(false); // Close 'From' dropdown when typing in 'To'
    }
  };

  const handleSelectAirport = (airport, type) => {
    if (type === "from") {
      setFormData((prevState) => ({
        ...prevState,
        from: airport.name,
        // from: airport.name + " (" + airport.iata_code + ")",
      }));
      setSelectedAirport({
        city: airport.city,
        name: airport.name,
        iata_code: airport.iata_code,
      });
      setShowFromDropdown(false);
    } else if (type === "to") {
      setFormData((prevState) => ({
        ...prevState,
        // to: airport.name + " (" + airport.iata_code + ")",
        to: airport.name,
      }));
      setSelectedToAirport({
        city: airport.city,
        name: airport.name,
        iata_code: airport.iata_code,
      });
      setShowToDropdown(false);
    }
  };


  const addSegment = () => {
    setSegments((prevSegments) => [
      ...prevSegments,
      {
        from: prevSegments[prevSegments.length - 1].to, // Auto-set "From"
        to: "", // Leave "To" empty for user input
        departureDate: new Date().toISOString().split("T")[0],
        travelerCount: 1, // Default passenger count per trip
      },
    ]);
    setShowToDropdown(true); // Open the "To" dropdown automatically
  };




  const removeSegment = (index) => {
    setSegments((prevSegments) => prevSegments.filter((_, i) => i !== index));
  };



  const handleSegmentChange = (index, field, value) => {
    setSegments((prevSegments) => {
      const updatedSegments = prevSegments.map((segment, i) =>
        i === index ? { ...segment, [field]: value } : segment
      );

      if (field === "to" && index < updatedSegments.length - 1) {
        updatedSegments[index + 1].from = value;
      }

      return updatedSegments;
    });

    if (field === "from") {
      setSearchQuery(value);
      setShowFromDropdown(true);
      setShowToDropdown(false);
    } else if (field === "to") {
      setSearchQuery(value);
      setShowToDropdown(true);
      setShowFromDropdown(false);
    }
  };


  const handleInterchange = () => {
    setFormData((prevData) => ({
      ...prevData,
      from: prevData.to,
      to: prevData.from,
    }));

    setSelectedAirport((prev) => selectedToAirport);
    setSelectedToAirport((prev) => selectedAirport);
  };


  const handleFlightTypeChange = (flightType) => {
    if (flightType === "multicity") {
      setSegments([
        {
          from: formData.from, // Use the main "From" value
          to: formData.to, // Use the main "To" value
          departureDate: formData.departureDate,
          travelerCount: formData.travelerCount,
        },
        {
          from: formData.to, // Auto-set "From" of second trip as the first trip's "To"
          to: "", // Open "To" section for the second trip
          departureDate: new Date().toISOString().split("T")[0],
          travelerCount: 1,
        },
      ]);
    }
    setFormData((prevData) => ({
      ...prevData,
      flightType,
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

      {/* Main Search Container - Hide if Multi-City is selected */}
      {formData.flightType !== "multicity" && (
        <div className="bg-white shadow-md rounded-lg border border-gray-300 py-4 px-6 flex items-center relative">
          <div className="flex flex-[4]">
            {/* "From" Section */}
            <div className="flex-[5] border-r border-gray-300 pr-4 relative">
              <p className="text-sm text-gray-500 mb-1">From</p>
              {selectedAirport && (
                <p className="text-2xl font-bold">{selectedAirport.city}</p>
              )}
              <input
                type="text"
                name="from"
                value={formData.from}
                onChange={handleInputChange}
                placeholder="Enter city, airport name, IATA, ICAO, country"
                className="w-full text-sm bg-transparent border-none focus:outline-none"
              />

              {/* Add Dropdown for FROM field */}
              {showFromDropdown && airports.length > 0 && (
                <ul className="absolute bg-white shadow-md border w-full mt-1 max-h-48 overflow-y-auto z-50">
                  {airports.map((airport) => (
                    <li
                      key={airport.id}
                      onClick={() => handleSelectAirport(airport, "from")}
                      className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-200"
                    >
                      <div>
                        <p className="text-sm font-semibold">{airport.city}, {airport.country}</p>
                        <p className="text-xs text-gray-500">{airport.name}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-600">{airport.iata_code}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>


            {/* Interchange Icon */}
            <div className="relative transform translate-y-[40%] -translate-x-1/2 z-10 bg-white rounded-full shadow-[0_0_10px_#93c5fd,0_0_20px_#bfdbfe] flex items-center justify-center w-[40px] h-[40px]">
              <button
                onClick={handleInterchange}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <SwapHorizIcon className="text-blue-500 text-2xl" />
              </button>
            </div>

            {/* "To" Section */}
            <div className="flex-[5] border-r border-gray-300 px-4 relative">
              <p className="text-sm text-gray-500 mb-1">To</p>
              {selectedToAirport && (
                <p className="text-2xl font-bold">{selectedToAirport.city}</p>
              )}
              <input
                type="text"
                name="to"
                value={formData.to}
                onChange={handleInputChange}
                placeholder="Enter city, airport name, IATA, ICAO, country"
                className="w-full text-sm bg-transparent border-none focus:outline-none"
              />

              {/* Add Dropdown for TO field */}
              {showToDropdown && airports.length > 0 && (
                <ul className="absolute bg-white shadow-md border w-full mt-1 max-h-48 overflow-y-auto z-50">
                  {airports.map((airport) => (
                    <li
                      key={airport.id}
                      onClick={() => handleSelectAirport(airport, "to")}
                      className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-200"
                    >
                      <div>
                        <p className="text-sm font-semibold">{airport.city}, {airport.country}</p>
                        <p className="text-xs text-gray-500">{airport.name}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-600">{airport.iata_code}</p>
                    </li>
                  ))}
                </ul>
              )}
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
              min={new Date().toISOString().split("T")[0]}
              onKeyDown={(e) => e.preventDefault()}
            />
            <p className="text-xs text-gray-400 mt-1">
              {formData.departureDate &&
                new Date(formData.departureDate).toLocaleDateString("en-US", {
                  weekday: "long",
                })}
            </p>
          </div>

          {/* Passengers Section */}
          <div className="flex-1 px-4">
            <p className="text-sm text-gray-500 mb-4">Passengers</p>
            <select
              name="travelerCount"
              value={formData.travelerCount}
              onChange={handleInputChange}
              className=" text-lg font-semibold bg-transparent border border-gray-300 rounded-lg focus:outline-none cursor-pointer"
            >
              {[...Array(20)].map((_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1} Passenger{index > 0 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}



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
                <div className="flex-[5] border-r border-gray-300 pr-4 relative">
                  <p className="text-sm text-gray-500 mb-1">From</p>
                  <p className="text-2xl font-bold">{segment.from}</p>
                  <input
                    type="text"
                    value={segment.from}
                    onChange={(e) => handleSegmentChange(index, "from", e.target.value)}
                    placeholder="Enter city, airport name, IATA, ICAO, country"
                    className="w-full text-sm bg-transparent border-none focus:outline-none"
                  />
                  {showFromDropdown && airports.length > 0 && (
                    <ul className="absolute bg-white shadow-md border w-full mt-1 max-h-48 overflow-y-auto z-50">
                      {airports.map((airport) => (
                        <li
                          key={airport.id}
                          onClick={() =>
                            handleSegmentChange(index, "from", `${airport.name} (${airport.iata_code})`)
                          }
                          className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-200"
                        >
                          <div>
                            <p className="text-sm font-semibold">{airport.city}, {airport.country}</p>
                            <p className="text-xs text-gray-500">{airport.name}</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-600">{airport.iata_code}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* To Section */}
                <div className="flex-[5] border-r border-gray-300 px-4 relative">
                  <p className="text-sm text-gray-500 mb-1">To</p>
                  <p className="text-2xl font-bold">{segment.to}</p>
                  <input
                    type="text"
                    value={segment.to}
                    onChange={(e) => handleSegmentChange(index, "to", e.target.value)}
                    placeholder="Enter city, airport name, IATA, ICAO, country"
                    className="w-full text-sm bg-transparent border-none focus:outline-none"
                  />
                  {showToDropdown && airports.length > 0 && (
                    <ul className="absolute bg-white shadow-md border w-full mt-1 max-h-48 overflow-y-auto z-50">
                      {airports.map((airport) => (
                        <li
                          key={airport.id}
                          onClick={() =>
                            handleSegmentChange(index, "to", `${airport.name} (${airport.iata_code})`)
                          }
                          className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-200"
                        >
                          <div>
                            <p className="text-sm font-semibold">{airport.city}, {airport.country}</p>
                            <p className="text-xs text-gray-500">{airport.name}</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-600">{airport.iata_code}</p>
                        </li>
                      ))}
                    </ul>
                  )}
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
                        weekday: "long",
                      })}
                  </p>
                </div>

                {/* Passenger Section - INDIVIDUAL for EACH TRIP */}
                <div className="flex-1 px-4">
                  <p className="text-sm text-gray-500 mb-1">Passengers</p>
                  <select
                    name="travelerCount"
                    value={segment.travelerCount}
                    onChange={(e) => handleSegmentChange(index, "travelerCount", e.target.value)}
                    className="text-lg font-semibold bg-transparent border border-gray-300 rounded-lg focus:outline-none cursor-pointer"
                  >
                    {[...Array(20)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} Passenger{i > 0 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Add/Remove Trip Buttons */}
                <div className="flex items-center gap-4">
                  {index === segments.length - 1 && (
                    <button
                      onClick={addSegment}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                      Add Another City
                    </button>
                  )}

                  {index > 0 && index === segments.length - 1 && (
                    <div className="h-6 w-[1px] bg-gray-300" />
                  )}

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
