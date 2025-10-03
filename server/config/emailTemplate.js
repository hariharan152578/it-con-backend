
// export const emailTemplate = (
//   title,
//   message,
//   userName,
//   userEmail,
//   userId,
//   userAbstract,
//   finalPaperStatus,
//   paymentStatus,
//   content,
//   resetLink
// ) => {
//   let bannerHtml = "";
//   let dynamicContentHtml = "";

//   // --------------------------
//   // Abstract rejection / status
//   // --------------------------
//   if (userAbstract !== undefined && userAbstract !== null) {
//     if (userAbstract.toLowerCase() === "rejected") {
//       bannerHtml = `<img src="https://example.com/abstract-rejected.png" alt="Abstract Rejected Banner" style="width:100%; max-width:600px; border-radius:8px 8px 0 0;" />`;
//       dynamicContentHtml = `
//         <p style="margin-top:20px;color:#ff0000;">
//           <b>User Name:</b> ${userName}<br/>
//           <b>Abstract Status:</b> ${userAbstract} ❌<br/>
//           <b>Reason:</b> ${content || "Not specified by admin"}
//         </p>
//       `;
//     } else {
//       bannerHtml = `<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRREkO_NkGUNEj0eZnFmTtIa0q_AWsxTq1Lgw&s" alt="Abstract Status Banner" style="width:100%; max-width:600px; border-radius:8px 8px 0 0;" />`;
//       dynamicContentHtml = `
//         <p style="margin-top:20px;">
//           <b>User Name:</b> ${userName}<br/>
//           <b>Abstract Status:</b> ${userAbstract}<br/>
//         </p>
//       `;
//     }
//   }

//   // --------------------------
//   // Final Paper rejection / status
//   // --------------------------
//   else if (finalPaperStatus !== undefined && finalPaperStatus !== null) {
//     if (finalPaperStatus.toLowerCase() === "rejected") {
//       bannerHtml = `<img src="https://example.com/finalpaper-rejected.png" alt="Final Paper Rejected Banner" style="width:100%; max-width:600px; border-radius:8px 8px 0 0;" />`;
//       dynamicContentHtml = `
//         <p style="margin-top:20px;color:#ff0000;">
//           <b>User Name:</b> ${userName}<br/>
//           <b>Final Paper Status:</b> ${finalPaperStatus} ❌<br/>
//           <b>Reason:</b> ${content}
//         </p>
//       `;
//     } else {
//       bannerHtml = `<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLpUL9pnhkzyHQvcnP4OHZP5Qr0oAUL7A_xXt4FX0M5SO2ECFkLibK0lcLbcwbPC32Gqc&usqp=CAU" alt="Final Paper Status Banner" style="width:100%; max-width:600px; border-radius:8px 8px 0 0;" />`;
//       dynamicContentHtml = `
//         <p style="margin-top:20px;">
//           <b>User Name:</b> ${userName}<br/>
//           <b>Final Paper Status:</b> ${finalPaperStatus}<br/>
//         </p>
//       `;
//     }
//   }

