"use client";
import React from "react";
import { FaPlane, FaHelicopter, FaAmbulance, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function HeroAviationSection({ data }) {
  const heroData = data && Array.isArray(data) && data[0]?.hero ? data[0].hero : null;
  const keyValues = heroData?.keyValues || [];

  const serviceIcons = {
    "Private Jets": FaPlane,
    "Helicopters": FaHelicopter,
    "Air Ambulance": FaAmbulance,
  };

  return (
    <section className="relative bg-white px-6 py-20 md:px-16 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#d4af37]/10 to-transparent rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#1e4976]/10 to-transparent rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#0a1628] text-[#d4af37] px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FaPlane className="text-xs" />
            <span>Premium Aviation Services</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0a1628] mb-4">
            {heroData?.subtitle || "Book Private Jets & Charter Flights"}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Experience luxury aviation with Charter Flights Aviation - your trusted partner for premium air travel
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-3 space-y-6"
          >
            <div className="relative">
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-[#d4af37] to-[#b87333] rounded-full" />
              
              {heroData?.paragraph?.map((p, idx) => (
                <p key={idx} className="text-gray-700 text-lg leading-relaxed mb-4 pl-4">
                  {p}
                </p>
              ))}

              {!heroData?.paragraph && (
                <p className="text-gray-700 text-lg leading-relaxed pl-4">
                  Charter Flights Aviation is a leading provider of premium air charter services, 
                  offering private jet rentals, business jets, and helicopter charters at competitive prices.
                  We ensure world-class safety, comfort, and personalized service for every journey.
                </p>
              )}
            </div>

            {/* Features List */}
            <div className="grid sm:grid-cols-2 gap-4 pt-6">
              {[
                "Worldwide Coverage",
                "24/7 Concierge Service",
                "Flexible Scheduling",
                "Premium Safety Standards",
                "Luxury Amenities",
                "Competitive Pricing"
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-6 h-6 rounded-full bg-[#d4af37]/20 flex items-center justify-center group-hover:bg-[#d4af37] transition-colors">
                    <FaCheckCircle className="text-[#d4af37] text-xs group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-gray-700 font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 inline-flex items-center gap-2 bg-[#0a1628] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#1e4976] transition-colors group"
            >
              Get a Quote
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Right: Service Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-to-br from-[#0a1628] to-[#1e4976] p-6 rounded-3xl shadow-2xl">
              {/* Header Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-xs font-semibold bg-[#d4af37] text-[#0a1628] rounded-full px-3 py-1">
                  Helicopters
                </span>
                <span className="text-xs font-semibold bg-white/20 text-white rounded-full px-3 py-1">
                  Private Jets
                </span>
                <span className="text-xs font-semibold bg-white/20 text-white rounded-full px-3 py-1">
                  Turboprop
                </span>
              </div>

              {/* Service Cards */}
              <div className="space-y-4">
                {keyValues.length > 0 ? (
                  keyValues.map((item, idx) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 rounded-2xl p-5 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#b87333] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <FaPlane className="text-white text-xl" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-lg">{item.key}</h3>
                          <p className="text-[#d4af37] text-sm font-medium mt-1">{item.value}</p>
                        </div>
                        <FaArrowRight className="text-white/50 group-hover:text-[#d4af37] group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  // Default cards if no data
                  [
                    { key: "Private Jets", value: "Starting $3,500/hr" },
                    { key: "Helicopters", value: "Starting $1,200/hr" },
                    { key: "Air Ambulance", value: "24/7 Available" },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 rounded-2xl p-5 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#b87333] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <FaPlane className="text-white text-xl" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-lg">{item.key}</h3>
                          <p className="text-[#d4af37] text-sm font-medium mt-1">{item.value}</p>
                        </div>
                        <FaArrowRight className="text-white/50 group-hover:text-[#d4af37] group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Bottom CTA */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <button className="w-full py-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a1628] font-bold hover:shadow-lg hover:shadow-[#d4af37]/30 transition-all">
                  View All Services
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
