import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-gray-400 relative overflow-hidden">
      {/* Background with jet image effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-300 opacity-60"></div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">

        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="animate-pulse">
            <div className="h-8 md:h-12 bg-white bg-opacity-40 rounded-lg w-48 md:w-64 mx-auto mb-4"></div>
            <div className="h-16 md:h-20 bg-white bg-opacity-50 rounded-lg w-80 md:w-96 mx-auto"></div>
          </div>
        </div>

        {/* Transport Type Selector - Horizontal Pills */}
        {/* <div className="flex justify-center mb-12">
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <div className="flex items-center space-x-2">
              {[...Array(5)].map((_, index) => (
                <div key={index} className={`animate-pulse flex items-center px-4 py-3 rounded-full ${index === 0 ? 'bg-blue-500 bg-opacity-80' : 'bg-transparent'}`}>
                  <div className="w-6 h-6 bg-white bg-opacity-60 rounded mr-2"></div>
                  <div className="h-3 bg-white bg-opacity-60 rounded w-16 md:w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        {/* One Way / Multi City Toggle */}
        {/* <div className="flex justify-center space-x-8 mb-8">
          <div className="flex items-center animate-pulse">
            <div className="w-4 h-4 bg-blue-400 rounded-full mr-3"></div>
            <div className="h-4 bg-white bg-opacity-60 rounded w-16"></div>
          </div>
          <div className="flex items-center animate-pulse">
            <div className="w-4 h-4 bg-white bg-opacity-40 rounded-full mr-3"></div>
            <div className="h-4 bg-white bg-opacity-60 rounded w-20"></div>
          </div>
        </div> */}

        {/* Main Booking Form */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl">

            {/* Flight Route Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8 items-end">

              {/* From Field */}
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-12 mb-3"></div>
                <div className="h-14 bg-gray-200 rounded-lg border"></div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center md:justify-start animate-pulse">
                <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded"></div>
                </div>
              </div>

              {/* To Field */}
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-8 mb-3"></div>
                <div className="h-14 bg-gray-200 rounded-lg border"></div>
              </div>

              {/* Date & Seats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-20 mb-3"></div>
                  <div className="h-14 bg-gray-200 rounded-lg border"></div>
                </div>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-12 mb-3"></div>
                  <div className="h-14 bg-gray-200 rounded-lg border"></div>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

              {/* Email */}
              <div className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded-lg border"></div>
              </div>

              {/* Phone */}
              <div className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded-lg border flex items-center px-4">
                  <div className="w-6 h-4 bg-orange-400 rounded mr-3"></div>
                  <div className="flex-1 h-4 bg-gray-300 rounded"></div>
                </div>
              </div>

              {/* Name */}
              <div className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded-lg border"></div>
              </div>
            </div>

            {/* Terms and Search Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">

              {/* Terms Checkbox */}
              <div className="animate-pulse">
                <div className="w-4 h-4 bg-gray-300 rounded border mr-3"></div>
                <div className="h-4 bg-gray-300 rounded w-32"></div>
              </div>

              {/* Search Button */}
              <div className="animate-pulse">
                <div className="w-24 h-12 bg-blue-500 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 opacity-20 animate-pulse hidden lg:block">
        <div className="w-32 h-20 bg-white rounded-lg"></div>
      </div>
      <div className="absolute bottom-20 left-10 opacity-20 animate-pulse hidden lg:block">
        <div className="w-40 h-24 bg-white rounded-lg"></div>
      </div>
    </div>
  );
};
export default SkeletonLoader;