//   // --------------------------
//   // Payment rejection / success
//   // --------------------------
// else if (paymentStatus !== undefined && paymentStatus !== null) {
// if (paymentStatus?.toLowerCase() === "rejected") {
//     bannerHtml = `
//       <img src="https://example.com/payment-rejected.png" 
//            alt="Payment Rejected" 
//            style="width:100%;max-width:600px;" />
//     `;
//     dynamicContentHtml = `
//       <p style="color:#dc2626;font-size:16px;">
//         ❌ <b>Payment Rejected</b>
//       </p>
//       <p><b>User:</b> ${userName}</p>
//       <p><b>Reason:</b> ${content.reason || "Not specified"}</p>
//     `;
//   } else if (paymentStatus?.toLowerCase() === "paid") {
//     bannerHtml = `
//       <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" 
//            alt="Payment Success" 
//            style="width:100%;max-width:600px;" />
//     `;
//     dynamicContentHtml = `
//       <p style="color:#16a34a;font-size:18px;margin-top:20px;">
//         ✅ <b>Payment Successful!</b>
//       </p>
//       <p><b>User:</b> ${userName}</p>
//       <p><b>Unique ID:</b> ${content.uniqueId || "N/A"}</p>
//       <p><b>Abstract Title:</b> ${abstractTitle || "N/A"}</p>
//       <p><b>Final Paper Status:</b> ${finalPaperStatus || "Pending"}</p>
//       <p><b>Payment Status:</b> Paid</p>
//       <div style="text-align:center;margin-top:20px;">
//         <a href="${content.hallTicketUrl}" 
//            style="display:inline-block;padding:12px 24px;
//                   background:#2563eb;color:#fff;
//                   font-size:16px;font-weight:bold;
//                   border-radius:6px;text-decoration:none;">
//           ⬇️ Download Hall Ticket (PDF)
//         </a>
//       </div>
//       <div style="text-align:center;margin-top:20px;">
//         <p>📌 Or scan this QR code at event check-in:</p>
//         <img src="${content.qrCodeUrl}" 
//              alt="QR Code" 
//              style="max-width:200px;" />
//       </div>
//     `;
//   } else {
//     bannerHtml = `
//       <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg3_vsVL7OGr6De1j8XcJmMGPZYdVxB5zEewNkNYW3RWPsj-GtNMFAdUwiyz9aWMs6ElI&usqp=CAU" 
//            alt="Payment Pending" 
//            style="width:100%;max-width:600px;" />
//     `;
//     dynamicContentHtml = `
//       <p><b>User:</b> ${userName}</p>
//       <p><b>Payment Status:</b> ${paymentStatus || "Pending"}</p>
//     `;
//   }
// }

//   // --------------------------
//   // Password Reset
//   // --------------------------
//   else if (resetLink) {
//     bannerHtml = `<img src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png" alt="Reset Password Banner" style="width:100%; max-width:600px; border-radius:8px 8px 0 0;" />`;
//     dynamicContentHtml = `
//       <p style="margin-top:20px;">
//         <b>User Name:</b> ${userName}<br/>
//         <b>User Email:</b> ${userEmail}<br/>
//       </p>
//       <p>You requested to reset your password. Please click below:</p>
//       <div style="margin:20px 0;text-align:center;">
//         <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;font-size:16px;font-weight:bold;border-radius:6px;text-decoration:none;">
//           Reset Password
//         </a>
//       </div>
//       <p style="font-size:14px;color:#555;">If you didn’t request this, ignore this email.</p>
//     `;
//   }

