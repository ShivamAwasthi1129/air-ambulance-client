"use client";
import React, { useEffect, useState, useRef } from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PinterestIcon from "@mui/icons-material/Pinterest";
import InstagramIcon from "@mui/icons-material/Instagram";
import Link from "next/link";
import { FaPlane, FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowRight, FaWhatsapp, FaShieldAlt, FaHeadset, FaGlobe } from "react-icons/fa";

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
    { icon: FacebookIcon, href: "https://www.facebook.com/charterflight/", label: "Facebook", color: "#1877f2" },
    { icon: YouTubeIcon, href: "https://www.youtube.com/@CharterflightsAviation/featured", label: "YouTube", color: "#ff0000" },
    { icon: LinkedInIcon, href: "https://www.linkedin.com/company/charter-flights-aviation/", label: "LinkedIn", color: "#0077b5" },
    { icon: InstagramIcon, href: "https://www.instagram.com/charterflightsaviation/", label: "Instagram", color: "#e4405f" },
    { icon: PinterestIcon, href: "https://in.pinterest.com/charterflightsa/", label: "Pinterest", color: "#bd081c" },
  ];

  const quickLinks = [
    { name: "Private Jets", url: "#" },
    { name: "Helicopters", url: "#" },
    { name: "Air Ambulance", url: "#" },
    { name: "Charter Flights", url: "#" },
    { name: "Empty Leg Flights", url: "#" },
  ];

  const companyLinks = [
    { name: "About Us", url: "/aboutUs" },
    { name: "Contact Us", url: "/getInTouch" },
    { name: "Terms & Conditions", url: "/termsAndCondition" },
    { name: "Privacy Policy", url: "#" },
    { name: "Careers", url: "#" },
  ];

  return (
    <footer className="bg-[#051423] text-white">
      {/* Trust Banner */}
      <div className="bg-[#0a2540] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <FaPlane className="text-[#008cff]" />, title: "500+ Aircraft", desc: "Worldwide fleet" },
              { icon: <FaShieldAlt className="text-[#4caf50]" />, title: "100% Safe", desc: "Certified operations" },
              { icon: <FaHeadset className="text-[#ff6b00]" />, title: "24/7 Support", desc: "Always available" },
              { icon: <FaGlobe className="text-[#9c27b0]" />, title: "50+ Countries", desc: "Global coverage" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-xl">
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold text-sm">{item.title}</p>
                  <p className="text-xs text-white/60">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1 - About */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#008cff] rounded-lg flex items-center justify-center">
                <FaPlane className="text-white text-lg" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Charter<span className="text-[#008cff]">Flights</span></h3>
                <p className="text-[10px] text-white/50">Aviation®</p>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed mb-6 max-w-sm">
              Charter Flights Aviation® (CFA) is a global leader in private jet charters, 
              business jets, luxury air travel, helicopter services, and air ambulance services.
            </p>
            
            {/* Country Selector */}
            <div className="mb-6" ref={selectRef}>
              <label className="text-xs text-white/50 font-semibold mb-2 block uppercase tracking-wider">
                Select Region
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full max-w-xs px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#008cff] transition-colors text-sm"
              >
                <option value="Worldwide" className="bg-[#051423]">Worldwide</option>
                {countries.map((c) => (
                  <option key={c._id} value={c.country} className="bg-[#051423]">
                    {c.country.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Social Icons */}
            <div className="flex gap-2">
              {socialLinks.map((social, idx) => (
                <Link
                  key={idx}
                  href={social.href}
                  target="_blank"
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label={social.label}
                  style={{ '--hover-color': social.color }}
                >
                  <social.icon fontSize="small" />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2 - Services */}
          <div>
            <h4 className="text-sm font-bold mb-4 uppercase tracking-wider">Services</h4>
            <ul className="space-y-2">
              {(footerLinks.length > 0 ? footerLinks.map((link) => ({ name: link.name, url: link.url })) : quickLinks)
                .map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.url}
                    target={link.url.startsWith("http") ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="text-sm text-white/70 hover:text-[#008cff] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Company */}
          <div>
            <h4 className="text-sm font-bold mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.url}
                    className="text-sm text-white/70 hover:text-[#008cff] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h4 className="text-sm font-bold mb-4 uppercase tracking-wider">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaEnvelope className="text-[#008cff] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-white/50 mb-0.5">Email</p>
                  <a href="mailto:charterflights@charterflightsaviation.com" className="text-sm text-white/80 hover:text-[#008cff] transition-colors break-all">
                    charterflights@charterflightsaviation.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaPhone className="text-[#008cff] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-white/50 mb-0.5">Phone</p>
                  <p className="text-sm text-white/80">24/7 Support Available</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaWhatsapp className="text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-white/50 mb-0.5">WhatsApp</p>
                  <p className="text-sm text-white/80">Chat with us anytime</p>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-xs text-white/50 mb-2 uppercase tracking-wider">Newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-[#008cff] text-sm"
                />
                <button className="px-4 py-2 bg-[#008cff] text-white rounded-lg text-sm font-semibold hover:bg-[#0057a8] transition-colors">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p className="text-white/50 text-center md:text-left">
              © 2025 Charter Flights Aviation®. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-white/50">Made with ❤️ for global travelers</span>
              <div className="flex gap-3">
                {["Visa", "MC", "Amex"].map((card, idx) => (
                  <div key={idx} className="px-2 py-1 bg-white/10 rounded text-[10px] font-medium text-white/70">
                    {card}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
