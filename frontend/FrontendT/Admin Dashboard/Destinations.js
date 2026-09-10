const sideMenu = document.querySelector("#sidebar");
const form = document.querySelector(".add-destination form");
const body = document.querySelector("#destinations-body");
let editingId = null;

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  }[character]));

const loadDestinations = async () => {
  const { attractions } = await apiRequest("/attractions");
  body.innerHTML = attractions.map((item) => `
    <tr>
      <td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.location)}</td>
      <td>${escapeHtml(item.category)}</td><td>${escapeHtml(item.description)}</td>
      <td><button class="btn btn-edit" data-action="edit" data-id="${item._id}">Edit</button>
      <button class="btn btn-delete" data-action="delete" data-id="${item._id}">Delete</button></td>
    </tr>`).join("");
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData();
  formData.append("name", document.querySelector("#name").value.trim());
  formData.append("location", document.querySelector("#location").value.trim());
  formData.append("category", document.querySelector("#category").value);
  formData.append("description", document.querySelector("#description").value.trim());
  formData.append("openingHours", "09:00 - 18:00");
  formData.append("price", "0");
  try {
    await apiRequest(editingId ? `/attractions/${editingId}` : "/attractions", {
      method: editingId ? "PUT" : "POST", body: formData,
    });
    editingId = null;
    form.reset();
    form.querySelector("button").textContent = "Save Destination";
    await loadDestinations();
  } catch (error) { alert(error.message); }
});

body.addEventListener("click", async (event) => {
  const id = event.target.dataset.id;
  if (!id) return;
  try {
    const { attraction } = await apiRequest(`/attractions/${id}`);
    if (event.target.dataset.action === "delete") {
      if (!confirm("Delete this destination?")) return;
      await apiRequest(`/attractions/${id}`, { method: "DELETE" });
    } else {
      editingId = id;
      document.querySelector("#name").value = attraction.name;
      document.querySelector("#location").value = attraction.location;
      document.querySelector("#category").value = attraction.category;
      document.querySelector("#description").value = attraction.description;
      form.querySelector("button").textContent = "Update Destination";
      return;
    }
    await loadDestinations();
  } catch (error) { alert(error.message); }
});

document.querySelector("#menubtn").addEventListener("click", () => sideMenu.classList.add("active"));
document.querySelector("#closebtn").addEventListener("click", () => sideMenu.classList.remove("active"));
loadDestinations().catch((error) => alert(error.message));