//   // --------------------------
//   // Default Registration
//   // --------------------------
//   else {
//     bannerHtml = `<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_d9ec3NpFtI-GU3xQIu8gVG6qxQH0sY18gzSC5sMMFEqmu3NqT0UyZkvtA7GKKoBamSA&usqp=CAU" alt="KSR College of Engineering Banner" style="width:100%; max-width:600px; border-radius:8px 8px 0 0;" />`;
//     dynamicContentHtml = `
//       <p style="margin-top:20px;">
//         <b>User Name:</b> ${userName}<br/>
//         <b>User Email:</b> ${userEmail}<br/>
//         <b>User ID:</b> ${userId}<br/>
//         <b>Group:</b> <a href="https://chat.whatsapp.com/FoFsX2AJZjSIxUK98pqJei?mode=ems_wa_c">Join WhatsApp Group</a>
//       </p>
//     `;
//   }
//     return `
// <!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <meta http-equiv="X-UA-Compatible" content="ie=edge" />
//     <title>${title}</title>
//     <style>
//       body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
//       table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
//       img { -ms-interpolation-mode: bicubic; }
//       img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
//       a[x-apple-data-detectors] {
//         color: inherit !important;
//         text-decoration: none !important;
//         font-size: inherit !important;
//         font-family: inherit !important;
//         font-weight: inherit !important;
//         line-height: inherit !important;
//       }
//       @media screen and (max-width: 525px) {
//         .wrapper { width: 100% !important; max-width: 100% !important; }
//         .responsive-table { width: 100% !important; }
//         .padding { padding: 10px 5% !important; }
//         .h2-padding { padding: 0 5% !important; }
//         .logo-image { max-width: 80% !important; height: auto !important; }
//       }
//     </style>
//   </head>
//   <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
//     <center style="width: 100%; background-color: #f4f4f4;">
//       <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
//         <tr>
//           <td align="center" style="padding: 20px 0;">
//             <table border="0" cellpadding="0" cellspacing="0" width="600" class="wrapper" style="max-width: 600px;">
//               <tr>
//                 <td style="background-color: #1e3a8a; padding: 0; border-radius: 8px 8px 0 0;">
//                   <table border="0" cellpadding="0" cellspacing="0" width="100%">
//                     <tr>
//                       <td align="center">
//                         ${bannerHtml}
//                       </td>
//                     </tr>
//                     <tr>
//                       <td align="center" style="padding: 15px 10px;">
//                         <h1 style="font-family: Arial, sans-serif; font-size: 28px; color: #ffffff; margin: 0;">
//                           ${title}
//                         </h1>
//                         <p style="font-family: Arial, sans-serif; font-size: 16px; color: #a3c9f7; margin: 10px 0 0;">
//                           Conference Portal
//                         </p>
//                       </td>
//                     </tr>
//                   </table>
//                 </td>
//               </tr>
//               <tr>
//                 <td style="background-color: #ffffff; padding: 40px 30px 20px; border-radius: 0 0 8px 8px;">
//                   <table border="0" cellpadding="0" cellspacing="0" width="100%">
//                     <tr>
//                       <td style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; padding-bottom: 20px;">
//                         <h2 style="font-size: 20px; color: #1e293b; margin: 0 0 10px;">Hello ${userName},</h2>
//                         <p>${message}</p>
//                         ${dynamicContentHtml}
//                       </td>
//                     </tr>
//                     <tr>
//                       <td align="center" style="padding-top: 25px;">
//                         <table border="0" cellspacing="0" cellpadding="0">
//                           <tr>
//                             <td align="center" style="border-radius: 6px; background: #f97316;">
//                               <a href="https://ksrce.ac.in/" target="_blank" style="font-size: 16px; font-family: Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 6px; padding: 14px 28px; border: 1px solid #f97316; display: block; font-weight: bold;">
//                                 Visit Portal
//                               </a>
//                             </td>
//                           </tr>
//                         </table>
//                       </td>
//                     </tr>
//                   </table>
//                 </td>
//               </tr>
//               <tr>
//                 <td align="center" style="padding: 20px 0;">
//                   <table border="0" cellpadding="0" cellspacing="0" width="100%">
//                     <tr>
//                       <td align="center" style="font-family: Arial, sans-serif; font-size: 14px; color: #888888;">
//                         <p style="margin: 5px 0;">
//                           📞 +91 88702 95336 | 📧 ksritconference@gmail.com
//                         </p>
//                         <div style="margin: 15px 0;">
//                           <a href="https://www.linkedin.com/company/ksrce?originalSubdomain=in" target="_blank" style="margin: 0 10px;">
//                             <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACUCAMAAAAj+tKkAAAAY1BMVEUAfrv///8AdLYAebkAfLqCsdQAd7ifwt2ArtL0+fxUksUAbbPi7fWpx+A8icDn8fdtps6VuNjU4e7C2OlBkcRGjcKcvNrY5/GYvttfnsu20OWJtdYAabIphL5ooczL3+1TmMjG8NevAAADoElEQVR4nO2ca7OiMAyGe6Na5CaXg8IR+f+/ckFd98g2rAWnZGfyfu6UZ0KTpm0mjHNeMMUQSrFigGOcm0RuzWKXTMwNMBBbk0ASwQgYIbXfKBkNgEfMgEfO0gSlh9ylkpTlaFfgKJGzHW7AHcsQL8FhEWasRLwEh0VYbk1AIv1bahTOfGeU1JcqDMNECZThSIquuabGmKj4Kg/orKh0F/GnTFHprYleJZOCv+qkMBlRspRP1Wg8hLL8m4/zK5q/rGRk4eN8h4VQxFY+zjsc4Ub2BgCMcOSPGjIg5z0GE6rK5iEPP8FgQtmBfDy9IAg1oIsMMhjc5HCFAXmLINIc6hnALwyA9iiNCHDOgkcEgKKZAdwjAJR7mC/FcJJWIQyIYq+7377a1WIAZLqF+AyOrFppKNCcELjIKFnZ+a5bgz2lj1ZARC8CwkJoSjx8w3bSTrPqOkSyAB+S1WtSEzNM9hulDufm4c0mjy8CRYB5ldZVt29PbdajxBullNRaS6R0JBLJm4ZYIA43CYEuJAxwUvVtU9R1nRdx2ysp10OO0c+mycTKPurHnqgE6+LJKTFt9uHKZwPZt4FN7euRSZXWYe3zCkwJcaxtV3lpcf5egyh29oSV719m1YF9VPw4uEh1gi4ah+SoW/GjPwMouhzEG9Uki09gnwBUc5dkd6Xd0hzkA4DyMm++u4KFC3E9oFRzN1B/dFr2l1cDyuo9vqWEqwHftN9tyiUnnbWA33N3tBOZcIGjrATcfb3PNwTEg3fAAn7GsE7qvgxXAjoqci8g8wu4oATPM2DqvCt7BuSZa6jxDZi7OrJvQOPqJr4BeeD4j70DxhsCmjSF0+rfyh1feT8G2ATdue/PXQs/bNyUVlsARtlwwJNjdZqU+tLM2rHfADBWPxN6dcjmdmjHYtpPAGbTQ7QGa0m4c976AUBLiiJ6eHjjG7CxxY2Zd97CM6D9TW+m3sUxa10NCDyKwiaM/AJCe6s8IwFsoKDxDRaF+QUEi2vAkhy/gAYsQQOfyv0CRuDE4CL0C1iDQQ2s1/ALeAW/pirAS/wCwvsWekCWAHuJX8CYAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAnwvwU8cWPTFHBvHcZnOsolkXVi41gSoJLQrkkF08U+aq6WDZjYsfLo3s3KpreGLZnZjY9E8iYMbR1gqRJ/i0n0TTrRtzlF3ygWfatd/M2K0bd7xt8wG3fL8V8O4E9US6xKJAAAAABJRU5ErkJggg==" alt="LinkedIn" width="36" style="display:inline-block; vertical-align:middle;">
//                           </a>
//                           <a href="https://wa.me/918870295336" target="_blank" style="margin: 0 10px;">
//                             <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-jy74DqQgjct3lvMoc5kKvKBoze3zt4Haiw&s" alt="WhatsApp" width="36" style="display:inline-block; vertical-align:middle;">
//                           </a>
//                           <a href="mailto:ksritconference@gmail.com" style="margin: 0 10px;">
//                             <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeeceiZtze55yNLLKmme9KuPcPqt9TXSyr5w&s" alt="Email" width="36" style="display:inline-block; vertical-align:middle;">
//                           </a>
//                           <a href="https://ksrce.ac.in/" style="margin: 0 10px;">
//                             <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEHfmd0qwHhVjUHnObfu-1clz_qsPTDSkCmA&s" alt="Website" width="36" style="display:inline-block; vertical-align:middle;">
//                           </a>
//                         </div>
//                         <p style="margin-top: 15px; font-size: 12px; color: #aaaaaa;">
//                           © ${new Date().getFullYear()} Conference Portal. All rights reserved.
//                         </p>
//                       </td>
//                     </tr>
//                   </table>
//                 </td>
//               </tr>
//             </table>
//           </td>
//         </tr>
//       </table>
//     </center>
//   </body>
// </html>
// `;
// };


