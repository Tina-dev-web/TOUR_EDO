const Attraction = require("../models/attraction");
const Hotel = require("../models/Hotel");
// const TourPackage = require("../models/TourPackage");

/**
 * Calculate recommendation score
 */
const calculateScore = ({
  item,
  interest,
  budget,
  location,
}) => {
  let score = 0;

  // Interest match
  if (
    interest &&
    item.category &&
    item.category.toLowerCase() === interest.toLowerCase()
  ) {
    score += 40;
  }

  // Location match
  if (
    location &&
    item.location &&
    item.location
      .toLowerCase()
      .includes(location.toLowerCase())
  ) {
    score += 30;
  }

  // Budget match
  if (
    budget &&
    item.price !== undefined &&
    Number(item.price) <= Number(budget)
  ) {
    score += 30;
  }

  return score;
};

/**
 * Get personalized recommendations
 */
const getRecommendations = async ({
  interest,
  budget,
  location,
}) => {
  const recommendations = [];

  // Get attractions
  const attractions = await Attraction.find();

  attractions.forEach((attraction) => {
    const score = calculateScore({
      item: attraction,
      interest,
      budget,
      location,
    });

    recommendations.push({
      type: "attraction",
      item: attraction,
      score,
    });
  });

  // Get hotels
  const hotels = await Hotel.find({
    available: true,
  });

  hotels.forEach((hotel) => {
    const score = calculateScore({
      item: hotel,
      interest,
      budget,
      location,
    });

      recommendations.push({
        type: "hotel",
        item: hotel,
        score,
      });
    });

  // Highest score first
  recommendations.sort(
    (a, b) => b.score - a.score
  );

  // Return top 10
  return recommendations.slice(0, 10);
};

module.exports = {
  calculateScore,
  getRecommendations,
};