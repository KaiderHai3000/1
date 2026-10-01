/* How to Schweiz – Sprache, Navigation, Detailseiten, Kontaktformular */
(function () {
  'use strict';

  // E-Mail-Adresse, an die das Kontaktformular gerichtet wird (öffnet das Mailprogramm).
  // Leer lassen, solange keine Adresse feststeht.
  var CONTACT_EMAIL = '';

  var T = window.I18N;
  var LANGS = ['de', 'en', 'gsw'];
  var HTML_LANG = { de: 'de', en: 'en', gsw: 'gsw' };
  var STORAGE_KEY = 'hts-lang';

  var FORM_MSG = {
    de: { invalid: 'Bitte füllen Sie Name, E-Mail und Ihre Situation aus.', noMail: 'Das Kontaktformular ist noch nicht verbunden. Bitte nutzen Sie vorerst die Kontaktdaten rechts.', ok: 'Ihr E-Mail-Programm wird geöffnet …', subject: 'Anfrage über How to Schweiz', skip: 'Zum Inhalt springen', menu: 'Menü' },
    en: { invalid: 'Please fill in your name, email and situation.', noMail: 'The contact form is not connected yet. Please use the contact details on the right for now.', ok: 'Opening your email program …', subject: 'Enquiry via How to Schweiz', skip: 'Skip to content', menu: 'Menu' },
    gsw: { invalid: 'Bitte füllet Sie Name, E-Mail und Ihri Situation us.', noMail: 'S Kontaktformular isch no nid verbunde. Bitte bruuched Sie vorerscht d Kontaktdate rächts.', ok: 'Ihres E-Mail-Programm wird göffnet …', subject: 'Aafrog über How to Schweiz', skip: 'Zum Inhalt springe', menu: 'Menü' }
  };

  var ICONS = {
    svc1: '<circle cx="10" cy="35" r="5"/><circle cx="38" cy="13" r="5"/><line x1="14" y1="31" x2="33" y2="17"/><polyline points="26,15 34,13 32,21"/>',
    svc2: '<rect x="7" y="7" width="34" height="34" rx="9"/><line x1="24" y1="16" x2="24" y2="32"/><line x1="16" y1="24" x2="32" y2="24"/>',
    svc3: '<line x1="6" y1="41" x2="42" y2="41"/><rect x="10" y="27" width="7" height="14"/><rect x="20.5" y="19" width="7" height="22"/><rect x="31" y="11" width="7" height="30"/>',
    svc4: '<rect x="11" y="6" width="26" height="36" rx="2"/><line x1="17" y1="16" x2="31" y2="16"/><line x1="17" y1="23" x2="31" y2="23"/><line x1="17" y1="30" x2="26" y2="30"/>',
    svc5: '<rect x="5" y="12" width="38" height="26" rx="4"/><line x1="5" y1="19" x2="43" y2="19"/><line x1="11" y1="30" x2="21" y2="30"/>',
    svc6: '<polygon points="24,6 39,13 39,24 24,43 9,24 9,13"/><polyline points="17,23 22,29 32,17"/>'
  };

  function iconSvg(id) {
    return '<svg class="icon icon-accent" viewBox="0 0 48 48" aria-hidden="true">' + (ICONS[id] || '') + '</svg>';
  }

  function storageGet() { try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; } }
  function storageSet(v) { try { localStorage.setItem(STORAGE_KEY, v); } catch (e) { /* ignore */ } }

  function initialLang() {
    var stored = storageGet();
    if (LANGS.indexOf(stored) !== -1) return stored;
    return 'de';
  }

  var lang = initialLang();
  var currentView = 'main';
  var currentService = null;

  /* ---------- Sprache ---------- */
  function applyLang() {
    var t = T[lang];
    document.documentElement.lang = HTML_LANG[lang];
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (t[key] != null) el.textContent = t[key];
    });
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
    document.querySelector('.skip-link').textContent = FORM_MSG[lang].skip;
    document.querySelector('.menu-toggle').setAttribute('aria-label', FORM_MSG[lang].menu);
    if (currentView === 'detail') renderDetail(currentService);
  }

  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      lang = btn.getAttribute('data-lang');
      storageSet(lang);
      applyLang();
    });
  });

  /* ---------- Icons in Leistungskarten ---------- */
  document.querySelectorAll('[data-icon]').forEach(function (el) {
    el.innerHTML = iconSvg(el.getAttribute('data-icon'));
  });

  /* ---------- Detailseite ---------- */
  function renderDetail(id) {
    var t = T[lang];
    var d = t.details[id];
    if (!d) return false;
    document.getElementById('detail-icon').innerHTML = iconSvg(id);
    document.getElementById('detail-title').textContent = t[id + '_title'];
    document.getElementById('detail-intro').textContent = d.intro;
    var body = document.getElementById('detail-body');
    body.innerHTML = '';
    ['1', '2', '3'].forEach(function (n) {
      if (!d['h' + n]) return;
      var h = document.createElement('h2');
      h.className = 'detail-h2';
      h.textContent = d['h' + n];
      var p = document.createElement('p');
      p.className = 'detail-p';
      p.textContent = d['p' + n];
      body.appendChild(h);
      body.appendChild(p);
    });
    document.title = t[id + '_title'] + ' – How to Schweiz';
    return true;
  }

  /* ---------- Router ---------- */
  var views = {
    main: document.getElementById('view-main'),
    detail: document.getElementById('view-detail'),
    impressum: document.getElementById('view-impressum'),
    datenschutz: document.getElementById('view-datenschutz')
  };

  function showView(name) {
    Object.keys(views).forEach(function (k) { views[k].hidden = k !== name; });
    currentView = name;
  }

  function route() {
    var hash = location.hash || '';
    closeMenu();
    var m = hash.match(/^#\/leistung\/(svc[1-6])$/);
    if (m && renderDetail(m[1])) {
      currentService = m[1];
      showView('detail');
      window.scrollTo(0, 0);
      return;
    }
    if (hash === '#/impressum' || hash === '#/datenschutz') {
      showView(hash.slice(2));
      document.title = (hash === '#/impressum' ? 'Impressum' : 'Datenschutz') + ' – How to Schweiz';
      window.scrollTo(0, 0);
      return;
    }
    var wasMain = currentView === 'main';
    showView('main');
    document.title = 'How to Schweiz – Ihr Weg in die Schweiz';
    var target = hash.length > 1 && hash.charAt(1) !== '/' ? document.getElementById(hash.slice(1)) : null;
    if (target) {
      if (!wasMain) target.scrollIntoView({ behavior: 'auto' });
    } else if (!wasMain) {
      window.scrollTo(0, 0);
    }
  }

  window.addEventListener('hashchange', route);

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

  /* ---------- Kontaktformular ---------- */
  var form = document.getElementById('contact-form');
  var status = form.querySelector('.form-status');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = FORM_MSG[lang];
    var valid = true;
    ['name', 'email', 'nachricht'].forEach(function (n) {
      var field = form.elements[n];
      var ok = field.value.trim() !== '' && (n !== 'email' || field.checkValidity());
      field.setAttribute('aria-invalid', ok ? 'false' : 'true');
      if (!ok) valid = false;
    });
    status.classList.toggle('is-error', !valid);
    if (!valid) { status.textContent = msg.invalid; return; }
    if (!CONTACT_EMAIL) {
      status.classList.add('is-error');
      status.textContent = msg.noMail;
      return;
    }
    var bodyText = form.elements.name.value + '\n' + form.elements.email.value + '\n' +
      (form.elements.telefon.value ? form.elements.telefon.value + '\n' : '') + '\n' + form.elements.nachricht.value;
    status.textContent = msg.ok;
    window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(msg.subject) + '&body=' + encodeURIComponent(bodyText);
  });

  applyLang();
  route();
})();
