import axios from "axios";

// ----------------------------
// Axios instance
// ----------------------------
const API = axios.create({
  baseURL: "http://localhost:5000/api", // backend URL
});

// Attach JWT token automatically to all requests
API.interceptors.request.use((req) => {
  // Get the token from localStorage using the key "token"
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ----------------------------
// Payment API calls
// ----------------------------

export const createOrder = () => API.post("/payments/create-payment");
export const verifyPayment = (data) => API.post("/payments/verify-payment", data);
export const completePayment = () => API.get("/payments/complete-payment");
// Example: Store JWT token (replace with real token from login)
localStorage.setItem(
  "token",
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZmYwYjk0ZjZmZGUxYzViY2NhZDlmMSIsImlhdCI6MTc2MTU0NjAwMCwiZXhwIjoxNzYyMTUwODAwfQ.9aZIzoJwcg8LwjMfzAFpR7VKZpbgOAFH43CrxZ0vaJA");

export default API;
