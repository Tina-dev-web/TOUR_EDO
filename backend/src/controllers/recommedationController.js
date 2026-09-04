
const Hotel = require("../models/Hotel");
// const TourPackage = require("../models/TourPackage");

const Attraction = require("../models/attraction");

const getRecommendations = async (req, res) => {
  try {
    const {
      interest,
      budget,
      location,
    } = req.body;

    const attractions = await Attraction.find();

    let recommendations = attractions.map((item) => {
      let score = 0;

      // Interest matching
      if (
        interest &&
        item.category &&
        item.category.toLowerCase() === interest.toLowerCase()
      ) {
        score += 40;
      }

      // Location matching
      if (
        location &&
        item.location &&
        item.location.toLowerCase().includes(location.toLowerCase())
      ) {
        score += 20;
      }

      // Budget matching
      if (
        budget !== undefined &&
        item.price !== undefined &&
        item.price <= Number(budget)
      ) {
        score += 25;
      }

      return {
        item,
        score,
      };
    });

    // Highest score first
    recommendations.sort((a, b) => b.score - a.score);

    return res.status(200).json({
      success: true,
      count: recommendations.slice(0, 10).length,
      recommendations: recommendations.slice(0, 10),
    });
  } catch (error) {
    console.error("Recommendation error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getRecommendations,
};