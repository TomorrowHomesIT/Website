/* Tomorrow Homes — Section 0 scroll splash.
   A giant wordmark color-flips at the rising content edge, rides up, then docks
   into the nav logo slot. The wordmark IS the nav reveal. */
(function () {
  var doc      = document.documentElement;
  var nav      = document.getElementById('nav');
  var wmW      = document.getElementById('wm-white');
  var wmB      = document.getElementById('wm-black');
  var navLogo  = nav ? nav.querySelector('.nav__logo') : null;
  var navMark  = nav ? nav.querySelector('.nav__logo-mark') : null;
  var page     = document.getElementById('page');
  var section1 = page ? page.querySelector('.hero') : null;   // first off-white slab edge
  var themed   = [].slice.call(document.querySelectorAll('[data-theme]'));

  if (!nav || !navLogo) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- nav theme: read data-theme of the section behind the bar ---------- */
  var lastTheme = '';
  function applyTheme() {
    var probeY = nav.offsetHeight * 0.5;
    var theme = 'light';
    for (var i = 0; i < themed.length; i++) {
      var r = themed[i].getBoundingClientRect();
      if (r.top <= probeY && r.bottom > probeY) theme = themed[i].getAttribute('data-theme') || 'light';
    }
    if (theme === lastTheme) return;
    nav.classList.toggle('theme-dark',  theme === 'dark');
    nav.classList.toggle('theme-light', theme !== 'dark');
    lastTheme = theme;
  }

  /* ---------- reduced motion / no choreography ---------- */
  if (reduce || !section1) {
    applyTheme();
    window.addEventListener('scroll',  function () { requestAnimationFrame(applyTheme); }, { passive: true });
    window.addEventListener('resize',  applyTheme);
    return;
  }

  doc.classList.add('js-intro'); // hide static mark + nav (also pre-set by head guard)

  var clamp = function (v, a, b) { return v < a ? a : (v > b ? b : v); };
  var lerp  = function (a, b, t) { return a + (b - a) * t; };
  var ease  = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

  var baseLeft = 0, baseTop = 0, baseW = 0, baseH = 0, VH = 0;

  function measure() {
    wmW.style.transform = 'none';
    var r = wmW.getBoundingClientRect();
    baseLeft = r.left; baseTop = r.top; baseW = r.width; baseH = r.height;
    VH = window.innerHeight;
  }

  /* nav reveal (crossfade target) */
  var navRev = -1;
  function setNavReveal(v) {
    if (v === navRev) return;
    navRev = v;
    nav.style.opacity = v;
    nav.style.pointerEvents = v > 0.99 ? 'auto' : 'none';
  }

  var ticking = false;
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }

  function frame() {
    ticking = false;
    var ct = section1.getBoundingClientRect().top;   // content edge, viewport coords
    var N, tx = 0, ty = 0, sc = 1, op = 1;

    if (ct >= baseTop) {
      /* PHASE 1 — pinned; horizontal wipe locked to the content edge */
      N = clamp(ct - baseTop, 0, baseH);
      setNavReveal(0);
    } else if (ct > 0) {
      /* PHASE 2 — ride up, locked to the content edge */
      N = 0;
      ty = ct - baseTop;
      setNavReveal(0);
    } else {
      /* PHASE 3 — dock into the nav logo slot */
      N = 0;
      var p  = clamp(-ct / (VH * 0.5), 0, 1);
      var e  = ease(p);
      var lr = (navMark || navLogo).getBoundingClientRect();
      sc = lerp(1, lr.width / baseW, e);
      tx = lerp(0, lr.left - baseLeft, e);
      ty = lerp(-baseTop, lr.top - baseTop, e);
      var fade = clamp((p - 0.8) / 0.2, 0, 1);   // final 20%: crossfade to real nav
      op = 1 - fade;
      setNavReveal(fade);
    }

    var t = 'translate(' + tx + 'px,' + ty + 'px) scale(' + sc + ')';
    wmW.style.transform = t;
    wmB.style.transform = t;
    wmW.style.opacity = op;
    wmB.style.opacity = op;
    var clip = 'inset(' + N + 'px 0 0 0)';
    wmB.style.clipPath = clip;
    wmB.style.webkitClipPath = clip;

    applyTheme();
  }

  function init() {
    measure();
    wmW.style.opacity = 1;
    wmB.style.opacity = 1;
    setNavReveal(0);
    frame();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { measure(); onScroll(); });

  init();
  window.addEventListener('load', function () { measure(); frame(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measure(); frame(); });
  [wmW.querySelector('img'), wmB.querySelector('img')].forEach(function (im) {
    if (im && !im.complete) im.addEventListener('load', function () { measure(); frame(); });
  });
})();
