const username = document.querySelector("#RGN");
const email = document.querySelector("#RGE");
const password = document.querySelector("#RGP");
const registerBtn = document.querySelector("#registerBtn");

registerBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const userData = {
    name: username.value,
    email: email.value,
    password: password.value,
  };

  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
      alert(data.message);
      return;
    }
    alert("Registration successful! Please log in.");
    window.location.href = "Login.html";
  } catch (error) {
    alert(error.message);
  }
});


// PopUp
let popUp = document.getElementById("popUp");
  function openPopUp() {
    popUp.classList.add("openPopUp");
  }
  function closePopUp() {
    popUp.classList.remove("openPopUp");
  }