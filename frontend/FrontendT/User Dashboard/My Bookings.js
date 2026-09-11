const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menubtn');
const closeBtn = document.getElementById('closebtn');

menuBtn.addEventListener('click', () => {
  sidebar.classList.add('show-sidebar');
});

closeBtn.addEventListener('click', () => {
  sidebar.classList.remove('show-sidebar');
});
// ==========================================================


document.addEventListener("DOMContentLoaded", async () => {

  if (!requireLogin("../Login.html")) {
    return;
  }


  const container =
    document.querySelector(".attractions-grid");


  if (!container) {
    return;
  }


  try {

const data =
await apiRequest("/bookings/my-bookings");


const bookings =
data.bookings || [];


container.innerHTML = "";


if (!bookings.length) {

container.innerHTML = `
<div class="empty-bookings">

  <h3>No bookings yet</h3>

  <p>
    Your bookings will appear here once
    you make a booking.
  </p>

</div>
`;

return;
}


bookings.forEach(booking => {

const id = booking._id;

const status =
booking.status || "pending";

const paymentStatus =
booking.paymentStatus || "pending";


const date =
booking.bookingDate
  ? new Date(
      booking.bookingDate
    ).toLocaleDateString()
  : "N/A";


const amount =
Number(
  booking.totalAmount || 0
);


const card =
document.createElement("div");


card.className = "card";


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

  <h3>
    ${escapeHtml(
      booking.serviceType || "Tour"
    )}
    booking
  </h3>


  <p>
    <i class="fa-solid fa-calendar-days"></i>
    ${date}
  </p>


  <p>
    <i class="fa-solid fa-hashtag"></i>
    ${escapeHtml(
      booking.bookingReference || id
    )}
  </p>


  <p>
    <i class="fa-solid fa-money-bill"></i>
    ₦${amount.toLocaleString()}
  </p>


  <div class="card-footer">

<span class="rating">

<i class="fa-solid fa-circle-check"></i>

${escapeHtml(status)}
·
${escapeHtml(paymentStatus)}

</span>


${
status !== "cancelled" &&
status !== "completed"
? `
  <button
    class="btn-book cancel-booking"
    data-id="${id}"
  >
    Cancel
  </button>
`
: ""
}


${
paymentStatus !== "paid" &&
status !== "cancelled"
? `
  <button
    class="btn-book pay-booking"
    data-id="${id}"
  >
    Pay
  </button>
`
: ""
    }

  </div>

</div>
`;


  container.appendChild(card);

});


// CANCEL BOOKING

container
  .querySelectorAll(".cancel-booking")
  .forEach(button => {

button.addEventListener(
"click",
async () => {

  if (
    !confirm(
      "Are you sure you want to cancel this booking?"
    )
  ) {
    return;
  }


  try {

    button.disabled = true;


    await apiRequest(
      `/bookings/${button.dataset.id}`,
      {
        method: "DELETE"
      }
    );


    window.location.reload();


  } catch (error) {

    button.disabled = false;

    alert(error.message);

  }

}
);

});


// PAYMENT

container
  .querySelectorAll(".pay-booking")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        window.location.href =
          `../Payment.html?bookingId=${encodeURIComponent(
            button.dataset.id
          )}`;

      }
    );

  });


} catch (error) {

console.error(error);


container.innerHTML = `

  <div class="empty-bookings">

    <h3>
      Unable to load bookings
    </h3>

    <p>
      ${escapeHtml(error.message)}
    </p>

  </div>

`;

}


  function escapeHtml(value) {

    return String(value ?? "").replace(
      /[&<>'"]/g,
      character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
      })[character]
    );

  }

});