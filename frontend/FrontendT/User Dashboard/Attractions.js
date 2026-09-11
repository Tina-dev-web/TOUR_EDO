// ===============================
// MOBILE SIDEBAR
// ===============================

const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menubtn');
const closeBtn = document.getElementById('closebtn');

menuBtn.addEventListener('click', () => {
  sidebar.classList.add('active');
});

closeBtn.addEventListener('click', () => {
  sidebar.classList.remove('active');
});


// ===============================
// TOUR EDO API
// ===============================

const BASE_URL = "https://tour-edo-backend.onrender.com/api";

const attractionsGrid = document.getElementById('attractionsGrid');


// ===============================
// LOAD ALL ATTRACTIONS
// ===============================

async function loadAttractions() {
  try {

    // Show loading message
    attractionsGrid.innerHTML = `
      <p class="loading-message">Loading attractions...</p>
    `;

    const response = await fetch(`${BASE_URL}/attractions`);

    if (!response.ok) {
      throw new Error(`Failed to load attractions: ${response.status}`);
    }

    const data = await response.json();

    console.log("API DATA:", data);

    displayAttractions(data.attractions);

  } catch (error) {

    console.error("Error loading attractions:", error);

    attractionsGrid.innerHTML = `
      <p class="error-message">
        Unable to load attractions. Please try again.
      </p>
    `;
  }
}


// ===============================
// DISPLAY ATTRACTIONS
// ===============================

function displayAttractions(attractions) {

  if (!attractions || attractions.length === 0) {
    attractionsGrid.innerHTML = `
      <p class="empty-message">No attractions available.</p>
    `;
    return;
  }

  attractionsGrid.innerHTML = attractions.map(attraction => {

    // Get the first attraction image
    const imageUrl =
      attraction.images &&
      attraction.images.length > 0 &&
      attraction.images[0].url
        ? attraction.images[0].url
        : "Images/Filter.png";

    return `
      <div class="card">

        <div class="card-img-holder">

          <img
            src="${imageUrl}"
            alt="${escapeHTML(attraction.name || 'Attraction')}"
            onerror="this.src='Images/Filter.png'"
          >

          <span class="favorite-icon">
            <i class="fa-regular fa-heart"></i>
          </span>

        </div>

        <div class="card-details">

          <h3>${escapeHTML(attraction.name || 'Unnamed Attraction')}</h3>

          <p>
            <i class="fa-solid fa-location-dot"></i>
            ${escapeHTML(attraction.location || 'Location unavailable')}
          </p>

          <div class="card-footer">

            <span class="rating">
              <i class="fa-solid fa-star"></i> N/A
            </span>

            <button
              class="btn-book"
              onclick="exploreAttraction('${attraction._id}')"
            >
              Explore
            </button>

          </div>

        </div>

      </div>
    `;

  }).join('');
}


// ===============================
// EXPLORE ATTRACTION
// ===============================

function exploreAttraction(id) {

  // For now, store the selected attraction ID.
  localStorage.setItem("selectedAttractionId", id);

  // Change this filename when your attraction details page is ready.
  window.location.href = `AttractionDetails.html?id=${id}`;
}


// ===============================
// SEARCH
// ===============================

const searchInput = document.querySelector('.search-box input');

let searchTimeout;

searchInput.addEventListener('input', () => {

  const searchTerm = searchInput.value.trim();

  clearTimeout(searchTimeout);

  // If search box is empty, show all attractions again
  if (searchTerm === '') {
    loadAttractions();
    return;
  }

  // Wait a little before sending the request
  searchTimeout = setTimeout(() => {
    searchAttractions(searchTerm);
  }, 400);

});


async function searchAttractions(searchTerm) {

  try {

    attractionsGrid.innerHTML = `
      <p class="loading-message">Searching...</p>
    `;

    const response = await fetch(
      `${BASE_URL}/attractions/search?search=${encodeURIComponent(searchTerm)}`
    );

    const data = await response.json();

    if (!response.ok) {

      if (response.status === 404) {
        attractionsGrid.innerHTML = `
          <p class="empty-message">
            No attractions found for "${escapeHTML(searchTerm)}".
          </p>
        `;
        return;
      }

      throw new Error(data.message || "Search failed");
    }

    displayAttractions(data.attractions);

  } catch (error) {

    console.error("Search error:", error);

    attractionsGrid.innerHTML = `
      <p class="error-message">
        Unable to search attractions. Please try again.
      </p>
    `;
  }
}


// ===============================
// CATEGORY FILTER
// ===============================

const categoryButtons = document.querySelectorAll('.category-btn');

categoryButtons.forEach(button => {

  button.addEventListener('click', () => {

    // Remove active class from all buttons
    categoryButtons.forEach(btn => {
      btn.classList.remove('active');
    });

    // Add active class to clicked button
    button.classList.add('active');

    const category = button.textContent.trim();

    // "All Sites" means show everything
    if (category === 'All Sites') {
      loadAttractions();
      return;
    }

    filterAttractions(category);
  });

});


async function filterAttractions(category) {

  try {

    attractionsGrid.innerHTML = `
      <p class="loading-message">Loading ${escapeHTML(category)}...</p>
    `;

    const response = await fetch(
      `${BASE_URL}/attractions/filter?category=${encodeURIComponent(category)}`
    );

    const data = await response.json();

    if (!response.ok) {

      if (response.status === 404) {
        attractionsGrid.innerHTML = `
          <p class="empty-message">
            No attractions found in "${escapeHTML(category)}".
          </p>
        `;
        return;
      }

      throw new Error(data.message || "Filter failed");
    }

    displayAttractions(data.attractions);

  } catch (error) {

    console.error("Filter error:", error);

    attractionsGrid.innerHTML = `
      <p class="error-message">
        Unable to filter attractions. Please try again.
      </p>
    `;
  }
}


// ===============================
// BASIC HTML ESCAPING
// ===============================

function escapeHTML(value) {

  const div = document.createElement('div');
  div.textContent = value;

  return div.innerHTML;
}


// ===============================
// START
// ===============================

loadAttractions();

console.log("Attractions JS is running");