const sideMenu = document.querySelector("#sidebar-drawer");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#closebtn");

// Open Mobile Sidebar
menuBtn.addEventListener("click", () => {
  sideMenu.classList.add("show-sidebar");
});

// Close Mobile Sidebar
closeBtn.addEventListener("click", () => {
  sideMenu.classList.remove("show-sidebar");
});

// Close Drawer when clicking outside of the sidebar
document.addEventListener("click", (event) => {
  const isClickInsideSidebar = sideMenu.contains(event.target);
  const isClickOnMenuBtn = menuBtn.contains(event.target);

  if (!isClickInsideSidebar && !isClickOnMenuBtn && sideMenu.classList.contains("active")) {
    sideMenu.classList.remove("active");
  }
});