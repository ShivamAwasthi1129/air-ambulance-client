export default function WhyChooseSection({ data }) {
  // Extract secondaryArticle and subArticles from API data
  const secondaryArticle =
    data && Array.isArray(data) && data[0]?.secondaryArticle
      ? data[0].secondaryArticle
      : {};

  const mainHeading = secondaryArticle.mainHeading || "Why Choose Charter Flights Aviation in Dubai?";
  const mainParagraphs =
    secondaryArticle.paragraphs && secondaryArticle.paragraphs.length > 0
      ? secondaryArticle.paragraphs
      : [
          "Looking for the best charter flights in Chennai? Our affordable private jet, helicopter, air ambulance and air charter services are tailored to meet your travel needs. Whether you require a private jet in Chennai for business or helicopter charter for special occasions, we provide reliable and luxurious air travel solutions.",
          "Experience the convenience of low-cost charter flights with top-tier safety and comfort. Explore our exceptional air charter services in Dubai today!",
        ];

  const subArticles =
    secondaryArticle.subArticles && secondaryArticle.subArticles.length > 0
      ? secondaryArticle.subArticles
      : [
          {
            heading: "Premium Air Charter Service in Dubai - Charter Flights Aviation",
            paragraphs: [
              "Charter Flights Aviation offers top-tier air charter services in Chennai India, providing seamless booking for private jets, luxury air charters, and more. Experience the highest level of convenience and comfort with our VIP charter flights, catering to both business travelers and leisure seekers. Whether you need a corporate jet or a private air taxi, we ensure a tailored journey to suit your specific needs.",
              "With Charter Flights Aviation in Chennai India, enjoy on-demand private jet charters, flexible scheduling, and access to an exclusive fleet for domestic and international charter flights. Book your air charter in Chennai India today and elevate your travel experience with unmatched luxury and reliability.",
            ],
            image: "https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg",
          },
        ];

  return (
    <section className="px-4 py-12 md:px-16 bg-white text-gray-800 space-y-10">
      {/* Section Heading */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          {mainHeading}
        </h2>
        {mainParagraphs.map((p, idx) => (
          <p
            key={idx}
            className={`max-w-4xl mx-auto text-sm md:text-base ${idx === 0 ? "bg-blue-50 p-4 text-start" : "mt-2 bg-blue-50 p-4 text-start"}`}
          >
            {p}
          </p>
        ))}
      </div>

      {/* Services Section */}
      <div className="space-y-10">
        {subArticles.map((service, index) => (
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
                  alt={service.heading}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Text */}
            <div className="w-full lg:w-1/2 bg-blue-50 p-6 rounded-lg">
              <h3 className="text-blue-700 font-semibold text-sm md:text-base mb-3">
                {service.heading}
              </h3>
              {service.paragraphs.map((paragraph, i) => (
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