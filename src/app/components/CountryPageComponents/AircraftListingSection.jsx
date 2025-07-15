import React, { useState } from 'react';
import {
  FaUser,
  FaSuitcase,
  FaFan,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaArrowRight,
  FaStar,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";

export default function AircraftListingSection({data}) {
  const [favorites, setFavorites] = useState(new Set());
  const aircrafts = data && Array.isArray(data) && data[0]?.fleets ? data[0].fleets : [];

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  return (
    <section className="px-4 py-12 md:px-12 bg-gradient-to-br from-slate-50 to-blue-50 ">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full"></div>
              <span className="text-blue-600 font-medium text-sm uppercase tracking-wide">Premium Aviation</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-2">
              Luxury Charter Flights
            </h2>
            <p className="text-gray-600 text-lg">
              Experience premium aviation with our fleet of helicopters and private jets
            </p>
          </div>
          
          {/* <div className="flex items-center gap-4 self-end md:self-auto">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Navigate</span>
            </div>
            <div className="flex space-x-3">
              <button className="bg-white hover:bg-gray-50 border border-gray-200 p-3 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                <FaArrowLeft className="text-gray-600" />
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
                <FaArrowRight />
              </button>
            </div>
          </div> */}
        </div>

        {/* Aircraft Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {aircrafts.map((aircraft) => (
            <div
              key={aircraft._id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img
                  src={
                    aircraft.aircraftGallery?.exterior?.["Front View"] ||
                    "https://images.pexels.com/photos/1441122/pexels-photo-1441122.jpeg"
                  }
                  alt={aircraft.fleetDetails.selectedModel}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                  {aircraft.featured && (
                    <span className="bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                  <button
                    onClick={() => toggleFavorite(aircraft.id)}
                    className="ml-auto bg-white/90 backdrop-blur-sm hover:bg-white p-2 rounded-full shadow-sm transition-all duration-200"
                  >
                    {favorites.has(aircraft.id) ? (
                      <FaHeart className="text-red-500 text-sm" />
                    ) : (
                      <FaRegHeart className="text-gray-600 text-sm" />
                    )}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Title and Rating */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                    {aircraft.fleetDetails.selectedModel}
                  </h3>
                  <div className="flex items-center gap-1 ml-2">
                    <FaStar className="text-yellow-400 text-sm" />
                    <span className="text-sm font-medium text-gray-900">4.5</span>
                    <span className="text-xs text-gray-500">26</span>
                  </div>
                </div>

                {/* Specifications */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="bg-blue-50 p-1.5 rounded-lg">
                      <FaUser className="text-blue-600 text-xs" />
                    </div>
                    <span className="text-sm">{aircraft.fleetDetails.seatCapacity} passengers</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="bg-blue-50 p-1.5 rounded-lg">
                      <FaSuitcase className="text-blue-600 text-xs" />
                    </div>
                    <span className="text-sm">{aircraft.fleetDetails.luggage}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="bg-blue-50 p-1.5 rounded-lg">
                      <FaFan className="text-blue-600 text-xs" />
                    </div>
                    <span className="text-sm">{aircraft.fleetDetails.maxSpeed} km/h</span>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-900">${aircraft.fleetDetails.pricing}</span>
                      <span className="text-sm text-gray-500">/hr</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}