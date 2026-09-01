const Review = require("../models/Review");
const Booking = require("../models/Booking");

// ==========================================
// CREATE REVIEW
// ==========================================

const createReview = async (req, res) => {
  try {
    const {
      booking,
      target,
      targetType,
      rating,
      comment,
    } = req.body;

    if (
      !booking ||
      !target ||
      !targetType ||
      rating === undefined ||
      !comment
    ) {
      return res.status(400).json({
        success: false,
        message: "All review fields are required",
      });
    }

    // Check that the booking belongs to the logged-in user
    const userBooking = await Booking.findOne({
      _id: booking,
      user: req.user.userId,
    });

    if (!userBooking) {
      return res.status(403).json({
        success: false,
        message: "You can only review a booking you made",
      });
    }

    // Only completed bookings can be reviewed
    if (userBooking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "You can only review completed bookings",
      });
    }

    // Prevent duplicate reviews
    const existingReview = await Review.findOne({
      user: req.user.userId,
      booking,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this booking",
      });
    }

    const review = await Review.create({
      user: req.user.userId,
      booking,
      target,
      targetType,
      rating,
      comment,
    });

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    console.error("Create review error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET REVIEW
// ==========================================

const getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("user", "name email")
      .populate("booking");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("Get review error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE REVIEW
// ==========================================

const updateReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (req.body.rating !== undefined) {
      review.rating = req.body.rating;
    }

    if (req.body.comment !== undefined) {
      review.comment = req.body.comment;
    }

    await review.save();

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.error("Update review error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// DELETE REVIEW
// ==========================================

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createReview,
  getReview,
  updateReview,
  deleteReview,
};