export default function BestFlightSection({ data }) {
  // Use cards from API data, fallback to static if not available
  const cards =
    data && Array.isArray(data) && data[0]?.cards && data[0].cards.length > 0
      ? data[0].cards
      : [
          {
            image: "https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg",
            price: 809,
            rating: 5,
            heading: "Royal flight salute in Dubai Airport",
            paragraph: "custom",
          },
        ];

  return (
    <section className="px-4 py-10 md:px-16 bg-white">
      <h2 className="text-2xl md:text-3xl font-bold text-blue-600 text-center">
        Best Charter flights and Air Charter Service in Chennai
      </h2>
      <p className="text-gray-700 text-center mt-2 mb-8">
        Charter flights aviation add on special services in Dubai
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={card._id || index}
            className="flex justify-between items-center bg-white rounded-xl shadow-md p-4 gap-4 hover:shadow-lg transition"
          >
            {/* Left content */}
            <div className="flex flex-col justify-between w-2/3">
              <div>
                <h3 className="font-semibold text-sm sm:text-base text-gray-900">
                  {card.heading}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  {card.paragraph}
                </p>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-green-700 bg-green-200 px-3 py-1 rounded font-semibold text-sm">
                  ${card.price || 809} Onwards
                </span>
                <span className="text-yellow-400 text-sm ml-2">
                  {"★".repeat(Math.round(card.rating || 5))}
                </span>
              </div>
            </div>

            {/* Right image */}
            <div className="w-1/3">
              <img
                src={card.image}
                alt={card.heading}
                className="w-full h-24 object-cover rounded-lg"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}