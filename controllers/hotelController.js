const Hotel = require("../models/Hotel");

// ==========================================
// GET ALL HOTELS + SEARCH + FILTER
// GET /api/hotels
// ==========================================

const getHotels = async (req, res) => {
  try {
    const {
      search,
      location,
      minPrice,
      maxPrice,
      rating,
      amenities,
      sort,
    } = req.query;

    const filter = {
      available: true,
    };

    // Search by hotel name
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter by location
    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    // Filter by price
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice !== undefined) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice !== undefined) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // Filter by rating
    if (rating !== undefined) {
      filter.rating = {
        $gte: Number(rating),
      };
    }

    // Filter by amenities
    if (amenities) {
      const amenitiesArray = amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      filter.amenities = {
        $all: amenitiesArray,
      };
    }

    // Sorting
    let sortOption = {};

    switch (sort) {
      case "price-low":
        sortOption.price = 1;
        break;

      case "price-high":
        sortOption.price = -1;
        break;

      case "rating":
        sortOption.rating = -1;
        break;

      default:
        sortOption.createdAt = -1;
    }

    const hotels = await Hotel.find(filter).sort(sortOption);

    return res.status(200).json({
      success: true,
      count: hotels.length,
      hotels,
    });
  } catch (error) {
    console.error("Get hotels error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch hotels",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE HOTEL
// GET /api/hotels/:id
// ==========================================

const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    return res.status(200).json({
      success: true,
      hotel,
    });
  } catch (error) {
    console.error("Get hotel error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch hotel",
      error: error.message,
    });
  }
};

module.exports = {
  getHotels,
  getHotelById,
};