const loginForm = document.querySelector(".admin");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.querySelector("#RGE").value.trim();
  const password = document.querySelector("#RGP").value;

  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Login failed.");
      return;
    }

    localStorage.setItem("token", data.token);


    localStorage.setItem("user", JSON.stringify(data.user));

    alert("Welcome to Tour Edo!");

   if (data.user.role === "admin") {
  window.location.href = "Admin Dashboard/AdminDashboard.html";
} else {
  window.location.href = "User Dashboard/UserDashbboard.html";
}

  } catch (error) {
    console.error("Login error:", error);
    alert("Unable to connect to the server.");
  }
});