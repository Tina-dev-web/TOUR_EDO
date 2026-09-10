document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector("#aiForm");
  const result = document.querySelector("#result");
  const loading = document.querySelector("#loading");

  if (!requireLogin()) {
    return;
  }

  form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const interest = document.querySelector("#interest").value;
    const budget = Number(document.querySelector("#budget").value);
    const location = document.querySelector("#location").value;
    const duration = document.querySelector("#duration").value;

    loading.style.display = "block";
    result.innerHTML = "";

    try {

      const data = await apiRequest("/ai/recommend", {
        method: "POST",
        body: JSON.stringify({
          interest,
          budget,
          location,
          duration
        })
      });

      console.log("AI response:", data);

      loading.style.display = "none";

      result.innerHTML = `
        <h2>Your AI Recommendations</h2>

        <div class="ai-response">
          ${data.aiResponse || "Here are some recommendations for you."}
        </div>
      `;

      if (data.recommendations && data.recommendations.length > 0) {

        result.innerHTML += `
          <h2>Recommended Places</h2>
          <div id="recommendations"></div>
        `;

        const recommendationsContainer =
          document.querySelector("#recommendations");

        data.recommendations.forEach((item) => {

          const card = document.createElement("div");

          card.className = "recommendation-card";

          card.innerHTML = `
            <h3>${item.name || item.title || "Recommended Place"}</h3>

            <p>
              ${item.description || "A recommended destination for you."}
            </p>

            ${
              item.price
                ? `<p><strong>Price:</strong> ${item.price}</p>`
                : ""
            }
          `;

          recommendationsContainer.appendChild(card);

        });

      }

    } catch (error) {

      console.error("AI recommendation error:", error);

      loading.style.display = "none";

      result.innerHTML = `
        <p style="color: red;">
          ${error.message || "Unable to get recommendations."}
        </p>
      `;

    }

  });

});