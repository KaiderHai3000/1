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

/* Rechenbeispiel Kaufpreis */
(function () {
  'use strict';
  var calc = document.getElementById('calc');
  if (!calc) return;
  var $ = function (id) { return document.getElementById(id); };
  var nf1 = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  var nf0 = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });

  function money(tsd) {
    return tsd >= 1000 ? nf1.format(tsd / 1000) + ' Mio. €' : nf0.format(tsd) + ' T€';
  }

  function update() {
    var ebit = Math.max(0, parseFloat($('calc-ebit').value) || 0);
    var mult = Math.max(0, parseFloat($('calc-mult').value) || 0);
    var growth = parseFloat($('calc-growth').value) / 100;
    var mplus = parseFloat($('calc-mplus').value);
    var before = ebit * mult;
    var after = ebit * (1 + growth) * (mult + mplus);
    var delta = after - before;

    $('calc-growth-out').textContent = nf0.format(growth * 100) + ' %';
    $('calc-mplus-out').textContent = '+' + nf1.format(mplus);
    $('val-before').textContent = money(before);
    $('val-after').textContent = money(after);
    $('val-delta').textContent = '+' + money(delta) + (before > 0 ? ' (+' + nf0.format(delta / before * 100) + ' %)' : '');
    var max = Math.max(after, 1);
    $('bar-before').style.width = (before / max * 100) + '%';
    $('bar-after').style.width = (after / max * 100) + '%';
  }

  calc.addEventListener('input', update);
  calc.addEventListener('submit', function (e) { e.preventDefault(); });
  update();
})();
