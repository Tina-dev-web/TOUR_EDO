const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menubtn");
const closeBtn = document.getElementById("closebtn");
const logoutLink = document.getElementById("logoutLink");

const elements = {
  welcomeMessage: document.getElementById("welcomeMessage"),
  userGreeting: document.getElementById("userGreeting"),
  userRole: document.getElementById("userRole"),
  totalTripsValue: document.getElementById("totalTripsValue"),
  totalTripsProgress: document.getElementById("totalTripsProgress"),
  totalTripsCircle: document.getElementById("totalTripsCircle"),
  totalSpentValue: document.getElementById("totalSpentValue"),
  totalSpentProgress: document.getElementById("totalSpentProgress"),
  totalSpentCircle: document.getElementById("totalSpentCircle"),
  rewardPointsValue: document.getElementById("rewardPointsValue"),
  rewardPointsProgress: document.getElementById("rewardPointsProgress"),
  rewardPointsCircle: document.getElementById("rewardPointsCircle"),
  bookingsBody: document.getElementById("bookingsBody"),
  updatesList: document.getElementById("updatesList"),
  destinationsList: document.getElementById("destinationsList"),
};

const circleCircumference = 2 * Math.PI * 36;

function bindSidebar() {
  menuBtn?.addEventListener("click", () => {
    sidebar?.classList.add("show");
  });

  closeBtn?.addEventListener("click", () => {
    sidebar?.classList.remove("show");
  });
}

function bindLogout() {
  logoutLink?.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "../Login.html";
  });
}

function setText(element, value) {
  if (element) {
    element.textContent = value;
  }
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-NG").format(Number(value) || 0);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatRelativeTime(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const differenceInSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const absoluteSeconds = Math.abs(differenceInSeconds);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (absoluteSeconds < 60) {
    return formatter.format(differenceInSeconds, "second");
  }

  const differenceInMinutes = Math.round(differenceInSeconds / 60);

  if (Math.abs(differenceInMinutes) < 60) {
    return formatter.format(differenceInMinutes, "minute");
  }

  const differenceInHours = Math.round(differenceInMinutes / 60);

  if (Math.abs(differenceInHours) < 24) {
    return formatter.format(differenceInHours, "hour");
  }

  const differenceInDays = Math.round(differenceInHours / 24);

  if (Math.abs(differenceInDays) < 7) {
    return formatter.format(differenceInDays, "day");
  }

  return formatDate(value);
}

