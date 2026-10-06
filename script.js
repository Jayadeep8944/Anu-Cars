// ANU Car Rentals & Travels - site behaviour
const WHATSAPP_NUMBER = "919492734906";

// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

function setMenu(open) {
  nav.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.textContent = open ? "Close" : "Menu";
}

menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

// Header shadow after scrolling
const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
}, { passive: true });

// Block past dates in the date picker
const dateInput = document.getElementById("date");
const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
dateInput.min = today.toISOString().split("T")[0];

// Booking form: validate, then open WhatsApp with the details
const form = document.getElementById("booking");
const errorBox = document.getElementById("formError");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  errorBox.textContent = "";

  const fields = Array.from(form.elements).filter((el) => el.name);
  fields.forEach((el) => el.classList.remove("invalid"));

  const missing = fields.filter((el) => !el.value.trim());
  if (missing.length) {
    missing.forEach((el) => el.classList.add("invalid"));
    errorBox.textContent = "Please fill in all fields marked *.";
    missing[0].focus();
    return;
  }

  const mobile = form.mobile.value.trim();
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    form.mobile.classList.add("invalid");
    errorBox.textContent = "Enter a valid 10-digit mobile number.";
    form.mobile.focus();
    return;
  }

  const data = new FormData(form);
  const message = [
    "Hi ANU Car Rentals & Travels, I would like to check availability.",
    "",
    "Name: " + data.get("name").trim(),
    "Mobile: " + mobile,
    "Trip type: " + data.get("trip"),
    "Pickup: " + data.get("pickup").trim(),
    "Drop: " + data.get("drop").trim(),
    "Date: " + data.get("date"),
    "Time: " + data.get("time"),
  ].join("\n");

  const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  window.open(url, "_blank", "noopener");
  form.reset();
});

// Only allow digits in the mobile field
form.mobile.addEventListener("input", () => {
  form.mobile.value = form.mobile.value.replace(/\D/g, "");
});
