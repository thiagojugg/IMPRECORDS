const button = document.querySelector('.menu-toggle');
const menu = document.querySelector('#mobile-menu');
button.addEventListener('click', () => {
  const expanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!expanded));
  menu.hidden = expanded;
});
menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menu.hidden = true;
    button.setAttribute('aria-expanded', 'false');
  });
});
