(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');

  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  // Cabeçalho: fundo sólido ao rolar
  var header = document.querySelector('.header');
  function onScroll() { header.classList.toggle('is-solid', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menu mobile
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  function toggleMenu(open) {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  burger.addEventListener('click', function () { toggleMenu(!menu.classList.contains('open')); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) toggleMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggleMenu(false); });

  // Revelação suave
  var items = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Carrossel do espaço
  var slider = document.getElementById('slider');
  document.querySelectorAll('.slider__ctl button').forEach(function (b) {
    b.addEventListener('click', function () {
      var step = slider.firstElementChild.getBoundingClientRect().width + 18;
      slider.scrollBy({ left: step * Number(b.dataset.dir), behavior: 'smooth' });
    });
  });
  slider.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') slider.scrollBy({ left: 300, behavior: 'smooth' });
    if (e.key === 'ArrowLeft') slider.scrollBy({ left: -300, behavior: 'smooth' });
  });

  // Lightbox
  var lb = document.getElementById('lb');
  var lbImg = document.getElementById('lbimg');
  var lbCap = document.getElementById('lbcap');
  var shots = Array.prototype.slice.call(document.querySelectorAll('#mosaic .g img'));
  var cur = 0, x0 = null;
  function show(i) {
    cur = (i + shots.length) % shots.length;
    lbImg.src = shots[cur].src;
    lbImg.alt = shots[cur].alt;
    lbCap.textContent = shots[cur].alt + '  (' + (cur + 1) + '/' + shots.length + ')';
  }
  shots.forEach(function (img, i) {
    img.parentNode.addEventListener('click', function () { show(i); lb.showModal(); });
  });
  lb.querySelector('.lb__x').addEventListener('click', function () { lb.close(); });
  lb.querySelector('.lb__n--p').addEventListener('click', function () { show(cur - 1); });
  lb.querySelector('.lb__n--n').addEventListener('click', function () { show(cur + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });
  lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
    x0 = null;
  });
})();
