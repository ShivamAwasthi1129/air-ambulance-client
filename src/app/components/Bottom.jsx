"use client";
import React, { useEffect, useState, useRef } from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PinterestIcon from "@mui/icons-material/Pinterest";
import InstagramIcon from "@mui/icons-material/Instagram";
import GoogleIcon from "@mui/icons-material/Google";
import Link from "next/link";
import { FaPlane, FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";

export const Bottom = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("Worldwide");

  useEffect(() => {
    if (typeof window !== "undefined") {
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

  useEffect(() => {
    fetch("https://admin.airambulanceaviation.co.in/api/contact?limit=255")
      .then((r) => r.json())
      .then((data) => {
        setCountries(data.data || []);
      });
  }, []);

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

  const socialLinks = [
    { icon: FacebookIcon, href: "https://www.facebook.com/charterflight/", label: "Facebook" },
    { icon: YouTubeIcon, href: "https://www.youtube.com/@CharterflightsAviation/featured", label: "YouTube" },
    { icon: LinkedInIcon, href: "https://www.linkedin.com/company/charter-flights-aviation/", label: "LinkedIn" },
    { icon: InstagramIcon, href: "https://www.instagram.com/charterflightsaviation/", label: "Instagram" },
    { icon: PinterestIcon, href: "https://in.pinterest.com/charterflightsa/", label: "Pinterest" },
  ];

  return (
    <footer className="relative bg-[#0a1628] text-white overflow-hidden">
      {/* Top Gradient Line */}
      <div className="h-1 bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37]" />

      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#1e4976]/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Top Section - Logo & Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 pb-12 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#f4d03f] flex items-center justify-center">
              <FaPlane className="text-[#0a1628] text-2xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Charter Flights Aviation®</h3>
              <p className="text-white/60 text-sm">Your Ultimate Private Jet Solution</p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="w-full lg:w-auto">
            <p className="text-white/80 mb-3 text-sm">Subscribe for exclusive offers & updates</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 lg:w-72 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#d4af37] transition-colors"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a1628] font-bold rounded-xl hover:shadow-lg hover:shadow-[#d4af37]/30 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-12">
          {/* Column 1 - About */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-[#d4af37]" />
              About Us
            </h4>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Charter Flights Aviation® (CFA) is a global leader in private jet charters, 
              business jets, luxury air travel, helicopter services, and air ambulance services. 
              Experience premium aviation with unmatched comfort and safety.
            </p>
            
            {/* Country Selector */}
            <div className="relative" ref={selectRef}>
              <label className="text-xs text-[#d4af37] font-semibold mb-2 block">
                Select Your Region
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#d4af37] transition-colors appearance-none cursor-pointer"
              >
                <option value="Worldwide" className="bg-[#0a1628]">Worldwide</option>
                {countries.map((c) => (
                  <option key={c._id} value={c.country} className="bg-[#0a1628]">
                    {c.country
                      .split("-")
                      .map((w) => w[0].toUpperCase() + w.slice(1))
                      .join(" ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-[#d4af37]" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {(footerLinks.length > 0
                ? footerLinks.map((link) => ({ name: link.name, url: link.url }))
                : [
                    { name: "Private Jets", url: "#" },
                    { name: "Helicopters", url: "#" },
                    { name: "Air Ambulance", url: "#" },
                    { name: "Charter Flights", url: "#" },
                    { name: "Empty Leg Flights", url: "#" },
                    { name: "About Us", url: "/aboutUs" },
                  ]
              ).map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.url}
                    target={link.url.startsWith("http") ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-[#d4af37] transition-colors flex items-center gap-2 group"
                  >
                    <FaArrowRight className="text-xs text-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-[#d4af37]" />
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="text-[#d4af37]" />
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1">Email Us</p>
                  <a href="mailto:charterflights@charterflightsaviation.com" className="text-white/80 hover:text-[#d4af37] transition-colors text-sm">
                    charterflights@charterflightsaviation.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <FaPhone className="text-[#d4af37]" />
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1">24/7 Support</p>
                  <p className="text-white/80 text-sm">Available Worldwide</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-[#d4af37]" />
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1">Headquarters</p>
                  <p className="text-white/80 text-sm">Global Operations</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4 - Social & App */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-[#d4af37]" />
              Connect With Us
            </h4>
            
            {/* Social Icons */}
            <div className="flex gap-3 mb-8">
              {socialLinks.map((social, idx) => (
                <Link
                  key={idx}
                  href={social.href}
                  target="_blank"
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#d4af37] hover:text-[#0a1628] transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon fontSize="small" className="group-hover:scale-110 transition-transform" />
                </Link>
              ))}
            </div>

            {/* Payment Methods */}
            <p className="text-xs text-white/50 mb-3">Accepted Payment Methods</p>
            <div className="flex gap-3 mb-6">
              {["Visa", "Mastercard", "Amex", "Discover"].map((card, idx) => (
                <div key={idx} className="px-3 py-2 bg-white rounded-lg">
                  <span className="text-xs font-bold text-[#0a1628]">{card}</span>
                </div>
              ))}
            </div>

            {/* App Downloads */}
            <div className="space-y-2">
              <a href="#" className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                <span className="text-2xl">🍎</span>
                <div>
                  <p className="text-xs text-white/50">Download on</p>
                  <p className="font-semibold text-sm">App Store</p>
                </div>
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                <span className="text-2xl">🤖</span>
                <div>
                  <p className="text-xs text-white/50">Get it on</p>
                  <p className="font-semibold text-sm">Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm text-center md:text-left">
            © 2025 Charter Flights Aviation®. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/termsAndCondition" className="text-white/50 hover:text-[#d4af37] transition-colors">
              Terms & Conditions
            </Link>
            <Link href="#" className="text-white/50 hover:text-[#d4af37] transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-white/50 hover:text-[#d4af37] transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
