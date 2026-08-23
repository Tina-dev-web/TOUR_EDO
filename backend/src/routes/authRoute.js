const express = require("express");
const { registerUser,loginUser, getAuthenticatedUser,forgotPassword,resetPassword,changePassword} = require("../controllers/authControllers");
const protectedRoute = require("../middleware/authMiddleware");

const router = express.Router();

// pls if you want to register a new user, use this route.
router.post("/register", registerUser);

// pls if you want to log in, use this route.
router.post("/login", loginUser);

//this route is for authenticated users only, pls use the token you got from the login route to access this route.
router.get("/protected", protectedRoute,getAuthenticatedUser);

//this route is for users who forgot their password, pls use this route to request a reset link.
router.post("/forgotpassword", forgotPassword);

//this route is for users who want to reset their password, pls use this route to reset your password.
router.post("/reset-password", resetPassword);


module.exports = router;