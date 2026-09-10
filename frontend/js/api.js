const API_BASE_URL = "https://tour-edo-backend.onrender.com/api";

function getToken() {
  return localStorage.getItem("token");
}

async function apiRequest(endpoint, options = {}) {
  const token = getToken();

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const text = await response.text();

  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
    }

    throw new Error(
      data.message || "Something went wrong. Please try again."
    );
  }

  return data;
}


// ===============================
// LOGIN PROTECTION
// ===============================

function requireLogin(loginPath = "../Login.html") {
  const token = getToken();

  if (!token) {
    window.location.href = loginPath;
    return false;
  }

  return true;
}


// ===============================
// ADMIN PROTECTION
// ===============================

async function requireAdmin(loginPath = "../Login.html") {

  if (!requireLogin(loginPath)) {
    return false;
  }

  try {

    const data = await apiRequest("/users/profile");

    const user = data.user || data;

    if (user.role !== "admin") {

      alert("Admin access required.");

      window.location.href = loginPath;

      return false;
    }

    return true;

  } catch (error) {

    alert(error.message || "Please login again.");

    localStorage.removeItem("token");

    window.location.href = loginPath;

    return false;
  }
}