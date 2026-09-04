const express = require("express");
const cors = require("cors");

const app = express();

// ==========================
// MIDDLEWARE
// ==========================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================
// TEST ROUTE
// ==========================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to TourEdo API",
  });
});

// ==========================
// ROUTES
// ==========================
// AUTH
// const authRoutes = require("./routes/authRoute")
// app.use("/api/auth", authRoutes);

// Booking
const bookingRoutes = require("./routes/bookingRoute");
app.use("/api/bookings", bookingRoutes);

// Payment
const paymentRoutes = require("./routes/paymentRoute");
app.use("/api/payments", paymentRoutes);

// Reviews
const reviewRoutes = require("./routes/reviewRoute");
app.use("/api/reviews", reviewRoutes);

// Favourites
const favouriteRoutes = require("./routes/favouriteRoute");
app.use("/api/favourites", favouriteRoutes);

// Recommendations
const recommendationRoutes = require("./routes/recommendationRoute");
app.use("/api/recommendations", recommendationRoutes);

// Hotels
const hotelRoutes = require("./routes/hotelRoute");
app.use("/api/hotels", hotelRoutes);

// // AI
const aiRoutes = require("./routes/aiRoute");
app.use("/api/ai", aiRoutes);

// ==========================
// 404 HANDLER
// ==========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});



// ==========================
// EXPORT APP
// ==========================

module.exports = app;