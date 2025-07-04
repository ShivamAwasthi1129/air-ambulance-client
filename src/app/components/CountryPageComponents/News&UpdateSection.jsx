export default function NewsAndUpdates() {
  const buttons = [
    {
      label: "COVID 19 INDIA STATE WISE QUARANTINE REGULATIONS",
      link: "/covid-regulations",
    },
    {
      label: "CHARTER FLIGHTS AVIATION",
      link: "/charter-flights",
    },
    {
      label: "PRIVATE JETS AVIATION",
      link: "/private-jets",
    },
  ];

  return (
    <section className="px-4 py-10 md:px-16 bg-white text-gray-800 space-y-6">
      {/* News Block */}
      <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6 p-5 rounded-xl border border-gray-200 shadow-md">
        {/* Image - small and left-aligned */}
        <div className="w-full md:w-auto flex-shrink-0">
          <img
            src="https://images.pexels.com/photos/3957983/pexels-photo-3957983.jpeg"
            alt="Covid-19 Update"
            className="rounded-lg w-[600px] h-[200px] object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2">
          <h3 className="text-lg sm:text-xl font-semibold leading-tight">
            News and Updates Covid 19 India State wise quarantine Regulations
          </h3>
          <p className="text-blue-600 font-medium text-sm sm:text-base">
            30 May 2021, Dubai
          </p>
          <p className="text-sm sm:text-base text-gray-700 leading-snug">
            Quarantine requirements Chennai India by air. The passenger must know the quarantine requirements for each state of India. However, an RT-PCR report with 48-72 hour validity is the best document to fly. Charter flights to India: All states have the independent administration to avoid coronavirus pandemic view of COVID-19. Please download the latest updates on state-wise Covid-19 India State-wise quarantine Regulations.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
        {buttons.map((btn, i) => (
          <a
            key={i}
            href={btn.link}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base font-medium shadow-sm"
          >
            {btn.label}
          </a>
        ))}
      </div>
    </section>
  );
}
