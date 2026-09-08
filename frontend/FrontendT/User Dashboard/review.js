async function loadReviews() {
  try {
    const data = await apiRequest("/reviews");

    console.log("Reviews:", data);

  } catch (error) {
    console.error("Reviews error:", error);
  }
}

loadReviews();