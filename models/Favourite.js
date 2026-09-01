const mongoose = require("mongoose");

const favouriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    target: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    targetType: {
      type: String,
      enum: ["attraction", "hotel", "restaurant", "tour"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same user from saving the same item twice
favouriteSchema.index(
  {
    user: 1,
    target: 1,
    targetType: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Favourite", favouriteSchema);