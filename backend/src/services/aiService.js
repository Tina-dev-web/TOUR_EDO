const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateTourRecommendation = async ({
  user,
  recommendations,
  budget,
  duration,
}) => {
  try {
    const places = recommendations.map((item) => ({
      type: item.type,
      name: item.item.name,
      location: item.item.location,
      price: item.item.price,
      score: item.score,
    }));

    const prompt = `
Your TourEdo AI, an intelligent tourism assistant
for visitors exploring Edo State, Nigeria.

Create a helpful and concise tourism recommendation.

User information:
- Interests: ${user?.interests?.join(", ") || "Not specified"}
- Budget: ₦${budget || "Not specified"}
- Trip duration: ${duration || "Not specified"}

Recommended TourEdo options:
${JSON.stringify(places, null, 2)}

Instructions:
1. Recommend the most suitable options.
2. Explain briefly why they match the user's preferences.
3. Consider their budget.
4. If a budget is provided, don't recommend options
   that clearly exceed it.
5. Don't invent hotels, attractions, prices, or locations.
6. Only use information contained in the supplied options.
`;

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: prompt,
    });

    return response.output_text;
  } catch (error) {
    console.error("AI service error:", error);

    throw new Error("Unable to generate AI recommendation");
  }
};

module.exports = {
  generateTourRecommendation,
};