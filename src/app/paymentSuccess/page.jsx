import React from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';

const PaymentSuccess = () => {
  // Your JSON data
  const jsonData = {
    "status": "success",
    "data": "merchant_id=96940&order_id=ORD1740107309046&currency=INR&amount=480.70&redirect_url=http://localhost:3000/api/ccavenue/response&cancel_url=http://localhost:3000/api/ccavenue/response"
  };

  // Parse the query string from jsonData.data
  const params = new URLSearchParams(jsonData.data);
  const merchantId = params.get('merchant_id');
  const orderId = params.get('order_id');
  const currency = params.get('currency');
  const amount = params.get('amount');
  const redirectUrl = params.get('http://localhost:3000/');
  const cancelUrl = params.get('cancel_url');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex flex-col items-center">
          <AiOutlineCheckCircle className="text-green-500 animate-bounce" size={64} />
          <h1 className="mt-4 text-3xl font-bold text-gray-800">Payment Successful!</h1>
          <p className="mt-2 text-gray-600">Thank you for your purchase.</p>
          <div className="mt-6 w-full">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-700 font-medium">Order ID:</span>
              <span className="text-gray-700">{orderId}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-700 font-medium">Merchant ID:</span>
              <span className="text-gray-700">{merchantId}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-700 font-medium">Currency:</span>
              <span className="text-gray-700">{currency}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-700 font-medium">Amount:</span>
              <span className="text-green-600 font-bold text-lg">{currency} {amount}</span>
            </div>
          </div>
          <div className="mt-6">
            <a
              href={redirectUrl}
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 cursor-pointer"
            >
              Continue another booking
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500 italic">
            Note: This is just 10% of the booking payment. Sooner or later our team will call you to complete the remaining payment and further enquiry.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
