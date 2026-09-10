document.addEventListener("DOMContentLoaded", () => {
  const paymentForm = document.querySelector(".pay-form");

  if (!paymentForm) return;

  paymentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      window.location.href = "../Login.html";
      return;
    }

  
    const params = new URLSearchParams(window.location.search);
    const bookingId = params.get("bookingId");

    if (!bookingId) {
      alert("No booking selected for payment.");
      return;
    }

    try {
      const result = await apiRequest("/payments/initialize", {
        method: "POST",
        body: JSON.stringify({
          bookingId: bookingId
        })
      });

      console.log("PAYMENT INITIALIZED:", result);

      const paymentData = result.data;

      if (paymentData && paymentData.authorization_url) {
        window.location.href = paymentData.authorization_url;
      } else {
        alert("Payment could not be started.");
      }

    } catch (error) {
      console.error("Payment error:", error);
      alert(error.message);
    }
  });
});