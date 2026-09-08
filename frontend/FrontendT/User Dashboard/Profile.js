document.addEventListener("DOMContentLoaded", async () => {

  const infoForm = document.getElementById("infoForm");
  const inputs = infoForm.querySelectorAll("input");
  const bio = infoForm.querySelector("textarea");

  const editInfoBtn = document.getElementById("editInfoBtn");
  const editProfileBtn = document.querySelector(".edit-profile-btn");
  const cancelInfoBtn = document.getElementById("cancelInfoBtn");
  const infoFormActions = document.getElementById("infoFormActions");


  // =========================
  // LOAD PROFILE
  // =========================

  try {

    const data = await apiRequest("/users/profile");

    const user = data.user || data;

    if (inputs[0]) {
      inputs[0].value = user.name || "";
    }

    if (inputs[1]) {
      inputs[1].value = user.email || "";
    }

  } catch (error) {

    console.error("Profile loading error:", error);

    alert(error.message);

  }

  function enableEditing() {

    inputs.forEach((input) => {
      input.disabled = false;
    });

    if (bio) {
      bio.disabled = false;
    }
    if (infoFormActions) {
      infoFormActions.style.display = "flex";
    }

    if (inputs[0]) {
      inputs[0].focus();
    }
  }

  editProfileBtn?.addEventListener("click", enableEditing);

  editInfoBtn?.addEventListener("click", enableEditing);


  cancelInfoBtn?.addEventListener("click", () => {

    window.location.reload();

  });

  infoForm?.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name = inputs[0]?.value.trim();
    const email = inputs[1]?.value.trim();

    if (!name || !email) {

      alert("Name and email are required.");

      return;
    }


    try {

      const data = await apiRequest("/users/profile", {

        method: "PUT",

        body: JSON.stringify({
          name: name,
          email: email
        })

      });


      alert(
        data.message ||
        "Profile updated successfully!"
      );


      window.location.reload();


    } catch (error) {

      console.error(
        "Profile update error:",
        error
      );

      alert(error.message);

    }

  });
  
  const deleteAccountBtn =
    document.getElementById("deleteAccountBtn");


  deleteAccountBtn?.addEventListener(
    "click",
    async () => {

      const confirmed = confirm(
        "Are you sure you want to permanently delete your account?"
      );


      if (!confirmed) {
        return;
      }


      try {

        const data = await apiRequest(
          "/users/profile",
          {
            method: "DELETE"
          }
        );


        alert(
          data.message ||
          "Account deleted successfully."
        );


        localStorage.removeItem("token");
        localStorage.removeItem("user");


        window.location.href =
          "../../Login.html";


      } catch (error) {

        console.error(
          "Delete account error:",
          error
        );

        alert(error.message);

      }

    }
  );

});