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

const aircrafts = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/1441122/pexels-photo-1441122.jpeg",
    title: "Single Engine Helicopter",
    rating: 4.8,
    reviews: 24,
    price: 18,
    originalPrice: 25,
    passengers: 4,
    luggage: 2,
    range: 246,
    locations: 3,
    featured: true,
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg",
    title: "Private Jet",
    rating: 4.9,
    reviews: 18,
    price: 45,
    originalPrice: 60,
    passengers: 8,
    luggage: 6,
    range: 1200,
    locations: 12,
    featured: false,
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/912060/pexels-photo-912060.jpeg",
    title: "Luxury Private Jet",
    rating: 5.0,
    reviews: 31,
    price: 85,
    originalPrice: 110,
    passengers: 12,
    luggage: 8,
    range: 2500,
    locations: 25,
    featured: true,
  },
  {
    id: 4,
    image: "https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg",
    title: "Twin Engine Helicopter",
    rating: 4.7,
    reviews: 15,
    price: 32,
    originalPrice: 42,
    passengers: 6,
    luggage: 4,
    range: 485,
    locations: 8,
    featured: false,
  },
  {
    id: 5,
    image: "https://images.pexels.com/photos/3379007/pexels-photo-3379007.jpeg",
    title: "Executive Helicopter",
    rating: 4.6,
    reviews: 12,
    price: 28,
    originalPrice: 35,
    passengers: 5,
    luggage: 3,
    range: 320,
    locations: 6,
    featured: false,
  },
  {
    id: 6,
    image: "https://images.pexels.com/photos/1556823/pexels-photo-1556823.jpeg",
    title: "Sport Helicopter",
    rating: 4.5,
    reviews: 8,
    price: 22,
    originalPrice: 30,
    passengers: 3,
    luggage: 2,
    range: 180,
    locations: 4,
    featured: false,
  },
  {
    id: 7,
    image: "https://images.pexels.com/photos/1309644/pexels-photo-1309644.jpeg",
    title: "VIP Private Jet",
    rating: 4.9,
    reviews: 27,
    price: 95,
    originalPrice: 120,
    passengers: 14,
    luggage: 10,
    range: 3200,
    locations: 35,
    featured: true,
  },
  {
    id: 8,
    image: "https://images.pexels.com/photos/754263/pexels-photo-754263.jpeg",
    title: "Ultra Luxury Jet",
    rating: 5.0,
    reviews: 42,
    price: 150,
    originalPrice: 200,
    passengers: 16,
    luggage: 12,
    range: 4500,
    locations: 50,
    featured: true,
  },
];

export default function AircraftListingSection() {
  const [favorites, setFavorites] = useState(new Set());

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
    <section className="px-4 py-12 md:px-12 bg-gradient-to-br from-slate-50 to-blue-50">
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
          
          <div className="flex items-center gap-4 self-end md:self-auto">
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
          </div>
        </div>

        {/* Aircraft Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {aircrafts.map((aircraft) => (
            <div
              key={aircraft.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img
                  src={aircraft.image}
                  alt={aircraft.title}
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

                {/* Discount Badge */}
                {/* {aircraft.originalPrice > aircraft.price && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{Math.round(((aircraft.originalPrice - aircraft.price) / aircraft.originalPrice) * 100)}%
                    </span>
                  </div>
                )} */}
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Title and Rating */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                    {aircraft.title}
                  </h3>
                  <div className="flex items-center gap-1 ml-2">
                    <FaStar className="text-yellow-400 text-sm" />
                    <span className="text-sm font-medium text-gray-900">{aircraft.rating}</span>
                    <span className="text-xs text-gray-500">({aircraft.reviews})</span>
                  </div>
                </div>

                {/* Specifications */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="bg-blue-50 p-1.5 rounded-lg">
                      <FaUser className="text-blue-600 text-xs" />
                    </div>
                    <span className="text-sm">{aircraft.passengers} passengers</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="bg-blue-50 p-1.5 rounded-lg">
                      <FaSuitcase className="text-blue-600 text-xs" />
                    </div>
                    <span className="text-sm">{aircraft.luggage} bags</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="bg-blue-50 p-1.5 rounded-lg">
                      <FaFan className="text-blue-600 text-xs" />
                    </div>
                    <span className="text-sm">{aircraft.range} nm</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="bg-blue-50 p-1.5 rounded-lg">
                      <FaMapMarkerAlt className="text-blue-600 text-xs" />
                    </div>
                    <span className="text-sm">{aircraft.locations} locations</span>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-900">${aircraft.price}</span>
                      <span className="text-sm text-gray-500">/min</span>
                    </div>
                    {aircraft.originalPrice > aircraft.price && (
                      <span className="text-sm text-gray-400 line-through">${aircraft.originalPrice}</span>
                    )}
                  </div>
                  {/* <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg">
                    Book Now
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-10">
          <button className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg">
            View All Aircraft
          </button>
        </div>
      </div>
    </section>
  );
}