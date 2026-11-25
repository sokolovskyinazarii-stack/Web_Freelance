const toggle = document.getElementById("menu-toggle");
const navMore = document.getElementById("nav-more");
const navMobile = window.matchMedia("(max-width: 1140px)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// У мобільному меню другий рівень показуємо одразу: підсумковий рядок прихований.
function syncNavMore() {
  if (navMore && navMobile.matches) navMore.open = true;
}

syncNavMore();
navMobile.addEventListener("change", syncNavMore);

toggle?.addEventListener("click", () => {
  const open = document.body.classList.toggle("nav-open");
  toggle.setAttribute("aria-expanded", String(open));
});

const progress = document.getElementById("scroll-progress");
let progressFrame = 0;

if (progress) {
  const paintProgress = () => {
    progressFrame = 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    progress.style.transform = `scaleX(${ratio})`;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (progressFrame) return;
      progressFrame = window.requestAnimationFrame(paintProgress);
    },
    { passive: true }
  );

  window.addEventListener("resize", paintProgress, { passive: true });
  paintProgress();
}

document.addEventListener("click", (event) => {
  const row = event.target.closest("[data-href]");
  if (row && !event.target.closest("a, button")) {
    window.location.href = row.dataset.href;
    return;
  }

  if (event.target.closest("[data-scroll-top]")) {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    return;
  }

  if (navMore?.open && !navMobile.matches && !navMore.contains(event.target)) {
    navMore.open = false;
  }

  if (!event.target.closest(".masthead")) {
    document.body.classList.remove("nav-open");
    toggle?.setAttribute("aria-expanded", "false");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (navMore?.open && !navMobile.matches) navMore.open = false;
    if (document.body.classList.contains("nav-open")) {
      document.body.classList.remove("nav-open");
      toggle?.setAttribute("aria-expanded", "false");
    }
    return;
  }

  if (event.key !== "Enter" || event.target.closest("a, button")) return;
  const row = event.target.closest("tr[data-href]");
  if (row) window.location.href = row.dataset.href;
});
