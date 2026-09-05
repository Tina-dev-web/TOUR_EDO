// Select DOM Elements
const sideMenu = document.querySelector("#sidebar");
const menuBtn = document.querySelector("#menubtn");
const closeBtn = document.querySelector("#closebtn");

// Open Sidebar Menu
menuBtn.addEventListener("click", () => {
  sideMenu.classList.add("active");
});

// Close Sidebar Menu
closeBtn.addEventListener("click", () => {
  sideMenu.classList.remove("active");
});

// Close Sidebar when clicking anywhere outside of it
document.addEventListener("click", (event) => {
  const isClickInsideSidebar = sideMenu.contains(event.target);
  const isClickOnMenuBtn = menuBtn.contains(event.target);

  if (!isClickInsideSidebar && !isClickOnMenuBtn && sideMenu.classList.contains("active")) {
    sideMenu.classList.remove("active");
  }
});