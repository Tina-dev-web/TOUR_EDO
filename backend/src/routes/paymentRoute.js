const express = require("express");

const {
  initializePayment,
  verifyPayment,
} = require("../controllers/paymentController");

const protectedAuth = require("../middleware/authMiddleware");

const router = express.Router();

// Initialize Paystack payment
router.post(
  "/initialize",
  protectedAuth,
  initializePayment
);

// Verify Paystack payment
router.get(
  "/verify/:reference",
  protectedAuth,
  verifyPayment
);

module.exports = router;