const axios = require("axios");

const PAYSTACK_URL =
  "https://api.paystack.co";

const paystackHeaders = {
  Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
  "Content-Type": "application/json",
};

// ==========================================
// INITIALIZE PAYMENT
// ==========================================

const initializeTransaction = async ({
  email,
  amount,
  reference,
  metadata,
}) => {
  try {
    const response = await axios.post(
      `${PAYSTACK_URL}/transaction/initialize`,
      {
        email,
        amount: Math.round(amount * 100),
        currency: "NGN",
        reference,
        metadata,
      },
      {
        headers: paystackHeaders,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Paystack initialization error:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
        "Unable to initialize payment"
    );
  }
};

// ==========================================
// VERIFY PAYMENT
// ==========================================

const verifyTransaction = async (reference) => {
  try {
    const response = await axios.get(
      `${PAYSTACK_URL}/transaction/verify/${reference}`,
      {
        headers: paystackHeaders,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Paystack verification error:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
        "Unable to verify payment"
    );
  }
};

module.exports = {
  initializeTransaction,
  verifyTransaction,
};