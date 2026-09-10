const sideMenu = document.querySelector("#sidebar");
const money = (value) => `NGN ${Number(value || 0).toLocaleString("en-NG")}`;

const loadReport = async () => {
  const [{ users }, { attractions }, { bookings }] = await Promise.all([
    apiRequest("/users/admin/users"),
    apiRequest("/attractions"),
    apiRequest("/bookings/my-bookings"),
  ]);
  const paid = bookings.filter((item) => item.paymentStatus === "paid");
  const revenue = paid.reduce((total, item) => total + Number(item.totalAmount || 0), 0);
  const counts = new Map();
  bookings.forEach((item) => counts.set(item.service, (counts.get(item.service) || 0) + 1));
  const top = attractions.reduce((winner, item) =>
    (counts.get(item._id) || 0) > (counts.get(winner?._id) || 0) ? item : winner, attractions[0]);

  document.querySelector("#report-bookings").textContent = `${bookings.length} Bookings`;
  document.querySelector("#report-destination").textContent = top?.name || "No bookings";
  document.querySelector("#report-revenue").textContent = money(revenue);
  document.querySelector("#report-tourists").textContent = `${users.length} Tourists`;
  document.querySelector("#report-body").innerHTML = `<tr>
    <td>${new Date().toLocaleString("en", { month: "long", year: "numeric" })}</td>
    <td>${bookings.length}</td><td>${money(revenue)}</td>
    <td>${top?.name || "No bookings"}</td>
  </tr>`;
};

document.querySelector("#menubtn").addEventListener("click", () => sideMenu.classList.add("active"));
document.querySelector("#closebtn").addEventListener("click", () => sideMenu.classList.remove("active"));
loadReport().catch((error) => alert(error.message));
