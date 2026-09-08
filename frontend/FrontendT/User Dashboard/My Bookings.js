document.addEventListener("DOMContentLoaded", async () => {
  const bookingsContainer = document.querySelector(".attractions-grid");

  if (!bookingsContainer) return;

  try {
    const data = await apiRequest("/bookings/my-bookings");

    console.log("MY BOOKINGS:", data);

    const bookings = Array.isArray(data)
      ? data
      : data.bookings || [];

    if (bookings.length === 0) {
      bookingsContainer.innerHTML = `
        <div class="empty-bookings">
          <h3>No bookings yet</h3>
          <p>Your bookings will appear here once you make one.</p>
        </div>
      `;
      return;
    }

    bookingsContainer.innerHTML = "";

bookings.forEach((booking) => {
  const card = document.createElement("div");
  card.className = "card";

  const bookingId =
    booking._id || booking.id || "N/A";

  const status =
    booking.status || "pending";

  const title =
    booking.title ||
    booking.attraction?.name ||
    booking.hotel?.name ||
    "Tour Edo Booking";

  const date =
    booking.date ||
    booking.bookingDate ||
    booking.checkIn ||
    "Date not available";

  card.innerHTML = `
    <div class="card-img-holder">
      <img
        src="Images/EdBackground.jpg"
        alt="Tour Edo booking"
      >

      <span class="favorite-icon">
        <i class="fa-solid fa-ticket"></i>
      </span>
    </div>

    <div class="card-details">
      <h3>${title}</h3>

      <p>
        <i class="fa-solid fa-calendar-days"></i>
        ${date}
      </p>

      <p>
        <i class="fa-solid fa-hashtag"></i>
        Booking ID: ${bookingId}
      </p>

      <div class="card-footer">

        <span class="rating">
          <i class="fa-solid fa-circle-check"></i>
          ${status}
        </span>

        <button
          class="btn-book cancel-booking"
          data-id="${bookingId}"
        >
          Cancel
        </button>

      </div>
    </div>
  `;

  bookingsContainer.appendChild(card);
});

document
.querySelectorAll(".cancel-booking")
.forEach((button) => {

button.addEventListener("click", async () => {

  const bookingId =
    button.dataset.id;

  const confirmed = confirm(
    "Are you sure you want to cancel this booking?"
  );

  if (!confirmed) return;

  try {

    const result = await apiRequest(
      `/bookings/${bookingId}`,
      {
        method: "DELETE"
      }
    );

    alert(
      result.message ||
      "Booking cancelled successfully."
    );

    window.location.reload();

  } catch (error) {

    console.error(
      "Cancel booking error:",
      error
    );

    alert(error.message);
  }
    });
  });

} catch (error) {

console.error(
  "Loading bookings error:",
  error
);

bookingsContainer.innerHTML = `
  <div class="empty-bookings">
    <h3>Unable to load bookings</h3>
    <p>${error.message}</p>
  </div>
`;
}
});