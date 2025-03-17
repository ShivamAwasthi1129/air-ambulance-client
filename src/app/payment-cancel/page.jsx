'use client';

import React, { Suspense } from 'react';
import NavBar from '../components/Navbar'; 
import { AiOutlineCloseCircle } from 'react-icons/ai';

function PaymentCancelContent() {
  return (
    <div className="min-h-screen flex flex-col">
        <div
        className="w-full bg-cover"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-photo/airplane-runway-airport-sunset-travel-concept_587448-8154.jpg?t=st=1739105999~exp=1739109599~hmac=ab95500395c06198c3f2190d29da1b0c41ca0529e115404f07b822f31749eccc&w=1380')"
        }}>
        <NavBar />
      </div>
      <div className="flex flex-1 items-center justify-center bg-gradient-to-r from-red-400 to-pink-500">
        <div className=" flex flex-col justify-center items-center bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
          <AiOutlineCloseCircle className="text-red-500 animate-bounce" size={64} />
          <h1 className="mt-4 text-3xl font-bold text-gray-800">Payment Cancelled</h1>
          <p className="mt-2 text-gray-600">Your payment has been cancelled.</p>
          <div className="mt-6">
            <a
              href="/"
              className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 cursor-pointer"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentCancelContent />
    </Suspense>
  );
}
