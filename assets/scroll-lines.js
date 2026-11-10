/* IMP RECORDS — linhas editoriais reativas ao scroll da página principal. */
(() => {
  const body = document.body;
  if (!body || !document.querySelector("main#main")) return;

  body.classList.add("imp-home-scroll-lines");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let ticking = false;
  const update = () => {
    const shift = (window.scrollY * 0.18) % 112;
    body.style.setProperty("--imp-scroll-shift", `${shift.toFixed(2)}px`);
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
})();
