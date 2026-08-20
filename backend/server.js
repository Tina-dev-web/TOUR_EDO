const express = require("express");
const dotenv = require("dotenv").config();

console.log("EMAIL_USER exists:", !!process.env.EMAIL_USER);
console.log("EMAIL_PASSWORD exists:", !!process.env.EMAIL_PASSWORD);
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoute");
const userRoutes = require("./src/routes/userRoutes");




const app = express();

app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


