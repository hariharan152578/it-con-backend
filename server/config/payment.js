
import dotenv from "dotenv";
import Razorpay from "razorpay";
dotenv.config();
import axios from "axios";


// Initialize Razorpay instance
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,      // from Razorpay dashboard
  key_secret: process.env.RAZORPAY_KEY_SECRET, // from Razorpay dashboard
});


export const countryCodeMap = {
  "+61": "Australia",
  "+43": "Austria",
  "+32": "Belgium",
  "+55": "Brazil",
  "+359": "Bulgaria",
  "+1": "Canada",
  "+357": "Cyprus",
  "+420": "Czech Republic",
  "+358": "Finland",
  "+350": "Gibraltar",
  "+91": "India",
  "+81": "Japan",
  "+370": "Lithuania",
  "+52": "Mexico",
  "+47": "Norway",
  "+65": "Singapore",
  "+34": "Spain",
  "+971": "United Arab Emirates",
  "+44": "United Kingdom",
  "+385": "Croatia",
  "+372": "Estonia",
  "+36": "Hungary",
  "+39": "Italy",
  "+423": "Liechtenstein",
  "+356": "Malta",
  "+40": "Romania",
  "+66": "Thailand",
  "+33": "France",
  "+30": "Greece",
  "+352": "Luxembourg",
  "+31": "Netherlands",
  "+48": "Poland",
  "+351": "Portugal",
  "+421": "Slovakia",
  "+386": "Slovenia",
  "+46": "Sweden",
  "+41": "Switzerland",
  "+1": "United States",
  "+49": "Germany",
  "+852": "Hong Kong",
  "+353": "Ireland",
  "+371": "Latvia",
  "+60": "Malaysia",
  "+64": "New Zealand",
  "+7": "Russia", // not in Stripe yet but added for completeness
  "+27": "South Africa",
  "+254": "Kenya",
  "+225": "Côte d'Ivoire",
  "+233": "Ghana",
  "+234": "Nigeria",
  "+62": "Indonesia",
  "+66": "Thailand"
};
// ------------------ Country/Currency Maps ------------------
export const countryCodes = {
  "+61": "AUD",
  "+43": "EUR",
  "+32": "EUR",
  "+55": "BRL",
  "+359": "BGN",
  "+1": "USD",
  "+357": "EUR",
  "+420": "CZK",
  "+358": "EUR",
  "+350": "GIP",
  "+91": "INR",
  "+81": "JPY",
  "+370": "EUR",
  "+52": "MXN",
  "+47": "NOK",
  "+65": "SGD",
  "+34": "EUR",
  "+971": "AED",
  "+44": "GBP",
  "+385": "HRK",
  "+372": "EUR",
  "+36": "HUF",
  "+39": "EUR",
  "+423": "CHF",
  "+356": "EUR",
  "+40": "RON",
  "+66": "THB",
  "+33": "EUR",
  "+30": "EUR",
  "+352": "EUR",
  "+31": "EUR",
  "+48": "PLN",
  "+351": "EUR",
  "+421": "EUR",
  "+386": "EUR",
  "+46": "SEK",
  "+41": "CHF",
  "+49": "EUR",
  "+852": "HKD",
  "+353": "EUR",
  "+371": "EUR",
  "+60": "MYR",
  "+64": "NZD",
  "+7": "RUB",
  "+27": "ZAR",
  "+254": "KES",
  "+225": "XOF",
  "+233": "GHS",
  "+234": "NGN",
  "+62": "IDR",
};

// export const inrToCurrency = {
//   "+61": 0.0175,   // AUD
//   "+43": 0.0098,   // EUR
//   "+32": 0.0098,   // EUR
//   "+55": 0.057,    // BRL
//   "+359": 0.019,   // BGN
//   "+1": 0.0114,    // USD
//   "+357": 0.0098,  // EUR
//   "+420": 0.254,   // CZK
//   "+358": 0.0098,  // EUR
//   "+350": 0.0098,  // GIP
//   "+91": 1,        // INR
//   "+81": 1.728,    // JPY
//   "+370": 0.0098,  // EUR
//   "+52": 0.211,    // MXN
//   "+47": 0.106,    // NOK
//   "+65": 0.015,    // SGD
//   "+34": 0.0098,   // EUR
//   "+971": 0.042,   // AED
//   "+44": 0.0085,   // GBP
//   "+385": 0.078,   // HRK
//   "+372": 0.0098,  // EUR
//   "+36": 3.58,     // HUF
//   "+39": 0.0098,   // EUR
//   "+423": 0.0094,  // CHF
//   "+356": 0.0098,  // EUR
//   "+40": 0.052,    // RON
//   "+66": 0.038,    // THB
//   "+33": 0.0098,   // EUR
//   "+30": 0.0098,   // EUR
//   "+352": 0.0098,  // EUR
//   "+31": 0.0098,   // EUR
//   "+48": 0.045,    // PLN
//   "+351": 0.0098,  // EUR
//   "+421": 0.0098,  // EUR
//   "+386": 0.0098,  // EUR
//   "+46": 0.107,    // SEK
//   "+41": 0.0094,   // CHF
//   "+49": 0.0098,   // EUR
//   "+852": 0.089,   // HKD
//   "+353": 0.0098,  // EUR
//   "+371": 0.0098,  // EUR
//   "+60": 0.053,    // MYR
//   "+64": 0.019,    // NZD
//   "+7": 0.105,     // RUB
//   "+27": 0.211,    // ZAR
//   "+254": 1.35,    // KES
//   "+225": 0.0065,  // XOF
//   "+233": 0.14,    // GHS
//   "+234": 4.35,    // NGN
//   "+62": 180.5,    // IDR
// };




