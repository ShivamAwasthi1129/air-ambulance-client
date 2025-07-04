const charterCards = [
  {
    title: "Royal flight salute in Dubai Airport",
    subtitle: "Runway only with special airport",
    image:
      "https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg", // Replace with real URLs
  },
  {
    title: "Royal flight salute in Dubai Airport",
    subtitle: "Runway only with special airport",
    image:
      "https://images.pexels.com/photos/46148/helicopter-aircraft-vehicle-flight-46148.jpeg",
  },
  {
    title: "Royal flight salute in Dubai Airport",
    subtitle: "Runway only with special airport",
    image:
      "https://images.pexels.com/photos/163728/helicopter-airport-flight-landing-163728.jpeg",
  },
  {
    title: "Royal flight salute in Dubai Airport",
    subtitle: "Runway only with special airport",
    image:
      "https://images.pexels.com/photos/1105986/pexels-photo-1105986.jpeg",
  },
  {
    title: "Royal flight salute in Dubai Airport",
    subtitle: "Runway only with special airport",
    image:
      "https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg",
  },
  {
    title: "Royal flight salute in Dubai Airport",
    subtitle: "Runway only with special airport",
    image:
      "https://images.pexels.com/photos/1309644/pexels-photo-1309644.jpeg",
  },
  {
    title: "Royal flight salute in Dubai Airport",
    subtitle: "Runway only with special airport",
    image:
      "https://images.pexels.com/photos/586815/pexels-photo-586815.jpeg",
  },
  {
    title: "Royal flight salute in Dubai Airport",
    subtitle: "Runway only with special airport",
    image:
      "https://images.pexels.com/photos/209510/pexels-photo-209510.jpeg",
  },
  {
    title: "Royal flight salute in Dubai Airport",
    subtitle: "Runway only with special airport",
    image:
      "https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg",
  },
];

export default function BestFlightSection() {
  return (
    <section className="px-4 py-10 md:px-16 bg-white">
      <h2 className="text-2xl md:text-3xl font-bold text-blue-600 text-center">
        Best Charter flights and Air Charter Service in Chennai
      </h2>
      <p className="text-gray-700 text-center mt-2 mb-8">
        Charter flights aviation add on special services in Dubai
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {charterCards.map((card, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-white rounded-xl shadow-md p-4 gap-4 hover:shadow-lg transition"
          >
            {/* Left content */}
            <div className="flex flex-col justify-between w-2/3">
              <div>
                <h3 className="font-semibold text-sm sm:text-base text-gray-900">
                  {card.title}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  {card.subtitle}
                </p>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-green-700 bg-green-200 px-3 py-1 rounded font-semibold text-sm">
                  $809 Onwards
                </span>
                <span className="text-yellow-400 text-sm ml-2">★★★★★</span>
              </div>
            </div>

            {/* Right image */}
            <div className="w-1/3">
              <img
                src={card.image}
                alt="charter"
                className="w-full h-24 object-cover rounded-lg"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
