// import nodemailer from "nodemailer";

// export const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: Number(process.env.SMTP_PORT || 587),
//   secure: String(process.env.SMTP_SECURE) === "true",
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// export const sendMail = async ({ to, subject, html }) => {
//   const from = process.env.FROM_EMAIL || "no-reply@example.com";
//   return transporter.sendMail({ from, to, subject, html });
// };

// export const templates = {
//   abstractReceived: (name) => `<p>Hi ${name},</p><p>Your abstract has been received.</p>`,
//   abstractSelected: (name) => `<p>Hi ${name},</p><p>Your abstract has been selected. Please proceed to payment.</p>`,
//   paymentConfirmed: (name) => `<p>Hi ${name},</p><p>Your payment is confirmed.</p>`,
//   finalConfirmed: (name) => `<p>Hi ${name},</p><p>Your final paper has been received.</p>`,
// };

// import nodemailer from "nodemailer";

// export const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: Number(process.env.SMTP_PORT || 587),
//   secure: String(process.env.SMTP_SECURE) === "true", // true for 465, false for 587
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS, // <-- use app password here
//   },
// });

// transporter.verify((err, success) => {
//   if (err) {
//     console.error("❌ SMTP Connection Error:", err);
//   } else {
//     console.log("✅ SMTP Server is ready to take messages");
//   }
// });

// export const sendMail = async ({ to, subject, html }) => {
//   const from = process.env.FROM_EMAIL || "no-reply@example.com";
//   return transporter.sendMail({ from, to, subject, html });
// };
// export const templates = {
//   abstractReceived: (name) => `<p>Hi ${name},</p><p>Your abstract has been received.</p>`,
//   abstractSelected: (name) => `<p>Hi ${name},</p><p>Your abstract has been selected. Please proceed to payment.</p>`,
//   paymentConfirmed: (name) => `<p>Hi ${name},</p><p>Your payment is confirmed.</p>`,
//   finalConfirmed: (name) => `<p>Hi ${name},</p><p>Your final paper has been received.</p>`,
// };

import nodemailer from "nodemailer";

export const sendMail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Or use "smtp" with custom host
    auth: {
      user: process.env.EMAIL_USER,  // must be set
      pass: process.env.EMAIL_PASS,  // must be set
    },
  });

  await transporter.sendMail({
    from: `"Conference Team" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
