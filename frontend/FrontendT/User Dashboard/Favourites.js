
const favouritesContainer = document.getElementById("favouritesContainer");

const loading = document.getElementById("loading");

const emptyState = document.getElementById("emptyState");

const errorMessage = document.getElementById("errorMessage");

let favourites = [];


    function getToken() {
      return localStorage.getItem("token");
    }



    async function loadFavourites() {
      const token = getToken();

      
    if (!token) {
    loading.style.display = "none";

    errorMessage.style.display = "block";

    errorMessage.innerHTML = `
    <p>
      Please login to view your favourites.
    </p>

    <a
      href="login.html"
      class="cta-btn"
    >
      Login
    </a>
    `;

    return;
    }

    try {
    loading.style.display = "block";

    emptyState.style.display = "none";

    errorMessage.style.display = "none";

    const response = await getData("/favourites", {
    headers: {
    Authorization: `Bearer ${token}`,
    },
    });

    console.log("Favourites response:", response);

    favourites = response.favourites || response.data || [];

    loading.style.display = "none";

    if (favourites.length === 0) {
    emptyState.style.display = "block";

    return;
    }

    displayFavourites();
    } catch (error) {
    console.error("Favourites error:", error);

    loading.style.display = "none";

    errorMessage.style.display = "block";

    errorMessage.textContent = error.message || "Unable to load favourites.";
    }
    }

    function displayFavourites() {
    favouritesContainer.innerHTML = "";

    favourites.forEach((favourite) => {


    const place = favourite.attraction || favourite.place || favourite;

    const id = place._id || favourite.attractionId;

    const name = place.name || "Unnamed Place";

    const image =
    place.image || place.images?.[0] || "../assets/images/placeholder.jpg";

    const location = place.location || "Edo State";

    const description =
    place.description || "Discover this amazing destination in Edo State.";

    const card = document.createElement("article");

    card.className = "favourite-card";

    card.innerHTML = `

    <img
      src="${image}"
      alt="${name}"
    >


    <div class="favourite-content">

      <h3>
          ${name}
      </h3>


      <p class="favourite-location">
          📍 ${location}
      </p>


      <p class="favourite-description">
          ${description.substring(0, 120)}
          ${description.length > 120 ? "..." : ""}
      </p>


      <div class="favourite-actions">

          <a
              href="attraction-details.html?id=${id}"
              class="view-btn"
          >
              View Details
          </a>


          <button
              class="remove-btn"
              onclick="removeFavourite('${favourite._id}')"
          >
              Remove
          </button>

      </div>

    </div>

    `;

    favouritesContainer.appendChild(card);
    });
    }



    async function removeFavourite(favouriteId) {
    const token = getToken();

    if (!token) {
    window.location.href = "login.html";

    return;
    }

    const confirmRemove = confirm("Remove this place from your favourites?");

    if (!confirmRemove) {
    return;
    }

    try {
    await apiRequest(`/favourites/${favouriteId}`, {
    method: "DELETE",

    headers: {
    Authorization: `Bearer ${token}`,
    },
    });

    await loadFavourites();
    } catch (error) {
    console.error("Remove favourite error:", error);

    alert(error.message || "Unable to remove favourite.");
    }
    }



    loadFavourites();
