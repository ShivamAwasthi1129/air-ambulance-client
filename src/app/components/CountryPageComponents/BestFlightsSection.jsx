"use client";
import { FaStar, FaPlane } from "react-icons/fa";
import { motion } from "framer-motion";

export default function BestFlightSection({ data }) {
  const countryName = typeof window !== "undefined"
    ? sessionStorage.getItem("country_name") || "WorldWide"
    : "WorldWide";
  const cards =
    data && Array.isArray(data) && data[0]?.cards && data[0].cards.length > 0
      ? data[0].cards
      : [
          {
            image: "https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg",
            price: 809,
            rating: 5,
            heading: "Royal flight salute in Dubai Airport",
            paragraph: "Custom VIP services available",
          },
        ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="inline-flex items-center gap-2 bg-[#e8f4ff] text-[#008cff] px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <FaPlane className="text-xs" />
            Best Services
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Best Charter Flights in <span className="text-[#008cff]">{countryName}</span>
          </h2>
          <p className="text-gray-600 text-sm">
            Charter flights aviation special add-on services
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card, index) => (
            <motion.div
              key={card._id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-[#008cff]/30 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-stretch">
                {/* Left content */}
                <div className="flex-1 p-4">
                  <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-[#008cff] transition-colors">
                    {card.heading}
                  </h3>
                  <p className="text-gray-500 text-xs mb-3 line-clamp-2">
                    {card.paragraph}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-xs font-bold">
                      ${card.price || 809} Onwards
                    </span>
                    <div className="flex items-center gap-1">
                      <FaStar className="text-yellow-400 text-xs" />
                      <span className="text-gray-600 text-xs font-medium">
                        {card.rating || 5}.0
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right image */}
                <div className="w-28 flex-shrink-0">
                  <img
                    src={card.image}
                    alt={card.heading}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
