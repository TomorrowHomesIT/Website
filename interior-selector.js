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

  btns.addEventListener('click', function (e) {
    var b = e.target.closest('.int-btn');
    if (b) select(b.dataset.scheme);
  });
})();
