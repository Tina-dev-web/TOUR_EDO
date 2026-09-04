const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config();

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoute");
const userRoutes = require("./src/routes/userRoutes");
const attractionRoutes = require("./src/routes/attractionRoutes");



app.use(cors());
app.use(express.json());
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attractions", attractionRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


