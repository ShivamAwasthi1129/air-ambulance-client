"use client"
import React, { useState } from "react";
const FleetDetailsPreview = ({ fleetData }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");

  return (
    <div className="p-8 bg-gradient-to-r from-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Header */}
        <header className="bg-indigo-600 text-white p-6">
          <h1 className="text-3xl font-bold font-sans text-center">
            Fleet Details Preview
          </h1>
        </header>

        <div className="p-8 space-y-8">
          {/* Fleet Details */}
          <section>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4 border-b-2 border-indigo-300 pb-2">
              Fleet Details
            </h2>
            <table className="w-full table-auto border-collapse border border-gray-200 text-gray-800">
              <tbody>
                {Object.entries(fleetData.fleetDetails).map(([key, value]) => (
                  <tr key={key} className="even:bg-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium capitalize border-r border-gray-300">
                      {key.replace(/([A-Z])/g, " $1")}
                    </td>
                    <td className="px-4 py-2">
                      {typeof value === "object" && !Array.isArray(value)
                        ? Object.entries(value)
                          .map(([nestedKey, nestedValue]) => `${nestedKey}: ${nestedValue}`)
                          .join(", ")
                        : Array.isArray(value)
                          ? value.join(", ")
                          : value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Aircraft Gallery */}
          <section>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4 border-b-2 border-indigo-300 pb-2">
              Aircraft Gallery
            </h2>
            <div className="space-y-6">
              {["cockpit", "exterior", "interior"].map((view) => (
                <div key={view}>
                  <h3 className="text-xl font-semibold capitalize text-indigo-600 mb-2">{view}</h3>
                  <div className="flex space-x-4 overflow-x-auto">
                    {Object.entries(fleetData.aircraftGallery[view]).map(([angle, url]) => (
                      <div key={angle} className="flex-shrink-0">
                        <h4 className="text-sm font-medium text-gray-600 mb-2">{angle}</h4>
                        <img
                          src={url}
                          alt={`${view} ${angle}`}
                          className="w-64 h-40 object-cover rounded-lg shadow-md hover:scale-105 transform transition duration-300 cursor-pointer"
                          onClick={() => {
                            setModalImageUrl(url);
                            setIsModalOpen(true);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {fleetData.aircraftGallery.video && (
                <div>
                  <h3 className="text-xl font-semibold text-indigo-600 mb-2">Video</h3>
                  <video
                    controls
                    autoPlay
                    muted
                    loop
                    src={fleetData.aircraftGallery.video}
                    className="w-full h-96 rounded-lg shadow-md object-cover"
                  />
                </div>
              )}
            </div>
          </section>



          {/* Additional Amenities */}
          <section>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4 border-b-2 border-indigo-300 pb-2">
              Additional Amenities
            </h2>
            <table className="w-full table-auto border-collapse border border-gray-200 text-gray-800">
              <tbody>
                {Object.entries(fleetData.additionalAmenities).map(([key, value]) => (
                  <tr key={key} className="even:bg-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium capitalize border-r border-gray-300">
                      {key}
                    </td>
                    <td className="px-4 py-2">
                      <p>{value.value}</p>
                      {value.name && (
                        <p>
                          <strong>Name:</strong> {value.name}
                        </p>
                      )}
                      {value.phone && (
                        <p>
                          <strong>Phone:</strong> {value.phone}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Travel Modes */}
          <section>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4 border-b-2 border-indigo-300 pb-2">
              Travel Modes
            </h2>
            {Object.entries(fleetData.travelmodes).map(([mode, details]) => (
              <div key={mode} className="mb-6">
                <h3 className="text-xl font-semibold capitalize text-indigo-600">
                  {mode}
                </h3>
                <table className="w-full table-auto border-collapse border border-gray-200 text-gray-800">
                  <tbody>
                    {Object.entries(details).map(([key, value]) => (
                      <tr key={key} className="even:bg-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium capitalize border-r border-gray-300">
                          {key}
                        </td>
                        <td className="px-4 py-2">
                          {typeof value === "object"
                            ? Object.entries(value)
                              .map(([nestedKey, nestedValue]) => `${nestedKey}: ${nestedValue}`)
                              .join(", ")
                            : value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </section>

          {/* Restricted Airports */}
          <section>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4 border-b-2 border-indigo-300 pb-2">
              Restricted Airports
            </h2>
            <ul className="list-disc list-inside text-gray-800 space-y-2">
              {fleetData.fleetDetails.restrictedAirports.map((airport, index) => (
                <li key={index}>{airport}</li>
              ))}
            </ul>
          </section>

          {/* Unavailability Dates */}
          <section>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4 border-b-2 border-indigo-300 pb-2">
              Unavailability Dates
            </h2>
            <table className="w-full table-auto border-collapse border border-gray-200 text-gray-800">
              <tbody>
                <tr className="even:bg-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium capitalize border-r border-gray-300">
                    From
                  </td>
                  <td className="px-4 py-2">{fleetData.fleetDetails.unavailabilityDates.fromDate}</td>
                </tr>
                <tr className="even:bg-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium capitalize border-r border-gray-300">
                    To
                  </td>
                  <td className="px-4 py-2">{fleetData.fleetDetails.unavailabilityDates.toDate}</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="relative">
            <img
              src={modalImageUrl}
              alt="Modal"
              className="w-auto h-auto max-w-3xl max-h-[90vh] rounded-lg shadow-lg"
            />
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 px-4 py-2 rounded-full hover:bg-opacity-75 transition"
            >
              &times;
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default FleetDetailsPreview;
