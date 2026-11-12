/* IMP RECORDS — controle da tela de carregamento */
(() => {
  const screen = document.getElementById('imp-loading-screen');
  if (!screen) return;
  let finished = false;
  const startedAt = Date.now();
  const dismiss = () => {
    if (finished) return;
    finished = true;
    const wait = Math.max(0, 1450 - (Date.now() - startedAt));
    window.setTimeout(() => {
      screen.classList.add('is-hidden');
      document.documentElement.classList.remove('imp-loading-active');
      window.setTimeout(() => screen.remove(), 750);
    }, wait);
  };
  document.documentElement.classList.add('imp-loading-active');
  if (document.readyState === 'complete') dismiss();
  else window.addEventListener('load', dismiss, { once: true });
  window.setTimeout(dismiss, 6500);
})();
