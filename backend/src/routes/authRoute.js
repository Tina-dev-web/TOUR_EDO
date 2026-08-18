const express = require("express");
const { registerUser,loginUser, getAuthenticatedUser } = require("../controllers/authControllers");
const protectedRoute = require("../middleware/authMiddleware");

const router = express.Router();

// pls if you want to register a new user, use this route.
router.post("/register", registerUser);

// pls if you want to log in, use this route.
router.post("/login", loginUser);

//this route is for authenticated users only, pls use the token you got from the login route to access this route.
router.get("/protected", protectedRoute,getAuthenticatedUser);

module.exports = router;