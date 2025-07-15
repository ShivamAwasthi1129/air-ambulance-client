"use client";
import { useState } from "react";

export default function TermsAndDisclaimer({ data }) {
  // Get the termsAndDisclaimer object
  const termsAndDisclaimer =
    data && Array.isArray(data) && data[0]?.termsAndDisclaimer
      ? data[0].termsAndDisclaimer
      : null;

  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);

  return (
    <section className="px-5 py-12 md:px-16 bg-white text-gray-800 max-w-[800px] mx-auto">
      <h2 className="text-center text-xl md:text-2xl font-bold text-blue-600 mb-10">
        Terms And Disclaimer
      </h2>

      <div className="bg-white rounded-xl shadow-xl p-6 md:p-10 space-y-4">
        {termsAndDisclaimer ? (
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={toggle}
              className="w-full text-left px-4 py-3 font-medium text-gray-800 flex justify-between items-center hover:bg-blue-50 transition"
            >
              {termsAndDisclaimer.termsAndUse}
              <span className="text-xl">{open ? "−" : "+"}</span>
            </button>
            <div
              className={`faq-answer${open ? " open" : ""} px-4 py-3 text-gray-600 border-t bg-gray-50`}
              style={{
                maxHeight: open ? 300 : 0,
                opacity: open ? 1 : 0,
                overflow: "hidden",
                transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s",
              }}
            >
              {termsAndDisclaimer.Disclaimer}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 italic">No terms or disclaimer available.</p>
        )}
      </div>
    </section>
  );
}