"use client"; // Next.js App Router

import React, { useEffect, useState } from "react";
import { IoIosAirplane } from "react-icons/io";
import { BsExclamationTriangle } from "react-icons/bs";
import FlightCard from "../components/FleetCard";

// Remove parentheses from airport name
function cleanAirportName(str) {
  return str.replace(/\s*\(.*?\)\s*/, "").trim();
}

// Helper: format to US dollars, e.g. `$ 650,000`.
function formatUSD(amount) {
  return `$ ${amount.toLocaleString("en-US")}`;
}

const FinalEnquiryPage = () => {
  const [searchData, setSearchData] = useState(null);
  const [fetchedSegmentsData, setFetchedSegmentsData] = useState([]);

  // 1) Read from sessionStorage
  useEffect(() => {
    const storedData = sessionStorage.getItem("searchData");
    if (storedData) {
      setSearchData(JSON.parse(storedData));
    }
  }, []);

  // 2) Fetch flights for each segment, filter by selected registrationNo
  useEffect(() => {
    const fetchAllSegments = async () => {
      if (!searchData || !searchData.segments) return;

      const resultsArr = [];
      for (let i = 0; i < searchData.segments.length; i++) {
        const segment = searchData.segments[i];
        const cleanedFrom = cleanAirportName(segment.from);
        const cleanedTo = cleanAirportName(segment.to);

        const url = `/api/search-flights?from=${encodeURIComponent(
          cleanedFrom
        )}&to=${encodeURIComponent(cleanedTo)}&departureDate=${
          segment.departureDate
        }&travelerCount=${segment.passengers}`;

        try {
          const res = await fetch(url);
          const data = await res.json();
          const finalFleetArray = data?.finalFleet || [];

          // Filter to match chosen registrationNo
          let filtered = [];
          if (segment.selectedFleet?.registrationNo) {
            filtered = finalFleetArray.filter(
              (flight) =>
                flight?.fleetDetails?.registrationNo ===
                segment.selectedFleet.registrationNo
            );
          }
          resultsArr.push(filtered);
        } catch (error) {
          console.error("Error fetching flights for segment", i, error);
          resultsArr.push([]);
        }
      }
      setFetchedSegmentsData(resultsArr);
    };

    if (searchData) {
      fetchAllSegments();
    }
  }, [searchData]);

  if (!searchData) {
    return (
      <div className="p-4 text-center">
        No Search Data found, or still loading...
      </div>
    );
  }

  // 3) Summation for cost details
  const allSelectedFlights = fetchedSegmentsData.flat();

  // Parse flight.totalPrice, e.g. "$ 650,000"
  const totalFlightCost = allSelectedFlights.reduce((acc, flight) => {
    if (!flight.totalPrice) return acc;
    const numericPrice = parseInt(flight.totalPrice.replace(/\D+/g, ""), 10) || 0;
    return acc + numericPrice;
  }, 0);

  // Example: airport handling = 71,700 * number of segments
  const airportHandling = 71700 * searchData.segments.length;

  const subTotal = totalFlightCost + airportHandling;
  const gstAmount = Math.round(subTotal * 0.18); // 18% tax
  const estimatedCost = subTotal + gstAmount;
  const message = `Hello, I would like to get a quotation for my flight trip. Please find the attached flight details.`;
  const sendWhatsAppMessage = () => {
    const phoneNumber = "+919999929832"; 
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  };

  const sendEmailMessage = () => {
    const emailAddress = "hexerve@gmail.com";
    const subject = "Quotation Request";
    const emailURL = `mailto:${emailAddress}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(message)}`;
    window.open(emailURL, "_blank");
  }
  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      {/* LEFT COLUMN: Flights */}
      <div className="w-[60%] md:w-2/3 flex flex-col space-y-4">
        {searchData.segments.map((segment, segmentIndex) => {
          const flightsForSegment = fetchedSegmentsData[segmentIndex] || [];

          return (
            <div
              key={segmentIndex}
              className="w-full bg-white flex flex-col items-start px-4 border border-blue-100 rounded-xl"
            >
              <h3 className="text-lg font-bold flex items-center mt-4">
                Trip {segmentIndex + 1}: {segment.from}
                <span className="mx-2">
                  <IoIosAirplane size={24} />
                </span>
                {segment.to}
              </h3>

              {flightsForSegment.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-6">
                  <BsExclamationTriangle className="text-5xl text-gray-400 mb-2" />
                  <p className="text-lg text-gray-600">No fleets available</p>
                </div>
              ) : (
                flightsForSegment.map((flight) => (
                  <div className="w-full my-4" key={flight.serialNumber}>
                    <FlightCard filteredData={[flight]} readOnly />
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>

      {/* RIGHT COLUMN: Cost Details + Buttons */}
      <div className="w-[30%] fixed right-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Cost Details</h2>
          <div className="flex justify-between mb-2">
            <span>Flight Cost (Combined)</span>
            <span>{formatUSD(totalFlightCost)}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Airport Handling Charges</span>
            <span>{formatUSD(airportHandling)}</span>
          </div>

          <div className="flex justify-between font-medium mb-2">
            <span>Sub total</span>
            <span>{formatUSD(subTotal)}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>GST (18%)</span>
            <span>{formatUSD(gstAmount)}</span>
          </div>

          <div className="flex justify-between font-semibold text-lg mb-6">
            <span>Estimated Cost</span>
            <span>{formatUSD(estimatedCost)}</span>
          </div>

          {/* NEW: Row of 3 Buttons */}
          <div className="flex justify-between  space-2 mb-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors text-sm font-semibold">
              BOOK NOW
              <div className="text-xs font-normal">With Partial Payment</div>
            </button>

            <button onClick={sendWhatsAppMessage} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors text-sm font-semibold">
              SEND Enquiry
              <div className="text-xs font-normal">via Whatsapp</div>
            </button>

            <button onClick={sendEmailMessage} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-white px-4 py-2 rounded transition-colors text-sm font-semibold">
              SEND Enquiry
              <div className="text-xs font-normal">via Email</div>
            </button>
          </div>

          {/* Existing "Download Proforma Invoice" button */}
          <button
            className="border border-orange-400 text-orange-500 px-4 py-2 rounded-md 
                       hover:bg-orange-100 transition-colors w-full text-center"
            onClick={() => {
              // Implement your PDF or invoice generation logic
              alert("Downloading Proforma Invoice...");
            }}
          >
            Download Proforma Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalEnquiryPage;
