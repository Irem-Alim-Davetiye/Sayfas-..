/**
 * ui.js — İrem & Alim Davetiyesi
 * Tüm UI / animasyon / geri sayım kodu
 * Firebase'e hiç bağımlı değil — her zaman çalışır.
 */

(function () {
  'use strict';

  /* ── DOM ── */
  var openingScreen  = document.getElementById('opening-screen');
  var mainInvitation = document.getElementById('main-invitation');
  var sealBtn        = document.getElementById('seal-btn');
  var sealHint       = document.getElementById('seal-hint');
  var musicBtn       = document.getElementById('music-btn');
  var bgMusic        = document.getElementById('bg-music');
  var musicIconOn    = document.getElementById('music-icon-on');
  var musicIconOff   = document.getElementById('music-icon-off');

  if (!sealBtn || !openingScreen || !mainInvitation) {
    console.error('Davetiye elementleri bulunamadı.');
    return;
  }

  /* ══════════════════════════════════════════
     AÇILIŞ ANİMASYONU
  ══════════════════════════════════════════ */
  var hasOpened = false;

  function openInvitation() {
    if (hasOpened) return;
    hasOpened = true;

    sealBtn.style.pointerEvents = 'none';
    if (sealHint) sealHint.style.opacity = '0';

    /* 1 — Paneller açılmaya başlar */
    openingScreen.classList.add('opening');

    /* 2 — Tamamen açılır */
    setTimeout(function () {
      openingScreen.classList.add('opened');
    }, 320);

    /* 3 — Ana davetiye gösterilir */
    setTimeout(function () {
      openingScreen.classList.add('hidden');
      mainInvitation.setAttribute('aria-hidden', 'false');
      mainInvitation.classList.add('visible');

      /* Stagger animasyonu */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          mainInvitation.classList.add('animate');
        });
      });

      /* Müzik butonu */
      if (musicBtn) musicBtn.classList.add('visible');

    }, 1400);
  }

  /* Mühür — click, touch ve klavye */
  sealBtn.addEventListener('click', openInvitation);

  sealBtn.addEventListener('touchend', function (e) {
    e.preventDefault();
    openInvitation();
  }, { passive: false });

  sealBtn.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openInvitation();
    }
  });

  /* ══════════════════════════════════════════
     MÜZİK KONTROLÜ
  ══════════════════════════════════════════ */
  var musicPlaying = false;

  function toggleMusic() {
    if (!bgMusic) return;
    var hasSrc = bgMusic.src && bgMusic.src !== '' && bgMusic.src !== window.location.href;
    if (!hasSrc) {
      if (musicBtn) {
        musicBtn.style.opacity = '0.35';
        setTimeout(function () { musicBtn.style.opacity = '1'; }, 250);
      }
      return;
    }
    if (musicPlaying) {
      bgMusic.pause();
      musicPlaying = false;
      if (musicIconOn)  musicIconOn.style.display  = 'block';
      if (musicIconOff) musicIconOff.style.display = 'none';
      if (musicBtn)     musicBtn.setAttribute('aria-label', 'Müziği aç');
    } else {
      bgMusic.play().then(function () {
        musicPlaying = true;
        if (musicIconOn)  musicIconOn.style.display  = 'none';
        if (musicIconOff) musicIconOff.style.display = 'block';
        if (musicBtn)     musicBtn.setAttribute('aria-label', 'Müziği kapat');
      }).catch(function () {
        console.warn('Ses çalınamadı.');
      });
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', toggleMusic);
    musicBtn.addEventListener('touchend', function (e) {
      e.preventDefault();
      toggleMusic();
    }, { passive: false });
  }

  /* ══════════════════════════════════════════
     iOS 100vh DÜZELTMESİ
  ══════════════════════════════════════════ */
  function setVH() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--real-vh', vh + 'px');
  }
  setVH();
  window.addEventListener('resize', setVH, { passive: true });

  /* ══════════════════════════════════════════
     GERİ SAYIM SAYACI
  ══════════════════════════════════════════ */
  var EVENTS = [
    {
      name: 'kina',
      target: new Date('2026-10-06T19:30:00+03:00'),
      ids: { d: 'cd-kina-d', h: 'cd-kina-h', m: 'cd-kina-m', s: 'cd-kina-s' }
    },
    {
      name: 'elazig',
      target: new Date('2026-10-07T19:30:00+03:00'),
      ids: { d: 'cd-el-d', h: 'cd-el-h', m: 'cd-el-m', s: 'cd-el-s' }
    },
    {
      name: 'ankara',
      target: new Date('2026-10-10T19:00:00+03:00'),
      ids: { d: 'cd-an-d', h: 'cd-an-h', m: 'cd-an-m', s: 'cd-an-s' }
    }
  ];

  function pad2(n) {
    return String(Math.max(0, Math.floor(n))).padStart(2, '0');
  }

  function updateCountdown(ev) {
    var now  = new Date();
    var diff = ev.target - now;
    var dEl  = document.getElementById(ev.ids.d);
    var hEl  = document.getElementById(ev.ids.h);
    var mEl  = document.getElementById(ev.ids.m);
    var sEl  = document.getElementById(ev.ids.s);
    if (!dEl) return;

    if (diff <= 0) {
      var wrap = dEl.closest ? dEl.closest('.countdown-digits') : null;
      if (wrap) wrap.innerHTML = '<span class="countdown-past">Mutlulukla kutlandı ✦</span>';
      return;
    }

    var totalSecs = Math.floor(diff / 1000);
    var d = Math.floor(totalSecs / 86400);
    var h = Math.floor((totalSecs % 86400) / 3600);
    var m = Math.floor((totalSecs % 3600) / 60);
    var s = totalSecs % 60;

    if (dEl.textContent !== String(d))   dEl.textContent = String(d);
    if (hEl && hEl.textContent !== pad2(h)) hEl.textContent = pad2(h);
    if (mEl && mEl.textContent !== pad2(m)) mEl.textContent = pad2(m);
    if (sEl && sEl.textContent !== pad2(s)) sEl.textContent = pad2(s);
  }

  function tickAll() {
    EVENTS.forEach(updateCountdown);
  }

  tickAll();
  setInterval(tickAll, 1000);

  console.log('%c İrem & Alim Davetiyesi — UI hazır ✓', 'color:#b8a07a;font-style:italic');

})();