const express = require("express");

const {
  getRecommendations,
} = require("../controllers/recommedationController");

const protectedAuth = require("../middleware/authMiddleware");

const router = express.Router();

// Get personalized recommendations
router.post("/", protectedAuth, getRecommendations);

module.exports = router;