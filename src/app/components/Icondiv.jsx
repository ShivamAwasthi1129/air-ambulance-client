"use client";
import { FaPlane, FaHelicopter, FaAmbulance, FaShippingFast, FaWater } from "react-icons/fa";

export const Icondiv = ({ flightTypes, setFlightTypes }) => {
  const toggleFlightType = (type) => {
    setFlightTypes([type]);
  };

  const flightOptions = [
    { type: "Private Jet", icon: FaPlane, label: "Private Jet", color: "#008cff" },
    { type: "Helicopter", icon: FaHelicopter, label: "Helicopter", color: "#ff6b00" },
    { type: "Air Ambulance", icon: FaAmbulance, label: "Air Ambulance", color: "#eb2026" },
    { type: "Air Cargo", icon: FaShippingFast, label: "Air Cargo", color: "#2e7d32" },
    { type: "Sea Plane", icon: FaWater, label: "Sea Plane", color: "#0097a7" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {flightOptions.map((option) => {
        const isSelected = flightTypes.includes(option.type);
        const IconComponent = option.icon;
        
        return (
          <button
            key={option.type}
            onClick={() => toggleFlightType(option.type)}
            className={`
              flight-type-icon
              ${isSelected ? "active" : ""}
            `}
            style={{
              borderColor: isSelected ? option.color : "transparent",
              backgroundColor: isSelected ? `${option.color}10` : "#f8f8f8"
            }}
          >
            <IconComponent 
              className="text-2xl"
              style={{ color: isSelected ? option.color : "#9b9b9b" }}
            />
            <span 
              className="text-[10px] font-semibold"
              style={{ color: isSelected ? option.color : "#9b9b9b" }}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
