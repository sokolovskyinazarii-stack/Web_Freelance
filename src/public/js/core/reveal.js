(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canObserve = "IntersectionObserver" in window && !reduced;

  function animateCount(element) {
    const raw = element.textContent.trim();
    const match = raw.match(/^([^\d]*)([\d\s]+)([^\d]*)$/);
    if (!match) return;

    const target = Number(match[2].replace(/\s/g, ""));
    if (!Number.isFinite(target) || target < 1) return;

    const prefix = match[1];
    const suffix = match[3];
    const started = performance.now();
    const duration = 760;

    const frame = (now) => {
      const progress = Math.min((now - started) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      element.textContent = prefix + value.toLocaleString("uk-UA") + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    };

    element.textContent = prefix + "0" + suffix;
    requestAnimationFrame(frame);
  }

  const observer = canObserve
    ? new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("is-visible");
            entry.target.querySelectorAll(".figure-value").forEach(animateCount);
            observer.unobserve(entry.target);
          }
        },
        { threshold: 0.08, rootMargin: "0px 0px -36px 0px" }
      )
    : null;

  function prepare(root) {
    const targets = Array.from(root.querySelectorAll("[data-reveal]"));

    const groups = new Map();
    for (const element of targets) {
      element.classList.remove("is-visible");
      element.style.removeProperty("--reveal-delay");
      const parent = element.parentElement;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent).push(element);
    }

    for (const list of groups.values()) {
      list.forEach((element, index) => {
        element.style.setProperty("--reveal-delay", `${Math.min(index * 55, 220)}ms`);
      });
    }

    if (!observer) {
      targets.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    targets.forEach((element) => observer.observe(element));
  }

  window.initReveal = prepare;
  window.__revealReady = true;
  window.clearTimeout(window.__revealFailSafe);

  prepare(document);
})();
