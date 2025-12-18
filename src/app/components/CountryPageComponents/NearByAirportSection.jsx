import { useState, useEffect, useCallback } from "react";

export default function NearByAirportsSection() {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countryName, setCountryName] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  
  const fetchAirports = useCallback(async (country, retry = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      // Encode the query parameter properly
      const encodedCountry = encodeURIComponent(country.trim());
      const response = await fetch(
        `https://ow91reoh80.execute-api.ap-south-1.amazonaws.com/air/station?query=${encodedCountry}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        // If 500 error and haven't retried yet, try again
        if (response.status === 500 && retry < 2) {
          console.log(`API returned 500, retrying... (attempt ${retry + 1})`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retry + 1)));
          return fetchAirports(country, retry + 1);
        }
        throw new Error(`Server error. Please try again later.`);
      }
      
      const data = await response.json();
      setAirports(data.airports || []);
      setRetryCount(0);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching airports:', err);
      setRetryCount(retry);
    } finally {
      setLoading(false);
    }
  }, []);
  const updateCountryName = () => {
    const newCountryName = sessionStorage?.getItem('country_name') || 'dubai';
    console.log('Country changed to:', newCountryName);
    setCountryName(newCountryName);
    fetchAirports(newCountryName);
  };
  useEffect(() => {
    // Initial load
    const initialCountryName = sessionStorage?.getItem('country_name') || 'dubai';
    setCountryName(initialCountryName);
    fetchAirports(initialCountryName);
    // Listen for country name changes
    window.addEventListener("countryNameChanged", updateCountryName);
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("countryNameChanged", updateCountryName);
    };
  }, []);
  if (loading) {
    return (
      <section className="px-5 py-12 md:px-16 bg-white text-gray-800">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading airports...</p>
          </div>
        </div>
      </section>
    );
  }
  const handleRetry = () => {
    fetchAirports(countryName);
  };

  if (error) {
    return (
      <section className="px-5 py-12 md:px-16 bg-white text-gray-800">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <div className="text-red-600 text-3xl mb-3">⚠️</div>
            <h3 className="text-red-800 font-semibold mb-2">Unable to Load Airports</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="px-5 py-12 md:px-16 bg-white text-gray-800">
      {/* Title */}
      <h2 className="text-center text-xl md:text-2xl font-bold text-blue-600 mb-10">
        Airports near {countryName.charAt(0).toUpperCase() + countryName.slice(1)}
      </h2>

      {/* Grid Layout */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* Table */}
        <div className="w-full lg:w-1/2 overflow-x-auto">
          {airports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No airports found for this location.
            </div>
          ) : (
            <table className="w-full border border-gray-300 shadow-md rounded-lg overflow-hidden text-sm sm:text-base">
              <thead>
                <tr className="bg-blue-50 text-gray-700 font-semibold">
                  <th className="px-4 py-3 border text-left">Name</th>
                  <th className="px-4 py-3 border text-left">City</th>
                  <th className="px-4 py-3 border text-left">Country</th>
                  <th className="px-4 py-3 border text-left">IATA</th>
                  <th className="px-4 py-3 border text-left">ICAO</th>
                  <th className="px-4 py-3 border text-left">Coordinates</th>
                </tr>
              </thead>
              <tbody>
                {airports.map((airport, i) => (
                  <tr
                    key={airport._id || i}
                    className={`${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-100 transition-colors`}
                  >
                    <td className="px-4 py-3 border font-medium text-blue-600">
                      {airport.name}
                    </td>
                    <td className="px-4 py-3 border">{airport.city}</td>
                    <td className="px-4 py-3 border">{airport.country}</td>
                    <td className="px-4 py-3 border font-mono text-sm">
                      {airport.iata_code || "—"}
                    </td>
                    <td className="px-4 py-3 border font-mono text-sm">
                      {airport.icao_code || "—"}
                    </td>
                    <td className="px-4 py-3 border text-xs text-gray-600">
                      {airport.latitude?.toFixed(4)}, {airport.longitude?.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Map Image */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src="https://images.pexels.com/photos/6813362/pexels-photo-6813362.jpeg"
            alt={`Map of ${countryName}`}
            className="w-full max-w-md h-[360px] sm:h-[400px] rounded-xl object-cover shadow-lg"
          />
        </div>
      </div>

      {/* Airport Count */}
      {/* {airports.length > 0 && (
        <div className="text-center mt-8 text-gray-600">
          Found {airports.length} airport{airports.length !== 1 ? 's' : ''} in the area
        </div>
      )} */}
    </section>
  );
}