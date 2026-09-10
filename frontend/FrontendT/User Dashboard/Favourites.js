<<<<<<< Updated upstream
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
=======
const sidebar = document.getElementById("sidebar-container");
const menuBtn = document.getElementById("menubtn");
const closeBtn = document.getElementById("closebtn");
const favouritesContainer = document.getElementById("favouritesContainer");
const loading = document.getElementById("loading");
const emptyState = document.getElementById("emptyState");
const errorMessage = document.getElementById("errorMessage");
let favourites = [];

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  }[character]));

const getPlace = (favourite) =>
  favourite.attraction || favourite.place || favourite.attractionId || favourite;

const getImage = (place) => {
  const image = place.images?.[0];
  return image?.url || image || "";
};

const renderFavourites = () => {
  favouritesContainer.innerHTML = favourites.map((favourite) => {
    const place = getPlace(favourite);
    const id = place._id || favourite.attractionId;
    const image = getImage(place);
    const name = place.name || "Unnamed attraction";
    const location = place.location || "Location unavailable";
    const category = place.category || "Attraction";
    const price =
      place.price === undefined
        ? "Price unavailable"
        : `NGN ${Number(place.price).toLocaleString("en-NG")}`;

    return `
      <article class="fav-card">
        <div class="fav-img-holder">
          ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(name)}">` : ""}
          <button class="fav-toggle active remove-favourite" data-id="${escapeHtml(favourite._id)}" aria-label="Remove from favourites">
            <i class="fa-solid fa-heart"></i>
          </button>
          <span class="fav-tag">${escapeHtml(category)}</span>
        </div>
        <div class="fav-details">
          <div class="fav-title-row">
            <h3>${escapeHtml(name)}</h3>
          </div>
          <p><i class="fa-solid fa-location-dot"></i> ${escapeHtml(location)}</p>
          <div class="fav-footer">
            <span class="fav-price">${escapeHtml(price)}</span>
            <a class="btn-book" href="Attractions.html">View Attractions</a>
          </div>
        </div>
      </article>`;
  }).join("");
};

const loadFavourites = async () => {
  if (!localStorage.getItem("token")) {
    window.location.href = "../Login.html";
    return;
  }

  loading.hidden = false;
  emptyState.hidden = true;
  errorMessage.hidden = true;

  try {
    const response = await apiRequest("/favourites");
    favourites = response.favourites || [];
    loading.hidden = true;
    emptyState.hidden = favourites.length !== 0;
    renderFavourites();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    document.getElementById("profile-name").textContent = user?.name || "User";
    document.getElementById("profile-role").textContent = user?.role || "";
  } catch (error) {
    loading.hidden = true;
    errorMessage.hidden = false;
    errorMessage.textContent = error.message || "Unable to load favourites.";
  }
};

favouritesContainer.addEventListener("click", async (event) => {
  const button = event.target.closest(".remove-favourite");
  if (!button) return;
  if (!confirm("Remove this place from your favourites?")) return;

  try {
    await apiRequest(`/favourites/${button.dataset.id}`, { method: "DELETE" });
    await loadFavourites();
  } catch (error) {
    errorMessage.hidden = false;
    errorMessage.textContent = error.message || "Unable to remove favourite.";
  }
});

menuBtn.addEventListener("click", () => sidebar.classList.add("show-sidebar"));
closeBtn.addEventListener("click", () => sidebar.classList.remove("show-sidebar"));
document.querySelector(".search-box input").addEventListener("input", (event) => {
  const query = event.target.value.toLowerCase();
  favouritesContainer.querySelectorAll(".fav-card").forEach((card) => {
    card.hidden = !card.textContent.toLowerCase().includes(query);
  });
});
loadFavourites();
>>>>>>> Stashed changes
