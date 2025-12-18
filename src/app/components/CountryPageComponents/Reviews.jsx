"use client";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaStar, FaQuoteLeft } from "react-icons/fa";
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
              Availability: 5,
              "Response Time": 5,
              Payments: 5,
              "Qualified Staff": 5,
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
              Availability: 5,
              "Response Time": 5,
              Payments: 5,
              "Qualified Staff": 5,
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
            size={14}
            className={i < count ? "text-[#d4af37]" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0f2744] to-[#0a1628]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#d4af37]/10 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 text-[#d4af37] px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            <FaStar className="text-xs" />
            Client Testimonials
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Real experiences from travelers who chose excellence
          </p>
        </motion.div>

        {/* Review Card */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prev}
            className="absolute top-1/2 -left-4 md:-left-8 transform -translate-y-1/2 z-20 
                       bg-white hover:bg-[#d4af37] text-[#0a1628]
                       w-12 h-12 md:w-14 md:h-14 rounded-full shadow-2xl 
                       transition-all duration-300 flex items-center justify-center
                       hover:scale-110"
          >
            <FaArrowLeft className="text-sm md:text-base" />
          </button>

          <button
            onClick={next}
            className="absolute top-1/2 -right-4 md:-right-8 transform -translate-y-1/2 z-20 
                       bg-white hover:bg-[#d4af37] text-[#0a1628]
                       w-12 h-12 md:w-14 md:h-14 rounded-full shadow-2xl 
                       transition-all duration-300 flex items-center justify-center
                       hover:scale-110"
          >
            <FaArrowRight className="text-sm md:text-base" />
          </button>

          {/* Main Review Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="glass-card-dark p-8 md:p-12 mx-4 md:mx-0"
            >
              {/* Quote Icon */}
              <div className="flex justify-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#f4d03f] flex items-center justify-center shadow-lg">
                  <FaQuoteLeft className="text-[#0a1628] text-2xl" />
                </div>
              </div>

              {/* Profile Section */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="relative mb-4">
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#d4af37] to-[#b87333] rounded-full blur-md opacity-50" />
                  <img
                    src={reviews[current].image}
                    alt={reviews[current].name}
                    className="relative w-24 h-24 md:w-28 md:h-28 rounded-full object-cover 
                             border-4 border-[#d4af37] shadow-2xl"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-[#0a1628] flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {reviews[current].name}
                </h3>

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-lg ${
                          i < Math.floor(reviews[current].rating)
                            ? "text-[#d4af37]"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[#d4af37] font-bold text-xl ml-2">
                    {reviews[current].rating.toFixed(1)}
                  </span>
                </div>

                <span className="text-white/50 text-sm">Verified Customer</span>
              </div>

              {/* Review Text */}
              <div className="mb-10">
                <p className="text-white/80 text-lg md:text-xl leading-relaxed text-center 
                            max-w-3xl mx-auto font-light italic">
                  "{reviews[current].review}"
                </p>
              </div>

              {/* Service Ratings */}
              <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                <h4 className="text-lg font-bold text-center text-white mb-6">
                  Service Ratings
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(reviews[current].serviceRatings).map(
                    ([key, value], index) => (
                      <div
                        key={index}
                        className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors border border-white/5"
                      >
                        <div className="flex flex-col items-center text-center">
                          <span className="font-medium text-white/70 text-sm mb-2 min-h-10 flex items-center">
                            {key}
                          </span>
                          {renderStars(value)}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-3">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === current
                    ? "bg-[#d4af37] w-8"
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
