const sideMenu = document.querySelector("#sidebar");
const profileForm = document.querySelector(".settings-form");

const loadProfile = async () => {
  const { user } = await apiRequest("/users/profile");
  document.querySelector("#admin-name").value = user.name || "";
  document.querySelector("#admin-email").value = user.email || "";
};

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const response = await apiRequest("/users/profile", {
      method: "PUT",
      body: JSON.stringify({
        name: document.querySelector("#admin-name").value.trim(),
        email: document.querySelector("#admin-email").value.trim(),
      }),
    });
    localStorage.setItem("user", JSON.stringify(response.user));
    alert("Profile updated successfully.");
  } catch (error) {
    alert(error.message);
  }
});

document.querySelector("#menubtn").addEventListener("click", () => sideMenu.classList.add("active"));
document.querySelector("#closebtn").addEventListener("click", () => sideMenu.classList.remove("active"));
loadProfile().catch((error) => alert(error.message));
