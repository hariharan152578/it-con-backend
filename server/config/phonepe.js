import axios from "axios";

const PHONEPE_BASE_URL = process.env.PHONEPE_BASE_URL;
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const MERCHANT_SECRET = process.env.PHONEPE_MERCHANT_SECRET;

// Create a PhonePe order
export const createPhonePeOrder = async ({ amount, orderId, user }) => {
  const payload = {
    merchantId: MERCHANT_ID,
    merchantOrderId: orderId,
    amount: amount * 100, // PhonePe amount in paise
    customerPhone: user.mobileno,
    customerEmail: user.email,
    redirectUrl: `https://yourdomain.com/payment/verify/${orderId}`,
  };

  const headers = {
    "Content-Type": "application/json",
    "X-VERIFY": MERCHANT_SECRET, // Replace with actual PhonePe signing method
  };

  const response = await axios.post(`${PHONEPE_BASE_URL}/payment/init`, payload, { headers });
  return response.data;
};

// Verify a PhonePe payment
export const verifyPhonePePayment = async ({ paymentId }) => {
  const headers = {
    "X-VERIFY": MERCHANT_SECRET,
  };
  const response = await axios.get(`${PHONEPE_BASE_URL}/payment/status/${paymentId}`, { headers });
  return response.data;
};
