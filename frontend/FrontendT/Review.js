
const btn = document.getElementById("toggleTestimonials");
const testimonials = document.getElementById("testimonials");

// When the button is clicked, show or hide the testimonials
btn.addEventListener("click", function () {
  testimonials.classList.toggle("hidden");
});