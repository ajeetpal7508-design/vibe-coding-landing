const startButton = document.querySelector("#start-building");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

const revealItems = document.querySelectorAll(".reveal");
const heroVisual = document.querySelector(".hero-visual");
const projectCards = document.querySelectorAll(".project-card");
const certificateButtons = document.querySelectorAll(".certificate-button");
const certificateLightbox = document.querySelector("#certificate-lightbox");
const lightboxContent = certificateLightbox?.querySelector(".lightbox-content");
const lightboxTitle = certificateLightbox?.querySelector("#lightbox-title");
const lightboxClose = certificateLightbox?.querySelector(".lightbox-close");
const currentYear = document.querySelector("#current-year");
const githubProjectGrid = document.querySelector("#github-project-grid");
const canUsePointerEffects = window.matchMedia("(min-width: 781px) and (hover: hover) and (pointer: fine)").matches;
const navLinks = [...document.querySelectorAll(".site-nav a")];
const navigableSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (currentYear) currentYear.textContent = new Date().getFullYear();

const githubProfileUrl = "https://github.com/ajeetpal7508-design";
const githubReposUrl = "https://api.github.com/users/ajeetpal7508-design/repos?type=public&sort=updated&per_page=100";
const githubCacheKey = "ajeetpal-github-public-repositories";
const githubCacheMaxAge = 15 * 60 * 1000;

const createGithubIcon = () => {
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("aria-hidden", "true");
  icon.classList.add("github-icon");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill", "currentColor");
  path.setAttribute("d", "M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.6-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.28c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z");
  icon.append(path);
  return icon;
};

const showGithubStatus = (message) => {
  if (!githubProjectGrid) return;
  githubProjectGrid.replaceChildren();
  const status = document.createElement("article");
  status.className = "github-project-status";
  const mark = document.createElement("span");
  mark.className = "github-status-mark";
  mark.setAttribute("aria-hidden", "true");
  mark.textContent = "!";
  const text = document.createElement("p");
  text.textContent = message;
  status.append(mark, text);
  githubProjectGrid.append(status);
};

const renderGithubRepositories = (repositories) => {
  if (!githubProjectGrid) return;
  githubProjectGrid.replaceChildren();

  repositories.forEach((repository) => {
    const card = document.createElement("article");
    card.className = "github-project-card";

    const header = document.createElement("div");
    header.className = "github-card-header";
    const iconWrap = document.createElement("span");
    iconWrap.className = "github-card-icon";
    iconWrap.append(createGithubIcon());
    const label = document.createElement("span");
    label.className = "github-card-label";
    label.textContent = "PUBLIC REPOSITORY";
    header.append(iconWrap, label);

    const name = document.createElement("h3");
    name.textContent = repository.name;
    const description = document.createElement("p");
    description.className = "github-card-description";
    description.textContent = repository.description || "No repository description provided.";

    const details = document.createElement("div");
    details.className = "github-card-details";
    if (repository.language) {
      const language = document.createElement("span");
      language.className = "github-language";
      language.textContent = repository.language;
      details.append(language);
    }
    const visibility = document.createElement("span");
    visibility.textContent = "Public";
    details.append(visibility);

    const link = document.createElement("a");
    link.className = "github-card-link";
    link.href = repository.html_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `View ${repository.name} on GitHub`);
    link.append(document.createTextNode("View on GitHub"));
    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "->";
    link.append(arrow);

    card.append(header, name, description, details, link);
    githubProjectGrid.append(card);
  });
};

const loadGithubRepositories = async () => {
  if (!githubProjectGrid) return;

  try {
    const cached = JSON.parse(sessionStorage.getItem(githubCacheKey) || "null");
    if (cached && Date.now() - cached.timestamp < githubCacheMaxAge) {
      renderGithubRepositories(cached.repositories);
      return;
    }
  } catch {
    sessionStorage.removeItem(githubCacheKey);
  }

  try {
    const response = await fetch(githubReposUrl, { headers: { Accept: "application/vnd.github+json" } });
    if (!response.ok) throw new Error("GitHub request failed");
    const repositories = (await response.json())
      .filter((repository) => repository && repository.private === false && repository.fork === false && repository.html_url)
      .sort((first, second) => new Date(second.updated_at) - new Date(first.updated_at));
    sessionStorage.setItem(githubCacheKey, JSON.stringify({ timestamp: Date.now(), repositories }));
    renderGithubRepositories(repositories);
  } catch {
    showGithubStatus("GitHub projects are temporarily unavailable. View the public profile for the latest repositories.");
  }
};

loadGithubRepositories();

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

if (heroVisual && canUsePointerEffects && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let pointerFrame = 0;
  let pointerX = 0;
  let pointerY = 0;

  const updateHeroDepth = () => {
    pointerFrame = 0;
    heroVisual.style.setProperty("--tilt-x", `${pointerY * -3}deg`);
    heroVisual.style.setProperty("--tilt-y", `${pointerX * 3}deg`);
    heroVisual.style.setProperty("--float-x", `${pointerX * 7}px`);
    heroVisual.style.setProperty("--float-y", `${pointerY * 7}px`);
  };

  heroVisual.addEventListener("pointermove", (event) => {
    const bounds = heroVisual.getBoundingClientRect();
    pointerX = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
    pointerY = ((event.clientY - bounds.top) / bounds.height - .5) * 2;
    if (!pointerFrame) pointerFrame = window.requestAnimationFrame(updateHeroDepth);
  });

  heroVisual.addEventListener("pointerleave", () => {
    pointerX = 0;
    pointerY = 0;
    if (!pointerFrame) pointerFrame = window.requestAnimationFrame(updateHeroDepth);
  });
}

if (projectCards.length && canUsePointerEffects && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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

if (certificateButtons.length && certificateLightbox && lightboxContent && lightboxTitle && lightboxClose) {
  let lastFocusedElement;

  const closeCertificate = () => {
    certificateLightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    lightboxContent.replaceChildren();
    lastFocusedElement?.focus();
  };

  certificateButtons.forEach((button) => {
    button.addEventListener("click", () => {
      lastFocusedElement = button;
      lightboxTitle.textContent = button.dataset.certificateTitle;
      const preview = button.dataset.certificateType === "pdf"
        ? Object.assign(document.createElement("object"), { data: button.dataset.certificate, type: "application/pdf" })
        : Object.assign(document.createElement("img"), { src: button.dataset.certificate, alt: `${button.dataset.certificateTitle} certificate` });
      preview.className = "lightbox-preview";
      lightboxContent.replaceChildren(preview);
      certificateLightbox.hidden = false;
      document.body.classList.add("lightbox-open");
      lightboxClose.focus();
    });
  });

  lightboxClose.addEventListener("click", closeCertificate);
  certificateLightbox.addEventListener("click", (event) => {
    if (event.target === certificateLightbox) closeCertificate();
  });
  document.addEventListener("keydown", (event) => {
    if (certificateLightbox.hidden) return;
    if (event.key === "Escape") closeCertificate();
    if (event.key === "Tab") {
      event.preventDefault();
      lightboxClose.focus();
    }
  });
}
