
"use client"
import React from "react";
import { FaPlane } from "react-icons/fa";

export default function HeroAviationSection({ data }) {
  const heroData = data && Array.isArray(data) && data[0]?.hero ? data[0].hero : null;
  const keyValues = heroData?.keyValues || [];

  return (
    <section className="bg-white px-5 py-10 md:px-16 text-gray-800 mt-36">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
        {/* Left: Text Content */}
        <div className="md:col-span-2">
          <h1 className="text-xl md:text-2xl font-bold text-blue-700 mb-2">
            {heroData?.subtitle || "Book Private Jets, Charter Flights & Helicopter Services in Dubai"}
          </h1>
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
            {heroData?.title || "Charter Flights Aviation"}
          </h2>

          {heroData?.paragraph?.map((p, idx) => (
            <p key={idx} className="mb-4 text-gray-700">
              {p}
            </p>
          ))}

          <p className="text-gray-700">
            Charter Flights Aviation is a leading provider of premium air charter services in Chennai, offering
            private jet rentals, business jets, and helicopter charters at competitive prices.
          </p>
        </div>

        {/* Right: Card Section */}
        <div className="bg-gray-50 p-4 rounded-xl shadow-md">
          <div className="flex gap-2 mb-4">
            <span className="text-xs font-medium bg-blue-600 text-white rounded px-2 py-1">Helicopters</span>
            <span className="text-xs font-medium bg-yellow-400 text-white rounded px-2 py-1">Jets</span>
            <span className="text-xs font-medium bg-indigo-500 text-white rounded px-2 py-1">Turboprop</span>
          </div>

          {/* Cards */}
          <div className="space-y-4">
            {keyValues.map((item) => (
              <div
                key={item._id}
                className="border rounded-lg p-4 bg-white shadow hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4">
                  <FaPlane className="text-3xl text-gray-600" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.key}</h3>
                    <p className="text-green-600 text-sm font-medium mt-1">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
