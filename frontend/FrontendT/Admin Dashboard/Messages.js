// DOM Element Selection
const sideMenu = document.querySelector("#sidebar");
const menuBtn = document.querySelector("#menubtn");
const closeBtn = document.querySelector("#closebtn");

// Open Mobile Navigation Drawer
menuBtn.addEventListener("click", () => {
  sideMenu.classList.add("active");
});

// Close Mobile Navigation Drawer
closeBtn.addEventListener("click", () => {
  sideMenu.classList.remove("active");
});

// Close Drawer when clicking outside of the sidebar
document.addEventListener("click", (event) => {
  const isClickInsideSidebar = sideMenu.contains(event.target);
  const isClickOnMenuBtn = menuBtn.contains(event.target);

  if (!isClickInsideSidebar && !isClickOnMenuBtn && sideMenu.classList.contains("active")) {
    sideMenu.classList.remove("active");
  }
});