// export const emailTemplate = (title, message, userName, userEmail, userId, userAbstract, finalPaperStatus, paymentStatus) => `
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
//                             <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS8mepTgXsJPetKr4etyIA6UT_IqdNza2g8A&s" alt="LinkedIn" width="36" style="display:inline-block; vertical-align:middle;">
//                           </a>
//                           <a href="https://wa.me/918870295336" target="_blank" style="margin: 0 10px;">
//                             <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhYatLnrkEbMpa1WbqTteKE9WMRXQbyxy4Ag&s" alt="WhatsApp" width="36" style="display:inline-block; vertical-align:middle;">
//                           </a>
//                           <a href="mailto:ksritconference@gmail.com" style="margin: 0 10px;">
//                             <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9pHiswB5E3LY-Jxy-my1buVbRTvvn6qXLfQ&s" alt="Email" width="36" style="display:inline-block; vertical-align:middle;">
//                           </a>
//                           <a href="https://ksrce.ac.in/" style="margin: 0 10px;">
//                             <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlS-n3cCqGfO3jHQP6MWfZvB__XQyQkMNL-Q&s" alt="Website" width="36" style="display:inline-block; vertical-align:middle;">
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


export const emailTemplate = (title, message, userName, userEmail, userId, userAbstract, finalPaperStatus, paymentStatus) => {
  let bannerHtml = '';
  let dynamicContentHtml = '';

  // Determine the banner and dynamic content based on the email type
  if (userAbstract !== undefined && userAbstract !== null) {
    bannerHtml = `<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRREkO_NkGUNEj0eZnFmTtIa0q_AWsxTq1Lgw&s" alt="Abstract Submission Banner" style="width:100%; max-width:600px; height:auto; display:block; border-radius:8px 8px 0 0;" />`;
    dynamicContentHtml = `
      <p style="margin-top: 20px;">
        <b>User Name:</b> ${userName}<br/>
        <b>User Abstract:</b> ${userAbstract}<br/>
      </p>
    `;
  } else if (finalPaperStatus !== undefined && finalPaperStatus !== null) {
    bannerHtml = `<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLpUL9pnhkzyHQvcnP4OHZP5Qr0oAUL7A_xXt4FX0M5SO2ECFkLibK0lcLbcwbPC32Gqc&usqp=CAU" alt="Final Paper Status Banner" style="width:100%; max-width:600px; height:auto; display:block; border-radius:8px 8px 0 0;" />`;
    dynamicContentHtml = `
      <p style="margin-top: 20px;">
        <b>User Name:</b> ${userName}<br/>
        <b>Final Paper Status:</b> ${finalPaperStatus}<br/>
      </p>
    `;
  } else if (paymentStatus !== undefined && paymentStatus !== null) {
    bannerHtml = `<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg3_vsVL7OGr6De1j8XcJmMGPZYdVxB5zEewNkNYW3RWPsj-GtNMFAdUwiyz9aWMs6ElI&usqp=CAU" alt="Payment Status Banner" style="width:100%; max-width:600px; height:auto; display:block; border-radius:8px 8px 0 0;" />`;
    dynamicContentHtml = `
      <p style="margin-top: 20px;">
        <b>User Name:</b> ${userName}<br/>
        <b>Payment Status:</b> ${paymentStatus}<br/>
      </p>
    `;
  } else {
    // Default case for registration/welcome email
    bannerHtml = `<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_d9ec3NpFtI-GU3xQIu8gVG6qxQH0sY18gzSC5sMMFEqmu3NqT0UyZkvtA7GKKoBamSA&usqp=CAU" alt="KSR College of Engineering Banner" style="width:100%; max-width:600px; height:auto; display:block; border-radius:8px 8px 0 0;" />`;
    dynamicContentHtml = `
      <p style="margin-top: 20px;">
        <b>User Name:</b> ${userName}<br/>
        <b>User Email:</b> ${userEmail}<br/>
        <b>User ID:</b> ${userId}<br/>
      </p>
    `;
  }

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>${title}</title>
    <style>
      body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      img { -ms-interpolation-mode: bicubic; }
      img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }
      @media screen and (max-width: 525px) {
        .wrapper { width: 100% !important; max-width: 100% !important; }
        .responsive-table { width: 100% !important; }
        .padding { padding: 10px 5% !important; }
        .h2-padding { padding: 0 5% !important; }
        .logo-image { max-width: 80% !important; height: auto !important; }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
    <center style="width: 100%; background-color: #f4f4f4;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table border="0" cellpadding="0" cellspacing="0" width="600" class="wrapper" style="max-width: 600px;">
              <tr>
                <td style="background-color: #1e3a8a; padding: 0; border-radius: 8px 8px 0 0;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center">
                        ${bannerHtml}
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding: 15px 10px;">
                        <h1 style="font-family: Arial, sans-serif; font-size: 28px; color: #ffffff; margin: 0;">
                          ${title}
                        </h1>
                        <p style="font-family: Arial, sans-serif; font-size: 16px; color: #a3c9f7; margin: 10px 0 0;">
                          Conference Portal
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="background-color: #ffffff; padding: 40px 30px 20px; border-radius: 0 0 8px 8px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; padding-bottom: 20px;">
                        <h2 style="font-size: 20px; color: #1e293b; margin: 0 0 10px;">Hello ${userName},</h2>
                        <p>${message}</p>
                        ${dynamicContentHtml}
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding-top: 25px;">
                        <table border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td align="center" style="border-radius: 6px; background: #f97316;">
                              <a href="https://ksrce.ac.in/" target="_blank" style="font-size: 16px; font-family: Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 6px; padding: 14px 28px; border: 1px solid #f97316; display: block; font-weight: bold;">
                                Visit Portal
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 20px 0;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" style="font-family: Arial, sans-serif; font-size: 14px; color: #888888;">
                        <p style="margin: 5px 0;">
                          📞 +91 88702 95336 | 📧 ksritconference@gmail.com
                        </p>
                        <div style="margin: 15px 0;">
                          <a href="https://www.linkedin.com/company/ksrce?originalSubdomain=in" target="_blank" style="margin: 0 10px;">
                            <img src="https://i.imgur.com/uXmR0pL.png" alt="LinkedIn" width="36" style="display:inline-block; vertical-align:middle;">
                          </a>
                          <a href="https://wa.me/918870295336" target="_blank" style="margin: 0 10px;">
                            <img src="https://i.imgur.com/bK4u1Jv.png" alt="WhatsApp" width="36" style="display:inline-block; vertical-align:middle;">
                          </a>
                          <a href="mailto:ksritconference@gmail.com" style="margin: 0 10px;">
                            <img src="https://i.imgur.com/gK61wUe.png" alt="Email" width="36" style="display:inline-block; vertical-align:middle;">
                          </a>
                          <a href="https://ksrce.ac.in/" style="margin: 0 10px;">
                            <img src="https://i.imgur.com/C53mH7J.png" alt="Website" width="36" style="display:inline-block; vertical-align:middle;">
                          </a>
                        </div>
                        <p style="margin-top: 15px; font-size: 12px; color: #aaaaaa;">
                          © ${new Date().getFullYear()} Conference Portal. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </center>
  </body>
</html>
`;
};