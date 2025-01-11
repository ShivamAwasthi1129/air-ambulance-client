"use client";
import FlightIcon from "@mui/icons-material/Flight";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

export const Icondiv = () => {
  return (
    <div className="flex h-[74px] w-[20%] pt-[5px] ml-6 bg-white rounded-lg shadow-md justify-around items-center">
      {/* Flights Icon and Text */}
      <div className="flex flex-col items-center group">
        <span className="text-[#a3a3a3] group-hover:text-[#2db0fc] cursor-pointer">
          <FlightIcon style={{ fontSize: 40, padding: 4 }} />
        </span>
        <p className="text-[#555454] text-[13px] m-0 group-hover:text-[#2db0fc]">
          Flights
        </p>
      </div>
      {/* Charter Flights Icon and Text */}
      <div className="flex flex-col items-center group">
        <span className="text-[#a3a3a3] group-hover:text-[#2db0fc] cursor-pointer">
          <FlightTakeoffIcon style={{ fontSize: 40, padding: 4 }} />
        </span>
        <p className="text-[#555454] text-[13px] m-0 group-hover:text-[#2db0fc]">
          Charter flights
        </p>
      </div>
    </div>
  );
};
