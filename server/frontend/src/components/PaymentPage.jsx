import React, { useState } from "react";
import { createOrder, verifyPayment,completePayment } from "../api/paymentApi";
import Spinner from "./Spinner";

export default function PaymentPage({ user }) {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);
// const handlePayNow = async () => {
//   setLoading(true);
//   setError(null);
//   setPaymentStatus(null);

//   try {
//     // ✅ Step 1: Create order on backend
//     const { data } = await createOrder();
//     const { keyId, orderId, amount, currency } = data;

//     // ✅ Step 2: Open Razorpay checkout
//     const options = {
//       key: keyId,
//       amount: amount * 100, // smallest unit for Razorpay
//       currency,
//       name: "KSR IT Conference",
//       description: "Paper Submission Fee",
//       order_id: orderId,
//   handler: async function (response) {
//   try {
//     // ✅ Step 3: Verify payment on backend
//     const verifyRes = await verifyPayment({
//       paymentMethod: "razorpay",
//       razorpay_order_id: response.razorpay_order_id,
//       razorpay_payment_id: response.razorpay_payment_id,
//       razorpay_signature: response.razorpay_signature,
//     });

//     if (verifyRes.data.success) {
//       setPaymentStatus("✅ Payment verified successfully!");

//       // ✅ Step 4: Complete payment (optional)
//       const completeRes = await completePayment();
//       console.log("🎉 Payment Completed:", completeRes.data);

//       alert("🎉 Payment Complete! You can now download your hall ticket.");
//       setPaymentStatus("🎉 Payment complete and confirmed!");
//     } else {
//       setError("❌ Payment verification failed. Contact support.");
//     }
//   } catch (err) {
//     console.error(err);
//     setError("❌ Payment verification failed.");
//   } finally {
//     setLoading(false);
//   }
// },

//       prefill: {
//         name: user.name,
//         email: user.email,
//         contact: user.mobileno || "",
//       },
//       theme: {
//         color: "#1e3a8a",
//       },
//       method: {
//         card: true,
//         netbanking: true,
//         wallet: true,
//         upi: true,
//         emi: true,
//         paylater: true,
//       },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();

//     rzp.on("payment.failed", function (response) {
//       console.error(response.error);
//       setError("❌ Payment failed: " + response.error.description);
//       setLoading(false);
//     });
//   } catch (err) {
//     console.error(err);
//     setError(err.response?.data?.message || "❌ Order creation failed.");
//     setLoading(false);
//   }
// };
  
const handlePayNow = async () => {
  setLoading(true);
  setError(null);
  setPaymentStatus(null);

  try {
    // ✅ 1. Create order
    const { data } = await createOrder();
    const { keyId, orderId, amount, currency } = data;

    // ✅ 2. Razorpay Checkout
    const options = {
      key: keyId,
      amount: amount * 100,
      currency,
      name: "KSR IT Conference",
      description: "Paper Submission Fee",
      order_id: orderId,
      handler: async function (response) {
        try {
          // ✅ 3. Verify payment
          const verifyRes = await verifyPayment({
            paymentMethod: "razorpay",
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
         console.log(verifyRes);
         
          if (verifyRes.data.success) {
            setPaymentStatus("✅ Payment verified successfully!");

            // ✅ 4. Complete payment (optional)
            const completeRes = await completePayment();
            console.log("🎉 Payment Completed:", completeRes.data);

            alert("🎉 Payment Complete! You can now download your hall ticket.");
            setPaymentStatus("🎉 Payment complete and confirmed!");
          } else {
            setError("❌ Payment verification failed. Contact support.");
          }
        } catch (err) {
          console.error(err);
          setError("❌ Payment verification failed.");
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.mobileno || "",
      },
      theme: { color: "#1e3a8a" },
      method: { card: true, netbanking: true, wallet: true, upi: true, emi: true, paylater: true },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    rzp.on("payment.failed", function (response) {
      console.error(response.error);
      setError("❌ Payment failed: " + response.error.description);
      setLoading(false);
    });
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || "❌ Order creation failed.");
    setLoading(false);
  }
};

return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px] text-center">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">
          Conference Paper Payment
        </h2>
        <p className="text-gray-600 mb-6">
          Please proceed to pay your registration fee securely.
        </p>

        {loading ? (
          <Spinner />
        ) : (
          <>
            <button
              onClick={handlePayNow}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-all"
            >
              Pay Now
            </button>

            {paymentStatus && (
              <p className="text-green-600 mt-4 font-semibold">{paymentStatus}</p>
            )}
            {error && <p className="text-red-500 mt-4 font-medium">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}
