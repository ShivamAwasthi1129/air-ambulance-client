import React from "react";

export default function BannerSection() {
  return (
    <section
    className="relative w-full py-10 flex flex-col items-center justify-center"
    style={{
      background: `
        linear-gradient(
          to bottom,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 1) 80%
        ),
        url('https://imgak.mmtcdn.com/flights/assets/media/dt/business/businessBg.png')
        no-repeat center / cover
      `,
    }}
    >
      {/* Main heading */}
      <h2 className="text-4xl md:text-7xl font-bold text-amber-900 tracking-wide mb-6">
        Fly Premium. Fly Luxury
      </h2>

      {/* Cards row */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* 1. Luxury Lounges */}
        <div className="relative w-[300px] h-[200px] md:w-[350px] md:h-[230px] overflow-hidden rounded-lg">
          <img
            src="https://imgak.mmtcdn.com/flights/assets/media/dt/business/luxury_lounges.png"
            alt="Luxury Lounges"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 w-full bg-black bg-opacity-40 text-white text-center py-2 text-lg font-semibold">
            LUXURY LOUNGES
          </div>
        </div>

        {/* 2. Premium Dining */}
        <div className="relative w-[300px] h-[200px] md:w-[350px] md:h-[230px] overflow-hidden rounded-lg">
          <img
            src="https://imgak.mmtcdn.com/flights/assets/media/dt/business/premium_dining.png"
            alt="Premium Dining"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 w-full bg-black bg-opacity-40 text-white text-center py-2 text-lg font-semibold">
            PREMIUM DINING
          </div>
        </div>

        {/* 3. Cabin Comfort */}
        <div className="relative w-[300px] h-[200px] md:w-[350px] md:h-[230px] overflow-hidden rounded-lg">
          <img
            src="https://imgak.mmtcdn.com/flights/assets/media/dt/business/cabin_comfort.png"
            alt="Cabin Comfort"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 w-full bg-black bg-opacity-40 text-white text-center py-2 text-lg font-semibold">
            CABIN COMFORT
          </div>
        </div>
      </div>
    </section>
  );
}
