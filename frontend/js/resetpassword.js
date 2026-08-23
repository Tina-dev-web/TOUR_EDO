const resetPasswordForm =
  document.getElementById("resetPasswordForm");

const message =
  document.getElementById("message");

const urlParams =
  new URLSearchParams(window.location.search);

const resetToken =
  urlParams.get("token");

resetPasswordForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const newPassword =
    document.getElementById("newPassword").value;

  const confirmPassword =
    document.getElementById("confirmPassword").value;

  if (newPassword !== confirmPassword) {
    message.textContent = "Passwords do not match.";
    return;
  }

  if (!resetToken) {
    message.textContent =
      "Invalid or missing password reset link.";

    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/reset-password",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          token: resetToken,
          newPassword: newPassword,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      message.textContent =
        data.message ||
        "Unable to reset password.";

      return;
    }

    message.textContent =
      data.message ||
      "Password reset successfully.";

    resetPasswordForm.reset();

  } catch (error) {
    console.error(
      "Reset password error:",
      error
    );

    message.textContent =
      "Unable to connect to the server.";
  }
});