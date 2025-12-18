"use client";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaStar, FaQuoteLeft, FaCheckCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function ReviewSection({ data }) {
  const reviews =
    data && Array.isArray(data) && data[0]?.reviews && data[0].reviews.length > 0
      ? data[0].reviews.map((r) => ({
          name: r.name,
          rating:
            r.services && r.services.length > 0
              ? r.services.reduce((sum, s) => sum + (s.rating || 0), 0) / r.services.length
              : 5,
          image: r.image,
          review: r.article,
          serviceRatings: r.services
            ? Object.fromEntries(r.services.map((s) => [s.name, Math.round(s.rating)]))
            : {},
        }))
      : [
          {
            name: "Luca Rossi",
            rating: 4.8,
            image: "https://randomuser.me/api/portraits/men/32.jpg",
            review:
              "Thank you very much to Charter Flights Aviation for making my air journey so smooth and comfortable. The service was impeccable from start to finish.",
            serviceRatings: {
              Service: 5,
              "Value for money": 5,
              "Flight quality": 5,
              Comfortness: 5,
            },
          },
          {
            name: "Sarah Mitchell",
            rating: 5.0,
            image: "https://randomuser.me/api/portraits/women/44.jpg",
            review:
              "Absolutely outstanding experience! The private jet was luxurious and the crew was extremely professional. Will definitely book again.",
            serviceRatings: {
              Service: 5,
              "Value for money": 5,
              "Flight quality": 5,
              Comfortness: 5,
            },
          },
        ];

  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % reviews.length);
  const prev = () => setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);

  const renderStars = (count) => {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <FaStar
            key={i}
            size={12}
            className={i < count ? "text-[#008cff]" : "text-gray-200"}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="relative py-12 overflow-hidden bg-gradient-to-b from-[#051423] to-[#1e4976]">
      <div className="relative max-w-5xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 bg-white/10 text-[#008cff] px-4 py-1.5 rounded-full text-sm font-semibold mb-4 backdrop-blur-sm">
            <FaStar className="text-xs" />
            Client Reviews
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            What Our Clients Say
          </h2>
          <p className="text-white/60 text-sm max-w-lg mx-auto">
            Real experiences from travelers who chose excellence
          </p>
        </motion.div>

        {/* Review Card */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prev}
            className="absolute top-1/2 -left-2 md:-left-6 transform -translate-y-1/2 z-20 
                       bg-white hover:bg-[#008cff] text-gray-700 hover:text-white
                       w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg 
                       transition-all duration-200 flex items-center justify-center"
          >
            <FaArrowLeft className="text-sm" />
          </button>

          <button
            onClick={next}
            className="absolute top-1/2 -right-2 md:-right-6 transform -translate-y-1/2 z-20 
                       bg-white hover:bg-[#008cff] text-gray-700 hover:text-white
                       w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg 
                       transition-all duration-200 flex items-center justify-center"
          >
            <FaArrowRight className="text-sm" />
          </button>

          {/* Main Review Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 mx-2 md:mx-0 border border-white/10"
            >
              {/* Profile Section */}
              <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                <div className="relative">
                  <img
                    src={reviews[current].image}
                    alt={reviews[current].name}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-3 border-[#008cff] shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                    <FaCheckCircle className="text-white text-xs" />
                  </div>
                </div>

                <div className="text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                    {reviews[current].name}
                  </h3>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          className={`text-sm ${
                            i < Math.floor(reviews[current].rating)
                              ? "text-[#008cff]"
                              : "text-gray-500"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[#008cff] font-bold text-lg ml-1">
                      {reviews[current].rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-white/50 text-xs">Verified Customer</span>
                </div>
              </div>

              {/* Review Text */}
              <div className="mb-6">
                <FaQuoteLeft className="text-[#008cff] text-xl mb-3" />
                <p className="text-white/80 text-base leading-relaxed italic">
                  "{reviews[current].review}"
                </p>
              </div>

              {/* Service Ratings */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <h4 className="text-sm font-semibold text-white mb-4">Service Ratings</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(reviews[current].serviceRatings).slice(0, 4).map(
                    ([key, value], index) => (
                      <div
                        key={index}
                        className="bg-white/5 rounded-lg p-3 text-center"
                      >
                        <span className="text-white/70 text-xs block mb-2">{key}</span>
                        {renderStars(value)}
                      </div>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  index === current
                    ? "bg-[#008cff] w-6"
                    : "bg-white/30 hover:bg-white/50 w-2"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
