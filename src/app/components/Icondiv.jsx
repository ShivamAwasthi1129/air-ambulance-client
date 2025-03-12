"use client"; 
import { GiCommercialAirplane } from "react-icons/gi";
import { FaHelicopter } from "react-icons/fa6";
import { RiFlightTakeoffLine } from "react-icons/ri";
import { GiCargoCrate } from "react-icons/gi";
import { CgAirplane } from "react-icons/cg";

export const Icondiv = ({ flightType, setFlightType }) => {
  return (
    <div className="flex flex-wrap items-center justify-around gap-3 mb-4 w-1/2 bg-white rounded-xl border-2 border-gray-300 p-2 -mt-20">
      <div
        onClick={() => setFlightType("Helicopter")}
        className={`cursor-pointer flex flex-col items-center p-2 rounded-md transition-colors ${
          flightType === "Helicopter"
            ? "bg-blue-600 text-white"
            : "text-gray-700 hover:bg-gray-300"
        }`}
      >
        <span
          className={`cursor-pointer ${
            flightType === "Helicopter"
              ? "text-white"
              : "text-[#a3a3a3] group-hover:text-[#2db0fc]"
          }`}
        >
          <FaHelicopter style={{ fontSize: 40, padding: 4 }} />
        </span>
        <p
          className={`text-[13px] m-0 ${
            flightType === "Helicopter"
              ? "text-white"
              : "text-[#555454] group-hover:text-[#2db0fc]"
          }`}
        >
          Helicopter
        </p>
      </div>

      <div
        onClick={() => setFlightType("Private Jet")}
        className={`cursor-pointer flex flex-col items-center p-2 rounded-md transition-colors ${
          flightType === "Private Jet"
            ? "bg-blue-600 text-white"
            : "text-gray-700 hover:bg-gray-300"
        }`}
      >
        <span
          className={`cursor-pointer ${
            flightType === "Private Jet"
              ? "text-white"
              : "text-[#a3a3a3] group-hover:text-[#2db0fc]"
          }`}
        >
          <GiCommercialAirplane style={{ fontSize: 40, padding: 4 }} />
        </span>
        <span
          className={`text-[13px] m-0 ${
            flightType === "Private Jet"
              ? "text-white"
              : "text-[#555454] group-hover:text-[#2db0fc]"
          }`}
        >
          Private Jet
        </span>
      </div>

      <div
        onClick={() => setFlightType("Air Ambulance")}
        className={`cursor-pointer flex flex-col items-center p-2 rounded-md transition-colors ${
          flightType === "Air Ambulance"
            ? "bg-blue-600 text-white"
            : "text-gray-700 hover:bg-gray-300"
        }`}
      >
        <span
          className={`cursor-pointer ${
            flightType === "Air Ambulance"
              ? "text-white"
              : "text-[#a3a3a3] group-hover:text-[#2db0fc]"
          }`}
        >
          <RiFlightTakeoffLine style={{ fontSize: 40, padding: 4 }} />
        </span>
        <span
          className={`text-[13px] m-0 ${
            flightType === "Air Ambulance"
              ? "text-white"
              : "text-[#555454] group-hover:text-[#2db0fc]"
          }`}
        >
          Air Ambulance
        </span>
      </div>

      <div
        onClick={() => setFlightType("Air Cargo")}
        className={`cursor-pointer flex flex-col items-center p-2 rounded-md transition-colors ${
          flightType === "Air Cargo"
            ? "bg-blue-600 text-white"
            : "text-gray-700 hover:bg-gray-300"
        }`}
      >
        <span
          className={`cursor-pointer ${
            flightType === "Air Cargo"
              ? "text-white"
              : "text-[#a3a3a3] group-hover:text-[#2db0fc]"
          }`}
        >
          <GiCargoCrate style={{ fontSize: 40, padding: 4 }} />
        </span>
        <span
          className={`text-[13px] m-0 ${
            flightType === "Air Cargo"
              ? "text-white"
              : "text-[#555454] group-hover:text-[#2db0fc]"
          }`}
        >
          Air Cargo
        </span>
      </div>

      <div
        onClick={() => setFlightType("Sea Plane")}
        className={`cursor-pointer flex flex-col items-center p-2 rounded-md transition-colors ${
          flightType === "Sea Plane"
            ? "bg-blue-600 text-white"
            : "text-gray-700 hover:bg-gray-300"
        }`}
      >
        <span
          className={`cursor-pointer ${
            flightType === "Sea Plane"
              ? "text-white"
              : "text-[#a3a3a3] group-hover:text-[#2db0fc]"
          }`}
        >
          <CgAirplane style={{ fontSize: 40, padding: 4 }} />
        </span>
        <span
          className={`text-[13px] m-0 ${
            flightType === "Sea Plane"
              ? "text-white"
              : "text-[#555454] group-hover:text-[#2db0fc]"
          }`}
        >
          Sea Plane
        </span>
      </div>
    </div>
  );
};