// utils/emailTemplate.js

// export const emailTemplate = (
//   subject,
//   message,
//   userName,
//   userEmail,
//   userId,
//   abstractTitle,
//   finalPaperStatus,
//   paymentStatus,
//   content = {}
// ) => {
//   let bannerHtml = "";
//   let dynamicContentHtml = "";

//   // --------------------------
//   // 1. Password Reset
//   // --------------------------
//   if (content?.resetLink) {
//     bannerHtml = `
//       <img src="https://cdn-icons-png.flaticon.com/512/103/103077.png" 
//            alt="Reset Password" 
//            style="width:100%;max-width:600px;" />
//     `;
//     dynamicContentHtml = `
//       <p style="font-size:16px;">
//         Hi ${userName || "User"},<br/><br/>
//         You requested a password reset. Click below to reset your password:
//       </p>
//       <div style="text-align:center;margin:20px 0;">
//         <a href="${content.resetLink}" 
//            style="padding:12px 24px;background:#2563eb;color:#fff;
//                   font-size:16px;font-weight:bold;border-radius:6px;
//                   text-decoration:none;">
//           🔑 Reset Password
//         </a>
//       </div>
//     `;
//   }

//   // --------------------------
//   // 2. Abstract Submission
//   // --------------------------
//   else if (content?.abstractStatus) {
//     bannerHtml = `
//       <img src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png" 
//            alt="Abstract Submission" 
//            style="width:100%;max-width:600px;" />
//     `;
//     dynamicContentHtml = `
//       <p style="font-size:16px;">
//         Hi ${userName},<br/><br/>
//         Your abstract titled <b>${abstractTitle}</b> has been 
//         <b>${content.abstractStatus}</b>.
//       </p>
//       <p><b>Track:</b> ${content.track || "N/A"}</p>
//       <p><b>Mode:</b> ${content.mode || "N/A"}</p>
//     `;
//   }

