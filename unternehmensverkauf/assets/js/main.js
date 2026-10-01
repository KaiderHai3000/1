/* M&A-Beratung – Kontaktformular (öffnet das E-Mail-Programm) */
(function () {
  'use strict';

  // E-Mail-Adresse, an die das Kontaktformular gerichtet wird.
  // Leer lassen, solange keine Adresse feststeht.
  var CONTACT_EMAIL = '';

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
    var lines = [f.name.value];
    if (f.firma.value) lines.push(f.firma.value);
    lines.push(f.email.value);
    if (f.telefon.value) lines.push(f.telefon.value);
    lines.push('Anliegen: ' + f.anliegen.value, '', f.nachricht.value);
    status.textContent = form.dataset.msgOk;
    window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(form.dataset.subject) + '&body=' + encodeURIComponent(lines.join('\n'));
  });
})();
