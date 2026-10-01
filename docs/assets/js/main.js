/* How to Schweiz – mobiles Menü und Kontaktformular */
(function () {
  'use strict';

  // E-Mail-Adresse, an die das Kontaktformular gerichtet wird (öffnet das Mailprogramm).
  // Leer lassen, solange keine Adresse feststeht.
  var CONTACT_EMAIL = '';

  /* ---------- Mobiles Menü ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');

  function closeMenu() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); toggle.focus(); }
  });

  /* ---------- Kontaktformular ---------- */
  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = form.querySelector('.form-status');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;
    ['name', 'email', 'nachricht', 'einwilligung'].forEach(function (n) {
      var field = form.elements[n];
      var ok = field.type === 'checkbox' ? field.checked : field.value.trim() !== '' && field.checkValidity();
      field.setAttribute('aria-invalid', ok ? 'false' : 'true');
      if (!ok) valid = false;
    });
    status.classList.toggle('is-error', !valid);
    if (!valid) { status.textContent = form.dataset.msgInvalid; return; }
    if (!CONTACT_EMAIL) {
      status.classList.add('is-error');
      status.textContent = form.dataset.msgNomail;
      return;
    }
    var f = form.elements;
    var bodyText = f.name.value + '\n' + f.email.value + '\n' + (f.telefon.value ? f.telefon.value + '\n' : '') + '\n' + f.nachricht.value;
    status.textContent = form.dataset.msgOk;
    window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(form.dataset.subject) + '&body=' + encodeURIComponent(bodyText);
  });
})();