//   // --------------------------
//   // 3. Final Paper Submission
//   // --------------------------
//   else if (content?.finalPaperStatus) {
//     bannerHtml = `
//       <img src="https://cdn-icons-png.flaticon.com/512/2232/2232688.png" 
//            alt="Final Paper" 
//            style="width:100%;max-width:600px;" />
//     `;
//     dynamicContentHtml = `
//       <p style="font-size:16px;">
//         Hi ${userName},<br/><br/>
//         Your final paper has been 
//         <b>${content.finalPaperStatus}</b>.
//       </p>
//       ${
//         content.paperUrl
//           ? `<p>📄 Download: 
//               <a href="${content.paperUrl}">${content.paperUrl}</a>
//              </p>`
//           : ""
//       }
//     `;
//   }

//   // --------------------------
//   // 4. Payment (Paid / Rejected)
//   // --------------------------
//   else if (paymentStatus && ["paid", "rejected"].includes(paymentStatus.toLowerCase())) {
//     if (paymentStatus.toLowerCase() === "rejected") {
//       bannerHtml = `
//         <img src="https://example.com/payment-rejected.png" 
//              alt="Payment Rejected" 
//              style="width:100%;max-width:600px;" />
//       `;
//       dynamicContentHtml = `
//         <p style="color:#dc2626;font-size:16px;">
//           ❌ <b>Payment Rejected</b>
//         </p>
//         <p><b>User:</b> ${userName}</p>
//         <p><b>Reason:</b> ${content.reason || "Not specified"}</p>
//       `;
//     } else if (paymentStatus.toLowerCase() === "paid") {
//       bannerHtml = `
//         <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" 
//              alt="Payment Success" 
//              style="width:100%;max-width:600px;" />
//       `;
//       dynamicContentHtml = `
//         <p style="color:#16a34a;font-size:18px;margin-top:20px;">
//           ✅ <b>Payment Successful!</b>
//         </p>
//         <p><b>User:</b> ${userName}</p>
//         <p><b>Unique ID:</b> ${content.uniqueId || "N/A"}</p>
//         <p><b>Abstract Title:</b> ${abstractTitle || "N/A"}</p>
//         <p><b>Final Paper Status:</b> ${finalPaperStatus || "Pending"}</p>
//         <p><b>Payment Status:</b> Paid</p>
//         <div style="text-align:center;margin-top:20px;">
//           <a href="${content.hallTicketUrl || "#"}" 
//              style="display:inline-block;padding:12px 24px;
//                     background:#2563eb;color:#fff;
//                     font-size:16px;font-weight:bold;
//                     border-radius:6px;text-decoration:none;">
//             ⬇️ Download Hall Ticket (PDF)
//           </a>
//         </div>
//         ${
//           content.qrCodeUrl
//             ? `
//           <div style="text-align:center;margin-top:20px;">
//             <p>📌 Or scan this QR code at event check-in:</p>
//             <img src="${content.qrCodeUrl}" 
//                  alt="QR Code" 
//                  style="max-width:200px;" />
//           </div>`
//             : ""
//         }
//       `;
//     }
//   }

