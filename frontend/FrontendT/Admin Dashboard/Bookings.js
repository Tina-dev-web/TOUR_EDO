// Select DOM Elements
//const sideMenu = document.querySelector("#sidebar");
//const menuBtn = document.querySelector("#menubtn");
//const closeBtn = document.querySelector("#closebtn");

// Open Sidebar Menu
//menuBtn.addEventListener("click", () => {
//  sideMenu.classList.add("active");
//});

// Close Sidebar Menu
//closeBtn.addEventListener("click", () => {
 // sideMenu.classList.remove("active");
//});

// Close Sidebar when clicking anywhere outside of it
//document.addEventListener("click", (event) => {
//  const isClickInsideSidebar = sideMenu.contains(event.target);
//  const isClickOnMenuBtn = menuBtn.contains(event.target);

//  if (!isClickInsideSidebar && !isClickOnMenuBtn && sideMenu.classList.contains("active")) {
//    sideMenu.classList.remove("active");
//  }
//});

document.addEventListener("DOMContentLoaded", () => {

  if (!requireLogin("../Login.html")) {
    return;
  }


  const params =
    new URLSearchParams(window.location.search);


  const service =
    params.get("service");


  const serviceType =
    params.get("serviceType") || "attraction";


  const amount =
    Number(params.get("amount") || 0);


  const form =
    document.getElementById("bookingForm");


  const dateInput =
    document.getElementById("bookingDate");


  const quantityInput =
    document.getElementById("quantity");


  const amountInput =
    document.getElementById("totalAmount");


  const message =
    document.getElementById("message");


  if (!form) {
    return;
  }


  if (!service) {

    if (message) {
      message.textContent =
        "No service was selected.";
    }

    return;
  }


  // Minimum booking date = today

  if (dateInput) {

    dateInput.min =
      new Date()
        .toISOString()
        .split("T")[0];

  }


  // If amount was supplied in URL

  if (amountInput && amount) {
    amountInput.value = amount;
  }


  form.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      const quantity =
        Number(quantityInput?.value || 1);


      const totalAmount =
        Number(amountInput?.value || 0);


      const bookingDate =
        dateInput?.value;


      if (!bookingDate) {

        message.textContent =
          "Please select a booking date.";

        return;
      }


      if (quantity < 1) {

        message.textContent =
          "Quantity must be at least 1.";

        return;
      }


      const button =
        form.querySelector(
          'button[type="submit"], button'
        );


      try {

        if (button) {
          button.disabled = true;
          button.textContent = "Creating booking...";
        }


        message.textContent = "";


        const result =
          await apiRequest(
            "/bookings",
            {
              method: "POST",

              body: JSON.stringify({

                service: service,

                serviceType: serviceType,

                bookingDate: bookingDate,

                quantity: quantity,

                totalAmount: totalAmount

              })
            }
          );


        if (!result.booking?._id) {
          throw new Error(
            "Booking was created but no booking ID was returned."
          );
        }


        // Go directly to payment

        window.location.href =
          `Payment.html?bookingId=${encodeURIComponent(
            result.booking._id
          )}`;

      } catch (error) {

        console.error(error);


        message.textContent =
          error.message ||
          "Unable to create booking.";


        if (button) {

          button.disabled = false;

          button.textContent =
            "Book Now";

        }

      }

    }
  );

});