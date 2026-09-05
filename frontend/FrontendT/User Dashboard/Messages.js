document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar-container');
  const menuBtn = document.getElementById('menubtn');
  const closeBtn = document.getElementById('closebtn');
  const chatContainer = document.querySelector('.chat-container');
  const conversationCards = document.querySelectorAll('.conversation-card');
  const backBtn = document.querySelector('.back-btn');
  const tabBtns = document.querySelectorAll('.tab-btn');

  // Mobile nav drawer
  menuBtn?.addEventListener('click', () => sidebar.classList.add('show-sidebar'));
  closeBtn?.addEventListener('click', () => sidebar.classList.remove('show-sidebar'));

  // Selecting a conversation: mark it active, and on mobile switch from the
  // list view to the chat view (this is the piece that was missing before —
  // `.chat-main` had `display: none` on mobile with no way to reveal it).
  conversationCards.forEach((card) => {
    card.addEventListener('click', () => {
      conversationCards.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
      chatContainer.classList.add('show-chat');
    });
  });

  // Back button (mobile only) returns to the conversation list.
  backBtn?.addEventListener('click', () => {
    chatContainer.classList.remove('show-chat');
  });

  // Simple All / Unread tab switching.
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
});