//   // --------------------------
//   // 5. Default (Registration Confirmation)
//   // --------------------------
//   else {
//     bannerHtml = `
//       <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
//            alt="Registration" 
//            style="width:100%;max-width:600px;" />
//     `;
//     dynamicContentHtml = `
//       <p style="font-size:16px;">
//         Hi ${userName},<br/><br/>
//         Thank you for registering for the conference. 
//         We’ll keep you updated on your progress.
//       </p>
//       <p><b>Abstract:</b> ${abstractTitle || "N/A"}</p>
//       <p><b>Status:</b> ${content.abstractStatus || "Pending"}</p>
//     `;
//   }

//   // --------------------------
//   // FINAL TEMPLATE
//   // --------------------------
//   return `
//     <div style="font-family:Arial,sans-serif;background:#f9fafb;padding:20px;">
//       <div style="max-width:600px;margin:0 auto;background:#fff;
//                   border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
//         ${bannerHtml}
//         <div style="padding:20px;">
//           <h2 style="color:#111827;">${subject}</h2>
//           <p>${message}</p>
//           ${dynamicContentHtml}
//         </div>
//         <div style="background:#f3f4f6;padding:12px;text-align:center;
//                     font-size:12px;color:#6b7280;">
//           © ${new Date().getFullYear()} Conference Committee. All rights reserved.
//         </div>
//       </div>
//     </div>
//   `;
// };



