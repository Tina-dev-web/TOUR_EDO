const express = require("express");

const { getProfile,updateProfile } = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// If you want to view your profile, use this route.
router.get("/profile", protect, getProfile);

// If you want to update your profile, use this route.
router.put("/profile", protect, updateProfile);

module.exports = router;