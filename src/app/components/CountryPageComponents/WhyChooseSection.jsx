"use client";
import React from "react";
import { FaQuoteLeft, FaArrowRight, FaCheckCircle } from "react-icons/fa";
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
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#d4af37]/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#0a1628] text-[#d4af37] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse" />
            Why Choose Us
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-[#0a1628] mb-6 max-w-3xl mx-auto">
            {mainHeading}
          </h2>

          <div className="max-w-4xl mx-auto space-y-4">
            {mainParagraphs.map((p, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-gray-600 text-lg leading-relaxed"
              >
                {p}
              </motion.p>
            ))}
          </div>
        </motion.div>

        {/* Services Grid */}
        <div className="space-y-16">
          {subArticles.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center gap-10`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2">
                <div className="relative group">
                  {/* Decorative Frame */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-[#d4af37] to-[#b87333] rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity blur-xl" />
                  
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                    <img
                      src={service.image}
                      alt={service.heading}
                      className="w-full h-[350px] md:h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/60 via-transparent to-transparent" />
                    
                    {/* Quote Badge */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="glass-card p-4 flex items-start gap-3">
                        <FaQuoteLeft className="text-[#d4af37] text-xl flex-shrink-0 mt-1" />
                        <p className="text-white text-sm font-medium italic">
                          "Excellence in aviation, delivered with passion"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a1628] px-6 py-3 rounded-2xl shadow-xl font-bold">
                    Premium
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="w-full lg:w-1/2">
                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                  {/* Heading with accent */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-1 h-16 bg-gradient-to-b from-[#d4af37] to-[#b87333] rounded-full flex-shrink-0" />
                    <h3 className="text-2xl md:text-3xl font-bold text-[#0a1628] leading-tight">
                      {service.heading}
                    </h3>
                  </div>

                  {/* Paragraphs */}
                  <div className="space-y-4 mb-8">
                    {service.paragraphs.map((paragraph, i) => (
                      <p
                        key={i}
                        className="text-gray-600 leading-relaxed text-base"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Feature Points */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {["Safety First", "24/7 Support", "Best Prices", "Luxury Fleet"].map(
                      (feature, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <FaCheckCircle className="text-[#d4af37]" />
                          <span>{feature}</span>
                        </div>
                      )
                    )}
                  </div>

                  {/* CTA Button */}
                  <button className="inline-flex items-center gap-2 bg-[#0a1628] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1e4976] transition-colors group">
                    Learn More
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-[#0a1628] to-[#1e4976] rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "15+", label: "Years Experience" },
              { number: "500+", label: "Aircraft Fleet" },
              { number: "10K+", label: "Happy Clients" },
              { number: "50+", label: "Countries Served" },
            ].map((stat, idx) => (
              <div key={idx} className="group">
                <h4 className="text-4xl md:text-5xl font-bold text-[#d4af37] mb-2 group-hover:scale-110 transition-transform">
                  {stat.number}
                </h4>
                <p className="text-white/70 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
