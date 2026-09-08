
const sideMenu = document.querySelector("#sidebar");
const menuBtn = document.querySelector("#menubtn");
const closeBtn = document.querySelector("#closebtn");


menuBtn.addEventListener("click", () => {
  sideMenu.classList.add("active");
});


closeBtn.addEventListener("click", () => {
  sideMenu.classList.remove("active");
});


document.addEventListener("click", (event) => {
  const isClickInsideSidebar = sideMenu.contains(event.target);
  const isClickOnMenuBtn = menuBtn.contains(event.target);

  if (!isClickInsideSidebar && !isClickOnMenuBtn && sideMenu.classList.contains("active")) {
    sideMenu.classList.remove("active");
  }
});