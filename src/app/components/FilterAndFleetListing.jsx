"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoIosAirplane } from "react-icons/io";
import FlightCard from "./FleetCard";

const fleetData = [
  {
    id: 1,
    title: "King Air C90",
    type: "Charter Flights",
    flightTime: "12 Hrs 50 Min",
    price: 1902267,
    additionalAmenities: {
      "Air Hostess / Escorts": {
        "value": "chargeable",
        "name": "akash sharma",
        "phone": "5685475124"
      },
      "Personal Bouquet": {
        "value": "free",
        "name": "",
        "phone": ""
      },
      "Brand new Interior": {
        "value": "free",
        "name": "",
        "phone": ""
      },
      "Brand new Paint": {
        "value": "free",
        "name": "",
        "phone": ""
      },
      "Espresso Coffee Machine": {
        "value": "free",
        "name": "",
        "phone": ""
      },
      "Personal Microwave": {
        "value": "free",
        "name": "",
        "phone": ""
      },
      "Music System Surround Sound": {
        "value": "free",
        "name": "",
        "phone": ""
      },
      "New FHD Monitor": {
        "value": "free",
        "name": "",
        "phone": ""
      },

      "Power Supply 110V": {
        "value": "free",
        "name": "",
        "phone": ""
      },
      "Vvip car Pick & Drop": {
        "value": "free",
        "name": "shivam",
        "phone": "9958241284"
      }
    },
    aircraftGallery: {
      "interior": {
        "Front View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/internal+view/istockphoto-1438630873-2048x2048.jpg",
        "Left View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/internal+view/istockphoto-1413587508-2048x2048.jpg",
        "Rear View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/internal+view/istockphoto-154191655-2048x2048.jpg",
        "Right View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/internal+view/istockphoto-471884691-2048x2048.jpg"
      },
      "exterior": {
        "Front View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/exterior+view/pexels-asadphoto-240524.jpg",
        "Left View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/exterior+view/pexels-guskazi-13528331.jpg",
        "Rear View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/exterior+view/pexels-joerg-mangelsen-337913024-15953920.jpg",
        "Right View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/exterior+view/pexels-saturnus99-19766183.jpg"
      },
      "cockpit": {
        "Front View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/cockpitView/pexels-joerg-mangelsen-337913024-15781287.jpg",
        "Left View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/cockpitView/pexels-kelly-1179532-2898316.jpg",
        "Rear View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/cockpitView/pexels-luis-peralta-58498002-29637932.jpg",
        "Right View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/cockpitView/pexels-rafael-cosquiere-1059286-2064123.jpg"
      },
      "aircraftLayout":{
        "Day": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/internal+view/istockphoto-1438630873-2048x2048.jpg",
        "Night": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/internal+view/istockphoto-1413587508-2048x2048.jpg",
      },
      "video": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/video/3657467-hd_1920_1080_30fps.mp4"
    },
  },
  {
    id: 2,
 
    title: "Cessna Citation X",
    type: "Private Jets",
    flightTime: "6 Hrs 30 Min",
    price: 3500000,
    additionalAmenities: {
      "Air Hostess / Escorts": {
        "value": "chargeable",
        "name": "akash sharma",
        "phone": "5685475124"
      },
      "Personal Bouquet": {
        "value": "free",
        "name": "",
        "phone": ""
      },
      "Brand new Interior": {
        "value": "free",
        "name": "",
        "phone": ""
      },
      "Brand new Paint": {
        "value": "free",
        "name": "",
        "phone": ""
      },
      "Espresso Coffee Machine": {
        "value": "free",
        "name": "",
        "phone": ""
      },
      "Personal Microwave": {
        "value": "free",
        "name": "",
        "phone": ""
      },
      "Music System Surround Sound": {
        "value": "free",
        "name": "",
        "phone": ""
      },
      "New FHD Monitor": {
        "value": "free",
        "name": "",
        "phone": ""
      },

      "Power Supply 110V": {
        "value": "free",
        "name": "",
        "phone": ""
      },
      "Vvip car Pick & Drop": {
        "value": "free",
        "name": "shivam",
        "phone": "9958241284"
      }
    },
    aircraftGallery: {
      "interior": {
        "Front View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/internal+view/istockphoto-1438630873-2048x2048.jpg",
        "Left View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/internal+view/istockphoto-1413587508-2048x2048.jpg",
        "Rear View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/internal+view/istockphoto-154191655-2048x2048.jpg",
        "Right View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/internal+view/istockphoto-471884691-2048x2048.jpg"
      },
      "exterior": {
        "Front View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/exterior+view/pexels-asadphoto-240524.jpg",
        "Left View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/exterior+view/pexels-guskazi-13528331.jpg",
        "Rear View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/exterior+view/pexels-joerg-mangelsen-337913024-15953920.jpg",
        "Right View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/exterior+view/pexels-saturnus99-19766183.jpg"
      },
      "cockpit": {
        "Front View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/cockpitView/pexels-joerg-mangelsen-337913024-15781287.jpg",
        "Left View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/cockpitView/pexels-kelly-1179532-2898316.jpg",
        "Rear View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/cockpitView/pexels-luis-peralta-58498002-29637932.jpg",
        "Right View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/cockpitView/pexels-rafael-cosquiere-1059286-2064123.jpg"
      },
      "aircraftLayout":{
        "Day": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/internal+view/istockphoto-1438630873-2048x2048.jpg",
        "Night": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/internal+view/istockphoto-1413587508-2048x2048.jpg",
      },
      "video": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/video/3657467-hd_1920_1080_30fps.mp4"
    },

  },
  {
    id: 3,

    title: "Bombardier Global 6000",
    type: "Business Jets",
    flightTime: "14 Hrs",
    price: 8000000,
    additionalAmenities: {
      "Air Hostess / Escorts": {
        "value": "chargeable",
        "name": "akash sharma",
        "phone": "5685475124"
      },
      "Personal Bouquet": {
        "value": "free",
        "name": "",
        "phone": ""
      },
      "Brand new Interior": {
        "value": "free",
        "name": "",
        "phone": ""
      },
      "Brand new Paint": {
        "value": "free",
        "name": "",
        "phone": ""
      },
      "Espresso Coffee Machine": {
        "value": "free",
        "name": "",
        "phone": ""
      },
      "Personal Microwave": {
        "value": "free",
        "name": "",
        "phone": ""
      },
      "Music System Surround Sound": {
        "value": "free",
        "name": "",
        "phone": ""
      },
      "New FHD Monitor": {
        "value": "free",
        "name": "",
        "phone": ""
      },

      "Power Supply 110V": {
        "value": "free",
        "name": "",
        "phone": ""
      },
      "Vvip car Pick & Drop": {
        "value": "free",
        "name": "shivam",
        "phone": "9958241284"
      }
    },
    aircraftGallery: {
      "interior": {
        "Front View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/internal+view/istockphoto-1438630873-2048x2048.jpg",
        "Left View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/internal+view/istockphoto-1413587508-2048x2048.jpg",
        "Rear View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/internal+view/istockphoto-154191655-2048x2048.jpg",
        "Right View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/internal+view/istockphoto-471884691-2048x2048.jpg"
      },
      "exterior": {
        "Front View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/exterior+view/pexels-asadphoto-240524.jpg",
        "Left View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/exterior+view/pexels-guskazi-13528331.jpg",
        "Rear View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/exterior+view/pexels-joerg-mangelsen-337913024-15953920.jpg",
        "Right View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/exterior+view/pexels-saturnus99-19766183.jpg"
      },
      "cockpit": {
        "Front View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/cockpitView/pexels-joerg-mangelsen-337913024-15781287.jpg",
        "Left View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/cockpitView/pexels-kelly-1179532-2898316.jpg",
        "Rear View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/cockpitView/pexels-luis-peralta-58498002-29637932.jpg",
        "Right View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/cockpitView/pexels-rafael-cosquiere-1059286-2064123.jpg"
      },
      "aircraftLayout":{
        "Day": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/internal+view/istockphoto-1438630873-2048x2048.jpg",
        "Night": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/internal+view/istockphoto-1413587508-2048x2048.jpg",
      },
      "video": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/video/3657467-hd_1920_1080_30fps.mp4"
    },
  },
];

