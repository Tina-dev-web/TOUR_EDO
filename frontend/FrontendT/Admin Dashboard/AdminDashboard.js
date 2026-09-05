const sideMenu = document.querySelector("aside")
const menuBtn = document.querySelector("#menubtn")
const closeBtn = document.querySelector("#closebtn")

// Side Bar
menuBtn.addEventListener('click', () =>{
  sideMenu.style.display = 'block';
})

closeBtn.addEventListener('click', () => {
  sideMenu.style.display = 'none'
})

