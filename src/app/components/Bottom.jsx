import React, { useEffect, useState, useRef } from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PinterestIcon from "@mui/icons-material/Pinterest";
import InstagramIcon from "@mui/icons-material/Instagram";
import GoogleIcon from "@mui/icons-material/Google";
import Link from "next/link";

export const Bottom = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("Worldwide");
  useEffect(() => {
    // Set country from sessionStorage after component mounts
    if (typeof window !== 'undefined') {
      const savedCountry = sessionStorage.getItem("country_name");
      if (savedCountry) {
        setSelectedCountry(savedCountry);
      }
    }
  }, []);
  const [footerLinks, setFooterLinks] = useState([]);
  const [footerImage, setFooterImage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const selectRef = useRef(null);
  useEffect(() => {
    const updateCountry = () => {
      setSelectedCountry(sessionStorage.getItem("country_name") || "Worldwide");
    };
    window.addEventListener("countryNameChanged", updateCountry);
    return () => window.removeEventListener("countryNameChanged", updateCountry);
  }, []);

  // Fetch country list on mount
  useEffect(() => {
    fetch("https://admin.airambulanceaviation.co.in/api/contact?limit=255")
      .then((r) => r.json())
      .then((data) => {
        setCountries(data.data || []);
      });
  }, []);

  // Fetch footer links and image when selectedCountry changes
  useEffect(() => {
    if (!selectedCountry) return;
    fetch(
      `https://s4ltdt9g72.execute-api.ap-south-1.amazonaws.com/aviation/footer/${selectedCountry}`
    )
      .then((r) => r.json())
      .then((data) => {
        setFooterLinks(data.links || []);
        setFooterImage(data.image || "");
      });
  }, [selectedCountry]);

  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="bg-gray-100 text-gray-800 w-full px-2 py-10 mt-4 text-xs md:text-sm">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
        {/* Column 1 */}
        <div>
          <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">
            Charter Flights Aviation® – Your Ultimate Private Jet & Air Charter Solution
          </h3>
          <p className="text-xs md:text-sm leading-relaxed">
            Charter Flights Aviation® (CFA) is a global leader in private jet charters, business jets, luxury air travel, helicopter services, air ambulance serivices, and seaplane rentals. As a trusted name in air charter services, we provide a premium fleet of private planes tailored for executive travel, leisure, and special occasions. Whether you're booking a private jet for business or indulging in a luxury helicopter ride, CFA ensures an unparalleled experience with top-tier comfort, safety, and convenience. Excitingly, reservations are now open for the exclusive 2025 Flight Party – a once-in-a-lifetime experience in luxury aviation. Secure your seat today and elevate your journey to new heights! Book now for the ultimate flight experience!
          </p>
          <div className="mt-3">
            <label className="text-xs font-semibold">Choose Near Office:</label>
            <div className="relative" ref={selectRef}>
              {/* Fake input to show Worldwide until focus */}
              {!showDropdown ? (
                <div
                  className="border border-gray-400 mt-1 p-1 text-xs w-full bg-white cursor-pointer rounded"
                  tabIndex={0}
                  onFocus={() => setShowDropdown(true)}
                  onClick={() => setShowDropdown(true)}
                >
                  {selectedCountry === "Worldwide"
                    ? "Worldwide"
                    : selectedCountry
                      .split("-")
                      .map((w) => w[0].toUpperCase() + w.slice(1))
                      .join(" ")}
                </div>
              ) : (
                <select
                  className="border border-gray-400 mt-1 p-1 text-xs w-full bg-white rounded"
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setShowDropdown(false);
                  }}
                  onBlur={() => setShowDropdown(false)}
                  autoFocus
                >
                  <option value="Worldwide">Worldwide</option>
                  {countries.map((c) => (
                    <option key={c._id} value={c.country}>
                      {c.country
                        .split("-")
                        .map((w) => w[0].toUpperCase() + w.slice(1))
                        .join(" ")}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <p className="text-xs mt-2 text-blue-600">
              ✉️ charterflights@charterflightsaviation.com
            </p>
            <div className="flex space-x-2 mt-3">
              <FacebookIcon fontSize="small" />
              <YouTubeIcon fontSize="small" />
              <GoogleIcon fontSize="small" />
              <LinkedInIcon fontSize="small" />
              <InstagramIcon fontSize="small" />
              <PinterestIcon fontSize="small" />
            </div>
          </div>
        </div>
        {/* Column 2 */}
        <div>
          <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">
            Private clouds await you. Unlock the capabilities of flight with Charter Flights Aviation®!
          </h3>
          <ul className="space-y-2 text-xs md:text-sm">
            {footerLinks.length > 0 ? (
              footerLinks.map((link) => (
                <li key={link._id}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 underline"
                  >
                    ▶ {link.name}
                  </a>
                </li>
              ))
            ) : (
              <>
                <li>▶ Helicopter</li>
                <li>▶ Charter Flights</li>
                <li>▶ Private Jet</li>
                <li>▶ Empty Leg</li>
                <li>▶ Booking</li>
                <li>▶ About</li>
              </>
            )}
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">
            "Get Ready to Soar with the Ultimate Flight Party in the Clouds: Stay Tuned for Exciting Updates!"
          </h3>
          <p className="text-xs md:text-sm mb-2">
            You might be just one flight away from flying free with us! Empty leg ferry flights could
            be waiting for you. Sign up to get offers and updates.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="your email"
              className="border border-gray-400 p-2 text-xs md:text-sm w-full"
            />
            <button className="bg-green-500 text-white px-3">✔</button>
          </div>
          <p className="text-xs mt-2">
            We respect your privacy and time—no junk with us.
          </p>
          <p className="text-xs md:text-sm mt-3">
            "Here’s the exciting part – we have some fantastic surprises in store for you! Join our vibrant social media channels to enjoy valuable gifts and seize incredible offers. Don’t miss out on the chance to be part of the excitement. Follow us now to stay informed and be the first to uncover all the captivating details!".
          </p>
          <div className="flex items-center mt-3 space-x-2">
            <p className="text-xs">Payment methods:</p>
            <img src="https://www.citypng.com/public/uploads/preview/hd-visa-payment-logo-png-7017516947777256ndfrewd52.png" alt="Visa" className="h-8 md:h-10" />
            <img src="https://images.seeklogo.com/logo-png/8/2/master-card-logo-png_seeklogo-89117.png" alt="MasterCard" className="h-8 md:h-10" />
            <img src="https://www.citypng.com/public/uploads/preview/hd-amex-american-express-logo-png-701751694708970jttzjjyo6e.png" alt="Amex" className="h-8 md:h-10" />
            <img src="https://e7.pngegg.com/pngimages/557/637/png-clipart-discover-financial-services-discover-card-credit-card-diners-club-international-credit-card-text-rectangle-thumbnail.png" alt="Discover" className="h-8 md:h-10" />
          </div>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">
            "Join us on our official social media channels for Charter Flights Aviation ® !"
          </h3>
          <p className="text-xs md:text-sm mb-2">Fly exclusive, connect with us:</p>
          <div className="flex space-x-2 text-yellow-600">
            <Link href="https://www.facebook.com/charterflight/" target="_blank">
              <FacebookIcon fontSize="small" />
            </Link>
            <Link href="https://www.youtube.com/@CharterflightsAviation/featured" target="_blank">
              <YouTubeIcon fontSize="small" />
            </Link>
            <Link href="https://workspaceupdates.googleblog.com/2023/04/new-community-features-for-google-chat-and-an-update-currents%20.html" target="_blank">
              <GoogleIcon fontSize="small" />
            </Link>
            <Link href="https://www.linkedin.com/company/charter-flights-aviation/" target="_blank">
              <LinkedInIcon fontSize="small" />
            </Link>
            <Link href="https://www.instagram.com/charterflightsaviation/" target="_blank">
              <InstagramIcon fontSize="small" />
            </Link>
            <Link href="https://in.pinterest.com/charterflightsa/" target="_blank">
              <PinterestIcon fontSize="small" />
            </Link>
          </div>
          <div className="mt-4 flex justify-center">
            {footerImage ? (
              <img
                src={footerImage}
                alt="Footer Country"
                width={250}
                height={220}
                className="rounded shadow"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <iframe
                title="Facebook Page"
                src="https://www.charterflightsaviation.com/images/facebookpage.jpg"
                width="250"
                height="220"
                style={{ border: "none", overflow: "hidden" }}
                allow="encrypted-media"
              ></iframe>
            )}
          </div>
          <div className="flex flex-col mt-4 space-y-2">
            <a href="#" className="bg-black text-white text-xs py-2 px-3 text-center">
              DOWNLOAD FROM APPLE STORE
            </a>
            <a href="#" className="bg-yellow-500 text-black text-xs py-2 px-3 text-center">
              DOWNLOAD FROM GOOGLE PLAY
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};