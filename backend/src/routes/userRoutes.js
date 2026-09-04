const express = require("express");

const { getProfile,updateProfile,deleteProfile,getAllUsers,getUserById,adminUpdateUser,adminDeleteUser } = require("../controllers/userController");
const adminMiddleware = require("../middleware/adminMiddleware");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// If you want to view your profile, use this route.
router.get("/profile", protect, getProfile);

// If you want to update your profile, use this route.
router.put("/profile", protect, updateProfile);

// If you want to delete your profile, use this route.
router.delete("/profile", protect, deleteProfile);

//admin routes
router.get("/admin/users", protect, adminMiddleware, getAllUsers);
router.get("/admin/users/:id", protect, adminMiddleware, getUserById);


router.put("/admin/users/:id", protect, adminMiddleware, adminUpdateUser);

router.delete("/admin/users/:id", protect, adminMiddleware, adminDeleteUser); 

module.exports = router;