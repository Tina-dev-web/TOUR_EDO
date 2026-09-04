const express = require("express");

const {
  createReview,
  getReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const protectedAuth = require("../middleware/authMiddleware");

const router = express.Router();

// Create review
router.post("/", protectedAuth, createReview);

// Get review
router.get("/:id", getReview);

// Update review
router.put("/:id", protectedAuth, updateReview);

// Delete review
router.delete("/:id", protectedAuth, deleteReview);

module.exports = router;