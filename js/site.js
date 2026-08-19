(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var desktop = window.matchMedia('(min-width: 981px)').matches;
  var menuButton = document.getElementById('menuButton');
  var menuPanel = document.getElementById('menuPanel');
  var year = document.getElementById('year');
  var hero = document.getElementById('top');
  var film = document.getElementById('heroFilm');
  var filmWindow = document.getElementById('filmWindow');
  var filmProgress = document.getElementById('filmProgress');
  var filmTime = document.getElementById('filmTime');

  if (year) year.textContent = new Date().getFullYear();

  function setMenu(open) {
    menuButton.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuPanel.classList.toggle('is-open', open);
    menuPanel.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
  }
  if (menuButton) menuButton.addEventListener('click', function () { setMenu(!menuPanel.classList.contains('is-open')); });
  if (menuPanel) menuPanel.addEventListener('click', function (event) { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape') setMenu(false); });

  var reveals = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (item) { item.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (item) { observer.observe(item); });
  }

  var ready = false;
  var duration = 8;
  var targetTime = 0;
  var shownTime = 0;
  var scrollQueued = false;

  function formatTime(value) {
    var seconds = Math.max(0, Math.min(59, Math.floor(value)));
    return '00:' + (seconds < 10 ? '0' : '') + seconds;
  }

  function updateFilmTarget() {
    scrollQueued = false;
    if (!desktop || reduced || !hero) return;
    var rect = hero.getBoundingClientRect();
    var travel = Math.max(1, rect.height - window.innerHeight);
    var progress = Math.max(0, Math.min(1, -rect.top / travel));
    targetTime = progress * Math.max(.01, duration - .04);
    if (filmProgress) filmProgress.style.width = (progress * 100).toFixed(2) + '%';
  }

  function onScroll() {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(updateFilmTarget);
  }

  if (film && !reduced) {
    function prepareFilm() {
      if (ready) return;
      duration = film.duration || 8;
      ready = true;
      if (desktop) {
        film.pause();
        film.currentTime = .01;
        shownTime = .01;
        updateFilmTarget();
      } else {
        film.loop = true;
        var play = film.play();
        if (play && play.catch) play.catch(function () {});
      }
    }

    film.addEventListener('loadedmetadata', prepareFilm);
    if (film.readyState >= 1) prepareFilm();

    (function scrubLoop() {
      if (desktop && ready) {
        shownTime += (targetTime - shownTime) * .16;
        if (!film.seeking && Math.abs(film.currentTime - shownTime) > .018) {
          try { film.currentTime = shownTime; } catch (error) {}
        }
        if (filmTime) filmTime.textContent = formatTime(shownTime);
      }
      requestAnimationFrame(scrubLoop);
    })();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateFilmTarget();

  if (filmWindow && window.matchMedia('(pointer:fine)').matches && !reduced) {
    filmWindow.addEventListener('pointermove', function (event) {
      var rect = filmWindow.getBoundingClientRect();
      filmWindow.style.setProperty('--mx', ((event.clientX - rect.left) / rect.width * 100).toFixed(1) + '%');
      filmWindow.style.setProperty('--my', ((event.clientY - rect.top) / rect.height * 100).toFixed(1) + '%');
    });
  }
})();
