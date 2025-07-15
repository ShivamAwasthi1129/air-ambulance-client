"use client";
import { useState } from "react";

export default function FAQSection({ data }) {
  const faqs =
    data && Array.isArray(data) && data[0]?.faqs ? data[0].faqs : [];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="px-5 py-12 md:px-16 bg-white text-gray-800 max-w-[800px] mx-auto">
      <h2 className="text-center text-xl md:text-2xl font-bold text-blue-600 mb-10">
        Frequently Asked Questions
      </h2>

      <div className="bg-white rounded-xl shadow-xl p-6 md:p-10 space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={faq._id || index}
            className="border border-gray-200 rounded-lg"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left px-4 py-3 font-medium text-gray-800 flex justify-between items-center hover:bg-blue-50 transition"
            >
              {faq.question}
              <span className="text-xl">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>

            {openIndex === index && (
              <div className="px-4 py-3 text-gray-600 border-t bg-gray-50">
                {faq.answer}
              </div>
            )}
          </div>
        ))}

        {faqs.length === 0 && (
          <p className="text-gray-500 italic">No FAQs available.</p>
        )}
      </div>
    </section>
  );
}