/**
 * Fetch INR to currency conversion rates (with fallback to static values)
 */
export const fetchInrToCurrencyRates = async () => {
  try {
    const res = await axios.get("https://open.er-api.com/v6/latest/INR");
    if (!res.data || !res.data.rates) throw new Error("Invalid currency data");

    const rates = res.data.rates;

    // ✅ Full dynamic + static country code mapping
    const dynamicRates = {
      "+61": rates.AUD,   // AUD
      "+43": rates.EUR,   // EUR
      "+32": rates.EUR,   // EUR
      "+55": rates.BRL,   // BRL
      "+359": rates.BGN,  // BGN
      "+1": rates.USD,    // USD
      "+357": rates.EUR,  // EUR
      "+420": rates.CZK,  // CZK
      "+358": rates.EUR,  // EUR
      "+350": rates.GIP || rates.EUR,
      "+91": 1,           // INR
      "+81": rates.JPY,   // JPY
      "+370": rates.EUR,
      "+52": rates.MXN,
      "+47": rates.NOK,
      "+65": rates.SGD,
      "+34": rates.EUR,
      "+971": rates.AED,
      "+44": rates.GBP,
      "+385": rates.HRK || rates.EUR,
      "+372": rates.EUR,
      "+36": rates.HUF,
      "+39": rates.EUR,
      "+423": rates.CHF,
      "+356": rates.EUR,
      "+40": rates.RON,
      "+66": rates.THB,
      "+33": rates.EUR,
      "+30": rates.EUR,
      "+352": rates.EUR,
      "+31": rates.EUR,
      "+48": rates.PLN,
      "+351": rates.EUR,
      "+421": rates.EUR,
      "+386": rates.EUR,
      "+46": rates.SEK,
      "+41": rates.CHF,
      "+49": rates.EUR,
      "+852": rates.HKD,
      "+353": rates.EUR,
      "+371": rates.EUR,
      "+60": rates.MYR,
      "+64": rates.NZD,
      "+7": rates.RUB,
      "+27": rates.ZAR,
      "+254": rates.KES || 1.35, // Kenya (fallback)
      "+225": rates.XOF || 0.0065,
      "+233": rates.GHS || 0.14,
      "+234": rates.NGN || 4.35,
      "+62": rates.IDR || 180.5,
    };

    return dynamicRates;
  } catch (error) {
    console.error("⚠️ Currency API Error (Using fallback):", error.message);

    // 🪫 Full fallback static data
    return {
      "+61": 0.0175, "+43": 0.0098, "+32": 0.0098, "+55": 0.057, "+359": 0.019,
      "+1": 0.0114, "+357": 0.0098, "+420": 0.254, "+358": 0.0098, "+350": 0.0098,
      "+91": 1, "+81": 1.728, "+370": 0.0098, "+52": 0.211, "+47": 0.106,
      "+65": 0.015, "+34": 0.0098, "+971": 0.042, "+44": 0.0085, "+385": 0.078,
      "+372": 0.0098, "+36": 3.58, "+39": 0.0098, "+423": 0.0094, "+356": 0.0098,
      "+40": 0.052, "+66": 0.038, "+33": 0.0098, "+30": 0.0098, "+352": 0.0098,
      "+31": 0.0098, "+48": 0.045, "+351": 0.0098, "+421": 0.0098, "+386": 0.0098,
      "+46": 0.107, "+41": 0.0094, "+49": 0.0098, "+852": 0.089, "+353": 0.0098,
      "+371": 0.0098, "+60": 0.053, "+64": 0.019, "+7": 0.105, "+27": 0.211,
      "+254": 1.35, "+225": 0.0065, "+233": 0.14, "+234": 4.35, "+62": 180.5,
    };
  }
};
