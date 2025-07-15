export default function PopularRoutesSection({ data }) {
  const routes =
    data && Array.isArray(data) && data[0]?.popularRoutes
      ? data[0].popularRoutes
      : [];

  return (
    <section className="px-5 py-12 md:px-16 text-gray-800 bg-white max-w-[800px] mx-auto">
      <h2 className="text-center text-xl md:text-2xl font-bold text-blue-600 mb-10">
        Popular Routes
      </h2>
      <div className="bg-white rounded-xl shadow-xl p-6 md:p-10">
        <ul className="space-y-6">
          {routes.map((route, index) => (
            <li key={route._id || index} className="flex items-start text-sm md:text-base">
              <span className="text-lg mr-2">›</span>
              <div>
                <a href={route.url} className="font-semibold hover:underline">
                  Private jet {route.name},
                </a>
                <div className="text-gray-600">by Charter flights & helicopter</div>
              </div>
            </li>
          ))}
          {routes.length === 0 && (
            <li className="text-gray-500 italic">No routes available at the moment.</li>
          )}
        </ul>
      </div>
    </section>
  );
}