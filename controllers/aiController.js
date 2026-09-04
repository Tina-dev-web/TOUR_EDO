const {
  generateTourRecommendation,
} = require("../services/aiService");

const {
  getRecommendations,
} = require("../services/recommendationService");

const generateAIRecommendation = async (req, res) => {
  try {
    const {
      interest,
      budget,
      location,
      duration,
    } = req.body;

    const recommendations = await getRecommendations({
      interest,
      budget,
      location,
    });

    const aiResponse =
      await generateTourRecommendation({
        user: req.user,
        recommendations,
        budget,
        duration,
      });

    res.status(200).json({
      success: true,
      recommendations,
      aiResponse,
    });
  } catch (error) {
    console.error("AI controller error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  generateAIRecommendation,
};