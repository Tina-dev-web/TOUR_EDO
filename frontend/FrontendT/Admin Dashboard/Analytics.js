const sideMenu = document.querySelector("#sidebar");
const money = (value) => `NGN ${Number(value || 0).toLocaleString("en-NG")}`;

const loadAnalytics = async () => {
  const [{ users }, { attractions }, { bookings }] = await Promise.all([
    apiRequest("/users/admin/users"),
    apiRequest("/attractions"),
    apiRequest("/bookings/my-bookings"),
  ]);
  const paid = bookings.filter((item) => item.paymentStatus === "paid");
  document.querySelector("#analytics-tourists").textContent = users.length;
  document.querySelector("#analytics-bookings").textContent = bookings.length;
  document.querySelector("#analytics-destinations").textContent = attractions.length;
  document.querySelector("#analytics-revenue").textContent = money(
    paid.reduce((total, item) => total + Number(item.totalAmount || 0), 0)
  );

  const months = new Map();
  bookings.forEach((booking) => {
    const date = new Date(booking.bookingDate);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const entry = months.get(key) || { date, count: 0 };
    entry.count += 1;
    months.set(key, entry);
  });
  document.querySelector("#monthly-bookings-body").innerHTML = [...months.values()]
    .sort((a, b) => a.date - b.date)
    .map((item) => `<tr><td>${item.date.toLocaleString("en", { month: "long", year: "numeric" })}</td><td>${item.count}</td><td>Available in attraction data</td></tr>`)
    .join("") || '<tr><td colspan="3">No booking data available.</td></tr>';
};

document.querySelector("#menubtn").addEventListener("click", () => sideMenu.classList.add("active"));
document.querySelector("#closebtn").addEventListener("click", () => sideMenu.classList.remove("active"));
loadAnalytics().catch((error) => alert(error.message));
