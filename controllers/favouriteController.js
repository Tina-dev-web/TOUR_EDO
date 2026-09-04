const Favourite = require("../models/Favourite");


// ADD FAVOURITE
// POST /api/favourites


const addFavourite = async (req, res) => {
  try {
    const {
      target,
      targetType,
    } = req.body;

    if (!target || !targetType) {
      return res.status(400).json({
        success: false,
        message: "Target and target type are required",
      });
    }

    const existingFavourite = await Favourite.findOne({
      user: req.user.userId,
      target,
      targetType,
    });

    if (existingFavourite) {
      return res.status(400).json({
        success: false,
        message: "Already added to favourites",
      });
    }

    const favourite = await Favourite.create({
      user: req.user.userId,
      target,
      targetType,
    });

    return res.status(201).json({
      success: true,
      message: "Added to favourites",
      favourite,
    });
  } catch (error) {
    console.error("Add favourite error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET FAVOURITES
// GET /api/favourites


const getFavourites = async (req, res) => {
  try {
    const favourites = await Favourite.find({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: favourites.length,
      favourites,
    });
  } catch (error) {
    console.error("Get favourites error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// DELETE FAVOURITE
// DELETE /api/favourites/:id


const deleteFavourite = async (req, res) => {
  try {
    const favourite = await Favourite.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!favourite) {
      return res.status(404).json({
        success: false,
        message: "Favourite not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Removed from favourites",
    });
  } catch (error) {
    console.error("Delete favourite error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addFavourite,
  getFavourites,
  deleteFavourite,
};