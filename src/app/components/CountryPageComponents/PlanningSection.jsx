"use client";
import React from "react";
import {
  FaPlane,
  FaTachometerAlt,
  FaSuitcase,
  FaUsers,
  FaStar,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function PlanningSection() {
  const flightCards = [
    {
      id: 1,
      duration: "4-5 Hrs",
      from: "DXB",
      to: "DEL",
      fromCity: "Dubai",
      toCity: "New Delhi",
      jets: [
        { type: "Light Jets", capacity: "3-4 Guests", status: "$ 8,500" },
        { type: "Mid Size Jets", capacity: "5-7 Guests", status: "$ 12,000" },
        { type: "Super Mid Jets", capacity: "9-13 Guests", status: "$ 18,500" },
        { type: "Large Business", capacity: "9-32 Guests", status: "$ 28,000" },
      ],
    },
    {
      id: 2,
      duration: "2-3 Hrs",
      from: "BOM",
      to: "DXB",
      fromCity: "Mumbai",
      toCity: "Dubai",
      jets: [
        { type: "Light Jets", capacity: "3-4 Guests", status: "$ 6,500" },
        { type: "Mid Size Jets", capacity: "5-7 Guests", status: "$ 9,800" },
        { type: "Super Mid Jets", capacity: "9-13 Guests", status: "$ 15,000" },
        { type: "Large Business", capacity: "9-32 Guests", status: "$ 22,000" },
      ],
    },
    {
      id: 3,
      duration: "6-7 Hrs",
      from: "LHR",
      to: "DXB",
      fromCity: "London",
      toCity: "Dubai",
      jets: [
        { type: "Light Jets", capacity: "3-4 Guests", status: "$ 15,000" },
        { type: "Mid Size Jets", capacity: "5-7 Guests", status: "$ 22,000" },
        { type: "Super Mid Jets", capacity: "9-13 Guests", status: "$ 35,000" },
        { type: "Large Business", capacity: "9-32 Guests", status: "$ 55,000" },
      ],
    },
    {
      id: 4,
      duration: "3-4 Hrs",
      from: "SIN",
      to: "BKK",
      fromCity: "Singapore",
      toCity: "Bangkok",
      jets: [
        { type: "Light Jets", capacity: "3-4 Guests", status: "$ 5,200" },
        { type: "Mid Size Jets", capacity: "5-7 Guests", status: "$ 7,800" },
        { type: "Super Mid Jets", capacity: "9-13 Guests", status: "$ 12,500" },
        { type: "Large Business", capacity: "9-32 Guests", status: "$ 18,000" },
      ],
    },
  ];

  const jetTypes = [
    {
      type: "Light Jets",
      guests: "2-4 guests",
      desc: "Ideal for short trips",
      color: "from-blue-500 to-blue-600",
    },
    {
      type: "Mid-size Jets",
      guests: "5-7 guests",
      desc: "Comfortable cabin",
      color: "from-purple-500 to-purple-600",
    },
    {
      type: "Super Mid-size",
      guests: "9-13 guests",
      desc: "Meeting cabins",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      type: "Large Business",
      guests: "9-13 guests",
      desc: "Conference cabin",
      color: "from-orange-500 to-orange-600",
    },
    {
      type: "Super Luxury",
      guests: "9-32 guests",
      desc: "Private bedroom",
      color: "from-[#008cff] to-[#0057a8]",
    },
  ];

  return (
    <section className="relative py-12 bg-[#f7f9fc] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 bg-[#e8f4ff] text-[#008cff] px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <FaPlane className="text-xs" />
            Flight Planning
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Plan Your Private Flight
          </h2>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            Discover various options from turbo-prop flights to luxurious private jets
          </p>
        </motion.div>

        {/* Jet Types Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-10"
        >
          {jetTypes.map((jet, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-xl p-4 border border-gray-100 hover:border-[#008cff]/30 transition-all duration-200 cursor-pointer hover:shadow-md"
            >
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-r ${jet.color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}
              >
                <FaPlane className="text-white text-sm" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm mb-0.5">{jet.type}</h4>
              <p className="text-[#008cff] font-semibold text-xs mb-1">{jet.guests}</p>
              <p className="text-gray-500 text-xs">{jet.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#051423] to-[#1e4976] rounded-2xl p-5 mb-10 shadow-lg"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#008cff] flex items-center justify-center flex-shrink-0">
                <FaCheckCircle className="text-white" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm mb-1">
                  Customized Charter Services
                </h4>
                <p className="text-white/70 text-xs">
                  Pricing may vary based on fleet availability, clearances, and special permissions.
                </p>
              </div>
            </div>
            <button className="bg-[#008cff] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#0070cc] transition-colors flex items-center gap-2 whitespace-nowrap text-sm">
              Get Quote
              <FaArrowRight className="text-xs" />
            </button>
          </div>
        </motion.div>

        {/* Flight Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {flightCards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#008cff]/30 hover:shadow-lg transition-all duration-300"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-[#051423] to-[#1e4976] p-5 text-center">
                <p className="text-[#008cff] text-xs font-medium mb-2">
                  ✈️ Approx {card.duration}
                </p>

                {/* Route */}
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{card.from}</div>
                    <div className="text-[10px] text-white/60">{card.fromCity}</div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-6 h-px bg-[#008cff]" />
                    <FaPlane className="text-[#008cff] text-sm mx-1" />
                    <div className="w-6 h-px bg-[#008cff]" />
                  </div>

                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{card.to}</div>
                    <div className="text-[10px] text-white/60">{card.toCity}</div>
                  </div>
                </div>

                {/* Icons */}
                <div className="flex justify-center gap-4">
                  {[
                    { icon: FaTachometerAlt, label: "Speed" },
                    { icon: FaSuitcase, label: "Luggage" },
                    { icon: FaUsers, label: "Guests" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-1 text-white/50 text-[10px]">
                      <item.icon className="text-[#008cff] text-[10px]" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Jet Options */}
              <div className="p-4 space-y-2">
                {card.jets.map((jet, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg hover:bg-[#e8f4ff] transition-colors cursor-pointer group/item"
                  >
                    <div>
                      <span className="text-gray-900 font-semibold text-xs">{jet.type}</span>
                      <span className="text-gray-500 text-[10px] block">{jet.capacity}</span>
                    </div>
                    <span className="text-gray-900 font-bold text-xs group-hover/item:text-[#008cff] transition-colors">
                      {jet.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Rating Footer */}
              <div className="px-4 pb-4">
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex text-[#008cff]">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-xs" />
                    ))}
                  </div>
                  <span className="text-gray-500 text-[10px]">Top Rated Route</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
