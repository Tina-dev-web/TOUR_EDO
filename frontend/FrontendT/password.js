const forgotPasswordForm = document.getElementById("forgotPasswordForm");

forgotPasswordForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const message = document.getElementById("message");

  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/forgotpassword",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      message.textContent = data.message || "Something went wrong.";
      return;
    }

    message.textContent = data.message;

  } catch (error) {
    console.error("Forgot password error:", error);

    message.textContent = "Unable to connect to the server.";
  }
});

