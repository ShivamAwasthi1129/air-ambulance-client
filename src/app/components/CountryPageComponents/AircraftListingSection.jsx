"use client";
import React, { useState } from "react";
import {
  FaUser,
  FaSuitcase,
  FaTachometerAlt,
  FaStar,
  FaHeart,
  FaRegHeart,
  FaArrowRight,
  FaPlane,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function AircraftListingSection({ data }) {
  const [favorites, setFavorites] = useState(new Set());
  const [activeFilter, setActiveFilter] = useState("All");
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

  const filters = ["All", "Jets", "Helicopters", "Turboprop"];

  return (
    <section className="relative py-12 bg-[#f7f9fc] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Our Fleet Collection
            </h2>
            <p className="text-gray-600 text-sm">
              Browse our premium collection of private jets and helicopters
            </p>
          </div>

          {/* Filter Tabs - MMT Style */}
          <div className="flex flex-wrap gap-2 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter
                    ? "bg-[#008cff] text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Aircraft Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {aircrafts.map((aircraft, index) => (
            <motion.div
              key={aircraft._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#008cff]/30 hover:shadow-lg transition-all duration-300">
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <img
                    src={
                      aircraft.aircraftGallery?.exterior?.["Front View"] ||
                      "https://images.pexels.com/photos/1441122/pexels-photo-1441122.jpeg"
                    }
                    alt={aircraft.fleetDetails.selectedModel}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                    <div className="flex flex-col gap-1.5">
                      {aircraft.featured && (
                        <span className="bg-[#ff6b00] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                          Featured
                        </span>
                      )}
                      <span className="bg-[#051423]/80 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-md">
                        {aircraft.fleetDetails.selectedType || "Private Jet"}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleFavorite(aircraft._id)}
                      className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all duration-200 hover:scale-105"
                    >
                      {favorites.has(aircraft._id) ? (
                        <FaHeart className="text-red-500 text-sm" />
                      ) : (
                        <FaRegHeart className="text-gray-500 text-sm" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Title and Rating */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-base font-bold text-gray-900 leading-tight group-hover:text-[#008cff] transition-colors line-clamp-1">
                      {aircraft.fleetDetails.selectedModel}
                    </h3>
                    <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-md">
                      <FaStar className="text-green-600 text-xs" />
                      <span className="text-xs font-bold text-green-700">4.9</span>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="flex items-center justify-between gap-2 mb-4 text-gray-500">
                    <div className="flex items-center gap-1 text-xs">
                      <FaUser className="text-[#008cff]" />
                      <span>{aircraft.fleetDetails.seatCapacity} Seats</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <FaSuitcase className="text-[#008cff]" />
                      <span>{aircraft.fleetDetails.luggage || "4"} Bags</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <FaTachometerAlt className="text-[#008cff]" />
                      <span>{aircraft.fleetDetails.maxSpeed || "850"} km/h</span>
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-[10px] text-gray-400">Starting from</span>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-lg font-bold text-gray-900">
                          ${aircraft.fleetDetails.pricing || "2,500"}
                        </span>
                        <span className="text-xs text-gray-400">/hr</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-[#008cff] text-white text-xs font-semibold hover:bg-[#0070cc] transition-colors">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        {aircrafts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <button className="inline-flex items-center gap-2 border-2 border-[#008cff] text-[#008cff] px-6 py-3 rounded-xl font-semibold hover:bg-[#008cff] hover:text-white transition-all duration-200 text-sm">
              View All Aircraft
              <FaArrowRight className="text-xs" />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
