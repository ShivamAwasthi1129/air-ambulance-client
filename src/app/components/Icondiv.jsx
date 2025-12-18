"use client";
import { FaPlane, FaHelicopter, FaAmbulance, FaShippingFast, FaWater } from "react-icons/fa";

export const Icondiv = ({ flightTypes, setFlightTypes }) => {
  const toggleFlightType = (type) => {
    setFlightTypes([type]);
  };

  const flightOptions = [
    { type: "Private Jet", icon: FaPlane, label: "Private Jet" },
    { type: "Helicopter", icon: FaHelicopter, label: "Helicopter" },
    { type: "Air Ambulance", icon: FaAmbulance, label: "Air Ambulance" },
    { type: "Air Cargo", icon: FaShippingFast, label: "Air Cargo" },
    { type: "Sea Plane", icon: FaWater, label: "Sea Plane" },
  ];

  return (
    <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-2 md:gap-3 w-full">
      {flightOptions.map((option) => {
        const isSelected = flightTypes.includes(option.type);
        const IconComponent = option.icon;
        
        return (
          <button
            key={option.type}
            onClick={() => toggleFlightType(option.type)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm
              transition-all duration-300 border-2
              ${isSelected 
                ? "bg-[#0a1628] text-white border-[#0a1628] shadow-lg" 
                : "bg-white text-gray-600 border-gray-200 hover:border-[#d4af37] hover:text-[#0a1628]"
              }
            `}
          >
            <IconComponent className={`text-lg ${isSelected ? "text-[#d4af37]" : ""}`} />
            <span className="hidden sm:inline whitespace-nowrap">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};
