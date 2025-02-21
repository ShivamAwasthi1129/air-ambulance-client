'use client';

import { useSearchParams } from 'next/navigation';

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();

    const merchantId = searchParams.get('merchant_id');
    const orderId = searchParams.get('order_id');
    const currency = searchParams.get('currency');
    const amount = searchParams.get('amount');

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center">
                <h2 className="text-2xl font-bold text-green-600">Payment Successful 🎉</h2>
                <p className="mt-2 text-gray-700">Thank you for your payment!</p>

                <div className="mt-4 text-left">
                    <p><strong>Merchant ID:</strong> {merchantId}</p>
                    <p><strong>Order ID:</strong> {orderId}</p>
                    <p><strong>Amount:</strong> {currency} {amount}</p>
                </div>

                <a href="/" className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Go to Home
                </a>
            </div>
        </div>
    );
}
