/* Studio Tomorrow — facade carousel + lightbox */
(function () {
  var R = window.__resources || {};
  var slides = [
    { src: R.facadeBrae       || 'facade-brae.jpg',       title: 'Brae' },
    { src: R.facadeVaucluse   || 'facade-vaucluse.jpg',   title: 'Vaucluse' },
    { src: R.facadeMainridge  || 'facade-mainridge.jpg',  title: 'Mainridge' },
    { src: R.facadeMosman     || 'facade-mosman.jpg',     title: 'Mosman' },
    { src: R.facadeHamilton   || 'facade-hamilton.jpg',   title: 'Hamilton' },
    { src: R.facadeToorak     || 'facade-toorak.jpg',     title: 'Toorak' },
    { src: R.facadePortsea    || 'facade-portsea.jpg',    title: 'Portsea' },
    { src: R.facadeBellevue   || 'facade-bellevue.jpg',   title: 'Bellevue' },
    { src: R.facadeTenerife   || 'facade-tenerife.jpg',   title: 'Tenerife' },
    { src: R.facadeCentennial || 'facade-centennial.jpg', title: 'Centennial' },
    { src: R.facadeArmadale   || 'facade-armadale.jpg',   title: 'Armadale' },
    { src: R.facadeBalwyn     || 'facade-balwyn.jpg',     title: 'Balwyn' },
    { src: R.facadeBrighton   || 'facade-brighton.jpg',   title: 'Brighton' },
    { src: R.facadeFloreat    || 'facade-floreat.jpg',    title: 'Floreat' },
    { src: R.facadePiper      || 'facade-piper.jpg',      title: 'Piper' },
    { src: R.facadeClaremont  || 'facade-claremont.jpg',  title: 'Claremont' }
  ];
  var N = slides.length;

  var root = document.getElementById('facadeCarousel');
  if (!root) return;

  var focal = document.getElementById('fcFocal');
  var layers = focal.querySelectorAll('.fc-layer');
  var prevImg = document.getElementById('fcPrevImg');
  var nextImg = document.getElementById('fcNextImg');
  var idxEl = null;
  var titleEl = document.getElementById('fcTitle');
  var thumbs = document.getElementById('fcThumbs');
  var thumbsTrack = document.getElementById('fcThumbsTrack');

  var cur = 0;
  var front = 0; // index of layer currently active

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function setFocal(i, dir) {
    var back = layers[1 - front];
    var fImg = back.querySelector('img');
    fImg.src = slides[i].src;
    back.style.transition = 'none';
    back.style.transform = 'translateX(' + (dir * 46) + 'px) scale(1.05)';
    // force reflow
    void back.offsetWidth;
    back.style.transition = '';
    back.classList.add('is-active');
    back.style.transform = 'translateX(0) scale(1)';
    layers[front].classList.remove('is-active');
    front = 1 - front;
  }

  function renderSides(i) {
    prevImg.style.opacity = '0';
    nextImg.style.opacity = '0';
    setTimeout(function () {
      prevImg.src = slides[(i - 1 + N) % N].src;
      nextImg.src = slides[(i + 1) % N].src;
      prevImg.style.opacity = '1';
      nextImg.style.opacity = '1';
    }, 180);
  }

  function updateMeta(i) {
    titleEl.textContent = slides[i].title;
    var actives = thumbsTrack.querySelectorAll('.fc-thumb');
    actives.forEach(function (t) {
      t.classList.toggle('is-active', parseInt(t.dataset.index, 10) === i);
    });
  }

  function go(i, dir) {
    i = (i % N + N) % N;
    if (dir === undefined) dir = (i === (cur + 1) % N) ? 1 : (i === (cur - 1 + N) % N ? -1 : (i > cur ? 1 : -1));
    if (i === cur) return;
    cur = i;
    setFocal(cur, dir);
    renderSides(cur);
    updateMeta(cur);
    if (lbOpen) loadLightbox(cur);
  }

  /* ---------- auto-rotate until the user interacts ---------- */
  var ROTATE_MS = 2200;
  var auto = null;
  var autoStopped = false;
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function startAuto() {
    if (autoStopped || auto || prefersReduced) return;
    auto = setInterval(function () { go(cur + 1, 1); }, ROTATE_MS);
  }
  function pauseAuto() { if (auto) { clearInterval(auto); auto = null; } }
  function stopAuto() { autoStopped = true; pauseAuto(); }

  document.getElementById('fcPrev').addEventListener('click', function () { stopAuto(); go(cur - 1, -1); });
  document.getElementById('fcNext').addEventListener('click', function () { stopAuto(); go(cur + 1, 1); });

  /* ---------- thumbnails: infinite drag strip ---------- */
  var COPIES = 3;
  function buildThumbs() {
    var html = '';
    for (var c = 0; c < COPIES; c++) {
      for (var i = 0; i < N; i++) {
        html += '<button class="fc-thumb" data-index="' + i + '" aria-label="' + slides[i].title + '"><img src="' + slides[i].src + '" alt="" /></button>';
      }
    }
    thumbsTrack.innerHTML = html;
  }
  buildThumbs();

  var setWidth = 0;
  function measure() {
    // width of one copy = total scrollWidth / COPIES
    setWidth = thumbsTrack.scrollWidth / COPIES;
    thumbs.scrollLeft = setWidth; // start in middle copy
  }

  var wrapScheduled = false;
  function wrapScroll() {
    if (!setWidth) return;
    var sl = thumbs.scrollLeft;
    if (sl < setWidth * 0.5) { thumbs.scrollLeft = sl + setWidth; }
    else if (sl > setWidth * 1.5) { thumbs.scrollLeft = sl - setWidth; }
  }
  thumbs.addEventListener('scroll', function () {
    if (wrapScheduled) return;
    wrapScheduled = true;
    requestAnimationFrame(function () { wrapScroll(); wrapScheduled = false; });
  }, { passive: true });

  // mouse drag-to-scroll
  var down = false, startX = 0, startScroll = 0, moved = 0;
  thumbs.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse') return;
    stopAuto();
    down = true; moved = 0; startX = e.clientX; startScroll = thumbs.scrollLeft;
    thumbs.classList.add('dragging');
    thumbs.setPointerCapture(e.pointerId);
  });
  thumbs.addEventListener('pointermove', function (e) {
    if (!down) return;
    var dx = e.clientX - startX;
    moved = Math.max(moved, Math.abs(dx));
    thumbs.scrollLeft = startScroll - dx;
  });
  function endDrag(e) {
    if (!down) return;
    down = false; thumbs.classList.remove('dragging');
    try { thumbs.releasePointerCapture(e.pointerId); } catch (err) {}
  }
  thumbs.addEventListener('pointerup', endDrag);
  thumbs.addEventListener('pointercancel', endDrag);

  thumbsTrack.addEventListener('click', function (e) {
    var btn = e.target.closest('.fc-thumb');
    if (!btn) return;
    if (moved > 6) return; // was a drag, not a click
    stopAuto();
    go(parseInt(btn.dataset.index, 10));
  });

  /* ---------- lightbox with zoom/pan ---------- */
  var lb = document.getElementById('fcLightbox');
  var lbStage = document.getElementById('fcLbStage');
  var lbImg = document.getElementById('fcLbImg');
  var lbMeta = document.getElementById('fcLbMeta');
  var lbOpen = false;
  var scale = 1, tx = 0, ty = 0;

  function applyTransform() {
    lbImg.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
  }
  function resetZoom() { scale = 1; tx = 0; ty = 0; applyTransform(); }

  function loadLightbox(i) {
    lbImg.src = slides[i].src;
    lbMeta.textContent = slides[i].title;
    resetZoom();
  }
  function openLightbox(i) {
    loadLightbox(i);
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    lbOpen = true;
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    lbOpen = false;
    document.body.style.overflow = '';
  }

  focal.addEventListener('click', function (e) {
    if (e.target.closest('.fc-expand')) return; // handled below
    stopAuto(); openLightbox(cur);
  });
  document.getElementById('fcExpand').addEventListener('click', function (e) {
    e.stopPropagation(); stopAuto(); openLightbox(cur);
  });
  document.getElementById('fcLbClose').addEventListener('click', closeLightbox);
  document.getElementById('fcLbPrev').addEventListener('click', function () { stopAuto(); go(cur - 1, -1); });
  document.getElementById('fcLbNext').addEventListener('click', function () { stopAuto(); go(cur + 1, 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target === lbStage) closeLightbox(); });
  document.addEventListener('keydown', function (e) {
    if (!lbOpen) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') { stopAuto(); go(cur - 1, -1); }
    else if (e.key === 'ArrowRight') { stopAuto(); go(cur + 1, 1); }
  });

  function clampScale(s) { return Math.max(1, Math.min(5, s)); }
  function clampPan() {
    var r = lbImg.getBoundingClientRect();
    var maxX = Math.max(0, (r.width - lbStage.clientWidth) / 2 + 80);
    var maxY = Math.max(0, (r.height - lbStage.clientHeight) / 2 + 80);
    tx = Math.max(-maxX, Math.min(maxX, tx));
    ty = Math.max(-maxY, Math.min(maxY, ty));
  }
  function stageCenter() {
    var r = lbStage.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  function zoomAt(factor, px, py) {
    var ns = clampScale(scale * factor);
    var f = ns / scale;
    var C = stageCenter();
    tx = (px - C.x) * (1 - f) + f * tx;
    ty = (py - C.y) * (1 - f) + f * ty;
    scale = ns;
    if (scale === 1) { tx = 0; ty = 0; }
    clampPan();
    applyTransform();
  }

  lbStage.addEventListener('wheel', function (e) {
    if (!lbOpen) return;
    e.preventDefault();
    zoomAt(e.deltaY < 0 ? 1.14 : 0.88, e.clientX, e.clientY);
  }, { passive: false });

  lbImg.addEventListener('dblclick', function (e) {
    if (scale > 1) resetZoom();
    else zoomAt(2.6, e.clientX, e.clientY);
  });

  // pointer-based pinch + pan
  var pts = new Map();
  var startDist = 0, startScale = 1, startTx = 0, startTy = 0, startMid = null;
  var panStart = null;
  lbStage.addEventListener('pointerdown', function (e) {
    if (!lbOpen) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    lbStage.setPointerCapture(e.pointerId);
    if (pts.size === 2) {
      var arr = [...pts.values()];
      startDist = Math.hypot(arr[0].x - arr[1].x, arr[0].y - arr[1].y);
      startScale = scale; startTx = tx; startTy = ty;
      startMid = { x: (arr[0].x + arr[1].x) / 2, y: (arr[0].y + arr[1].y) / 2 };
      panStart = null;
    } else if (pts.size === 1 && scale > 1) {
      panStart = { x: e.clientX, y: e.clientY, tx: tx, ty: ty };
      lbImg.classList.add('is-grabbing');
    }
  });
  lbStage.addEventListener('pointermove', function (e) {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 2 && startMid) {
      var arr = [...pts.values()];
      var dist = Math.hypot(arr[0].x - arr[1].x, arr[0].y - arr[1].y);
      var ns = clampScale(startScale * (dist / startDist));
      var f = ns / startScale;
      var C = stageCenter();
      tx = (startMid.x - C.x) * (1 - f) + f * startTx;
      ty = (startMid.y - C.y) * (1 - f) + f * startTy;
      scale = ns;
      clampPan(); applyTransform();
    } else if (pts.size === 1 && panStart && scale > 1) {
      tx = panStart.tx + (e.clientX - panStart.x);
      ty = panStart.ty + (e.clientY - panStart.y);
      clampPan(); applyTransform();
    }
  });
  function lbPointerUp(e) {
    pts.delete(e.pointerId);
    try { lbStage.releasePointerCapture(e.pointerId); } catch (err) {}
    if (pts.size < 2) startMid = null;
    if (pts.size === 0) { panStart = null; lbImg.classList.remove('is-grabbing'); }
  }
  lbStage.addEventListener('pointerup', lbPointerUp);
  lbStage.addEventListener('pointercancel', lbPointerUp);

  /* ---------- init ---------- */
  function init() {
    layers[front].querySelector('img').src = slides[0].src;
    prevImg.src = slides[N - 1].src;
    nextImg.src = slides[1].src;
    measure();
    updateMeta(0);
    // Rotate only while the carousel is on screen; halt for good once the user interacts.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) startAuto(); else pauseAuto();
        });
      }, { threshold: 0.3 }).observe(root);
    } else {
      startAuto();
    }
  }
  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);
  window.addEventListener('resize', function () {
    // keep strip seamless after resize
    measure();
  });
})();