const FilterAndFleetListing = ({ refreshKey }) => {
  // States
  const [searchData, setSearchData] = useState(null); // State to store session data
  const [filteredData, setFilteredData] = useState(fleetData); // Filtered fleets based on user selection
  const [selectedTypes, setSelectedTypes] = useState([]); // Flight types selected by the user
  const [priceRange, setPriceRange] = useState(Math.max(...fleetData.map((f) => f.price))); // Price range slider value
  const minPrice = Math.min(...fleetData.map((f) => f.price)); // Min price for slider
  const maxPrice = Math.max(...fleetData.map((f) => f.price)); // Max price for slider
  const [selectedFleets, setSelectedFleets] = useState([]); // Fleet selected for each segment

  // Fetch session data on component mount from sessionStorage
  useEffect(() => {
    const fetchSessionData = () => {
      try {
        const sessionData = JSON.parse(sessionStorage.getItem("searchData")); // Get session data
        if (sessionData) {
          setSearchData(sessionData); // Set the fetched session data
          setSelectedFleets(Array(sessionData?.segments?.length || 0).fill(null)); // Initialize fleets
        } else {
          console.warn("No session data found in sessionStorage.");
        }
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    };

    fetchSessionData();
  }, [refreshKey]);

  // Filter Logic (Price & Type)
  useEffect(() => {
    const filtered = fleetData.filter(
      (flight) =>
        flight.price <= priceRange &&
        (selectedTypes.length === 0 || selectedTypes.includes(flight.type))
    );
    setFilteredData(filtered);
  }, [priceRange, selectedTypes]);

  // Handle Type Selection
  const handleTypeChange = (type) => {
    setSelectedTypes((prevSelected) =>
      prevSelected.includes(type)
        ? prevSelected.filter((t) => t !== type)
        : [...prevSelected, type]
    );
  };

  // Handle Fleet Selection for a Specific Segment
  const handleFleetSelection = (index, fleet) => {
    const updatedFleets = [...selectedFleets];
    updatedFleets[index] = fleet;
    setSelectedFleets(updatedFleets);

    const updatedSearchData = { ...searchData };
    updatedSearchData.segments[index].selectedFleet = {
      name: fleet.title,
      model: fleet.type,
    };
    setSearchData(updatedSearchData);
    sessionStorage.setItem("searchData", JSON.stringify(updatedSearchData));
  };

  // Navigate to Enquiry Page
  const navigateToEnquiryPage = () => {
    console.log("Proceeding to enquiry with data: ", searchData);
    // Add your navigation logic here, e.g., using Next.js router or any other
  };

  // Render Loading State if `searchData` is not yet fetched
  if (!searchData) {
    return <div>Loading session data...</div>;
  }

  return (
    <div className="relative w-[90%] mx-auto flex flex-col items-start overflow-hidden rounded-lg shadow-lg mt-4">
      {/* Top Panel */}
      <div className="w-full p-6 bg-gray-50 border rounded-lg shadow-lg space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-center text-blue-700">
          Fleet Selection Panel
        </h1>
        {/* Main container with two columns on large screens */}
        <div className="flex ">
          {/* Left: Selected Fleets */}
          <div className="bg-white p-5 border border-blue-100 rounded-lg shadow-sm w-[35%]">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Selected Fleets
            </h2>
            {selectedFleets.map((fleet, index) =>
              fleet ? (
                <p
                  key={index}
                  className="text-sm text-gray-700 mb-2 border-l-4 border-blue-600 pl-2"
                >
                  Trip {index + 1}:{" "}
                  <span className="font-medium">{fleet.title}</span>
                </p>
              ) : (
                <p
                  key={index}
                  className="text-sm text-red-500 mb-2 border-l-4 border-red-500 pl-2"
                >
                  Trip {index + 1}:{" "}
                  <span className="font-medium">No Fleet Selected</span>
                </p>
              )
            )}
          </div>

          {/* Right: Fleet Selection Section */}
          <div className="bg-white p-5 border border-blue-100 rounded-lg shadow-sm w-full ml-4">
            {/* Oneway Trip */}
            {searchData.tripType === "oneway" && (
              <div>
                <h3 className="text-lg font-bold text-blue-600 mb-2">
                  Oneway Trip
                </h3>
                {/* Only one segment for oneway, index = 0 */}
                <div className=" flex justify-between">
                  <p className="text-sm text-gray-700 mb-2 flex items-center">
                    {searchData.segments[0]?.from} ------
                    <span className="inline-block mx-1">
                      < IoIosAirplane size={34} />
                    </span>
                    ----- {searchData.segments[0]?.to}
                  </p>

                  <button
                    onClick={() => handleFleetSelection(0, filteredData[0])}
                    disabled={!!selectedFleets[0]}
                    className={`
                      py-2 px-4 rounded-md shadow-md text-sm font-medium 
                      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all
                      ${!!selectedFleets[0]
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-500 text-white"
                      }
                    `}
                  >
                    {selectedFleets[0] ? "Fleet Selected" : "Select Fleet"}
                  </button>
                </div>

                {/* Proceed button only shows up when a fleet is selected */}
                {selectedFleets[0] && (
                  <button
                    onClick={navigateToEnquiryPage}
                    className="bg-green-600 text-white py-2 px-4 rounded-md shadow-md 
                               hover:bg-green-500 focus:outline-none focus:ring-2 
                               focus:ring-green-400 focus:ring-offset-2 transition-all text-sm font-medium"
                  >
                    Proceed to Enquiry
                  </button>
                )}
              </div>
            )}

            {/* Roundtrip */}
            {searchData.tripType === "roundtrip" && (
              <div>
                <h3 className="text-lg font-bold text-blue-600 mb-2">
                  Roundtrip
                </h3>

                {searchData.segments.map((segment, index) => (
                  <div key={index} className="mb-5">
                    <p className="text-sm text-gray-700 mb-2">
                      {segment.from}------
                      <span className="inline-block mx-1">
                        < IoIosAirplane size={34} />
                      </span>
                      -----{segment.to}
                    </p>
                    <button
                      onClick={() => handleFleetSelection(index, filteredData[0])}
                      disabled={!!selectedFleets[index]}
                      className={`
                        py-2 px-4 rounded-md shadow-md text-sm font-medium 
                        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all 
                        ${!!selectedFleets[index]
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-500 text-white"
                        }
                      `}
                    >
                      {selectedFleets[index]
                        ? "Fleet Selected"
                        : index === 0
                          ? "Select Fleet for Departure"
                          : "Select Fleet for Return"}
                    </button>
                  </div>
                ))}

                {selectedFleets.every((fleet) => fleet) && (
                  <button
                    onClick={navigateToEnquiryPage}
                    className="bg-green-600 text-white py-2 px-4 rounded-md shadow-md 
                               hover:bg-green-500 focus:outline-none focus:ring-2 
                               focus:ring-green-400 focus:ring-offset-2 transition-all text-sm font-medium"
                  >
                    Proceed to Enquiry
                  </button>
                )}
              </div>
            )}

            {/* Multi City */}
            {searchData.tripType === "multicity" && (
              <div>
                <h3 className="text-lg font-bold text-blue-600 mb-2">
                  Multicity Trip
                </h3>

                {searchData.segments.map((segment, index) => (
                  <div key={index} className="mb-5 flex justify-between ">
                    <p className="text-md text-gray-700 mb-2 flex items-center">
                      <span className="font-medium line ">Trip {index + 1}:- </span>
                      {segment.from} ------
                      <span className="inline-block mx-1 ">
                        < IoIosAirplane size={34} />
                      </span>
                      -----{segment.to}
                    </p>
                    <button
                      onClick={() => handleFleetSelection(index, filteredData[0])}
                      disabled={!!selectedFleets[index]}
                      className={`
                        py-2 px-4 rounded-md shadow-md text-sm font-medium 
                        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all
                        ${!!selectedFleets[index]
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-500 text-white"
                        }
                      `}
                    >
                      {selectedFleets[index] ? "Fleet Selected" : "Select Fleet"}
                    </button>
                  </div>
                ))}

                {selectedFleets.every((fleet) => fleet) && (
                  <button
                    onClick={navigateToEnquiryPage}
                    className="bg-green-600 text-white py-2 px-4 rounded-md shadow-md 
                               hover:bg-green-500 focus:outline-none focus:ring-2 
                               focus:ring-green-400 focus:ring-offset-2 transition-all text-sm font-medium"
                  >
                    Proceed to Enquiry
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Filters + Fleet Listing */}
      <div className="flex w-full">
        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-[30%] bg-gray-100 p-4 border-r border-gray-300"
        >
          {/* Filter Header */}
          <motion.h2
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-xl font-bold text-gray-700 mb-4"
          >
            Filter Options
          </motion.h2>

          {/* Flight Type Checkboxes */}
          <div className="space-y-4">
            {[
              { label: "Charter Flights", id: "charter" },
              { label: "Private Jets", id: "private" },
              { label: "Business Jets", id: "business" },
            ].map((option) => {
              // Count the number of flights of each type
              const count = fleetData.filter(
                (flight) => flight.type === option.label
              ).length;

              return (
                <motion.div
                  key={option.id}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    id={option.id}
                    checked={selectedTypes.includes(option.label)}
                    onChange={() => handleTypeChange(option.label)}
                    className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
                  />
                  <label htmlFor={option.id} className="text-gray-600 cursor-pointer">
                    {option.label} ({count})
                  </label>
                </motion.div>
              );
            })}
          </div>

          {/* Price Range Slider */}
          <div className="mt-6">
            <label className="block text-gray-600 font-semibold mb-4">
              Price Range:
              <span className="text-blue-600 font-bold">
                {" "}
                ₹{minPrice.toLocaleString()}
              </span>
              -
              <span className="text-blue-600 font-bold">
                {" "}
                ₹{priceRange.toLocaleString()}
              </span>
            </label>
            <div className="relative w-full">
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  background: `linear-gradient(to right, #3b82f6 ${((priceRange - minPrice) / (maxPrice - minPrice)) * 100
                    }%, #e5e7eb ${((priceRange - minPrice) / (maxPrice - minPrice)) * 100
                    }%)`,
                }}
              />
            </div>

            {/* Message Box for current Price Selection */}
            {priceRange !== maxPrice && (
              <div className="mt-4 p-2 bg-blue-100 text-blue-800 rounded-lg shadow-md text-sm font-medium">
                Selected Price: ₹{priceRange.toLocaleString()}
              </div>
            )}
          </div>
        </motion.div>

        {/* Fleet Listing Section */}
        <div className="w-full bg-white flex flex-col items-center p-4">
          {/* Here you can list fleets for each segment, same code as before */}
          {searchData.segments.map((segment, segmentIndex) => (
            <div key={segmentIndex} className="mb-10 w-full">
              <h3 className="text-lg font-bold mb-2 flex ">
                Trip {segmentIndex + 1}: {segment.from} ------
                <span className="inline-block mx-1">
                  < IoIosAirplane size={34} />
                </span>
                ----- {segment.to}
              </h3>
              {filteredData.map((flight) => (
                <FlightCard
                  key={flight.id}
                  filteredData={[flight]}
                  onSelectFleet={(selectedFleet) =>
                    handleFleetSelection(segmentIndex, selectedFleet)
                  }
                  selectedFleet={selectedFleets[segmentIndex]} // Pass the selected fleet
                  tripType={searchData.tripType} // Pass the trip type
                  segment={segment} // Pass the segment data
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterAndFleetListing;
