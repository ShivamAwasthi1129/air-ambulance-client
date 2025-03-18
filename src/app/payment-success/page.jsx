"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AiOutlineCheckCircle } from "react-icons/ai";
import NavBar from "../components/Navbar";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const currency = searchParams.get("currency");
  const amount = searchParams.get("amount");
  if (sessionStorage.getItem("searchData"))
    sessionStorage.removeItem("searchData");

  return (
    <div className="min-h-screen flex items-center justify-center flex-col bg-gradient-to-r from-green-400 to-blue-500">
      <div
        className="w-full bg-cover absolute top-0"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-photo/airplane-runway-airport-sunset-travel-concept_587448-8154.jpg?t=st=1739105999~exp=1739109599~hmac=ab95500395c06198c3f2190d29da1b0c41ca0529e115404f07b822f31749eccc&w=1380')",
        }}
      >
        <NavBar />
      </div>
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex flex-col items-center">
          <AiOutlineCheckCircle
            className="text-green-500 animate-bounce"
            size={64}
          />
          <h1 className="mt-4 text-3xl font-bold text-gray-800">
            Payment Successful!
          </h1>
          <p className="mt-2 text-gray-600">Thank you for your purchase.</p>
          <div className="mt-6 w-full">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-700 font-medium">Order ID:</span>
              <span className="text-gray-700">{orderId}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-700 font-medium">Currency:</span>
              <span className="text-gray-700">{currency}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-700 font-medium">Amount:</span>
              <span className="text-green-600 font-bold text-lg">
                {currency} {amount}
              </span>
            </div>
          </div>
          <div className="mt-6">
            <a
              href="/"
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 cursor-pointer"
            >
              Continue another booking
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500 italic">
            Note: This is just 10% of the booking payment. Sooner or later our
            team will call you to complete the remaining payment and further
            enquiry.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
