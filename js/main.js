// Wait for the DOM to load before running scripts
document.addEventListener("DOMContentLoaded", () => {
  //========== MOBILE MENU TOGGLE ==========
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("show-menu");
    });
  }

  //========== QUALIFICATION TABS ==========
  // 1) Grab all tabs (which have a data-target attribute) and the content sections
  const tabs = document.querySelectorAll("[data-target]");
  const tabContents = document.querySelectorAll(".qualification__content");

  // 2) For each tab, add a click event that toggles the active classes
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active states from all contents and tabs
      tabContents.forEach((tc) => tc.classList.remove("qualification__active"));
      tabs.forEach((t) => t.classList.remove("active-qual"));

      // Activate the clicked tab
      const target = document.querySelector(tab.dataset.target);
      if (target) {
        target.classList.add("qualification__active");
      }
      tab.classList.add("active-qual");
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const darkModeToggle = document.getElementById("darkModeToggle");

  // On click, toggle .dark-mode on <body>
  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
});

