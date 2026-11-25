document.documentElement.classList.add("js");

// Якщо reveal.js не завантажиться, контент не має залишитися прихованим.
window.__revealFailSafe = window.setTimeout(() => {
  if (window.__revealReady) return;
  document.querySelectorAll("[data-reveal]").forEach((element) => {
    element.classList.add("is-visible");
  });
}, 1200);