function formatStatus(value) {
  if (!value) {
    return "Unknown";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getStatusClass(value) {
  switch (value) {
    case "confirmed":
    case "completed":
      return "success";
    case "pending":
      return "warning";
    case "cancelled":
      return "danger";
    default:
      return "primary";
  }
}

function createTextCell(value, className = "") {
  const cell = document.createElement("td");
  cell.textContent = value;

  if (className) {
    cell.className = className;
  }

  return cell;
}

function createDetailsCell(bookingId) {
  const cell = document.createElement("td");
  const link = document.createElement("a");

  link.className = "primary";
  link.textContent = "Details";
  link.href = bookingId
    ? `My%20Bookings.html#${encodeURIComponent(bookingId)}`
    : "My%20Bookings.html";

  cell.appendChild(link);
  return cell;
}

function setProgress(circle, label, value) {
  const progress = Math.max(0, Math.min(100, Number(value) || 0));
  setText(label, `${progress}%`);

  if (!circle) {
    return;
  }

  circle.style.strokeDasharray = `${circleCircumference}`;
  circle.style.strokeDashoffset = `${
    circleCircumference - (circleCircumference * progress) / 100
  }`;
  circle.setAttribute("aria-label", `${progress}% complete`);
}

function renderBookings(bookings) {
  if (!elements.bookingsBody) {
    return;
  }

  elements.bookingsBody.innerHTML = "";

  if (!Array.isArray(bookings) || bookings.length === 0) {
    elements.bookingsBody.innerHTML =
      '<tr><td colspan="5" class="dashboard-state">No bookings yet.</td></tr>';
    return;
  }

  bookings.slice(0, 5).forEach((booking) => {
    const row = document.createElement("tr");
    const statusClass = getStatusClass(booking.status);

    row.append(
      createTextCell(booking.name || "Tour Edo booking"),
      createTextCell(formatDate(booking.date)),
      createTextCell(formatCurrency(booking.amount)),
      createTextCell(formatStatus(booking.status), statusClass),
      createDetailsCell(booking.id)
    );

    elements.bookingsBody.appendChild(row);
  });
}

function renderUpdates(updates) {
  if (!elements.updatesList) {
    return;
  }

  elements.updatesList.innerHTML = "";

  if (!Array.isArray(updates) || updates.length === 0) {
    elements.updatesList.innerHTML =
      '<p class="text-muted dashboard-state">No recent updates.</p>';
    return;
  }

  updates.forEach((update) => {
    const item = document.createElement("div");
    item.className = "update";

    const photo = document.createElement("div");
    photo.className = "profile-photo";
    photo.setAttribute("aria-hidden", "true");

    const message = document.createElement("div");
    message.className = "message";

    const text = document.createElement("p");
    text.textContent = update.message || "Your account was updated";

    const timestamp = document.createElement("small");
    timestamp.className = "text-muted";
    timestamp.textContent = formatRelativeTime(update.timestamp);

    message.append(text, timestamp);
    item.append(photo, message);
    elements.updatesList.appendChild(item);
  });
}

function createDestinationIcon(index) {
  const iconNames = ["fa-fire", "fa-sun", "fa-landmark"];
  const wrapper = document.createElement("div");
  const icon = document.createElement("span");
  const iconElement = document.createElement("i");

  wrapper.className = "icon";
  iconElement.className = `fa-solid ${iconNames[index] || "fa-compass"}`;
  iconElement.setAttribute("aria-hidden", "true");
  icon.appendChild(iconElement);
  wrapper.appendChild(icon);

  return wrapper;
}

function renderDestinations(destinations) {
  if (!elements.destinationsList) {
    return;
  }

  elements.destinationsList.innerHTML = "";

  if (!Array.isArray(destinations) || destinations.length === 0) {
    elements.destinationsList.innerHTML =
      '<p class="text-muted dashboard-state">No destinations available.</p>';
    return;
  }

  destinations.forEach((destination, index) => {
    const item = document.createElement("div");
    const details = document.createElement("div");
    const info = document.createElement("div");
    const name = document.createElement("h3");
    const category = document.createElement("small");
    const rating = document.createElement("h5");
    const price = document.createElement("h3");

    item.className = `item ${index === 0 ? "trending" : ""} ${
      index === 1 ? "seasonal" : ""
    }`.trim();
    details.className = "right";
    info.className = "info";
    name.textContent = destination.name || "Unnamed destination";
    category.className = "text-muted";
    category.textContent =
      destination.category || destination.location || "Recommended destination";
    rating.className = index === 0 ? "danger" : index === 1 ? "success" : "primary";

    if (destination.rating !== null && destination.rating !== undefined) {
      rating.textContent = Number(destination.rating).toFixed(1);
      const star = document.createElement("i");
      star.className = "fa-solid fa-star";
      star.setAttribute("aria-hidden", "true");
      rating.appendChild(document.createTextNode(" "), star);
    } else {
      rating.textContent = "Not rated";
    }

    price.textContent = formatCurrency(destination.price);
    info.append(name, category);
    details.append(info, rating, price);
    item.append(createDestinationIcon(index), details);
    elements.destinationsList.appendChild(item);
  });
}

function renderStats(stats) {
  const progress = stats.progress || {};

  setText(elements.totalTripsValue, formatNumber(stats.totalTrips));
  setText(elements.totalSpentValue, formatCurrency(stats.totalSpent));
  setText(elements.rewardPointsValue, formatNumber(stats.rewardPoints));
  setProgress(
    elements.totalTripsCircle,
    elements.totalTripsProgress,
    progress.trips
  );
  setProgress(
    elements.totalSpentCircle,
    elements.totalSpentProgress,
    progress.spent
  );
  setProgress(
    elements.rewardPointsCircle,
    elements.rewardPointsProgress,
    progress.rewards
  );
}

function renderDashboard(data) {
  const profile = data.profile || {};

  setText(
    elements.welcomeMessage,
    profile.name ? `Welcome back, ${profile.name}` : "Welcome back"
  );
  setText(
    elements.userGreeting,
    profile.name ? `Hey, ${profile.name}` : "Hey, there"
  );
  setText(elements.userRole, profile.role ? formatStatus(profile.role) : "Tourist");

  renderStats(data.stats || {});
  renderBookings(data.bookings || []);
  renderUpdates(data.recentUpdates || []);
  renderDestinations(data.topDestinations || []);
}

function renderError() {
  setText(elements.welcomeMessage, "Unable to load your dashboard");
  setText(elements.userGreeting, "Dashboard unavailable");
  setText(elements.userRole, "Please try again");
  setText(elements.totalTripsValue, "—");
  setText(elements.totalSpentValue, "—");
  setText(elements.rewardPointsValue, "—");
  setText(elements.totalTripsProgress, "—");
  setText(elements.totalSpentProgress, "—");
  setText(elements.rewardPointsProgress, "—");

  if (elements.bookingsBody) {
    elements.bookingsBody.innerHTML =
      '<tr><td colspan="5" class="dashboard-state">Unable to load bookings.</td></tr>';
  }

  if (elements.updatesList) {
    elements.updatesList.innerHTML =
      '<p class="text-muted dashboard-state">Unable to load recent updates.</p>';
  }

  if (elements.destinationsList) {
    elements.destinationsList.innerHTML =
      '<p class="text-muted dashboard-state">Unable to load destinations.</p>';
  }
}

function setLoadingState() {
  setText(elements.welcomeMessage, "Loading your dashboard…");
  setText(elements.userGreeting, "Loading profile…");
  setText(elements.userRole, "");
  setText(elements.totalTripsValue, "—");
  setText(elements.totalSpentValue, "—");
  setText(elements.rewardPointsValue, "—");
  setText(elements.totalTripsProgress, "—");
  setText(elements.totalSpentProgress, "—");
  setText(elements.rewardPointsProgress, "—");

  if (elements.bookingsBody) {
    elements.bookingsBody.innerHTML =
      '<tr><td colspan="5" class="dashboard-state">Loading bookings…</td></tr>';
  }

  if (elements.updatesList) {
    elements.updatesList.innerHTML =
      '<p class="text-muted dashboard-state">Loading updates…</p>';
  }

  if (elements.destinationsList) {
    elements.destinationsList.innerHTML =
      '<p class="text-muted dashboard-state">Loading destinations…</p>';
  }
}

async function initializeDashboard() {
  bindSidebar();
  bindLogout();

  if (!getToken()) {
    window.location.href = "../Login.html";
    return;
  }

  setLoadingState();

  try {
    const [{ user }, { bookings }, { attractions }] = await Promise.all([
      apiRequest("/users/profile"),
      apiRequest("/bookings/my-bookings"),
      apiRequest("/attractions"),
    ]);
    const attractionsById = new Map(
      attractions.map((attraction) => [String(attraction._id), attraction])
    );
    const activeBookings = bookings.filter(
      (booking) => booking.status !== "cancelled"
    );
    const paidBookings = activeBookings.filter(
      (booking) => booking.paymentStatus === "paid"
    );
    const totalSpent = paidBookings.reduce(
      (total, booking) => total + Number(booking.totalAmount || 0),
      0
    );
    const dashboardBookings = bookings.map((booking) => ({
      id: String(booking._id),
      name:
        attractionsById.get(String(booking.service))?.name ||
        `${booking.serviceType || "Tour"} booking`,
      serviceType: booking.serviceType,
      date: booking.bookingDate,
      amount: Number(booking.totalAmount || 0),
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      reference: booking.bookingReference,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    }));
    const data = {
      profile: {
        name: user.name,
        role: user.role,
      },
      stats: {
        totalTrips: activeBookings.length,
        totalSpent,
        rewardPoints: Number(user.rewardPoints || 0),
        progress: {
          trips: Math.min(100, Math.round((activeBookings.length / 15) * 100)),
          spent: Math.min(100, Math.round((totalSpent / 500000) * 100)),
          rewards: Math.min(
            100,
            Math.round((Number(user.rewardPoints || 0) / 2500) * 100)
          ),
        },
      },
      bookings: dashboardBookings,
      recentUpdates: dashboardBookings.slice(0, 3).map((booking) => ({
        id: booking.id,
        message: `Your booking for ${booking.name} is ${booking.status}`,
        timestamp: booking.updatedAt || booking.createdAt,
        status: booking.status,
      })),
      topDestinations: attractions.slice(0, 3).map((attraction) => ({
        id: String(attraction._id),
        name: attraction.name,
        location: attraction.location,
        category: attraction.category,
        price: Number(attraction.price || 0),
        rating: attraction.rating ?? null,
      })),
    };
    renderDashboard(data);
  } catch (error) {
    console.error("Dashboard loading error:", error);

    if (error.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "../Login.html";
      return;
    }

    renderError();
  }
}

document.addEventListener("DOMContentLoaded", initializeDashboard);
