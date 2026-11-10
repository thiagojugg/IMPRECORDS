/* IMP RECORDS — revelação cinematográfica durante a rolagem nas páginas Artistas e Divisões. */
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  const selectors = [
    ".artists-intro",
    ".artists-grid .artist-card",
    ".divisions-intro",
    ".divisions-grid .division-card"
  ];
  const targets = Array.from(document.querySelectorAll(selectors.join(",")));
  if (!targets.length) return;

  targets.forEach(element => {
    element.classList.add("imp-cinematic-scroll-reveal");
    if (element.matches(".artist-card, .division-card")) {
      element.classList.add("imp-cinematic-depth-card");
    }
    const siblingIndex = Array.from(element.parentElement?.children || []).indexOf(element);
    element.style.setProperty("--imp-cinematic-delay", Math.min(Math.max(siblingIndex, 0) * 100, 400) + "ms");
  });

  document.documentElement.classList.add("imp-cinematic-scroll-ready");
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });

  targets.forEach(element => observer.observe(element));
})();
