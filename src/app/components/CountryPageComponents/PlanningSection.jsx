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
      desc: "Ideal for short trips with recliner seats",
      color: "from-blue-500 to-blue-600",
    },
    {
      type: "Mid-size Jets",
      guests: "5-7 guests",
      desc: "Comfortable spacious cabin",
      color: "from-purple-500 to-purple-600",
    },
    {
      type: "Super Mid-size",
      guests: "9-13 guests",
      desc: "Meeting cabins with sofa seating",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      type: "Large Business",
      guests: "9-13 guests",
      desc: "Conference cabin included",
      color: "from-orange-500 to-orange-600",
    },
    {
      type: "Super Luxury",
      guests: "9-32 guests",
      desc: "Private bedroom & conference room",
      color: "from-[#d4af37] to-[#b87333]",
    },
  ];

  return (
    <section className="relative py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#d4af37]/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#0a1628] text-[#d4af37] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FaPlane className="text-xs" />
            Flight Planning
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0a1628] mb-4">
            Plan Your Private Flight
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover various options from turbo-prop flights to luxurious private jets with premium seating
          </p>
        </motion.div>

        {/* Jet Types Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16"
        >
          {jetTypes.map((jet, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#d4af37]/30 cursor-pointer"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-r ${jet.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <FaPlane className="text-white text-lg" />
              </div>
              <h4 className="font-bold text-[#0a1628] mb-1">{jet.type}</h4>
              <p className="text-[#d4af37] font-semibold text-sm mb-2">{jet.guests}</p>
              <p className="text-gray-500 text-xs">{jet.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#0a1628] to-[#1e4976] rounded-3xl p-8 mb-16 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#d4af37] flex items-center justify-center flex-shrink-0">
                <FaCheckCircle className="text-[#0a1628] text-xl" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg mb-2">
                  Customized Charter Services
                </h4>
                <p className="text-white/70 text-sm">
                  Our charter flights provide customized private jet rentals with additional
                  services. Pricing may vary based on fleet availability, clearances, and
                  special permissions.
                </p>
              </div>
            </div>
            <button className="bg-[#d4af37] text-[#0a1628] px-6 py-3 rounded-full font-bold hover:bg-[#f4d03f] transition-colors flex items-center gap-2 whitespace-nowrap">
              Get Quote
              <FaArrowRight />
            </button>
          </div>
        </motion.div>

        {/* Flight Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {flightCards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-[#0a1628] to-[#1e4976] p-6 text-center">
                <p className="text-[#d4af37] text-sm font-medium mb-3">
                  ✈️ Approx {card.duration}
                </p>

                {/* Route */}
                <div className="flex items-center justify-center gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{card.from}</div>
                    <div className="text-xs text-white/60">{card.fromCity}</div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-8 h-px bg-[#d4af37]" />
                    <FaPlane className="text-[#d4af37] text-lg mx-2" />
                    <div className="w-8 h-px bg-[#d4af37]" />
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{card.to}</div>
                    <div className="text-xs text-white/60">{card.toCity}</div>
                  </div>
                </div>

                {/* Icons */}
                <div className="flex justify-center gap-4">
                  {[
                    { icon: FaTachometerAlt, label: "Speed" },
                    { icon: FaSuitcase, label: "Luggage" },
                    { icon: FaUsers, label: "Guests" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-1 text-white/60 text-xs">
                      <item.icon className="text-[#d4af37] text-xs" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Jet Options */}
              <div className="p-5 space-y-3">
                {card.jets.map((jet, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-[#d4af37]/10 transition-colors cursor-pointer group/item"
                  >
                    <div>
                      <span className="text-[#0a1628] font-semibold text-sm">{jet.type}</span>
                      <span className="text-gray-500 text-xs block">{jet.capacity}</span>
                    </div>
                    <span className="text-[#0a1628] font-bold text-sm group-hover/item:text-[#d4af37] transition-colors">
                      {jet.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Rating Footer */}
              <div className="px-5 pb-5">
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex text-[#d4af37]">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-sm" />
                    ))}
                  </div>
                  <span className="text-gray-500 text-xs">Top Rated Route</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
