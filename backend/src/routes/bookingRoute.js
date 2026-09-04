const express = require("express");

const {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");

const protectedAuth = require("../middleware/authMiddleware");

const router = express.Router();


// CREATE BOOKING

router.post("/", protectedAuth, createBooking);


// GET LOGGED-IN USER'S BOOKINGS

router.get("/my-bookings", protectedAuth, getMyBookings);


// GET SINGLE BOOKING

router.get("/:id", protectedAuth, getBookingById);


// UPDATE BOOKING

router.patch("/:id", protectedAuth, updateBooking);


// CANCEL BOOKING

router.delete("/:id", protectedAuth, deleteBooking);

module.exports = router;