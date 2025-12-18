"use client";
import { useState, useEffect, useCallback } from "react";
import { FaPlane, FaMapMarkerAlt, FaSync } from "react-icons/fa";
import { motion } from "framer-motion";

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
    const initialCountryName = sessionStorage?.getItem('country_name') || 'dubai';
    setCountryName(initialCountryName);
    fetchAirports(initialCountryName);
    window.addEventListener("countryNameChanged", updateCountryName);
    return () => {
      window.removeEventListener("countryNameChanged", updateCountryName);
    };
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="text-center">
              <div className="w-12 h-12 border-3 border-[#008cff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm">Loading airports...</p>
            </div>
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
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="text-center bg-red-50 border border-red-100 rounded-2xl p-6 max-w-md">
              <div className="text-red-500 text-3xl mb-3">⚠️</div>
              <h3 className="text-red-800 font-semibold mb-2">Unable to Load Airports</h3>
              <p className="text-red-600 text-sm mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="px-5 py-2 bg-[#008cff] text-white rounded-xl hover:bg-[#0070cc] transition-colors font-medium text-sm flex items-center gap-2 mx-auto"
              >
                <FaSync className="text-xs" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="inline-flex items-center gap-2 bg-[#e8f4ff] text-[#008cff] px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <FaMapMarkerAlt className="text-xs" />
            Nearby Airports
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Airports near <span className="text-[#008cff]">{countryName.charAt(0).toUpperCase() + countryName.slice(1)}</span>
          </h2>
        </motion.div>

        {/* Grid Layout */}
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Table */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="w-full lg:w-3/5 overflow-x-auto"
          >
            {airports.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-2xl">
                No airports found for this location.
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#f7f9fc] text-gray-700">
                      <th className="px-4 py-3 text-left font-semibold">Airport Name</th>
                      <th className="px-4 py-3 text-left font-semibold">City</th>
                      <th className="px-4 py-3 text-left font-semibold">IATA</th>
                      <th className="px-4 py-3 text-left font-semibold">ICAO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {airports.slice(0, 8).map((airport, i) => (
                      <tr
                        key={airport._id || i}
                        className="border-t border-gray-50 hover:bg-[#f7f9fc] transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-[#e8f4ff] rounded-lg flex items-center justify-center flex-shrink-0">
                              <FaPlane className="text-[#008cff] text-xs" />
                            </div>
                            <span className="font-medium text-gray-900 truncate max-w-[180px]">{airport.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{airport.city}</td>
                        <td className="px-4 py-3">
                          <span className="bg-[#e8f4ff] text-[#008cff] px-2 py-0.5 rounded font-mono text-xs font-semibold">
                            {airport.iata_code || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">
                          {airport.icao_code || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {/* Map Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="w-full lg:w-2/5"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://images.pexels.com/photos/6813362/pexels-photo-6813362.jpeg"
                alt={`Map of ${countryName}`}
                className="w-full h-[300px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#051423]/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#008cff] rounded-lg flex items-center justify-center">
                    <FaMapMarkerAlt className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold text-sm">{airports.length} Airports Found</p>
                    <p className="text-gray-500 text-xs">In {countryName} region</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
