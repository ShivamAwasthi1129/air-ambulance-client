"use client";
import { FaPlane, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function FlyPrivateSection({ data }) {
  const mainArticle = data && Array.isArray(data) && data[0]?.mainArticle ? data[0].mainArticle : {};

  const imageSrc = "https://images.pexels.com/photos/3787839/pexels-photo-3787839.jpeg";

  const paragraphs = mainArticle.paragraphs && mainArticle.paragraphs.length > 0
    ? mainArticle.paragraphs
    : [
        "Charter Flight AirAviation specializes in luxury private and business jet charters to and from Dubai, UAE. We offer access to a curated fleet of private aircraft at highly competitive rates—designed to match your needs and exceed your expectations.",
        "We also offer empty-leg flights and cost-efficient turboprop charters. With five airports within 50 miles of Dubai—like DXB, SHJ, and RKT—we make private air travel seamless and flexible.",
        "At Charter Flight AirAviation, we're committed to delivering a world-class charter experience backed by 24/7 personalized support."
      ];

  const keyPoints = mainArticle.highlights && mainArticle.highlights.length > 0
    ? mainArticle.highlights
    : [
        "Midsize Jets: Hawker 800XP, Learjet 60XR",
        "Large Jets: Challenger 604, Legacy 600, Falcon 900DX",
        "Long-Range: Global Express XRS",
        "VIP Airliners: Embraer Lineage 1000"
      ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            <span className="text-[#008cff]">{mainArticle.heading || "Fly Private"}</span> – Jets, Routes & Airports Covered
          </h2>
        </motion.div>

        {/* Content layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 space-y-5"
          >
            {/* First paragraph */}
            <div className="bg-[#f7f9fc] rounded-2xl p-5 border border-gray-100">
              <p className="text-gray-700 text-base leading-relaxed">
                {mainArticle.mainParagraph || paragraphs[0]}
              </p>
            </div>

            {/* Key points section */}
            <div className="bg-white rounded-2xl p-5 border border-[#008cff]/20">
              <h3 className="text-[#008cff] font-semibold text-base mb-4 flex items-center gap-2">
                <FaPlane className="text-sm" />
                Popular aircraft available in the region:
              </h3>
              <div className="space-y-2">
                {keyPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <FaCheckCircle className="text-[#008cff] text-xs mt-1.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Remaining paragraphs */}
            <div className="space-y-3">
              {paragraphs.slice(1).map((para, idx) => (
                <p key={idx} className="text-gray-700 text-base leading-relaxed">{para}</p>
              ))}
            </div>
          </motion.div>

          {/* Right section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <img
                src={imageSrc}
                alt="Dubai Charter"
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#051423] to-transparent p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#008cff] rounded-lg flex items-center justify-center">
                    <FaPlane className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Ready to fly?</p>
                    <p className="text-white/70 text-xs">Get instant quote for your journey</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
