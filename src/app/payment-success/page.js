"use client";

import { useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  // Get query parameters
  const searchParams = useSearchParams();

  const merchantId = searchParams.get("merchant_id");
  const orderId = searchParams.get("order_id");
  const currency = searchParams.get("currency");
  const amount = searchParams.get("amount");

  // Validate if all required parameters exist
  if (!merchantId || !orderId || !currency || !amount) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-red-500 text-2xl font-bold">Invalid Payment Details</h2>
        <p className="text-gray-600">Some payment details are missing.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-green-500 text-3xl font-bold">Payment Successful 🎉</h1>
      <p className="text-lg text-gray-700">Thank you for your payment.</p>
      
      <div className="border p-4 mt-4 rounded-md bg-white shadow-md">
        <p><strong>Merchant ID:</strong> {merchantId}</p>
        <p><strong>Order ID:</strong> {orderId}</p>
        <p><strong>Currency:</strong> {currency}</p>
        <p><strong>Amount:</strong> {amount}</p>
      </div>
    </div>
  );
}
