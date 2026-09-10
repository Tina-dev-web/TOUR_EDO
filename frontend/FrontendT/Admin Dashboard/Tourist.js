const sideMenu = document.querySelector("#sidebar-drawer");
const usersBody = document.querySelector("#touristTable tbody");
const touristCount = document.querySelector("#tourist-count");
const filterButtons = document.querySelectorAll(".filter-btn");
let users = [];

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  }[character]));

const loadUsers = async () => {
  const response = await apiRequest("/users/admin/users");
  users = response.users;
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  document.querySelector("#total-tourists").textContent = users.length;
  document.querySelector("#new-tourists").textContent = users.filter(
    (user) => new Date(user.createdAt) >= monthStart
  ).length;
  document.querySelector("#guides-count").textContent = users.filter(
    (user) => user.role === "guide"
  ).length;
  document.querySelector("#roles-count").textContent = new Set(
    users.map((user) => user.role)
  ).size;
  usersBody.innerHTML = users.map((user) => `
    <tr>
      <td><input type="checkbox"></td>
      <td><div class="tourist-info"><div><h4>${escapeHtml(user.name)}</h4><p>${escapeHtml(user.email)}</p></div></div></td>
      <td>${escapeHtml(user.role)}</td>
      <td>${escapeHtml(user.email)}</td>
      <td title="${escapeHtml(user._id)}">${escapeHtml(user._id.slice(-8))}</td>
      <td>${new Date(user.createdAt).toLocaleDateString()}</td>
      <td><span class="status active-status">Registered</span></td>
      <td><div class="action-buttons">
        <button class="edit-user" data-id="${user._id}">Edit</button>
        <button class="delete-user" data-id="${user._id}">Delete</button>
      </div></td>
    </tr>`).join("");
  touristCount.textContent =
    `Showing ${users.length} registered user${users.length === 1 ? "" : "s"}`;
};

document.querySelector(".add-tourist-btn").addEventListener("click", async () => {
  const name = prompt("Tourist name:");
  const email = prompt("Tourist email:");
  const password = prompt("Temporary password (minimum 8 characters):");
  if (!name || !email || !password) return;
  try {
    await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role: "tourist" }),
    });
    await loadUsers();
  } catch (error) {
    alert(error.message);
  }
});

usersBody.addEventListener("click", async (event) => {
  const id = event.target.dataset.id;
  if (!id) return;
  try {
    if (event.target.classList.contains("delete-user")) {
      if (!confirm("Delete this tourist?")) return;
      await apiRequest(`/users/admin/users/${id}`, { method: "DELETE" });
    } else {
      const name = prompt("New name:");
      const email = prompt("New email:");
      if (!name || !email) return;
      await apiRequest(`/users/admin/users/${id}`, {
        method: "PUT", body: JSON.stringify({ name, email }),
      });
    }
    await loadUsers();
  } catch (error) {
    alert(error.message);
  }
});

document.querySelector("#touristSearch").addEventListener("input", (event) => {
  const query = event.target.value.toLowerCase();
  usersBody.querySelectorAll("tr").forEach((row) => {
    row.hidden = !row.textContent.toLowerCase().includes(query);
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => item.classList.remove("active-filter"));
      button.classList.add("active-filter");
      const filter = button.textContent.trim().toLowerCase();
      usersBody.querySelectorAll("tr").forEach((row) => {
        const role = row.children[2]?.textContent.toLowerCase();
        const date = row.children[5]?.textContent;
        const isCurrentMonth =
          date && new Date(date).getMonth() === new Date().getMonth();
        row.hidden =
          (filter === "tourists" && role !== "tourist") ||
          (filter === "guides" && role !== "guide") ||
          (filter === "newest" && !isCurrentMonth);
      });
    });
  });
});

document.querySelector("#menu-btn").addEventListener("click", () => sideMenu.classList.add("show-sidebar"));
document.querySelector("#closebtn").addEventListener("click", () => sideMenu.classList.remove("show-sidebar"));
loadUsers().catch((error) => alert(error.message));
