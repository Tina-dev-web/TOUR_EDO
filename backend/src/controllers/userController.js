const User = require("../models/User");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};