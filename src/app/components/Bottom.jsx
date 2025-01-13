import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";

export const Bottom = () => {
  return (
    <div>
      <div className="flex justify-between w-11/12 mx-auto">
        <div>
          <h3 className="text-sm font-semibold">PRODUCT OFFERING</h3>
          <p className="text-xs text-gray-700 cursor-pointer hover:text-blue-500">Flights</p>
          <p className="text-xs text-gray-700 cursor-pointer hover:text-blue-500">International Flights</p>
          <p className="text-xs text-gray-700 cursor-pointer hover:text-blue-500">Charter Flights</p>
          <p className="text-xs text-gray-700 cursor-pointer hover:text-blue-500">Hotels</p>
          <p className="text-xs text-gray-700 cursor-pointer hover:text-blue-500">International Hotels</p>
          <p className="text-xs text-gray-700 cursor-pointer hover:text-blue-500">Homestays and Villas</p>
          <p className="text-xs text-gray-700 cursor-pointer hover:text-blue-500">Activities</p>
          <p className="text-xs text-gray-700 cursor-pointer hover:text-blue-500">Holidays In India</p>
          <p className="text-xs text-gray-700 cursor-pointer hover:text-blue-500">International Holidays</p>
          {/* Add remaining items */}
        </div>
        <div>
          <h3 className="text-sm font-semibold">Airport DirectoryWorld</h3>
          <p className="text-xs text-gray-700 cursor-pointer hover:text-blue-500">About Us</p>
          <p className="text-xs text-gray-700 cursor-pointer hover:text-blue-500">Investor Relations</p>
          <p className="text-xs text-gray-700 cursor-pointer hover:text-blue-500">Careers</p>
          <p className="text-xs text-gray-700 cursor-pointer hover:text-blue-500">MMT Foundation</p>
          <p className="text-xs text-gray-700 cursor-pointer hover:text-blue-500">CSR Policy</p>
          {/* Add remaining items */}
        </div>
        <div>
          <h3 className="text-sm font-semibold">ABOUT THIS SITE</h3>
          <p className="text-xs text-gray-700 cursor-pointer hover:text-blue-500">Contact Us</p>
          <p className="text-xs text-gray-700 cursor-pointer hover:text-blue-500">Payment Security</p>
          <p className="text-xs text-gray-700 cursor-pointer hover:text-blue-500">Privacy Policy</p>
          <p className="text-xs text-gray-700 cursor-pointer hover:text-blue-500">User Agreement</p>
          <p className="text-xs text-gray-700 cursor-pointer hover:text-blue-500">Terms of Service</p>
          {/* Add remaining items */}
        </div>
      </div>
      <div className="w-11/12 mx-auto mt-16">
        <h3 className="text-sm font-semibold">QUICK LINKS</h3>
        <p className="text-xs text-gray-700 cursor-pointer hover:text-blue-500">
          Delhi Chennai Flights, Delhi Mumbai Flights, Delhi Goa Flights, Chennai Mumbai flights,
          Mumbai Hyderabad flights, Kolkata to Rupsi Flights, Rupsi to Guwahati Flights...
        </p>
        <h3 className="text-sm font-semibold mt-4">IMPORTANT LINKS</h3>
        <p className="text-xs text-gray-700 cursor-pointer hover:text-blue-500">
          Cheap Flights, Flight Status, Kumbh Mela, Domestic Airlines, International Airlines, Indigo,
          Spicejet, GoAir, Air Asia...
        </p>
      </div>
      <div className="flex justify-around mt-16 bg-gray-300 py-10 px-10">
        <div>
          <h3 className="text-base font-semibold">Why Airport DirectoryWorld?</h3>
          <p className="text-sm text-gray-700 cursor-pointer hover:text-blue-500">
            Established in 2000, Airport DirectoryWorld has since positioned itself as one of the leading
            companies...
          </p>
        </div>
        <div>
          <h3 className="text-base font-semibold">Booking Flights with Airport DirectoryWorld</h3>
          <p className="text-sm text-gray-700 cursor-pointer hover:text-blue-500">
            At Airport DirectoryWorld, you can find the best of deals and cheap air tickets to any place
            you want...
          </p>
        </div>
        <div>
          <h3 className="text-base font-semibold">Domestic Flights with Airport DirectoryWorld</h3>
          <p className="text-sm text-gray-700 cursor-pointer hover:text-blue-500">
            Airport DirectoryWorld is India's leading player for flight bookings, and have a dominant position
            in the domestic flights sector...
          </p>
        </div>
      </div>
      <div className="bg-black text-gray-500 text-sm py-12">
        <div className="flex justify-between w-11/12 mx-auto">
          <div className="flex gap-4 items-center text-white">
            <FacebookIcon />
            <TwitterIcon />
          </div>
          <div>
            <p>© 2021 Airport Directory World PVT. LTD.</p>
            <p>Country India USA UAE</p>
          </div>
        </div>
      </div>
    </div>
  );
};
