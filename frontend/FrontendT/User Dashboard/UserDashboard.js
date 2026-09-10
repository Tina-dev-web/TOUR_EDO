document.addEventListener("DOMContentLoaded", () => {

 
  const sideMenu = document.querySelector("#sidebar");

 
  const menuBtn = document.querySelector(".top-bar button");

  const closeBtn = document.querySelector(".close");


 
  console.log("Sidebar:", sideMenu);
  console.log("Menu button:", menuBtn);
  console.log("Close button:", closeBtn);


  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      sideMenu.classList.add("active");
    });
  }


  
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      sideMenu.classList.remove("active");
    });
  }

  document.addEventListener("click", (event) => {

    const isClickInsideSidebar = sideMenu.contains(event.target);

    const isClickOnMenuBtn = menuBtn && menuBtn.contains(event.target);

    if (
      !isClickInsideSidebar &&
      !isClickOnMenuBtn &&
      sideMenu.classList.contains("active")
    ) {
      sideMenu.classList.remove("active");
    }

  });

});