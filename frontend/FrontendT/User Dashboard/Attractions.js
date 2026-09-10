document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementsByClassName('sidebar');
  const menuBtn = document.getElementById('menubtn');
  const closeBtn = document.getElementById('closebtn');

  menuBtn.addEventListener('click', () => 
  sidebar.classList.add('show-sidebar'));

  closeBtn.addEventListener('click', () => 
  sidebar.classList.remove('show-sidebar'));
});
