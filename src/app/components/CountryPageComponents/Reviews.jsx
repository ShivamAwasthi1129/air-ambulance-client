import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaStar, FaQuoteLeft } from "react-icons/fa";


export default function ReviewSection({ data }) {
  const reviews =
    data && Array.isArray(data) && data[0]?.reviews && data[0].reviews.length > 0
      ? data[0].reviews.map((r) => ({
        name: r.name,
        rating: r.services && r.services.length > 0
          ? r.services.reduce((sum, s) => sum + (s.rating || 0), 0) / r.services.length
          : 5,
        image: r.image,
        review: r.article,
        serviceRatings: r.services
          ? Object.fromEntries(r.services.map((s) => [s.name, Math.round(s.rating)]))
          : {},
      }))
      : [
        // fallback static reviews if API data is missing
        {
          name: "Luca Rossi",
          rating: 4.0,
          image: "https://randomuser.me/api/portraits/men/32.jpg",
          review:
            "Thank you very much to Charter Flights Aviation for making my air journey so smooth and comfortable...",
          serviceRatings: {
            Service: 5,
            "Value for money": 5,
            "Flight quality": 5,
            Comfortness: 5,
            Availability: 5,
            "Activation Time": 5,
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
      <div className="flex gap-0.5 text-amber-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <FaStar
            key={i}
            size={14}
            className={i < count ? 'text-amber-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  const renderMainStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex gap-1 text-amber-400 justify-center mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <FaStar
            key={i}
            size={18}
            className={i < fullStars ? 'text-amber-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-6 px-4">
      <div className="max-w-5xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Real experiences from our valued customers
          </p>
        </div>

        {/* Review Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={prev}
            className="absolute top-1/2 -left-4 md:-left-8 transform -translate-y-1/2 z-10 
                     bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 
                     w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg hover:shadow-xl 
                     transition-all duration-300 flex items-center justify-center
                     border border-blue-100 hover:border-blue-200"
          >
            <FaArrowLeft className="text-sm md:text-base" />
          </button>

          <button
            onClick={next}
            className="absolute top-1/2 -right-4 md:-right-8 transform -translate-y-1/2 z-10 
                     bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 
                     w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg hover:shadow-xl 
                     transition-all duration-300 flex items-center justify-center
                     border border-blue-100 hover:border-blue-200"
          >
            <FaArrowRight className="text-sm md:text-base" />
          </button>

          {/* Review Card */}
          <div className="bg-white rounded-2xl shadow-2xl border border-white/20 backdrop-blur-sm 
                        p-4 md:p-6 mx-4 md:mx-0 transform transition-all duration-500 hover:shadow-3xl">

            {/* Quote Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full">
                <FaQuoteLeft className="text-white text-sm" />
              </div>
            </div>

            {/* Profile Section */}
            <div className="flex flex-col items-center text-center mb-4">
              <div className="relative mb-3">
                <img
                  src={reviews[current].image}
                  alt={reviews[current].name}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover shadow-xl 
                           border-4 border-white ring-4 ring-blue-100"
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
              </div>

              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                {reviews[current].name}
              </h3>

              {renderMainStars(reviews[current].rating)}

              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {reviews[current].rating.toFixed(1)}/5.0
              </span>
            </div>

            {/* Review Text */}
            <div className="mb-4">
              <p className="text-gray-700 text-sm md:text-base leading-relaxed text-center 
                          max-w-3xl mx-auto font-medium italic">
                "{reviews[current].review}"
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center mb-4">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full max-w-xs"></div>
            </div>

            {/* Service Ratings */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 md:p-5">
              <h4 className="text-base md:text-lg font-bold text-center text-gray-800 mb-4">
                Service Ratings
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {Object.entries(reviews[current].serviceRatings).map(([key, value], index) => (
                  <div key={index} className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex flex-col items-center text-center">
                      <span className="font-semibold text-gray-700 text-xs md:text-sm mb-1 min-h-8 flex items-center text-center">
                        {key}
                      </span>
                      {renderStars(value)}
                      <span className="text-xs text-gray-500 mt-1">{value}/5</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === current
                    ? 'bg-blue-600 w-6'
                    : 'bg-gray-300 hover:bg-gray-400'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}