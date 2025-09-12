import React, { useState, useEffect, useMemo } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const extractAllGalleryImages = (aircraftGallery) => {
  if (!aircraftGallery) return [];
  const images = [];
  Object.keys(aircraftGallery).forEach((section) => {
    if (section === "video" || section === "_id") return;
    const sectionObj = aircraftGallery[section];
    if (typeof sectionObj === "object" && sectionObj !== null) {
      Object.keys(sectionObj).forEach((view) => {
        if (
          view !== "_id" &&
          sectionObj[view] &&
          typeof sectionObj[view] === "string"
        ) {
          images.push(sectionObj[view]);
        }
      });
    }
  });
  return images;
};

const ImageSlider = ({ aircraftGallery, onExperience }) => {
  const images = useMemo(
    () => extractAllGalleryImages(aircraftGallery),
    [aircraftGallery]
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) =>
          prev === images.length - 1 ? 0 : prev + 1
        );
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  // Reset index if images change
  useEffect(() => {
    setCurrentIndex(0);
  }, [images.length]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images.length) {
    return (
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">No image available</span>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full min-h-[250px] overflow-hidden rounded-3xl"
      onClick={onExperience}
    >
      {/* Slider images */}
      <div
        className="flex transition-all duration-700 h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`Aircraft ${idx}`}
            className="w-full h-full object-cover flex-shrink-0"
          />
        ))}
      </div>

      {/* See Flight Experience overlay */}
      <span
        className="absolute bottom-4 left-4 bg-black/50 text-white text-sm md:text-base 
                   px-3 py-1 rounded cursor-pointer"
      >
        See More Photos
      </span>

      {images.length > 1 && (
        <>
          {/* Left arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 
                       bg-white/70 text-black p-1 rounded-full z-10 
                       hover:bg-white shadow"
          >
            <FaArrowLeft />
          </button>
          {/* Right arrow */}
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 
                       bg-white/70 text-black p-1 rounded-full z-10 
                       hover:bg-white shadow"
          >
            <FaArrowRight />
          </button>
        </>
      )}
    </div>
  );
};

export default ImageSlider;