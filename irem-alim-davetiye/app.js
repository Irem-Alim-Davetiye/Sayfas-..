/**
 * app.js — İrem & Alim Davetiyesi
 * Dilek formu yönetimi (Doğrudan Google Forms + Sheets entegrasyonu)
 */

(function () {
  'use strict';

  var wishForm    = document.getElementById('wish-form');
  var wishName    = document.getElementById('wish-name');
  var wishMessage = document.getElementById('wish-message');
  var submitBtn   = document.getElementById('wish-submit-btn');
  var statusEl    = document.getElementById('wish-status');
  var iframe      = document.getElementById('hidden_iframe');

  if (!wishForm) return;

  var isSubmitting = false;

  wishForm.addEventListener('submit', function (e) {
    var nameVal = (wishName.value || '').trim();
    var msgVal  = (wishMessage.value || '').trim();

    if (!nameVal || !msgVal) {
      e.preventDefault();
      if (!nameVal && wishName) {
        wishName.classList.add('input-error');
        setTimeout(function () { wishName.classList.remove('input-error'); }, 1200);
      }
      if (!msgVal && wishMessage) {
        wishMessage.classList.add('input-error');
        setTimeout(function () { wishMessage.classList.remove('input-error'); }, 1200);
      }
      return;
    }

    isSubmitting = true;
    if (submitBtn) {
      submitBtn.textContent = 'İletiliyor…';
      submitBtn.disabled = true;
    }
    if (statusEl) {
      statusEl.textContent = '';
      statusEl.style.opacity = '1';
    }

    // Google Form formResponse isteği hidden_iframe içine post edilir
    setTimeout(function () {
      if (wishName) wishName.value = '';
      if (wishMessage) wishMessage.value = '';

      if (submitBtn) {
        submitBtn.textContent = 'İletildi ✓';
      }

      if (statusEl) {
        statusEl.textContent = 'Dileğiniz sevgiyle iletildi ✦';
      }

      setTimeout(function () {
        if (submitBtn) {
          submitBtn.textContent = 'Dileği İlet';
          submitBtn.disabled = false;
        }
        if (statusEl) {
          statusEl.style.opacity = '0';
          setTimeout(function () { statusEl.textContent = ''; }, 400);
        }
        isSubmitting = false;
      }, 3500);
    }, 800);
  });

  console.log('%c İrem & Alim — Dilek kutusu entegrasyonu hazır ✓', 'color:#b8a07a;font-style:italic');
})();