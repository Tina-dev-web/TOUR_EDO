const sideMenu = document.querySelector("#sidebar");
const bookingsBody = document.querySelector("#bookings-body");
const destinationSelect = document.querySelector("#destination");
const bookingForm = document.querySelector(".add-booking form");
let attractions = [];
let editingBookingId = null;

const formatDate = (value) => new Date(value).toLocaleDateString();
const findAttraction = (id) => attractions.find((item) => item._id === id);

const loadBookings = async () => {
  const [{ bookings }, attractionData] = await Promise.all([
    apiRequest("/bookings/admin/all"),
    apiRequest("/attractions"),
  ]);
  attractions = attractionData.attractions;
  destinationSelect.innerHTML = attractions
    .map((item) => `<option value="${item._id}">${item.name}</option>`)
    .join("");

  bookingsBody.innerHTML = bookings.length
    ? bookings.map((booking) => {
        const attraction = findAttraction(booking.service);
        return `<tr>
          <td>Current user</td>
          <td>${attraction?.name || booking.serviceType}</td>
          <td>${formatDate(booking.bookingDate)}</td>
          <td>${booking.status}</td>
          <td>
            <button class="btn btn-edit" data-action="edit" data-id="${booking._id}">Edit</button>
            <button class="btn btn-delete" data-action="delete" data-id="${booking._id}">Cancel</button>
          </td>
        </tr>`;
      }).join("")
    : '<tr><td colspan="5">No bookings found for this account.</td></tr>';
};

bookingForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const service = destinationSelect.value;
  const attraction = findAttraction(service);
  const bookingDate = document.querySelector("#date").value;
  if (!service || !bookingDate) return;

  try {
    if (editingBookingId) {
      await apiRequest(`/bookings/${editingBookingId}`, {
        method: "PATCH",
        body: JSON.stringify({ bookingDate, quantity: 1 }),
      });
      editingBookingId = null;
    } else {
      await apiRequest("/bookings", {
        method: "POST",
        body: JSON.stringify({
          service,
          serviceType: "attraction",
          bookingDate,
          quantity: 1,
          totalAmount: Number(attraction?.price || 0),
        }),
      });
    }
    bookingForm.reset();
    await loadBookings();
  } catch (error) {
    alert(error.message);
  }
});

bookingsBody.addEventListener("click", async (event) => {
  const id = event.target.dataset.id;
  if (!id) return;
  try {
    if (event.target.dataset.action === "delete") {
      if (!confirm("Cancel this booking?")) return;
      await apiRequest(`/bookings/${id}`, { method: "DELETE" });
    } else {
      editingBookingId = id;
      document.querySelector(".bttn").textContent = "Update Booking";
    }
    await loadBookings();
  } catch (error) {
    alert(error.message);
  }
});

document.querySelector("#menubtn").addEventListener("click", () => sideMenu.classList.add("active"));
document.querySelector("#closebtn").addEventListener("click", () => sideMenu.classList.remove("active"));
loadBookings().catch((error) => alert(error.message));
