export default function NearByAirportsSection() {
  const airports = [
    {
      code: "OMDB",
      name: "Dubai Intl Airport",
      link: "#",
      location: "DXB, Dubai",
    },
    {
      code: "OMSJ",
      name: "Sharjah Intl Airport",
      link: "#",
      location: "SHJ, Sharjah",
    },
    {
      code: "OMRK",
      name: "Ras Al Khaimah Intl Airport",
      link: "#",
      location: "RKT",
    },
    {
      code: "OMFJ",
      name: "Fujairah Intl Airport",
      link: "#",
      location: "FJR, Fujairah",
    },
    {
      code: "OMAA",
      name: "Abu Dhabi Intl Airport",
      link: "#",
      location: "AUH, Abu Dhabi",
    },
    {
      code: "OMAD",
      name: "AL Bateen Airport",
      link: "#",
      location: "Abu Dhabi",
    },
  ];

  return (
    <section className="px-5 py-12 md:px-16 bg-white text-gray-800">
      {/* Title */}
      <h2 className="text-center text-xl md:text-2xl font-bold text-blue-600 mb-10">
        Airports near Dubai
      </h2>

      {/* Grid Layout */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* Table */}
        <div className="w-full lg:w-1/2 overflow-x-auto">
          <table className="w-full border border-gray-600 shadow-md rounded-lg overflow-hidden text-sm sm:text-base">
            <thead>
              <tr className="bg-blue-50 text-gray-700 font-semibold">
                <th className="px-6 py-4 border-2">Code</th>
                <th className="px-6 py-4 border-2">Airport</th>
                <th className="px-6 py-4 border-2">Location</th>
              </tr>
            </thead>
            <tbody>
              {airports.map((airport, i) => (
                <tr
                  key={i}
                  className={`${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-100 transition-colors`}
                >
                  <td className="px-6 py-4 border font-medium">{airport.code}</td>
                  <td className="px-6 py-4 border text-blue-600 font-medium">
                    <a href={airport.link} className="hover:underline">
                      {airport.name}
                    </a>
                  </td>
                  <td className="px-6 py-4 border">{airport.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Map Image */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src="https://images.pexels.com/photos/6813362/pexels-photo-6813362.jpeg"
            alt="Map of UAE"
            className="w-full max-w-md h-[360px] sm:h-[400px] rounded-xl object-cover shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
