import React from 'react';
import { FaPlane, FaTachometerAlt, FaSuitcase, FaUsers, FaStar } from 'react-icons/fa';

export default function PlanningSection() {
  const flightCards = [
    {
      id: 1,
      duration: "4-5 Hrs",
      from: "DXB",
      to: "DEL",
      fromCity: "Dubai",
      toCity: "New Delhi",
      jets: [
        { type: "Light Jets", capacity: "3-4 Guests", status: "$ Updating" },
        { type: "Mid Size Jets", capacity: "5-7 Guests", status: "$ Updating" },
        { type: "Mid Size Jets", capacity: "9-13 Guests", status: "$ Updating" },
        { type: "Mid Size Jets", capacity: "9-13 Guests", status: "$ Updating" },
        { type: "Large Business Jets", capacity: "9-32 Guests", status: "$ Updating" }
      ]
    },
    {
      id: 2,
      duration: "4-5 Hrs",
      from: "DXB",
      to: "DEL",
      fromCity: "Dubai",
      toCity: "New Delhi",
      jets: [
        { type: "Light Jets", capacity: "3-4 Guests", status: "$ Updating" },
        { type: "Mid Size Jets", capacity: "5-7 Guests", status: "$ Updating" },
        { type: "Mid Size Jets", capacity: "9-13 Guests", status: "$ Updating" },
        { type: "Mid Size Jets", capacity: "9-13 Guests", status: "$ Updating" },
        { type: "Large Business Jets", capacity: "9-32 Guests", status: "$ Updating" }
      ]
    },
    {
      id: 3,
      duration: "4-5 Hrs",
      from: "DXB",
      to: "DEL",
      fromCity: "Dubai",
      toCity: "New Delhi",
      jets: [
        { type: "Light Jets", capacity: "3-4 Guests", status: "$ Updating" },
        { type: "Mid Size Jets", capacity: "5-7 Guests", status: "$ Updating" },
        { type: "Mid Size Jets", capacity: "9-13 Guests", status: "$ Updating" },
        { type: "Mid Size Jets", capacity: "9-13 Guests", status: "$ Updating" },
        { type: "Large Business Jets", capacity: "9-32 Guests", status: "$ Updating" }
      ]
    },
    {
      id: 4,
      duration: "4-5 Hrs",
      from: "DXB",
      to: "DEL",
      fromCity: "Dubai",
      toCity: "New Delhi",
      jets: [
        { type: "Light Jets", capacity: "3-4 Guests", status: "$ Updating" },
        { type: "Mid Size Jets", capacity: "5-7 Guests", status: "$ Updating" },
        { type: "Mid Size Jets", capacity: "9-13 Guests", status: "$ Updating" },
        { type: "Mid Size Jets", capacity: "9-13 Guests", status: "$ Updating" },
        { type: "Large Business Jets", capacity: "9-32 Guests", status: "$ Updating" }
      ]
    },
    {
      id: 5,
      duration: "4-5 Hrs",
      from: "DXB",
      to: "DEL",
      fromCity: "Dubai",
      toCity: "New Delhi",
      jets: [
        { type: "Light Jets", capacity: "3-4 Guests", status: "$ Updating" },
        { type: "Mid Size Jets", capacity: "5-7 Guests", status: "$ Updating" },
        { type: "Mid Size Jets", capacity: "9-13 Guests", status: "$ Updating" },
        { type: "Mid Size Jets", capacity: "9-13 Guests", status: "$ Updating" },
        { type: "Large Business Jets", capacity: "9-32 Guests", status: "$ Updating" }
      ]
    },
    {
      id: 6,
      duration: "4-5 Hrs",
      from: "DXB",
      to: "DEL",
      fromCity: "Dubai",
      toCity: "New Delhi",
      jets: [
        { type: "Light Jets", capacity: "3-4 Guests", status: "$ Updating" },
        { type: "Mid Size Jets", capacity: "5-7 Guests", status: "$ Updating" },
        { type: "Mid Size Jets", capacity: "9-13 Guests", status: "$ Updating" },
        { type: "Mid Size Jets", capacity: "9-13 Guests", status: "$ Updating" },
        { type: "Large Business Jets", capacity: "9-32 Guests", status: "$ Updating" }
      ]
    },
    {
      id: 7,
      duration: "4-5 Hrs",
      from: "DXB",
      to: "DEL",
      fromCity: "Dubai",
      toCity: "New Delhi",
      jets: [
        { type: "Light Jets", capacity: "3-4 Guests", status: "$ Updating" },
        { type: "Mid Size Jets", capacity: "5-7 Guests", status: "$ Updating" },
        { type: "Mid Size Jets", capacity: "9-13 Guests", status: "$ Updating" },
        { type: "Mid Size Jets", capacity: "9-13 Guests", status: "$ Updating" },
        { type: "Large Business Jets", capacity: "9-32 Guests", status: "$ Updating" }
      ]
    },
    {
      id: 8,
      duration: "4-5 Hrs",
      from: "DXB",
      to: "DEL",
      fromCity: "Dubai",
      toCity: "New Delhi",
      jets: [
        { type: "Light Jets", capacity: "3-4 Guests", status: "$ Updating" },
        { type: "Mid Size Jets", capacity: "5-7 Guests", status: "$ Updating" },
        { type: "Mid Size Jets", capacity: "9-13 Guests", status: "$ Updating" },
        { type: "Mid Size Jets", capacity: "9-13 Guests", status: "$ Updating" },
        { type: "Large Business Jets", capacity: "9-32 Guests", status: "$ Updating" }
      ]
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Planning Section */}
      <section className="px-4 py-12 md:px-16 text-gray-800">
        <h2 className="text-xl md:text-2xl font-bold mb-2">
          Planning to book a chartered flight to Dubai wondering about the cost of a private jet?
        </h2>
        <p className="text-blue-600 mb-6">
          Discover various options, from turbo-prop flights for short distances to luxurious private with premium seating.
        </p>
        
        <ul className="space-y-3 mb-8">
          <li>
            <span className="text-blue-600 font-medium">Light jets</span>
            <span> : ideal for 2-4 guests with recliner seats</span>
          </li>
          <li>
            <span className="text-blue-600 font-medium">Mid-size jets</span>
            <span> : comfortable for 5-7 guests with a spacious cabin</span>
          </li>
          <li>
            <span className="text-blue-600 font-medium">Super mid-size jets</span>
            <span> : seats 9-13 guests, including meeting cabins with sofa seating</span>
          </li>
          <li>
            <span className="text-blue-600 font-medium">Large business jets</span>
            <span> : accommodates 9-13 guests with a conference cabin</span>
          </li>
          <li>
            <span className="text-blue-600 font-medium">Super luxury jets</span>
            <span> : premium seating for 9-32 guests, offering a press conference room, meeting space, and private bedroom</span>
          </li>
        </ul>
        
        <div className="border border-gray-300 rounded-md p-4 text-blue-600 text-sm leading-relaxed">
          our charter flights aviation services in chennai provide customized private jet rentals with additional services pricing may vary based on fleet availability, clearances, and special permissions. book your chartered flight to chennai today!
        </div>
      </section>

      {/* Flight Cards Section */}
      <section className="px-4 md:px-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {flightCards.map((card) => (
            <div key={card.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="text-center mb-4">
                <p className="text-gray-600 text-sm mb-2">
                  Approx - <span className="text-blue-600 font-medium">{card.duration}</span>
                </p>
                
                {/* Route */}
                <div className="flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-800">{card.from}</div>
                    <div className="text-xs text-gray-500">{card.fromCity}</div>
                  </div>
                  
                  <div className="mx-4">
                    <FaPlane className="text-gray-400 text-lg" />
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-800">{card.to}</div>
                    <div className="text-xs text-gray-500">{card.toCity}</div>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mb-4">
                  Cost will vary it will be approx on
                </p>
                
                {/* Icons */}
                <div className="flex justify-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <FaTachometerAlt className="text-blue-500 text-xs mr-1" />
                    <span className="text-xs text-gray-500">Speed</span>
                  </div>
                  <div className="flex items-center">
                    <FaSuitcase className="text-blue-500 text-xs mr-1" />
                    <span className="text-xs text-gray-500">Luggage Capacity</span>
                  </div>
                  <div className="flex items-center">
                    <FaUsers className="text-blue-500 text-xs mr-1" />
                    <span className="text-xs text-gray-500">Guest</span>
                  </div>
                </div>
              </div>
              
              {/* Jet Options */}
              <div className="space-y-2 mb-4">
                {card.jets.map((jet, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="text-blue-600 font-medium">{jet.type}</span>
                      <span className="text-gray-500"> : {jet.capacity}</span>
                    </div>
                    <span className="text-green-600 font-medium text-xs">{jet.status}</span>
                  </div>
                ))}
              </div>
              
              {/* Rating */}
              <div className="flex items-center justify-center text-xs text-gray-500 border-t pt-3">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-xs" />
                  ))}
                </div>
                <span>Based On Previous Reviews</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}