import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PinterestIcon from "@mui/icons-material/Pinterest";
import InstagramIcon from "@mui/icons-material/Instagram";
import GoogleIcon from "@mui/icons-material/Google";
import Link from "next/link";

export const Bottom = () => {
  return (
    <div className="bg-gray-100 text-gray-800 w-full px-4 py-10 mt-48">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1 */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Charter Flights Aviation® – Your Ultimate Private Jet & Air Charter Solution
          </h3>
          <p className="text-sm leading-relaxed">
            Charter Flights Aviation® (CFA) is a global leader in private jet charters, business jets, luxury air travel, helicopter services, air ambulance serivices, and seaplane rentals. As a trusted name in air charter services, we provide a premium fleet of private planes tailored for executive travel, leisure, and special occasions. Whether you're booking a private jet for business or indulging in a luxury helicopter ride, CFA ensures an unparalleled experience with top-tier comfort, safety, and convenience. Excitingly, reservations are now open for the exclusive 2025 Flight Party – a once-in-a-lifetime experience in luxury aviation. Secure your seat today and elevate your journey to new heights! Book now for the ultimate flight experience!
          </p>
          <div className="mt-4">
            <label className="text-sm font-semibold">Choose Near Office:</label>
            <select className="border border-gray-400 mt-1 p-1 text-sm w-full">
              <option>Worldwide</option>
              <option>India</option>
              <option>UAE</option>
              <option>USA</option>
            </select>
            <p className="text-sm mt-2 text-blue-600">✉️ charterflights@charterflightsaviation.com</p>
            <div className="flex space-x-2 mt-3">
              <FacebookIcon />
              <YouTubeIcon />
              <GoogleIcon />
              <LinkedInIcon />
              <InstagramIcon />
              <PinterestIcon />
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Private clouds awited you Unlock the capabilities of take flight with Charter Flights Aviation® to explore their formidable potential! sky in private
          </h3>
          <ul className="space-y-2 text-sm">
            <li>▶ Helicopter</li>
            <li>▶ Charter Flights</li>
            <li>▶ Private Jet</li>
            <li>▶ Empty Leg</li>
            <li>▶ Booking</li>
            <li>▶ About</li>
            <li>▶ Latest Jobs</li>
            <li>▶ Press Releases</li>
            <li>▶ Updates</li>
            <li>▶ Maha Kumbh Mela 2025</li>
            <li>▶ Medical Partner</li>
            <li>▶ Ownership Club</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            "Get Ready to Soar with the Ultimate Flight Party in the Clouds: Stay Tuned for Exciting Updates!"
          </h3>
          <p className="text-sm mb-2">
            You might be just one flight away from flying free with us! Empty leg ferry flights could
            be waiting for you. Sign up to get offers and updates.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="your email"
              className="border border-gray-400 p-2 text-sm w-full"
            />
            <button className="bg-green-500 text-white px-3">✔</button>
          </div>
          <p className="text-xs mt-2">
            We respect your privacy and time—no junk with us.
          </p>
          <p className="text-sm mt-3">
            "Here’s the exciting part – we have some fantastic surprises in store for you! Join our vibrant social media channels to enjoy valuable gifts and seize incredible offers. Don’t miss out on the chance to be part of the excitement. Follow us now to stay informed and be the first to uncover all the captivating details!".
          </p>
          <div className="flex items-center mt-3 space-x-2">
            <p className="text-xs">Payment methods:</p>
            <img src="https://www.citypng.com/public/uploads/preview/hd-visa-payment-logo-png-7017516947777256ndfrewd52.png" alt="Visa" className="h-10" />
            <img src="https://images.seeklogo.com/logo-png/8/2/master-card-logo-png_seeklogo-89117.png" alt="MasterCard" className="h-10" />
            <img src="https://www.citypng.com/public/uploads/preview/hd-amex-american-express-logo-png-701751694708970jttzjjyo6e.png" alt="Amex" className="h-10" />
            <img src="https://e7.pngegg.com/pngimages/557/637/png-clipart-discover-financial-services-discover-card-credit-card-diners-club-international-credit-card-text-rectangle-thumbnail.png" alt="Discover" className="h-10" />
          </div>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            "Join us on our official social media channels for Charter Flights Aviation ® !"
          </h3>
          <p className="text-sm mb-2">Fly exclusive, connect with us:</p>
          <div className="flex space-x-2 text-yellow-600">
            <Link href="https://www.facebook.com/charterflight/" target="_blank">
              <FacebookIcon />
            </Link>
            <Link href="https://www.youtube.com/@CharterflightsAviation/featured" target="_blank">
              <YouTubeIcon />
            </Link>
            <Link href="https://workspaceupdates.googleblog.com/2023/04/new-community-features-for-google-chat-and-an-update-currents%20.html" target="_blank">
              <GoogleIcon />
            </Link>
            <Link href="https://www.linkedin.com/company/charter-flights-aviation/" target="_blank">
              <LinkedInIcon />
            </Link>
            <Link href="https://www.instagram.com/charterflightsaviation/" target="_blank">
              <InstagramIcon />
            </Link>
            <Link href="https://in.pinterest.com/charterflightsa/" target="_blank">
              <PinterestIcon />
            </Link>
          </div>
          <div className="mt-4">
            <iframe
              title="Facebook Page"
              src="https://www.charterflightsaviation.com/images/facebookpage.jpg"
              width="250"
              height="220"
              style={{ border: "none", overflow: "hidden" }}
              allow="encrypted-media"
            ></iframe>
          </div>
          <div className="flex flex-col mt-4 space-y-2">
            <a href="#" className="bg-black text-white text-sm py-2 px-3 text-center">
              DOWNLOAD FROM APPLE STORE
            </a>
            <a href="#" className="bg-yellow-500 text-black text-sm py-2 px-3 text-center">
              DOWNLOAD FROM GOOGLE PLAY
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
