"use client";

const SponsoredBanner = () => {
  return (
    <div className="absolute top-4 right-4 flex flex-col items-center">
      {/* "Sponsored" Text */}
      <span className="bg-white text-gray-700 text-xs font-semibold px-2 py-1 rounded-md shadow-md mb-1">
        Sponsored
      </span>

      {/* Banner Image */}
      <img
        src="https://platforms.makemytrip.com/contents/039eebbc-1a8f-4641-9da5-e6d75d70a5a8"
        alt="Sponsored Banner"
        className="w-40 h-auto rounded-lg shadow-lg"
      />
    </div>
  );
};

export default SponsoredBanner;