export const emailTemplate = (
  subject,
  message,
  userName,
  userEmail,
  userId,
  abstractTitle,
  finalPaperStatus,
  paymentStatus,
  content = {}
) => {
  let bannerHtml = "";
  let dynamicContentHtml = "";

  // --------------------------
  // 1. Password Reset
  // --------------------------
  if (content?.resetLink) {
    bannerHtml = `
      <img src="https://cdn-icons-png.flaticon.com/512/103/103077.png" 
           alt="Reset Password" 
           style="width:100%;max-width:600px;" />
    `;
    dynamicContentHtml = `
      <p style="font-size:16px;">
        Hi ${userName || "User"},<br/><br/>
        You requested a password reset. Click below to reset your password:
      </p>
      <div style="text-align:center;margin:20px 0;">
        <a href="${content.resetLink}" 
           style="padding:12px 24px;background:#2563eb;color:#fff;
                  font-size:16px;font-weight:bold;border-radius:6px;
                  text-decoration:none;">
          🔑 Reset Password
        </a>
      </div>
    `;
  }

  // --------------------------
  // 2. Payment Status (priority before paper)
  // --------------------------
  else if (paymentStatus && ["paid", "rejected"].includes(paymentStatus.toLowerCase())) {
    if (paymentStatus.toLowerCase() === "rejected") {
      bannerHtml = `
        <img src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png" 
             alt="Payment Rejected" 
             style="width:100%;max-width:600px;" />
      `;
      dynamicContentHtml = `
        <p style="color:#dc2626;font-size:16px;">
          ❌ <b>Payment Rejected</b>
        </p>
        <p><b>User:</b> ${userName}</p>
        <p><b>Reason:</b> ${content.reason || "Not specified"}</p>
      `;
    } else {
      bannerHtml = `
        <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" 
             alt="Payment Success" 
             style="width:100%;max-width:600px;" />
      `;
      dynamicContentHtml = `
        <p style="color:#16a34a;font-size:18px;margin-top:20px;">
          ✅ <b>Payment Successful!</b>
        </p>
        <p><b>User:</b> ${userName}</p>
        <p><b>Unique ID:</b> ${content.uniqueId || "N/A"}</p>
        <p><b>Abstract Title:</b> ${abstractTitle || "N/A"}</p>
        <p><b>Final Paper Status:</b> ${finalPaperStatus || "Pending"}</p>
        <p><b>Payment Status:</b> Paid</p>
        <div style="text-align:center;margin-top:20px;">
          <a href="${content.hallTicketUrl || "#"}" 
             style="display:inline-block;padding:12px 24px;
                    background:#2563eb;color:#fff;
                    font-size:16px;font-weight:bold;
                    border-radius:6px;text-decoration:none;">
            ⬇️ Download Hall Ticket (PDF)
          </a>
        </div>
        ${
          content.qrCodeUrl
            ? `
          <div style="text-align:center;margin-top:20px;">
            <p>📌 Or scan this QR code at event check-in:</p>
            <img src="${content.qrCodeUrl}" 
                 alt="QR Code" 
                 style="max-width:200px;" />
          </div>` 
            : ""
        }
      `;
    }
  }

  // --------------------------
  // 3. Final Paper Submission
  // --------------------------
  else if (content?.finalPaperStatus) {
    bannerHtml = `
      <img src="https://cdn-icons-png.flaticon.com/512/2232/2232688.png" 
           alt="Final Paper" 
           style="width:100%;max-width:600px;" />
    `;
    dynamicContentHtml = `
      <p style="font-size:16px;">
        Hi ${userName},<br/><br/>
        Your final paper has been 
        <b>${content.finalPaperStatus}</b>.
      </p>
      ${
        content.paperUrl
          ? `<p>📄 Download: 
              <a href="${content.paperUrl}">${content.paperUrl}</a>
             </p>`
          : ""
      }
    `;
  }

  // --------------------------
  // 4. Abstract Submission
  // --------------------------
  else if (content?.abstractStatus) {
    bannerHtml = `
      <img src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png" 
           alt="Abstract Submission" 
           style="width:100%;max-width:600px;" />
    `;
    dynamicContentHtml = `
      <p style="font-size:16px;">
        Hi ${userName},<br/><br/>
        Your abstract titled <b>${abstractTitle}</b> has been 
        <b>${content.abstractStatus}</b>.
      </p>
      <p><b>Track:</b> ${content.track || "N/A"}</p>
      <p><b>Mode:</b> ${content.mode || "N/A"}</p>
    `;
  }

  // --------------------------
  // 5. Default Registration
  // --------------------------
  else {
    bannerHtml = `
      <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
           alt="Registration" 
           style="width:100%;max-width:600px;" />
    `;
    dynamicContentHtml = `
      <p style="font-size:16px;">
        Hi ${userName},<br/><br/>
        Thank you for registering for the conference. 
        We’ll keep you updated on your progress.
      </p>
      <p><b>Abstract:</b> ${abstractTitle || "N/A"}</p>
      <p><b>Status:</b> ${content.abstractStatus || "Pending"}</p>
    `;
  }

  // --------------------------
  // FINAL TEMPLATE
  // --------------------------
  return `
    <div style="font-family:Arial,sans-serif;background:#f9fafb;padding:20px;">
      <div style="max-width:600px;margin:0 auto;background:#fff;
                  border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        ${bannerHtml}
        <div style="padding:20px;">
          <h2 style="color:#111827;">${subject}</h2>
          <p>${message}</p>
          ${dynamicContentHtml}
        </div>
        <div style="background:#f3f4f6;padding:12px;text-align:center;
                    font-size:12px;color:#6b7280;">
          © ${new Date().getFullYear()} Conference Committee. All rights reserved.
        </div>
      </div>
    </div>
  `;
};

