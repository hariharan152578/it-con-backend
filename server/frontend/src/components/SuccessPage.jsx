import React from "react";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-3">Payment Successful 🎉</h2>
        <p className="text-gray-700 mb-6">Your paper registration is complete.</p>
        <a
          href="/api/payment/complete-payment"
          className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700"
        >
          Download Hall Ticket
        </a>
      </div>
    </div>
  );
}
