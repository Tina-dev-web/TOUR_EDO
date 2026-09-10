document.addEventListener("DOMContentLoaded", () => {

  if (!requireLogin("../../Login.html")) {
    return;
  }

  const container =
    document.querySelector(".favorites-grid") ||
    document.getElementById("favouritesContainer");

  const emptyState =
    document.querySelector(".empty-state") ||
    document.getElementById("emptyState");


  async function loadFavourites() {

    try {

      const data = await apiRequest("/favourites");

      const favourites = data.favourites || [];

      renderFavourites(favourites);

    } catch (error) {

      console.error(error);

      if (container) {
        container.innerHTML =
          `<p class="error-message">${escapeHtml(error.message)}</p>`;
      }
    }
  }


  function renderFavourites(favourites) {

    if (!container) return;

    container.innerHTML = "";


    if (!favourites.length) {

      if (emptyState) {
        emptyState.style.display = "block";
      }

      return;
    }


    if (emptyState) {
      emptyState.style.display = "none";
    }


    favourites.forEach(favourite => {

      const target =
        favourite.target &&
        typeof favourite.target === "object"
          ? favourite.target
          : null;


      const name =
        target?.name || "Saved place";


const location =
target?.location || "Edo State";


const image =
target?.image ||
target?.images?.[0] ||
"../Images/EdBackground.jpg";


const targetId =
target?._id ||
favourite.target ||
"";


const card = document.createElement("article");

card.className = "fav-card";


card.innerHTML = `

<div class="fav-img-holder">

<img
  src="${image}"
  alt="${escapeHtml(name)}"
  onerror="this.src='../Images/EdBackground.jpg'"
>

<button
  class="fav-toggle active"
  data-id="${favourite._id}"
  aria-label="Remove from favourites"
>
  <i class="fa-solid fa-heart"></i>
</button>

</div>


<div class="fav-details">

<div class="fav-title-row">
  <h3>${escapeHtml(name)}</h3>
</div>

<p>
  <i class="fa-solid fa-location-dot"></i>
  ${escapeHtml(location)}
</p>


<div class="fav-footer">

  <button
    class="btn-book"
    data-book="${targetId}"
  >
    Book Now
  </button>

  <button
    class="btn-book remove-favourite"
    data-id="${favourite._id}"
  >
    Remove
  </button>

</div>

</div>
`;


container.appendChild(card);

});



container
.querySelectorAll(".remove-favourite, .fav-toggle")
.forEach(button => {

  button.addEventListener("click", async () => {

    const favouriteId = button.dataset.id;

    if (!favouriteId) return;

    try {

      button.disabled = true;

      await apiRequest(
        `/favourites/${favouriteId}`,
        {
          method: "DELETE"
        }
      );

      await loadFavourites();

    } catch (error) {

      button.disabled = false;

      alert(error.message);
    }
  });

});


// BOOK

container
.querySelectorAll("[data-book]")
.forEach(button => {

  button.addEventListener("click", () => {

    const id = button.dataset.book;

    if (!id) return;

    window.location.href =
      `../Booking.html?service=${encodeURIComponent(id)}&serviceType=attraction`;

  });

});

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


loadFavourites();

});