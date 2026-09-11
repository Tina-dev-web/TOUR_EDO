const express = require("express");

const {
  createBooking,
  getMyBookings,
  getAllBookingsForAdmin,
  getBookingById,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");

const protectedAuth = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// CREATE BOOKING

router.post("/", protectedAuth, createBooking);


// GET LOGGED-IN USER'S BOOKINGS

router.get("/my-bookings", protectedAuth, getMyBookings);

// GET ALL BOOKINGS - ADMIN ONLY
router.get(
  "/admin/all",
  protectedAuth,
  adminMiddleware,
  getAllBookingsForAdmin
);


// GET SINGLE BOOKING

router.get("/:id", protectedAuth, getBookingById);


// UPDATE BOOKING

router.patch("/:id", protectedAuth, updateBooking);


// CANCEL BOOKING

router.delete("/:id", protectedAuth, deleteBooking);

module.exports = router;