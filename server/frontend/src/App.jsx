import React, { useEffect, useState } from "react";
import PaymentPage from "./components/PaymentPage";
import SuccessPage from "./components/SuccessPage";

function App() {
  const [user, setUser] = useState(null);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    // Simulated user (you can load real user after login)
    setUser({
      _id: "68edd97d8b1c203e6a2973c7",
      name: "Kaviya R",
      email: "kaviyarasan1029@gmail.com",
    });
  }, []);

  if (!user) return <div>Loading user...</div>;

  return paid ? (
    <SuccessPage />
  ) : (
    <PaymentPage user={user} onPaymentSuccess={() => setPaid(true)} />
  );
}

export default App;
