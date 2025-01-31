"use client";

export const Banner = () => {
  return (
    <div className="relative bg-darkblue h-[400px] w-[98%] flex items-center justify-start overflow-hidden shadow-lg mt-4">
      {/* Background Video */}
      <video
        src="https://s3.ap-south-1.amazonaws.com/aviation.hexerve/1650628-hd_1920_1080_25fps.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      ></video>

      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black opacity-35"></div>

      {/* Text Content */}
      <div className="relative z-10 text-left px-8">
        <h1
          className="text-white text-4xl md:text-5xl font-extrabold tracking-wide leading-tight"
          style={{
            textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7), -2px -2px 5px rgba(255, 255, 255, 0.3)",
          }}
        >
          Explore the Skies with Confidence
        </h1>
        <p className="text-white text-xl md:text-xl mt-4 font-semibold tracking-wide">
          Find the best flights for your next journey with unbeatable prices.
        </p>
        <button className="mt-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3 rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all text-lg font-bold uppercase tracking-wide">
          Discover Flights
        </button>
      </div>
    </div>
  );
};
