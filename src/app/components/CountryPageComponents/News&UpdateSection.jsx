"use client";
import { FaCalendarAlt, FaArrowRight, FaNewspaper } from "react-icons/fa";
import { motion } from "framer-motion";

export default function NewsAndUpdates({ data }) {
  const news =
    data && Array.isArray(data) && data[0]?.news && data[0].news.length > 0
      ? data[0].news
      : [
          {
            image: "https://images.pexels.com/photos/3957983/pexels-photo-3957983.jpeg",
            heading: "News and Updates Covid 19 India State wise quarantine Regulations",
            paragraph:
              "Quarantine requirements Chennai India by air. The passenger must know the quarantine requirements for each state of India. However, an RT-PCR report with 48-72 hour validity is the best document to fly. Charter flights to India: All states have the independent administration to avoid coronavirus pandemic view of COVID-19. Please download the latest updates on state-wise Covid-19 India State-wise quarantine Regulations.",
            date: "2021-05-30T00:00:00.000Z",
          },
        ];

  const buttons = [
    {
      label: "COVID 19 INDIA STATE WISE QUARANTINE REGULATIONS",
      link: "/covid-regulations",
    },
    {
      label: "CHARTER FLIGHTS AVIATION",
      link: "/charter-flights",
    },
    {
      label: "PRIVATE JETS AVIATION",
      link: "/private-jets",
    },
  ];

  return (
    <section className="py-12 bg-[#f7f9fc]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="inline-flex items-center gap-2 bg-[#e8f4ff] text-[#008cff] px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <FaNewspaper className="text-xs" />
            Latest Updates
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            News & Announcements
          </h2>
        </motion.div>

        {/* News Block */}
        <div className="space-y-5">
          {news.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-[#008cff]/20 transition-colors shadow-sm"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-1/3 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.heading}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                {/* Content */}
                <div className="flex-1 p-5 md:p-6">
                  <div className="flex items-center gap-2 text-[#008cff] text-xs font-medium mb-3">
                    <FaCalendarAlt className="text-xs" />
                    {item.date
                      ? new Date(item.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Date not available"}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight">
                    {item.heading}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                    {item.paragraph}
                  </p>
                  <button className="inline-flex items-center gap-2 text-[#008cff] font-semibold text-sm hover:gap-3 transition-all">
                    Read More
                    <FaArrowRight className="text-xs" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-3 justify-center mt-8"
        >
          {buttons.map((btn, i) => (
            <a
              key={i}
              href={btn.link}
              className="bg-[#008cff] text-white px-4 py-2.5 rounded-xl hover:bg-[#0070cc] transition-colors text-xs font-semibold shadow-sm"
            >
              {btn.label}
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
