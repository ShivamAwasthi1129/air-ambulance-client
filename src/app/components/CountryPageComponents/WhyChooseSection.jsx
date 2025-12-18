"use client";
import React from "react";
import { FaQuoteLeft, FaArrowRight, FaCheckCircle, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

export default function WhyChooseSection({ data }) {
  const secondaryArticle =
    data && Array.isArray(data) && data[0]?.secondaryArticle
      ? data[0].secondaryArticle
      : {};

  const mainHeading =
    secondaryArticle.mainHeading || "Why Choose Charter Flights Aviation?";
  const mainParagraphs =
    secondaryArticle.paragraphs && secondaryArticle.paragraphs.length > 0
      ? secondaryArticle.paragraphs
      : [
          "Looking for the best charter flights? Our affordable private jet, helicopter, air ambulance and air charter services are tailored to meet your travel needs.",
          "Experience the convenience of low-cost charter flights with top-tier safety and comfort.",
        ];

  const subArticles =
    secondaryArticle.subArticles && secondaryArticle.subArticles.length > 0
      ? secondaryArticle.subArticles
      : [
          {
            heading: "Premium Air Charter Service - Charter Flights Aviation",
            paragraphs: [
              "Charter Flights Aviation offers top-tier air charter services, providing seamless booking for private jets, luxury air charters, and more.",
              "Experience the highest level of convenience and comfort with our VIP charter flights, catering to both business travelers and leisure seekers.",
            ],
            image: "https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg",
          },
        ];

  return (
    <section className="relative py-12 bg-[#f7f9fc] overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 bg-[#e8f4ff] text-[#008cff] px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <FaStar className="text-xs" />
            Why Choose Us
          </span>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 max-w-3xl mx-auto">
            {mainHeading}
          </h2>

          <div className="max-w-3xl mx-auto space-y-3">
            {mainParagraphs.map((p, idx) => (
              <p key={idx} className="text-gray-600 text-base leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Services Grid */}
        <div className="space-y-10">
          {subArticles.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center gap-8`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2">
                <div className="relative group rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={service.image}
                    alt={service.heading}
                    className="w-full h-[300px] md:h-[350px] object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#051423]/70 via-transparent to-transparent" />
                  
                  {/* Quote Badge */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3">
                      <FaQuoteLeft className="text-[#008cff] text-lg flex-shrink-0 mt-1" />
                      <p className="text-gray-700 text-sm font-medium italic">
                        "Excellence in aviation, delivered with passion"
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="w-full lg:w-1/2">
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 hover:border-[#008cff]/20 transition-colors">
                  {/* Heading */}
                  <div className="flex items-start gap-3 mb-5">
                    <div className="w-1 h-12 bg-[#008cff] rounded-full flex-shrink-0" />
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                      {service.heading}
                    </h3>
                  </div>

                  {/* Paragraphs */}
                  <div className="space-y-3 mb-6">
                    {service.paragraphs.map((paragraph, i) => (
                      <p key={i} className="text-gray-600 leading-relaxed text-sm">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Feature Points */}
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {["Safety First", "24/7 Support", "Best Prices", "Luxury Fleet"].map(
                      (feature, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <FaCheckCircle className="text-[#008cff] text-xs" />
                          <span>{feature}</span>
                        </div>
                      )
                    )}
                  </div>

                  {/* CTA Button */}
                  <button className="inline-flex items-center gap-2 bg-[#008cff] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#0070cc] transition-colors text-sm">
                    Learn More
                    <FaArrowRight className="text-xs" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-[#051423] to-[#1e4976] rounded-2xl p-6 md:p-8 shadow-xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { number: "15+", label: "Years Experience" },
              { number: "500+", label: "Aircraft Fleet" },
              { number: "10K+", label: "Happy Clients" },
              { number: "50+", label: "Countries Served" },
            ].map((stat, idx) => (
              <div key={idx} className="group">
                <h4 className="text-3xl md:text-4xl font-bold text-[#008cff] mb-1 group-hover:scale-105 transition-transform">
                  {stat.number}
                </h4>
                <p className="text-white/70 text-xs md:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
