const express = require("express");

const {
  addFavourite,
  getFavourites,
  deleteFavourite,
} = require("../controllers/favouriteController");

const protectedAuth = require("../middleware/authMiddleware");

const router = express.Router();

// Add favourite
router.post("/", protectedAuth, addFavourite);

// Get user's favourites
router.get("/", protectedAuth, getFavourites);

// Remove favourite
router.delete("/:id", protectedAuth, deleteFavourite);

module.exports = router;