"use client";
import React, { useState, useEffect } from "react";

// Exchange rates relative to 1 USD
const exchangeRates = {
  USD: 1,
  INR: 82,
  GBP: 0.8,
};

// Symbols to display alongside amounts
const currencySymbols = {
  USD: "$",
  INR: "₹",
  GBP: "£",
};

const PaymentModal = ({ isOpen, onClose, onConfirm, loading, estimatedCost }) => {
  // Default currency is USD
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [amount, setAmount] = useState(0);

  // Convert the base USD `estimatedCost` to the selected currency
  const convertedCost = estimatedCost * exchangeRates[selectedCurrency];
  // Minimum payment is 2% of the converted cost
  const minPayment = Math.ceil(0.02 * convertedCost);
  // Maximum payment is the full converted cost
  const maxPayment = Math.ceil(convertedCost);

  useEffect(() => {
    if (isOpen) {
      // Whenever we open the modal or currency changes, clamp amount
      if (amount < minPayment || amount > maxPayment) {
        setAmount(minPayment);
      }
    }
  }, [isOpen, minPayment, maxPayment, amount]);

  if (!isOpen) return null; // Do not render if modal is closed

  // Handle currency dropdown changes
  const handleCurrencyChange = (e) => {
    setSelectedCurrency(e.target.value);
  };

  // Handle the slider input
  const handleSliderChange = (e) => {
    setAmount(Number(e.target.value));
  };

  // Handle manual number input
  const handleInputChange = (e) => {
    let val = Number(e.target.value);
    if (val < minPayment) val = minPayment;
    if (val > maxPayment) val = maxPayment;
    setAmount(val);
  };

  // When user clicks Confirm Payment:
  //  - Send both `amount` and the chosen `selectedCurrency` to the parent
  const handleConfirmClick = () => {
    onConfirm(amount, selectedCurrency);
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Make a Partial Payment
        </h2>

        {/* Currency Selector */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Select Currency
          </label>
          <select
            value={selectedCurrency}
            onChange={handleCurrencyChange}
            className="w-full p-2 border border-gray-300 rounded
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="USD">USD</option>
            <option value="INR">INR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-4">
          Please select an amount between{" "}
          <strong>
            {currencySymbols[selectedCurrency]}
            {minPayment.toLocaleString()}
          </strong> 
          {" "}and{" "}
          <strong>
            {currencySymbols[selectedCurrency]}
            {maxPayment.toLocaleString()}
          </strong>{" "}
          ({selectedCurrency}).
        </p>

        {/* Number Input */}
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Enter Payment Amount ({selectedCurrency})
        </label>
        <input
          type="number"
          value={amount}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-4
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            w-full mb-2 appearance-none h-2 bg-gray-200 rounded-full
            accent-blue-600 cursor-pointer transition-all duration-300
            hover:accent-blue-700
          "
        />
        <div className="text-right text-sm text-gray-600">
          {currencySymbols[selectedCurrency]}
          {amount.toLocaleString()} /{" "}
          {currencySymbols[selectedCurrency]}
          {maxPayment.toLocaleString()}{" "}
          {selectedCurrency}
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
