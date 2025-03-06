import React, { useState, useEffect } from "react";

const PaymentModal = ({ isOpen, onClose, onConfirm, loading, estimatedCost }) => {
  // Minimum payment is 2% of estimated cost (USD)
  const minPayment = Math.ceil(0.02 * estimatedCost);
  // Maximum payment is the full cost (USD)
  const maxPayment = estimatedCost;

  const [amount, setAmount] = useState(minPayment);

  useEffect(() => {
    // Reset the slider whenever estimatedCost changes
    setAmount(minPayment);
  }, [estimatedCost, minPayment]);

  if (!isOpen) return null;

  const handleSliderChange = (e) => {
    setAmount(Number(e.target.value));
  };

  const handleInputChange = (e) => {
    const inputValue = Number(e.target.value);
    if (inputValue > maxPayment) {
      setAmount(maxPayment);
    } else if (inputValue < minPayment) {
      setAmount(minPayment);
    } else {
      setAmount(inputValue);
    }
  };

  const handleConfirmClick = () => {
    // Pass the selected amount back to the parent
    onConfirm(amount);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Make a Partial Payment
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-4">
          Please select an amount between{" "}
          <strong>${minPayment.toLocaleString()}</strong> and{" "}
          <strong>${maxPayment.toLocaleString()}</strong> (USD).
        </p>

        {/* Number Input */}
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Enter Payment Amount (USD)
        </label>
        <input
          type="number"
          value={amount}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none 
                     focus:ring-2 focus:ring-blue-400 transition-all"
        />

        {/* Range Slider */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Slide to pick your amount
        </label>
        <input
          type="range"
          min={minPayment}
          max={maxPayment}
          value={amount}
          onChange={handleSliderChange}
          className="
            w-full mb-2
            appearance-none
            h-2
            bg-gray-200
            rounded-full
            accent-blue-600
            cursor-pointer
            transition-all
            duration-300
            focus:outline-none
            hover:accent-blue-700
          "
        />
        <div className="text-right text-sm text-gray-600">
          ${amount.toLocaleString()} / ${maxPayment.toLocaleString()} USD
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded 
                       transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmClick}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded 
                       transition-all duration-300"
          >
            {loading ? "Processing..." : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
