/* IMP RECORDS — navegação com transição suave entre páginas. */
(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const duration = 390;
  let navigating = false;
  let overlay;

  const getOverlay = () => {
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.id = "imp-page-transition";
    overlay.setAttribute("aria-hidden", "true");
    document.body.appendChild(overlay);
    return overlay;
  };

  document.addEventListener("click", event => {
    if (event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest("a[href]");
    if (!link || link.hasAttribute("download") ||
        link.target === "_blank" ||
        link.getAttribute("rel")?.split(/\s+/).includes("external") ||
        link.hasAttribute("data-no-transition")) return;

    // Preserva a transição sonora já existente do atalho FL Studio.
    if (link.closest(".fl-studio-launch")) return;

    let destination;
    try { destination = new URL(link.href, window.location.href); }
    catch (_) { return; }

    if (!["http:", "https:"].includes(destination.protocol) ||
        destination.origin !== window.location.origin) return;

    const current = new URL(window.location.href);
    const sameDocument = destination.pathname === current.pathname &&
                         destination.search === current.search;
    // Âncoras na mesma página continuam usando rolagem suave, sem fade de página.
    if (sameDocument && destination.hash) return;
    if (sameDocument && !destination.hash) return;
    if (navigating) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    navigating = true;
    getOverlay();
    requestAnimationFrame(() => {
      root.classList.add("imp-page-leaving");
      window.setTimeout(() => window.location.assign(destination.href), duration);
    });
  }, true);

  // Também anima os links de retorno disparados pelo histórico do próprio site
  // quando o navegador oferece a API de transições entre documentos.
  window.addEventListener("pageshow", () => {
    root.classList.remove("imp-page-leaving");
    navigating = false;
  });
})();
