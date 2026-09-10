const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menubtn");
const closeBtn = document.querySelector("#closebtn");

const formatCurrency = (value) =>
  `NGN ${Number(value || 0).toLocaleString("en-NG")}`;

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not available";

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const loadAdminDashboard = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "../Login.html";
    return;
  }

  try {
    const [{ users }, { attractions }, bookingsData] = await Promise.all([
      apiRequest("/users/admin/users"),
      apiRequest("/attractions"),
      apiRequest("/bookings/my-bookings"),
    ]);
    const recentTourists = users.slice(0, 5);
    const bookings = bookingsData.bookings || [];
    const paidBookings = bookings.filter(
      (booking) =>
        booking.paymentStatus === "paid" && booking.status !== "cancelled"
    );
    const stats = {
      totalTourists: users.length,
      newTourists: users.filter(
        (user) =>
          new Date(user.createdAt).getMonth() === new Date().getMonth() &&
          new Date(user.createdAt).getFullYear() === new Date().getFullYear()
      ).length,
      totalBookings: bookings.length,
      paidBookings: paidBookings.length,
      revenue: paidBookings.reduce(
        (total, booking) => total + Number(booking.totalAmount || 0),
        0
      ),
    };
    const recentUpdates = bookings.slice(0, 3).map((booking) => ({
      message: `Booking ${booking.bookingReference || booking._id} is ${booking.status}`,
      timestamp: booking.updatedAt || booking.createdAt,
    }));

    document.querySelector("#dashboard-revenue").textContent =
      formatCurrency(stats.revenue);
    document.querySelector("#dashboard-bookings").textContent =
      stats.totalBookings.toLocaleString();
    document.querySelector("#dashboard-tourists").textContent =
      stats.totalTourists.toLocaleString();
    document.querySelector("#revenue-progress").textContent = "Paid";
    document.querySelector("#tourist-progress").textContent =
      `${stats.newTourists.toLocaleString()} new this month`;
    document.querySelector("#walk-in-bookings").textContent =
      stats.totalBookings.toLocaleString();
    document.querySelector("#online-bookings").textContent =
      stats.paidBookings.toLocaleString();
    document.querySelector("#new-tourists").textContent =
      stats.newTourists.toLocaleString();

    document.querySelector("#recent-tourists-body").innerHTML =
      recentTourists.length
        ? recentTourists
            .map(
              (tourist) => `
                <tr>
                  <td>${escapeHtml(tourist.name)}</td>
                  <td>${escapeHtml(tourist.email)}</td>
                  <td>${escapeHtml(tourist.email)}</td>
                  <td>${escapeHtml(tourist.role)}</td>
                  <td class="warning">${formatDate(tourist.createdAt)}</td>
                  <td class="primary">
                    <button class="dashboard-edit" data-id="${tourist._id}">Edit</button>
                    <button class="dashboard-delete" data-id="${tourist._id}">Delete</button>
                  </td>
                  <td>Registered</td>
                </tr>
              `
            )
            .join("")
        : '<tr><td colspan="6">No tourists found.</td></tr>';

    document.querySelector("#recent-updates").innerHTML = recentUpdates.length
      ? recentUpdates
          .map(
            (update) => `
              <div class="update">
                <div class="profile-photo"></div>
                <div class="message">
                  <p>${escapeHtml(update.message)}</p>
                  <small class="text-muted">${formatDate(update.timestamp)}</small>
                </div>
              </div>
            `
          )
          .join("")
      : '<p class="text-muted">No recent updates.</p>';

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const adminName = document.querySelector(".profile .info b");
    if (adminName && user?.name) {
      adminName.textContent = user.name;
    }
  } catch (error) {
    console.error("Admin dashboard error:", error);

    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "../Login.html";
      return;
    }

    const updates = document.querySelector("#recent-updates");
    updates.innerHTML =
      '<p class="danger">Unable to load dashboard data. Please try again.</p>';
  }
};

menuBtn.addEventListener("click", () => {
  sideMenu.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  sideMenu.style.display = "none";
});

document.querySelector('a[href="/Login.html"]')?.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
});

loadAdminDashboard();

document
  .querySelector("#recent-tourists-body")
  .addEventListener("click", async (event) => {
    const id = event.target.dataset.id;
    if (!id) return;

    try {
      if (event.target.classList.contains("dashboard-delete")) {
        if (!window.confirm("Delete this tourist?")) return;
        await apiRequest(`/users/admin/users/${id}`, { method: "DELETE" });
      } else if (event.target.classList.contains("dashboard-edit")) {
        const name = window.prompt("New name:");
        if (!name) return;
        const email = window.prompt("New email:");
        if (!email) return;
        await apiRequest(`/users/admin/users/${id}`, {
          method: "PUT",
          body: JSON.stringify({ name, email }),
        });
      }
      loadAdminDashboard();
    } catch (error) {
      window.alert(error.message);
    }
  });
