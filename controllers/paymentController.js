const axios = require("axios");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const User = require("../models/User");

// ==========================================
// INITIALIZE PAYMENT
// ==========================================

const initializePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    // Get logged-in user
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find booking belonging to logged-in user
    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user.userId,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "This booking has been cancelled",
      });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "This booking has already been paid for",
      });
    }

    // Send payment request to Paystack
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: user.email,
        amount: Math.round(booking.totalAmount * 100),
        reference: booking.bookingReference,

        metadata: {
          bookingId: booking._id.toString(),
          userId: req.user.userId,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Save payment record
    await Payment.findOneAndUpdate(
      {
        reference: booking.bookingReference,
      },
      {
        user: req.user.userId,
        booking: booking._id,
        reference: booking.bookingReference,
        amount: booking.totalAmount,
        status: "pending",
      },
      {
        upsert: true,
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Payment initialized",
      data: response.data.data,
    });

  } catch (error) {
    console.error(
      "Payment initialization error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.message || error.message,
    });
  }
};

// ==========================================
// VERIFY PAYMENT
// ==========================================

const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is required",
      });
    }

    // Verify transaction with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const transaction = response.data.data;

    // Find payment record
    const payment = await Payment.findOne({
      reference,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    // Make sure the payment belongs to logged-in user
    if (
      payment.user.toString() !== req.user.userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to verify this payment",
      });
    }

    const booking = await Booking.findById(
      payment.booking
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Successful payment
    if (transaction.status === "success") {
      payment.status = "success";
      payment.paidAt = new Date();

      booking.paymentStatus = "paid";
      booking.status = "confirmed";

      await payment.save();
      await booking.save();

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        payment,
        booking,
      });
    }

    // Failed payment
    payment.status = "failed";
    booking.paymentStatus = "failed";

    await payment.save();
    await booking.save();

    return res.status(400).json({
      success: false,
      message: "Payment was not successful",
    });

  } catch (error) {
    console.error(
      "Payment verification error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.message || error.message,
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  initializePayment,
  verifyPayment,
};