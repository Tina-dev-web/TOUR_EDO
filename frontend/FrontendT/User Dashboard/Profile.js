document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar-container');
  const menuBtn = document.getElementById('menubtn');
  const closeBtn = document.getElementById('closebtn');

  // Mobile nav drawer (same pattern as Messages.js)
  menuBtn?.addEventListener('click', () => sidebar.classList.add('show-sidebar'));
  closeBtn?.addEventListener('click', () => sidebar.classList.remove('show-sidebar'));

  // Personal info: fields start disabled; "Edit" enables them and reveals
  // Save/Cancel actions.
  const infoForm = document.getElementById('infoForm');
  const editInfoBtn = document.getElementById('editInfoBtn');
  const cancelInfoBtn = document.getElementById('cancelInfoBtn');
  const infoInputs = infoForm ? infoForm.querySelectorAll('input, textarea') : [];
  const initialValues = new Map();
  infoInputs.forEach((el) => initialValues.set(el, el.value));

  const setEditing = (on) => {
    infoInputs.forEach((el) => { el.disabled = !on; });
    infoForm.classList.toggle('editing', on);
    editInfoBtn.style.display = on ? 'none' : 'inline-flex';
  };

  editInfoBtn?.addEventListener('click', () => setEditing(true));

  cancelInfoBtn?.addEventListener('click', () => {
    infoInputs.forEach((el) => { el.value = initialValues.get(el); });
    setEditing(false);
  });

  infoForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    infoInputs.forEach((el) => initialValues.set(el, el.value));
    setEditing(false);
  });

  // Password visibility toggles
  document.querySelectorAll('.toggle-visibility').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (!input) return;
      const showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      btn.innerHTML = showing
        ? '<i class="fa-solid fa-eye"></i>'
        : '<i class="fa-solid fa-eye-slash"></i>';
    });
  });

  document.getElementById('passwordForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    e.target.reset();
  });

  // Travel preference chips
  document.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => chip.classList.toggle('active'));
  });

  // Delete account confirmation
  document.getElementById('deleteAccountBtn')?.addEventListener('click', () => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete your account? This cannot be undone.'
    );
    if (confirmed) {
      // Hook up to your real delete-account endpoint here.
      console.log('Account deletion confirmed.');
    }
  });
});