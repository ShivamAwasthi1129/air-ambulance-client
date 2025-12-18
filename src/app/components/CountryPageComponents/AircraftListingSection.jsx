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
    <section className="relative py-20 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-[#d4af37]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-[#1e4976]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-1 bg-gradient-to-r from-[#d4af37] to-[#b87333] rounded-full" />
              <span className="text-[#d4af37] font-semibold text-sm uppercase tracking-wider">
                Our Fleet
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0a1628] mb-3">
              Luxury Charter Fleet
            </h2>
            <p className="text-gray-600 text-lg max-w-xl">
              Discover our premium collection of private jets and helicopters for your next journey
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 bg-gray-100 p-1.5 rounded-full">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter
                    ? "bg-[#0a1628] text-white shadow-lg"
                    : "text-gray-600 hover:text-[#0a1628]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Aircraft Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {aircrafts.map((aircraft, index) => (
            <motion.div
              key={aircraft._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="premium-card h-full">
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <img
                    src={
                      aircraft.aircraftGallery?.exterior?.["Front View"] ||
                      "https://images.pexels.com/photos/1441122/pexels-photo-1441122.jpeg"
                    }
                    alt={aircraft.fleetDetails.selectedModel}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                      {aircraft.featured && (
                        <span className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a1628] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          ⭐ Featured
                        </span>
                      )}
                      <span className="bg-[#0a1628]/80 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                        {aircraft.fleetDetails.selectedType || "Private Jet"}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleFavorite(aircraft._id)}
                      className="bg-white/90 backdrop-blur-sm hover:bg-white p-2.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    >
                      {favorites.has(aircraft._id) ? (
                        <FaHeart className="text-red-500 text-base" />
                      ) : (
                        <FaRegHeart className="text-gray-600 text-base" />
                      )}
                    </button>
                  </div>

                  {/* Quick View Button */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <button className="w-full py-3 bg-white/95 backdrop-blur-sm rounded-xl font-semibold text-[#0a1628] hover:bg-[#d4af37] hover:text-[#0a1628] transition-colors">
                      Quick View
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Title and Rating */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-[#0a1628] leading-tight group-hover:text-[#1e4976] transition-colors">
                      {aircraft.fleetDetails.selectedModel}
                    </h3>
                    <div className="flex items-center gap-1 bg-[#d4af37]/10 px-2 py-1 rounded-lg">
                      <FaStar className="text-[#d4af37] text-sm" />
                      <span className="text-sm font-bold text-[#0a1628]">4.9</span>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="text-center p-2 bg-gray-50 rounded-xl">
                      <FaUser className="text-[#1e4976] text-sm mx-auto mb-1" />
                      <span className="text-xs text-gray-600 block">
                        {aircraft.fleetDetails.seatCapacity}
                      </span>
                      <span className="text-[10px] text-gray-400">Seats</span>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-xl">
                      <FaSuitcase className="text-[#1e4976] text-sm mx-auto mb-1" />
                      <span className="text-xs text-gray-600 block">
                        {aircraft.fleetDetails.luggage || "4"}
                      </span>
                      <span className="text-[10px] text-gray-400">Bags</span>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-xl">
                      <FaTachometerAlt className="text-[#1e4976] text-sm mx-auto mb-1" />
                      <span className="text-xs text-gray-600 block">
                        {aircraft.fleetDetails.maxSpeed || "850"}
                      </span>
                      <span className="text-[10px] text-gray-400">km/h</span>
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-500">Starting from</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-[#0a1628]">
                          ${aircraft.fleetDetails.pricing || "2,500"}
                        </span>
                        <span className="text-sm text-gray-500">/hr</span>
                      </div>
                    </div>
                    <button className="w-12 h-12 rounded-full bg-[#0a1628] text-white flex items-center justify-center hover:bg-[#d4af37] hover:text-[#0a1628] transition-all duration-300 group-hover:scale-110">
                      <FaArrowRight className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="inline-flex items-center gap-3 bg-[#0a1628] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#1e4976] transition-all duration-300 group shadow-xl hover:shadow-2xl">
            <FaPlane className="group-hover:translate-x-1 transition-transform" />
            Explore Full Fleet
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
