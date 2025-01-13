"use client";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket"; 
import MedicalServicesIcon from "@mui/icons-material/MedicalServices"; 
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import FlightClassIcon from "@mui/icons-material/FlightClass"; 


export const Icondiv = () => {
  return (
    <div className="flex h-[74px] w-[50%] pt-[5px] ml-6 bg-white rounded-lg shadow-md justify-around items-center">
      {/* Charter Flights Icon and Text */}
      <div className="flex flex-col items-center group">
        <span className="text-[#a3a3a3] group-hover:text-[#2db0fc] cursor-pointer">
          <FlightTakeoffIcon style={{ fontSize: 40, padding: 4 }} />
        </span>
        <p className="text-[#555454] text-[13px] m-0 group-hover:text-[#2db0fc]">
          Charter Flights
        </p>
      </div>
      {/* Private Jets Icon and Text */}
      <div className="flex flex-col items-center group">
        <span className="text-[#a3a3a3] group-hover:text-[#2db0fc] cursor-pointer">
          <AirplaneTicketIcon style={{ fontSize: 40, padding: 4 }} />
        </span>
        <p className="text-[#555454] text-[13px] m-0 group-hover:text-[#2db0fc]">
          Private Jets
        </p>
      </div>
      {/* Air Ambulance Icon and Text */}
      <div className="flex flex-col items-center group">
        <span className="text-[#a3a3a3] group-hover:text-[#2db0fc] cursor-pointer">
          <MedicalServicesIcon style={{ fontSize: 40, padding: 4 }} />
        </span>
        <p className="text-[#555454] text-[13px] m-0 group-hover:text-[#2db0fc]">
          Air Ambulance
        </p>
      </div>
      {/* Business Jet Icon and Text */}
      <div className="flex flex-col items-center group">
        <span className="text-[#a3a3a3] group-hover:text-[#2db0fc] cursor-pointer">
          <BusinessCenterIcon style={{ fontSize: 40, padding: 4 }} />
        </span>
        <p className="text-[#555454] text-[13px] m-0 group-hover:text-[#2db0fc]">
          Business Jets
        </p>
      </div>
      {/* Air Charter Icon and Text */}
      <div className="flex flex-col items-center group">
        <span className="text-[#a3a3a3] group-hover:text-[#2db0fc] cursor-pointer">
          <FlightClassIcon style={{ fontSize: 40, padding: 4 }} />
        </span>
        <p className="text-[#555454] text-[13px] m-0 group-hover:text-[#2db0fc]">
          Air Charter
        </p>
      </div>

    </div>
  );
};
