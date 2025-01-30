import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";

export const Bottom = () => {
  return (
    <div className="text-gray-700 w-full mt-10">
      {/* Top Section: 3-column layout */}
      <div className="bg-gray-100 py-10">
        <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="mb-4 text-base md:text-lg font-semibold text-gray-800 uppercase">
              PRODUCT OFFERING
            </h3>
            <ul className="space-y-2">
              <li className="text-sm hover:text-blue-500 cursor-pointer">Flights</li>
              <li className="text-sm hover:text-blue-500 cursor-pointer">International Flights</li>
              <li className="text-sm hover:text-blue-500 cursor-pointer">Charter Flights</li>
              <li className="text-sm hover:text-blue-500 cursor-pointer">Hotels</li>
              <li className="text-sm hover:text-blue-500 cursor-pointer">International Hotels</li>
              <li className="text-sm hover:text-blue-500 cursor-pointer">Homestays and Villas</li>
              <li className="text-sm hover:text-blue-500 cursor-pointer">Activities</li>
              <li className="text-sm hover:text-blue-500 cursor-pointer">Holidays In India</li>
              <li className="text-sm hover:text-blue-500 cursor-pointer">International Holidays</li>
              {/* Add remaining items */}
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="mb-4 text-base md:text-lg font-semibold text-gray-800 uppercase">
              Airport DirectoryWorld
            </h3>
            <ul className="space-y-2">
              <li className="text-sm hover:text-blue-500 cursor-pointer">About Us</li>
              <li className="text-sm hover:text-blue-500 cursor-pointer">Investor Relations</li>
              <li className="text-sm hover:text-blue-500 cursor-pointer">Careers</li>
              <li className="text-sm hover:text-blue-500 cursor-pointer">MMT Foundation</li>
              <li className="text-sm hover:text-blue-500 cursor-pointer">CSR Policy</li>
              {/* Add remaining items */}
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="mb-4 text-base md:text-lg font-semibold text-gray-800 uppercase">
              ABOUT THIS SITE
            </h3>
            <ul className="space-y-2">
              <li className="text-sm hover:text-blue-500 cursor-pointer">Contact Us</li>
              <li className="text-sm hover:text-blue-500 cursor-pointer">Payment Security</li>
              <li className="text-sm hover:text-blue-500 cursor-pointer">Privacy Policy</li>
              <li className="text-sm hover:text-blue-500 cursor-pointer">User Agreement</li>
              <li className="text-sm hover:text-blue-500 cursor-pointer">Terms of Service</li>
              {/* Add remaining items */}
            </ul>
          </div>
        </div>
      </div>

      {/* Quick & Important Links */}
      <div className="max-w-screen-xl mx-auto px-4 mt-10">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 uppercase mb-2">
          QUICK LINKS
        </h3>
        <p className="text-sm md:text-base mb-6 leading-relaxed hover:text-blue-500 cursor-pointer">
          Delhi Chennai Flights, Delhi Mumbai Flights, Delhi Goa Flights, Chennai Mumbai flights,
          Mumbai Hyderabad flights, Kolkata to Rupsi Flights, Rupsi to Guwahati Flights...
        </p>

        <h3 className="text-base md:text-lg font-semibold text-gray-800 uppercase mb-2">
          IMPORTANT LINKS
        </h3>
        <p className="text-sm md:text-base leading-relaxed hover:text-blue-500 cursor-pointer">
          Cheap Flights, Flight Status, Kumbh Mela, Domestic Airlines, International Airlines, Indigo,
          Spicejet, GoAir, Air Asia...
        </p>
      </div>

      {/* Middle Info Section */}
      <div className="bg-gray-50 py-10 mt-10">
        <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Box 1 */}
          <div>
            <h3 className="mb-2 text-base md:text-lg font-semibold text-gray-800">
              Why Airport DirectoryWorld?
            </h3>
            <p className="text-sm leading-relaxed hover:text-blue-500 cursor-pointer">
              Established in 2000, Airport DirectoryWorld has since positioned itself as one of the
              leading companies...
            </p>
          </div>

          {/* Box 2 */}
          <div>
            <h3 className="mb-2 text-base md:text-lg font-semibold text-gray-800">
              Booking Flights with Airport DirectoryWorld
            </h3>
            <p className="text-sm leading-relaxed hover:text-blue-500 cursor-pointer">
              At Airport DirectoryWorld, you can find the best of deals and cheap air tickets to any
              place you want...
            </p>
          </div>

          {/* Box 3 */}
          <div>
            <h3 className="mb-2 text-base md:text-lg font-semibold text-gray-800">
              Domestic Flights with Airport DirectoryWorld
            </h3>
            <p className="text-sm leading-relaxed hover:text-blue-500 cursor-pointer">
              Airport DirectoryWorld is India's leading player for flight bookings, and have a 
              dominant position in the domestic flights sector...
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black py-6 mt-10">
        <div className="max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-gray-400 space-y-4 md:space-y-0">
          {/* Social Icons */}
          <div className="flex gap-4 text-white">
            <FacebookIcon />
            <TwitterIcon />
          </div>
          {/* Footer Text */}
          <div className="text-center md:text-right text-sm">
            <p>© 2021 Airport Directory World PVT. LTD.</p>
            <p>Country: India | USA | UAE</p>
          </div>
        </div>
      </div>
    </div>
  );
};
