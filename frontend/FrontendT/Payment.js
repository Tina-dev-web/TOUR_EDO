const paymentForm = document.querySelector(".pay-form");

paymentForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "Login.html";
    return;
  }

  const email = document.querySelector("#email").value.trim();

  try {
    const data = await apiRequest("/payments/initialize", {
      method: "POST",
      body: JSON.stringify({
        email
      })
    });

    console.log("Payment initialized:", data);

    if (data.authorization_url) {
      window.location.href = data.authorization_url;
    } else {
      alert("Payment initialized successfully.");
    }

  } catch (error) {
    console.error("Payment error:", error);
    alert(error.message);
  }
});