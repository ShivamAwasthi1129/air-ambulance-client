import React from "react";

const FlightCard = ({ image, title, description, flightTime, pax, price }) => {
  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
      <img
        className="w-full h-56 object-cover"
        src={image}
        alt={title}
      />
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-gray-500 text-sm">⏱️</span>
            <span className="text-gray-700 ml-2 text-sm font-medium">
              Total Flight Time: {flightTime}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-gray-500 text-sm">👥</span>
            <span className="text-gray-700 ml-2 text-sm font-medium">
              Pax: {pax}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-green-600">₹ {price}/-</span>
          <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-semibold px-4 py-2 rounded shadow-lg hover:from-blue-600 hover:to-blue-800 focus:ring-2 focus:ring-blue-300">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
