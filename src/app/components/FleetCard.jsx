import React, { useState, useEffect } from "react";
import Link from "next/link";
const FlightCard = ({ filteredData = [], onSelectFleet, selectedFleet, tripType, segment }) => {
  const ImageSlider = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      if (images && images.length > 0) {
        const interval = setInterval(() => {
          setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
          );
        }, 4000);

        return () => clearInterval(interval);
      }
    }, [images]);

    const goToPrevious = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    };

    const goToNext = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    };

    return (
      <div className="relative w-full h-80 overflow-hidden">
        {images && images.length > 0 ? (
          <div
            className="flex transition-transform duration-700"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Slide ${index}`}
                className="w-full h-80 object-cover flex-shrink-0"
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-80 bg-gray-100 flex items-center justify-center">
            <span className="text-gray-500">No images available</span>
          </div>
        )}
        <button
          onClick={goToPrevious}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full z-10"
        >
          ◀
        </button>
        <button
          onClick={goToNext}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full z-10"
        >
          ▶
        </button>
      </div>
    );
  };

  return (
    <div>
      {filteredData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No flights match the selected criteria.
        </div>
      ) : (
        filteredData.map((flight, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 mt-8"
          >
            <div className="w-full md:w-[70%]">
              <ImageSlider images={flight.images} />
            </div>
            <div className="p-6 py-0 w-full md:w-1/3">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                {flight.title}
              </h2>
              <p className="text-gray-600 text-sm md:text-base mb-4">
                {flight.description}
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center">
                  <span className="text-blue-500 text-base">⏱️</span>
                  <span className="text-gray-700 ml-2 text-sm md:text-base">
                    Total Flight Time: <strong>{flight.flightTime}</strong>
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-500 text-base">👥</span>
                  <span className="text-gray-700 ml-2 text-sm md:text-base">
                    Passengers: <strong>{flight.pax}</strong>
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start space-y-2">
                <div>
                  <span className="text-3xl font-extrabold text-black">
                    ₹ {flight.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500"> / per flight</span>
                </div>
                <button
                  onClick={() => onSelectFleet(flight)}
                  className={`${
                    selectedFleet?.id === flight.id
                      ? "bg-green-600"
                      : "bg-gradient-to-r from-green-500 to-green-700"
                  } text-white text-sm font-semibold px-4 py-2 rounded shadow-lg focus:ring-2 focus:ring-green-300`}
                >
                  {selectedFleet?.id === flight.id
                    ? tripType === "oneway"
                      ? "Fleet Selected for Trip"
                      : tripType === "roundtrip"
                      ? `Fleet Selected from ${segment.from} to ${segment.to}`
                      : tripType === "multicity"
                      ? `Fleet Selected for Segment ${segment.from} - ${segment.to}`
                      : "Fleet Selected"
                    : "Select Fleet"}
                </button>

                <Link href="/fleetPreview">
                <button
                  onClick={() =>
                    console.log(`View details for flight ID: ${flight.id}`)
                  }
                  className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-semibold px-4 py-2 rounded shadow-lg hover:from-blue-600 hover:to-blue-800 focus:ring-2 focus:ring-blue-300"
                >
                  View Details
                </button>             
                </Link>
              
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FlightCard;
