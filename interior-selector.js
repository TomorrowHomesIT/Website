/* Studio Tomorrow — interior scheme image swap */
(function () {
  var R = window.__resources || {};
  var schemes = [
    { key: 'moment',    name: 'Moment',    src: R.intMoment    || 'interior-moment.jpg' },
    { key: 'present',   name: 'Present',   src: R.intPresent   || 'interior-present.jpg' },
    { key: 'today',     name: 'Today',     src: R.intToday     || 'interior-today.jpg' },
    { key: 'tomorrow',  name: 'Tomorrow',  src: R.intTomorrow  || 'interior-tomorrow.jpg' },
    { key: 'yesterday', name: 'Yesterday', src: R.intYesterday || 'interior-yesterday.jpg' }
  ];
  var byKey = {};
  schemes.forEach(function (s) { byKey[s.key] = s; });

  var btns = document.getElementById('intBtns');
  var imgs = [document.getElementById('intImgA'), document.getElementById('intImgB')];
  var cap = document.getElementById('intCap');
  if (!btns) return;

  var front = 0;
  var cur = 'moment';
  var token = 0;

  // preload
  schemes.forEach(function (s) { var i = new Image(); i.src = s.src; });

  function select(key) {
    if (key === cur || !byKey[key]) return;
    cur = key;
    var s = byKey[key];
    var myToken = ++token;
    var back = imgs[1 - front];

    var show = function () {
      if (myToken !== token) return; // a newer selection superseded this one
      back.classList.add('is-active');
      imgs[front].classList.remove('is-active');
      front = 1 - front;
      cap.textContent = s.name;
    };

    back.alt = s.name + ' scheme — kitchen';
    if (back.getAttribute('src') === s.src && back.complete) {
      show();
    } else {
      back.onload = show;
      back.onerror = show;
      back.src = s.src;
    }

    btns.querySelectorAll('.int-btn').forEach(function (b) {
      var on = b.dataset.scheme === key;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  // ---- Auto-rotate until the user interacts ----
  var ROTATE_MS = 2200;
  var auto = null;
  var stopped = false;
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function next() {
    var i = schemes.findIndex(function (s) { return s.key === cur; });
    select(schemes[(i + 1) % schemes.length].key);
  }
  function startAuto() {
    if (stopped || auto || prefersReduced) return;
    auto = setInterval(next, ROTATE_MS);
  }
  function pauseAuto() {
    if (auto) { clearInterval(auto); auto = null; }
  }
  function stopAuto() {
    stopped = true;
    pauseAuto();
  }

  btns.addEventListener('click', function (e) {
    var b = e.target.closest('.int-btn');
    if (b) { stopAuto(); select(b.dataset.scheme); }
  });

  // Only rotate while the selector is on screen; halt for good once a user picks.
  var selector = document.getElementById('interiorSelector');
  if (selector && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) startAuto(); else pauseAuto();
      });
    }, { threshold: 0.3 }).observe(selector);
  } else {
    startAuto();
  }
})();
