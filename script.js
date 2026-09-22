const startButton = document.querySelector("#start-building");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

menuToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

startButton.addEventListener("click", () => {
  startButton.querySelector(".button-arrow").textContent = "ok";

  window.setTimeout(() => {
    startButton.querySelector(".button-arrow").textContent = "->";
  }, 900);
});
