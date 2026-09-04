const express = require("express");

const {
  generateAIRecommendation,
} = require("../controllers/aiController");

const protectedAuth = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/recommend",
  protectedAuth,
  generateAIRecommendation
);

module.exports = router;