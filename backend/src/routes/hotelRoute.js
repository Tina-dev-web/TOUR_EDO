const express = require("express");

const {
  getHotels,
  getHotelById,
} = require("../controllers/hotelController");

const router = express.Router();

// Get hotels with search/filter
router.get("/", getHotels);

// Get one hotel
router.get("/:id", getHotelById);

module.exports = router;