export default function WhyChooseSection() {
  const services = [
    {
      title: "Premium Air Charter Service in Dubai - Charter Flights Aviation",
      content: [
        "Charter Flights Aviation offers top-tier air charter services in Chennai India, providing seamless booking for private jets, luxury air charters, and more. Experience the highest level of convenience and comfort with our VIP charter flights, catering to both business travelers and leisure seekers. Whether you need a corporate jet or a private air taxi, we ensure a tailored journey to suit your specific needs.",
        "With Charter Flights Aviation in Chennai India, enjoy on-demand private jet charters, flexible scheduling, and access to an exclusive fleet for domestic and international charter flights. Book your air charter in Chennai India today and elevate your travel experience with unmatched luxury and reliability.",
      ],
      image: "https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg",
    },
    {
      title: "Luxury Private Jet Service in Chennai India - Charter Flights Aviation",
      content: [
        "Charter Flights Aviation offers top-tier air charter services in Chennai India, providing seamless booking for private jets, luxury air charters, and more. Experience the highest level of convenience and comfort with our VIP charter flights, catering to both business travelers and leisure seekers. Whether you need a corporate jet or a private air taxi, we ensure a tailored journey to suit your specific needs.",
        "With Charter Flights Aviation in Chennai India, enjoy on-demand private jet charters, flexible scheduling, and access to an exclusive fleet for domestic and international charter flights. Book your scheduling, and access to an exclusive fleet for domestic and international charter flights. Book your air charter in Chennai India today and elevate your travel experience with unmatched luxury and reliability.",
      ],
      image: "https://images.pexels.com/photos/258219/pexels-photo-258219.jpeg",
    },
    {
      title: "Premium Helicopter Service in Chennai India - Charter Flights Aviation",
      content: [
        "Charter Flights Aviation offers top-tier air charter services in Chennai India, providing seamless booking for private jets, luxury air charters and more. Experience the highest level of convenience and comfort with our VIP charter flights, catering to both business travelers and leisure seekers. Whether you need a corporate jet or a private air taxi, we ensure a tailored journey to suit your specific needs.",
        "With Charter Flights Aviation in Chennai India, enjoy on-demand private jet charters, flexible scheduling, and access to an exclusive fleet for domestic and international charter flights. Book your scheduling, and access to an exclusive fleet for domestic and international charter flights. Book your air charter in Chennai India today and elevate your travel experience with unmatched luxury and reliability.",
      ],
      image: "https://images.pexels.com/photos/1441122/pexels-photo-1441122.jpeg",
    },
  ];

  return (
    <section className="px-4 py-12 md:px-16 bg-white text-gray-800 space-y-10">
      {/* Section Heading */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Why Choose <span className="text-black">Charter Flights Aviation</span> in{" "}
          <span className="text-blue-600">Dubai</span>?
        </h2>
        <p className="max-w-4xl mx-auto text-sm md:text-base bg-blue-50 p-4 text-start ">
          Looking for the best charter flights in Chennai? Our affordable private jet, helicopter, air ambulance and air charter services are tailored to meet your travel needs. Whether you require a private jet in Chennai for business or helicopter charter for special occasions, we provide reliable and luxurious air travel solutions.
        </p>
        <p className="max-w-4xl mx-auto text-sm md:text-base mt-2 bg-blue-50 p-4 text-start">
          Experience the convenience of low-cost charter flights with top-tier safety and comfort. Explore our exceptional air charter services in Dubai today!
        </p>
      </div>

      {/* Services Section */}
      <div className="space-y-10">
        {services.map((service, index) => (
          <div
            key={index}
            className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center gap-6`}
          >
            {/* Image */}
            <div className="w-full lg:w-1/2">
              <div className="w-full h-[240px] sm:h-[280px] md:h-[300px] rounded-xl overflow-hidden shadow-md">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>


            {/* Text */}
            <div className="w-full lg:w-1/2 bg-blue-50 p-6 rounded-lg">
              <h3 className="text-blue-700 font-semibold text-sm md:text-base mb-3">
                {service.title}
              </h3>
              {service.content.map((paragraph, i) => (
                <p key={i} className="text-sm md:text-base mb-3 text-gray-700 leading-relaxed ">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
