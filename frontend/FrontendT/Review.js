document.addEventListener("DOMContentLoaded", async () => {
  try {
    const data = await apiRequest("/reviews");

    console.log("REVIEWS:", data);

    const reviews = Array.isArray(data)
      ? data
      : data.reviews || [];

    console.log("Reviews loaded:", reviews);

  } catch (error) {
    console.error("Loading reviews error:", error);
  }
});