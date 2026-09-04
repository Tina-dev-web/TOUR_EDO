const Booking = require("../models/Booking");
const crypto = require("crypto");

//create

const createBooking = async (req, res) => {
  try {
    const {
      service,
      serviceType,
      bookingDate,
      quantity,
      totalAmount,
    } = req.body;

    if (
      !service ||
      !serviceType ||
      !bookingDate ||
      !quantity ||
      totalAmount === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All booking fields are required",
      });
    }

    const bookingReference = `TEDO-${crypto
      .randomBytes(5)
      .toString("hex")
      .toUpperCase()}`;

    const booking = await Booking.create({
      user: req.user.userId,
      service,
      serviceType,
      bookingDate,
      quantity,
      totalAmount,
      bookingReference,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get single booking by id

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Get booking error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Completed bookings cannot be updated",
      });
    }

    const allowedUpdates = [
      "bookingDate",
      "quantity",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        booking[field] = req.body[field];
      }
    });

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    console.error("Update booking error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// CANCEL BOOKING

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Completed bookings cannot be cancelled",
      });
    }

    booking.status = "cancelled";

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
};