/* ============================================================
   FUSE — Voice AI agency
   main.js: cursor, Barba transitions, GSAP reveals,
   FAQ accordion, smooth scroll, page progress
   ============================================================ */

/* ---------- Custom cursor ---------- */
(function initCursor() {
  if (window.innerWidth < 800) return;
  const cursor = document.querySelector(".cursor");
  if (!cursor) return;
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; });
  function loop() {
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  loop();
  // Hover state for interactive elements
  function attachHover() {
    document.querySelectorAll("a, button, .card, .tier, .faq__q, input, textarea, select").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
    });
  }
  attachHover();
  window.attachCursorHover = attachHover;
})();

/* ---------- Reveal on scroll ---------- */
function initReveals() {
  const els = document.querySelectorAll(".reveal, .reveal-stagger");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -10% 0px" });
  els.forEach((el) => io.observe(el));
}

/* ---------- Hero word reveal (split + slide up) ---------- */
function initHeroReveal() {
  const titles = document.querySelectorAll("[data-split]");
  if (!titles.length || typeof gsap === "undefined") return;
  titles.forEach((title) => {
    const spans = title.querySelectorAll(".word > span");
    gsap.to(spans, {
      y: 0,
      duration: 1.2,
      ease: "expo.out",
      stagger: 0.06,
      delay: 0.2,
    });
    const sub = title.parentElement.querySelector(".hero__sub, .home-hero__sub");
    if (sub) gsap.to(sub, { opacity: 1, duration: 1, delay: 0.9, ease: "power2.out" });
  });
}

/* ---------- FAQ accordion ---------- */
function initFAQ() {
  document.querySelectorAll(".faq__item").forEach((item) => {
    const q = item.querySelector(".faq__q");
    if (!q) return;
    q.addEventListener("click", () => {
      const wasOpen = item.classList.contains("is-open");
      document.querySelectorAll(".faq__item").forEach((i) => i.classList.remove("is-open"));
      if (!wasOpen) item.classList.add("is-open");
    });
  });
}

/* ---------- Page progress bar ---------- */
function initProgress() {
  const marker = document.querySelector(".page-marker");
  if (!marker) return;
  const bar = marker.querySelector(".page-marker__bar");
  function update() {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    bar.style.setProperty("--progress", `${Math.max(0, Math.min(1, scrolled)) * 100}%`);
  }
  update();
  window.addEventListener("scroll", update, { passive: true });
}

/* ---------- Active nav link ---------- */
function setActiveNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav__link").forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("is-active", href === path);
  });
}

/* ---------- Marquee duplicate (for seamless loop) ---------- */
function initMarquee() {
  document.querySelectorAll(".marquee__track").forEach((t) => {
    if (t.dataset.dup === "1") return;
    t.dataset.dup = "1";
    t.innerHTML = t.innerHTML + t.innerHTML;
  });
}

/* ---------- Form submit (graceful, no backend) ---------- */
function initForm() {
  const form = document.querySelector(".form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector(".form__submit");
    if (!btn) return;
    btn.textContent = "Sent — we'll be in touch ✺";
    btn.style.background = "var(--coral)";
    form.querySelectorAll("input, textarea, select").forEach((el) => (el.value = ""));
    setTimeout(() => {
      btn.textContent = "Send →";
      btn.style.background = "";
    }, 4000);
  });
}

/* ---------- Initialize per page ---------- */
function pageInit() {
  initReveals();
  initHeroReveal();
  initFAQ();
  initProgress();
  setActiveNav();
  initMarquee();
  initForm();
  if (window.attachCursorHover) window.attachCursorHover();
  if (typeof initSphere === "function") initSphere();
}

/* ---------- Barba.js page transitions ---------- */
window.addEventListener("DOMContentLoaded", () => {
  if (typeof barba !== "undefined" && typeof gsap !== "undefined") {
    barba.init({
      preventRunning: true,
      transitions: [
        {
          name: "wipe",
          leave({ current }) {
            const overlay = document.querySelector(".transition");
            const label = document.querySelector(".transition__label");
            return new Promise((resolve) => {
              const tl = gsap.timeline({ onComplete: resolve });
              tl.set(overlay, { y: "100%" });
              tl.set(label, { opacity: 0, y: 40 });
              tl.to(overlay, { y: "0%", duration: 0.8, ease: "expo.inOut" });
              tl.to(label, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.3");
              tl.to(current.container, { opacity: 0, duration: 0.2 }, 0);
            });
          },
          enter({ next }) {
            const overlay = document.querySelector(".transition");
            const label = document.querySelector(".transition__label");
            // Update label to next page name
            const pageName = next.container.dataset.pageName || "Fuse";
            if (label) label.textContent = pageName;
            window.scrollTo(0, 0);
            return new Promise((resolve) => {
              const tl = gsap.timeline({ onComplete: resolve });
              tl.fromTo(next.container, { opacity: 0 }, { opacity: 1, duration: 0.4 });
              tl.to(label, { opacity: 0, y: -30, duration: 0.4, ease: "power2.in" }, "+=0.1");
              tl.to(overlay, { y: "-100%", duration: 0.8, ease: "expo.inOut" }, "-=0.2");
              tl.set(overlay, { y: "100%" });
            });
          },
        },
      ],
    });
    barba.hooks.afterEnter(() => {
      pageInit();
    });
  }
  pageInit();
});
