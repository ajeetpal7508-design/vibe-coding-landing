const startButton = document.querySelector("#start-building");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

const revealItems = document.querySelectorAll(".reveal");
const heroVisual = document.querySelector(".hero-visual");
const projectCards = document.querySelectorAll(".project-card");
const currentYear = document.querySelector("#current-year");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const navigableSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (currentYear) currentYear.textContent = new Date().getFullYear();

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

if ("IntersectionObserver" in window && navigableSections.length) {
  const activeSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: "-24% 0px -62% 0px", threshold: 0 });

  navigableSections.forEach((section) => activeSectionObserver.observe(section));
}

if (startButton) startButton.addEventListener("click", () => {
  startButton.querySelector(".button-arrow").textContent = "ok";

  window.setTimeout(() => {
    startButton.querySelector(".button-arrow").textContent = "->";
  }, 900);
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (heroVisual && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  heroVisual.addEventListener("pointermove", (event) => {
    const bounds = heroVisual.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - .5) * 2;
    heroVisual.style.setProperty("--tilt-x", `${y * -3}deg`);
    heroVisual.style.setProperty("--tilt-y", `${x * 3}deg`);
    heroVisual.style.setProperty("--float-x", `${x * 7}px`);
    heroVisual.style.setProperty("--float-y", `${y * 7}px`);
  });

  heroVisual.addEventListener("pointerleave", () => {
    heroVisual.style.setProperty("--tilt-x", "0deg");
    heroVisual.style.setProperty("--tilt-y", "0deg");
    heroVisual.style.setProperty("--float-x", "0px");
    heroVisual.style.setProperty("--float-y", "0px");
  });
}

if (projectCards.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  projectCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      card.style.setProperty("--card-tilt-x", `${y * -2.2}deg`);
      card.style.setProperty("--card-tilt-y", `${x * 2.2}deg`);
      card.style.setProperty("--visual-shift-x", `${x * 5}px`);
      card.style.setProperty("--visual-shift-y", `${y * 5}px`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--card-tilt-x", "0deg");
      card.style.setProperty("--card-tilt-y", "0deg");
      card.style.setProperty("--visual-shift-x", "0px");
      card.style.setProperty("--visual-shift-y", "0px");
    });
  });
}
