"use client";

export const SmallBottom = () => {
  return (
    <div className="bg-white rounded-[30px] shadow-md text-[#4a4a4a] text-sm w-[74%] mx-auto flex justify-around items-center h-[60px] relative -top-20">
      {/* Trip Ideas */}
      <div className="flex items-center h-full w-full text-center border-l-0 border-gray-300 first:border-none px-4">
        <img
          src="https://promos.makemytrip.com/Growth/Images/B2C/x/dt_tert_ti2.png"
          alt="Trip Ideas"
          className="w-8 ml-5"
        />
        <p className="ml-4 text-left">Trip ideas</p>
      </div>

      {/* Trip Money */}
      <div className="flex items-center h-full w-full text-center border-l border-gray-300 px-4">
        <img
          src="https://promos.makemytrip.com/Growth/Images/B2C/x/dt_tert_tm1.png"
          alt="Trip Money"
          className="w-8 ml-5"
        />
        <p className="ml-4 text-left">Trip Money</p>
      </div>

      {/* Explore International Flights */}
      <div className="flex items-center h-full w-full text-center border-l border-gray-300 px-4">
        <img
          src="https://promos.makemytrip.com/Growth/Images/B2C/2x/dt_tert_flights.png"
          alt="Explore International Flights"
          className="w-8 ml-5"
        />
        <p className="ml-4 text-left">Explore International Flights</p>
      </div>

      {/* Nearby Getaways */}
      <div className="flex items-center h-full w-full text-center border-l border-gray-300 px-4">
        <img
          src="https://promos.makemytrip.com/Growth/Images/B2C/x/dt_tert_ng1.png"
          alt="Nearby Getaways"
          className="w-6 ml-5"
        />
        <p className="ml-4 text-left">Nearby Getaways</p>
      </div>

      {/* Gift Cards */}
      <div className="flex items-center h-full w-full text-center border-l border-gray-300 px-4">
        <img
          src="https://promos.makemytrip.com/Growth/Images/B2C/x/dt_tert_gc1.png"
          alt="Gift Cards"
          className="w-8 ml-5"
        />
        <p className="ml-4 text-left">Gift Cards</p>
      </div>
    </div>
  );
};
