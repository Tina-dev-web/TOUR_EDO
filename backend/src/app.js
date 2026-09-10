const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//welcome routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to TourEdo API",
  });
});

// Backend 1 routes
const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoutes");
const attractionRoutes = require("./routes/attractionRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attractions", attractionRoutes);

// Backend 2 routes
const bookingRoutes = require("./routes/bookingRoute");
const paymentRoutes = require("./routes/paymentRoute");
const reviewRoutes = require("./routes/reviewRoute");
const favouriteRoutes = require("./routes/favouriteRoute");
const recommendationRoutes = require("./routes/recommendationRoute");
const hotelRoutes = require("./routes/hotelRoute");
const aiRoutes = require("./routes/aiRoute");

app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/favourites", favouriteRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/ai", aiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;
