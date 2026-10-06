document.addEventListener("DOMContentLoaded", () => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ===== Footer year =====
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // ===== Mobile menu =====
  const navToggle = $("#nav-toggle");
  const navMenu = $("#nav-menu");
  const setMenu = (open) => {
    if (!navToggle || !navMenu) return;
    navMenu.classList.toggle("show-menu", open);
    navToggle.setAttribute("aria-expanded", String(open));
  };
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => setMenu(!navMenu.classList.contains("show-menu")));
    $$(".nav__link", navMenu).forEach((link) => link.addEventListener("click", () => setMenu(false)));
  }

  // ===== Dark mode (initial class is set by a tiny inline script to avoid a flash) =====
  const themeBtn = $("#darkModeToggle");
  const applyTheme = (dark) => {
    document.body.classList.toggle("dark-mode", dark);
    if (!themeBtn) return;
    themeBtn.setAttribute("aria-pressed", String(dark));
    const icon = $("i", themeBtn);
    if (icon) icon.className = dark ? "fas fa-sun" : "fas fa-moon";
  };
  applyTheme(document.body.classList.contains("dark-mode"));
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const dark = !document.body.classList.contains("dark-mode");
      applyTheme(dark);
      try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
    });
  }

  // ===== Modals =====
  let lastTrigger = null;
  const closeModals = () => {
    $$(".modal.active").forEach((m) => m.classList.remove("active"));
    document.body.classList.remove("modal-open");
    if (lastTrigger) lastTrigger.focus();
    lastTrigger = null;
  };
  $$("[data-modal-target]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const modal = $(trigger.dataset.modalTarget);
      if (!modal) return;
      lastTrigger = trigger;
      modal.classList.add("active");
      document.body.classList.add("modal-open");
      const close = $(".modal__close", modal);
      if (close) close.focus();
    });
  });
  $$("[data-modal-close]").forEach((btn) => btn.addEventListener("click", closeModals));
  $$(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModals(); });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeModals();
    setMenu(false);
  });

  // ===== Extracurriculars filter =====
  const filterBtns = $$(".filter-btn");
  const items = $$(".activities__item");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active-filter"));
      btn.classList.add("active-filter");
      const filter = btn.dataset.filter;
      items.forEach((item) => {
        item.hidden = !(filter === "all" || item.classList.contains(filter));
      });
    });
  });

  // ===== Highlight the nav link of the section in view =====
  const links = $$(".nav__link");
  const sections = links.map((l) => $(l.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => l.classList.toggle("active-link", l.getAttribute("href") === "#" + entry.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => observer.observe(s));
  }

  // ===== Scroll progress bar =====
  const bar = $("#scroll-progress");
  if (bar) {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  // ===== Contact form (Formspree, no page redirect) =====
  const form = $("#contact-form");
  const status = $("#form-status");
  if (form && status) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = $("button[type=submit]", form);
      btn.disabled = true;
      status.className = "form__status";
      status.textContent = "Sending...";
      try {
        const res = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Request failed");
        form.reset();
        status.textContent = "Thanks! Your message has been sent.";
        status.classList.add("is-success");
      } catch (err) {
        status.textContent = "Message not sent. Please try again or email me directly.";
        status.classList.add("is-error");
      } finally {
        btn.disabled = false;
      }
    });
  }
});
