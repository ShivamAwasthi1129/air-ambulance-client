"use client";
import React from "react";
import { FaPlane, FaHelicopter, FaAmbulance, FaArrowRight, FaCheckCircle, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

export default function HeroAviationSection({ data }) {
  const heroData = data && Array.isArray(data) && data[0]?.hero ? data[0].hero : null;
  const keyValues = heroData?.keyValues || [];

  return (
    <section className="relative bg-white py-12 md:py-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23008cff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 bg-[#e8f4ff] text-[#008cff] px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <FaStar className="text-xs" />
            Premium Aviation Services
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            {heroData?.subtitle || "Book Private Jets & Charter Flights"}
          </h2>
          <p className="text-gray-600 text-base max-w-2xl mx-auto">
            Experience luxury aviation with Charter Flights Aviation - your trusted partner for premium air travel
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-5"
          >
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              {heroData?.paragraph?.map((p, idx) => (
                <p key={idx} className="text-gray-700 text-base leading-relaxed mb-3 last:mb-0">
                  {p}
                </p>
              ))}

              {!heroData?.paragraph && (
                <p className="text-gray-700 text-base leading-relaxed">
                  Charter Flights Aviation is a leading provider of premium air charter services, 
                  offering private jet rentals, business jets, and helicopter charters at competitive prices.
                  We ensure world-class safety, comfort, and personalized service for every journey.
                </p>
              )}
            </div>

            {/* Features List */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2 bg-white rounded-xl p-3 border border-gray-100 hover:border-[#008cff]/30 transition-colors group"
                >
                  <div className="w-5 h-5 rounded-full bg-[#e8f4ff] flex items-center justify-center flex-shrink-0 group-hover:bg-[#008cff] transition-colors">
                    <FaCheckCircle className="text-[#008cff] text-[10px] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-gray-700 text-sm font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Service Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-[#051423] to-[#1e4976] p-5 rounded-2xl shadow-xl">
              {/* Header */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-[#008cff] rounded-lg flex items-center justify-center">
                  <FaPlane className="text-white text-sm" />
                </div>
                <span className="text-white font-bold text-lg">Our Services</span>
              </div>

              {/* Service Cards */}
              <div className="space-y-3">
                {keyValues.length > 0 ? (
                  keyValues.slice(0, 4).map((item, idx) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="group bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-xl p-4 cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#008cff] flex items-center justify-center group-hover:scale-105 transition-transform">
                          <FaPlane className="text-white text-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white text-sm truncate">{item.key}</h3>
                          <p className="text-[#008cff] text-xs mt-0.5">{item.value}</p>
                        </div>
                        <FaArrowRight className="text-white/30 group-hover:text-[#008cff] text-xs transition-colors" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  [
                    { key: "Private Jets", value: "Starting $3,500/hr", icon: FaPlane },
                    { key: "Helicopters", value: "Starting $1,200/hr", icon: FaHelicopter },
                    { key: "Air Ambulance", value: "24/7 Available", icon: FaAmbulance },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="group bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-xl p-4 cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#008cff] flex items-center justify-center group-hover:scale-105 transition-transform">
                          <item.icon className="text-white text-sm" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-sm">{item.key}</h3>
                          <p className="text-[#008cff] text-xs mt-0.5">{item.value}</p>
                        </div>
                        <FaArrowRight className="text-white/30 group-hover:text-[#008cff] text-xs transition-colors" />
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* CTA Button */}
              <button className="w-full mt-5 py-3 rounded-xl bg-[#008cff] text-white font-semibold hover:bg-[#0070cc] transition-colors text-sm flex items-center justify-center gap-2">
                Get Instant Quote
                <FaArrowRight className="text-xs" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
