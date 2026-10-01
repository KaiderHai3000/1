#!/usr/bin/env node
/* Erzeugt die fertige Website in docs/ aus src/content.js.
 * Aufruf:  node src/build.js
 * Mit Domain (für Sitemap, Canonical, hreflang, Vorschaubild):
 *          SITE_URL=https://www.example.ch node src/build.js */
'use strict';

const fs = require('fs');
const path = require('path');
const content = require('./content');

const SITE_URL = (process.env.SITE_URL || '').replace(/\/+$/, '');
const OUT = path.join(__dirname, '..', 'docs');
const PARTNER_URL = 'https://claude.ai/artifact/FZNhNHnx4s9K6ucTt1nSgR';
const LANGS = ['de', 'en', 'gsw'];
const PREFIX = { de: '', en: 'en/', gsw: 'gsw/' };

const ICONS = {
  svc1: '<circle cx="10" cy="35" r="5"/><circle cx="38" cy="13" r="5"/><line x1="14" y1="31" x2="33" y2="17"/><polyline points="26,15 34,13 32,21"/>',
  svc2: '<rect x="7" y="7" width="34" height="34" rx="9"/><line x1="24" y1="16" x2="24" y2="32"/><line x1="16" y1="24" x2="32" y2="24"/>',
  svc3: '<line x1="6" y1="41" x2="42" y2="41"/><rect x="10" y="27" width="7" height="14"/><rect x="20.5" y="19" width="7" height="22"/><rect x="31" y="11" width="7" height="30"/>',
  svc4: '<rect x="11" y="6" width="26" height="36" rx="2"/><line x1="17" y1="16" x2="31" y2="16"/><line x1="17" y1="23" x2="31" y2="23"/><line x1="17" y1="30" x2="26" y2="30"/>',
  svc5: '<rect x="5" y="12" width="38" height="26" rx="4"/><line x1="5" y1="19" x2="43" y2="19"/><line x1="11" y1="30" x2="21" y2="30"/>',
  svc6: '<polygon points="24,6 39,13 39,24 24,43 9,24 9,13"/><polyline points="17,23 22,29 32,17"/>'
};

/* ---------- Helfer ---------- */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const homePath = (lang) => PREFIX[lang] + 'index.html';
const servicePath = (lang, slug) => PREFIX[lang] + 'leistungen/' + slug + '.html';
function rel(from, to) {
  const r = path.posix.relative(path.posix.dirname(from), to);
  return r === '' ? path.posix.basename(to) : r;
}
const abs = (p) => SITE_URL + '/' + p.replace(/(^|\/)index\.html$/, '$1');
const icon = (id, size) => `<svg class="icon icon-accent" viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true">${ICONS[id]}</svg>`;

/* ---------- Karte im Hero (Umrisse: Natural Earth, gemeinfrei) ---------- */
const MAP = require('./map-data.json');
function heroMap(t) {
  const [bx, by] = MAP.basel;
  const [sx, sy] = MAP.start;
  const cx = bx + 55, cy = by - 120;              // Kontrollpunkt östlich: Pfeil kommt aus Deutschland, nicht entlang der Grenze
  const dx = bx - cx, dy = by - cy, len = Math.hypot(dx, dy);
  const ex = (bx - dx / len * 20).toFixed(1), ey = (by - dy / len * 20).toFixed(1);
  const [dlx, dly] = MAP.deLabel, [clx, cly] = MAP.chLabel;
  return `
    <svg class="hero-map" viewBox="0 0 ${MAP.W} ${MAP.H}" role="img" aria-label="${esc(t.map_alt)}">
      <defs>
        <marker id="route-head" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" markerUnits="strokeWidth" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--accent)"/></marker>
      </defs>
      <path class="map-nb" d="${MAP.nb}"/>
      <path class="map-de" d="${MAP.de}"/>
      <path class="map-ch" d="${MAP.ch}"/>
      <text class="map-label" x="${dlx}" y="${dly - 6}" text-anchor="middle">${esc(t.map_de.toUpperCase())}</text>
      <text class="map-label map-label-ch" x="${clx + 18}" y="${cly + 14}" text-anchor="middle">${esc(t.map_ch.toUpperCase())}</text>
      <path class="map-route-casing" d="M${sx},${sy} Q${cx},${cy} ${ex},${ey}"/>
      <path class="map-route" d="M${sx},${sy} Q${cx},${cy} ${ex},${ey}" marker-end="url(#route-head)"/>
      <circle class="map-start" cx="${sx}" cy="${sy}" r="5"/>
      <circle class="map-halo" cx="${bx}" cy="${by}" r="15"/>
      <circle class="map-pin" cx="${bx}" cy="${by}" r="7"/>
      <line class="map-leader" x1="${bx - 9}" y1="${by - 6}" x2="${bx - 30}" y2="${by - 22}"/>
      <rect class="map-tag" x="${bx - 92}" y="${by - 40}" width="64" height="28" rx="14"/>
      <text class="map-tag-text" x="${bx - 60}" y="${by - 21}" text-anchor="middle">Basel</text>
    </svg>`;
}

/* ---------- Gerüst ---------- */
function layout({ lang, t, page, title, description, body, alternates, jsonld, navHome, noindex }) {
  const r = (to) => rel(page, to);
  const home = r(navHome || homePath(lang));
  const head = [];
  head.push(`<meta charset="utf-8">`);
  head.push(`<meta name="viewport" content="width=device-width, initial-scale=1">`);
  head.push(`<title>${esc(title)}</title>`);
  if (noindex) head.push(`<meta name="robots" content="noindex">`);
  head.push(`<meta name="description" content="${esc(description)}">`);
  head.push(`<link rel="icon" href="${r('assets/favicon.svg')}" type="image/svg+xml">`);
  head.push(`<link rel="preload" href="${r('assets/fonts/work-sans-latin-400-normal.woff2')}" as="font" type="font/woff2" crossorigin>`);
  head.push(`<link rel="preload" href="${r('assets/fonts/fraunces-latin-600-normal.woff2')}" as="font" type="font/woff2" crossorigin>`);
  head.push(`<link rel="stylesheet" href="${r('assets/css/style.css')}">`);
  head.push(`<meta property="og:type" content="website">`);
  head.push(`<meta property="og:site_name" content="How to Schweiz">`);
  head.push(`<meta property="og:title" content="${esc(title)}">`);
  head.push(`<meta property="og:description" content="${esc(description)}">`);
  head.push(`<meta property="og:locale" content="${t.og_locale}">`);
  head.push(`<meta name="twitter:card" content="summary_large_image">`);
  if (SITE_URL) {
    head.push(`<link rel="canonical" href="${abs(page)}">`);
    head.push(`<meta property="og:url" content="${abs(page)}">`);
    head.push(`<meta property="og:image" content="${SITE_URL}/assets/og-image.png">`);
    if (alternates) {
      LANGS.forEach((l) => head.push(`<link rel="alternate" hreflang="${content[l].html_lang}" href="${abs(alternates[l])}">`));
      head.push(`<link rel="alternate" hreflang="x-default" href="${abs(alternates.de)}">`);
    }
  }
  (jsonld || []).forEach((j) => head.push(`<script type="application/ld+json">${JSON.stringify(j)}</script>`));

  const langSwitch = alternates ? `
      <nav class="lang-switch" aria-label="${esc(t.lang_label)}">
        ${LANGS.map((l) => `<a class="lang-btn" href="${r(alternates[l])}" hreflang="${content[l].html_lang}" lang="${content[l].html_lang}" title="${esc(content[l].lang_name)}"${l === lang ? ' aria-current="true"' : ''}>${l.toUpperCase()}</a>`).join('<span aria-hidden="true">/</span>')}
      </nav>` : '';

  return `<!doctype html>
<html lang="${t.html_lang}">
<head>
${head.join('\n')}
</head>
<body>
<a class="skip-link" href="#main">${esc(t.skip)}</a>

<header class="site-header">
  <div class="header-inner">
    <div class="brand-group">
      <a class="brand" href="${home}">How to Schweiz</a>${langSwitch}
    </div>
    <button type="button" class="menu-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="${esc(t.menu)}">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>
    </button>
    <nav id="site-nav" class="site-nav">
      <a class="nav-link" href="${home}#leistungen">${esc(t.nav_leistungen)}</a>
      <a class="nav-link" href="${home}#ablauf">${esc(t.nav_ablauf)}</a>
      <a class="nav-link" href="${home}#ueber-uns">${esc(t.nav_ueberuns)}</a>
      <a class="nav-link" href="${home}#faq">${esc(t.nav_faq)}</a>
      <a class="nav-link" href="${home}#kontakt">${esc(t.nav_kontakt)}</a>
      <a class="btn btn-primary btn-sm" href="${home}#kontakt">${esc(t.nav_cta)}</a>
    </nav>
  </div>
</header>

<main id="main">
${body}
</main>

<footer class="site-footer">
  <div class="container">
    <div class="footer-top">
      <a class="footer-brand" href="${home}">How to Schweiz</a>
      <div class="footer-links">
        <a class="footer-link" href="${r('impressum.html')}" hreflang="de">${esc(t.footer_impressum)}</a>
        <a class="footer-link" href="${r('datenschutz.html')}" hreflang="de">${esc(t.footer_datenschutz)}</a>
        <a class="footer-link" href="${r('fuer-berater.html')}" hreflang="de">${esc(t.footer_partner)}</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>${esc(t.footer_copyright)}</p>
      <p>${esc(t.footer_disclaimer)}</p>
    </div>
  </div>
</footer>

<script src="${r('assets/js/main.js')}" defer></script>
</body>
</html>
`;
}

/* ---------- Startseite ---------- */
function homePage(lang) {
  const t = content[lang];
  const page = homePath(lang);
  const r = (to) => rel(page, to);
  const alternates = Object.fromEntries(LANGS.map((l) => [l, homePath(l)]));

  const cards = content.services.map((s) => `
    <a class="service-card" href="${r(servicePath(lang, s.slug))}">
      <div class="icon-badge">${icon(s.id, 26)}</div>
      <h3>${esc(t[s.id + '_title'])}</h3>
      <p>${esc(t[s.id + '_text'])}</p>
      <span class="more">${esc(t.more_label)}</span>
    </a>`).join('');

  const steps = [1, 2, 3, 4].map((n) => `
      <li class="step"><div class="step-badge"><span>0${n}</span></div><h3>${esc(t['step' + n + '_title'])}</h3><p>${esc(t['step' + n + '_text'])}</p></li>`).join('');

  const faq = t.faq.map((f, i) => `
      <details class="faq-item"${i === 0 ? ' open' : ''}>
        <summary><span>${esc(f.q)}</span><svg class="faq-chevron" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><polyline points="6,9 12,15 18,9"/></svg></summary>
        <p>${esc(f.a)}</p>
      </details>`).join('');

  const body = `
<section id="top" class="hero container">
  <div class="hero-copy">
    <span class="pill">${esc(t.hero_eyebrow)}</span>
    <h1>${esc(t.hero_title)}</h1>
    <p class="lead">${esc(t.hero_text)}</p>
    <div class="btn-row">
      <a class="btn btn-primary" href="#kontakt">${esc(t.hero_cta1)}</a>
      <a class="btn btn-ghost" href="#leistungen">${esc(t.hero_cta2)}</a>
    </div>
  </div>
  <div class="hero-art">${heroMap(t)}</div>
</section>

<section class="container usp-grid">
  <div class="usp-item">
    <svg class="icon" viewBox="0 0 48 48" width="28" height="28" aria-hidden="true"><circle cx="17" cy="24" r="13"/><circle cx="31" cy="24" r="13"/></svg>
    <h2>${esc(t.usp1_title)}</h2>
    <p>${esc(t.usp1_text)}</p>
  </div>
  <div class="usp-item">
    <svg class="icon" viewBox="0 0 48 48" width="28" height="28" aria-hidden="true"><circle cx="24" cy="14" r="7"/><path d="M12 40 C12 28, 17 24, 24 24 C31 24, 36 28, 36 40"/></svg>
    <h2>${esc(t.usp2_title)}</h2>
    <p>${esc(t.usp2_text)}</p>
  </div>
  <div class="usp-item">
    <svg class="icon" viewBox="0 0 48 48" width="28" height="28" aria-hidden="true"><circle cx="24" cy="24" r="16"/><line x1="24" y1="8" x2="24" y2="40"/><line x1="8" y1="24" x2="40" y2="24"/></svg>
    <h2>${esc(t.usp3_title)}</h2>
    <p>${esc(t.usp3_text)}</p>
  </div>
</section>

<section class="container section-tight">
  <div class="section-head">
    <span class="eyebrow">${esc(t.stats_eyebrow)}</span>
    <h2 class="section-title">${esc(t.stats_title)}</h2>
  </div>
  <div class="stats-grid">
    <div class="stat">
      <svg class="icon icon-accent" viewBox="0 0 48 48" width="24" height="24" aria-hidden="true"><ellipse cx="24" cy="34" rx="14" ry="5"/><ellipse cx="24" cy="26" rx="14" ry="5"/><ellipse cx="24" cy="18" rx="14" ry="5"/><path d="M10 18 L10 34 M38 18 L38 34"/></svg>
      <p class="stat-value">${esc(t.stat1_value)}</p>
      <p class="stat-label">${esc(t.stat1_label)}</p>
    </div>
    <div class="stat">
      <svg class="icon icon-accent" viewBox="0 0 48 48" width="24" height="24" aria-hidden="true">${ICONS.svc2}</svg>
      <p class="stat-value">${esc(t.stat2_value)}</p>
      <p class="stat-label">${esc(t.stat2_label)}</p>
    </div>
    <div class="stat">
      <svg class="icon icon-accent" viewBox="0 0 48 48" width="24" height="24" aria-hidden="true"><circle cx="24" cy="24" r="16"/><ellipse cx="24" cy="24" rx="7" ry="16"/><line x1="8" y1="24" x2="40" y2="24"/><path d="M11 15 C16 18, 32 18, 37 15"/><path d="M11 33 C16 30, 32 30, 37 33"/></svg>
      <p class="stat-value">${esc(t.stat3_value)}</p>
      <p class="stat-label">${esc(t.stat3_label)}</p>
    </div>
  </div>
  <p class="source">${esc(t.stats_source)}</p>
</section>

<section id="ueber-uns" class="band band-alt">
  <div class="container stack-lg">
    <div class="section-head">
      <span class="eyebrow">${esc(t.about_eyebrow)}</span>
      <h2 class="section-title">${esc(t.about_title)}</h2>
      <p class="body-text">${esc(t.about_text)}</p>
    </div>
    <div class="profile-wrap">
      <article class="profile-card">
        <div class="avatar" aria-hidden="true">
          <svg viewBox="0 0 88 88" width="88" height="88"><circle cx="44" cy="44" r="44" fill="var(--bg-alt)"/><circle cx="44" cy="36" r="14" fill="var(--line)"/><path d="M16 80 C16 60, 28 52, 44 52 C60 52, 72 60, 72 80 Z" fill="var(--line)"/></svg>
        </div>
        <div>
          <h3>Sami Kaune</h3>
          <p class="role">${esc(t.sami_role)}</p>
        </div>
        <p>${esc(t.sami_text)}</p>
      </article>
    </div>
  </div>
</section>

<section class="container section-pad">
  <div class="section-head">
    <span class="eyebrow">${esc(t.network_eyebrow)}</span>
    <h2 class="section-title">${esc(t.network_title)}</h2>
    <p class="body-text">${esc(t.network_text)}</p>
  </div>
  <ul class="network-list">
    <li><svg class="icon icon-accent" viewBox="0 0 48 48" width="24" height="24" aria-hidden="true"><line x1="24" y1="8" x2="24" y2="38"/><line x1="10" y1="14" x2="38" y2="14"/><line x1="16" y1="38" x2="32" y2="38"/><path d="M10 14 L6 24 L14 24 Z"/><path d="M38 14 L34 24 L42 24 Z"/></svg><span>${esc(t.network_item1)}</span></li>
    <li><svg class="icon icon-accent" viewBox="0 0 48 48" width="24" height="24" aria-hidden="true"><rect x="10" y="6" width="28" height="36" rx="3"/><line x1="16" y1="16" x2="32" y2="16"/><circle cx="18" cy="26" r="1.6"/><circle cx="24" cy="26" r="1.6"/><circle cx="30" cy="26" r="1.6"/><circle cx="18" cy="33" r="1.6"/><circle cx="24" cy="33" r="1.6"/><circle cx="30" cy="33" r="1.6"/></svg><span>${esc(t.network_item2)}</span></li>
    <li><svg class="icon icon-accent" viewBox="0 0 48 48" width="24" height="24" aria-hidden="true"><circle cx="12" cy="12" r="5"/><circle cx="36" cy="12" r="5"/><circle cx="24" cy="36" r="5"/><line x1="15" y1="16" x2="21" y2="32"/><line x1="33" y1="16" x2="27" y2="32"/><line x1="17" y1="12" x2="31" y2="12"/></svg><span>${esc(t.network_item3)}</span></li>
  </ul>
</section>

<section id="leistungen" class="container section-pad section-top">
  <div class="section-head">
    <span class="eyebrow">${esc(t.leistungen_eyebrow)}</span>
    <h2 class="section-title">${esc(t.leistungen_title)}</h2>
  </div>
  <div class="service-grid">${cards}
  </div>
</section>

<section id="ablauf" class="band band-dark">
  <div class="container stack-lg">
    <div class="section-head">
      <span class="eyebrow eyebrow-light">${esc(t.ablauf_eyebrow)}</span>
      <h2 class="section-title section-title-light">${esc(t.ablauf_title)}</h2>
    </div>
    <ol class="steps">${steps}
    </ol>
  </div>
</section>

<section id="faq" class="container section-pad faq-grid">
  <div class="section-head">
    <span class="eyebrow">${esc(t.faq_eyebrow)}</span>
    <h2 class="section-title">${esc(t.faq_title)}</h2>
    <p class="source faq-note">${esc(t.faq_note)}</p>
  </div>
  <div class="faq-list">${faq}
  </div>
</section>

<section id="kontakt" class="container section-pad contact-grid">
  <div>
    <span class="eyebrow">${esc(t.kontakt_eyebrow)}</span>
    <h2 class="section-title">${esc(t.kontakt_title)}</h2>
    <p class="body-text">${esc(t.kontakt_text)}</p>
    <form id="contact-form" class="contact-form" novalidate
      data-msg-invalid="${esc(t.form_invalid)}" data-msg-nomail="${esc(t.form_nomail)}"
      data-msg-ok="${esc(t.form_ok)}" data-subject="${esc(t.form_subject)}">
      <div class="form-field">
        <label for="kontakt-name">${esc(t.label_name)}</label>
        <input id="kontakt-name" type="text" name="name" autocomplete="name" required>
      </div>
      <div class="form-field">
        <label for="kontakt-email">${esc(t.label_email)}</label>
        <input id="kontakt-email" type="email" name="email" autocomplete="email" required>
      </div>
      <div class="form-field">
        <label for="kontakt-telefon">${esc(t.label_phone)}</label>
        <input id="kontakt-telefon" type="tel" name="telefon" autocomplete="tel">
      </div>
      <div class="form-field">
        <label for="kontakt-nachricht">${esc(t.label_situation)}</label>
        <textarea id="kontakt-nachricht" name="nachricht" rows="4" required></textarea>
      </div>
      <div class="form-consent">
        <input id="kontakt-einwilligung" type="checkbox" name="einwilligung" required>
        <label for="kontakt-einwilligung">${esc(t.label_consent_before)}<a href="${r('datenschutz.html')}" hreflang="de">${esc(t.label_consent_link)}</a>${esc(t.label_consent_after)}</label>
      </div>
      <button type="submit" class="btn btn-primary">${esc(t.btn_send)}</button>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>
  </div>
  <div>
    <div class="contact-card">
      <h3>Sami Kaune</h3>
      <p class="role">${esc(t.sami_contact_role)}</p>
      <p class="line"><svg class="icon icon-accent" viewBox="0 0 48 48" width="15" height="15" aria-hidden="true"><rect x="14" y="6" width="20" height="36" rx="4"/><line x1="20" y1="34" x2="28" y2="34"/></svg><span>${esc(t.ph_phone)}</span></p>
      <p class="line"><svg class="icon icon-accent" viewBox="0 0 48 48" width="15" height="15" aria-hidden="true"><rect x="6" y="12" width="36" height="24" rx="3"/><path d="M6 14 L24 28 L42 14"/></svg><span>${esc(t.ph_email)}</span></p>
    </div>
  </div>
</section>
`;

  const org = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'How to Schweiz',
    description: t.meta_description,
    areaServed: ['CH', 'DE'],
    address: { '@type': 'PostalAddress', addressLocality: 'Basel', addressCountry: 'CH' },
    employee: { '@type': 'Person', name: 'Sami Kaune' },
    knowsLanguage: ['de', 'en']
  };
  if (SITE_URL) org.url = abs(page);
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: t.html_lang,
    mainEntity: t.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  };

  return { page, html: layout({ lang, t, page, title: t.meta_title, description: t.meta_description, body, alternates, jsonld: [org, faqLd] }) };
}

/* ---------- Leistungsseiten ---------- */
function servicePage(lang, svc) {
  const t = content[lang];
  const d = t.details[svc.id];
  const page = servicePath(lang, svc.slug);
  const r = (to) => rel(page, to);
  const home = r(homePath(lang));
  const alternates = Object.fromEntries(LANGS.map((l) => [l, servicePath(l, svc.slug)]));
  const title = t[svc.id + '_title'];

  const sections = ['1', '2', '3'].filter((n) => d['h' + n]).map((n) => `
    <h2 class="detail-h2">${esc(d['h' + n])}</h2>
    <p class="detail-p">${esc(d['p' + n])}</p>`).join('');

  const others = content.services.filter((s) => s.id !== svc.id).map((s) => `
      <li><a href="${r(servicePath(lang, s.slug))}">${icon(s.id, 18)}<span>${esc(t[s.id + '_title'])}</span></a></li>`).join('');

  const body = `
<article class="container detail">
  <a class="back-link" href="${home}#leistungen">${esc(t.back_label)}</a>
  <div class="icon-badge icon-badge-lg">${icon(svc.id, 30)}</div>
  <h1>${esc(title)}</h1>
  <p class="detail-intro">${esc(d.intro)}</p>
  ${sections}
  <div class="detail-footer">
    <a class="btn btn-primary" href="${home}#kontakt">${esc(t.hero_cta1)}</a>
    <a class="btn btn-ghost" href="${home}#faq">${esc(t.nav_faq)}</a>
  </div>
  <nav class="other-services" aria-label="${esc(t.leistungen_eyebrow)}">
    <h2 class="eyebrow">${esc(t.leistungen_eyebrow)}</h2>
    <ul>${others}
    </ul>
  </nav>
</article>
`;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    description: d.intro,
    inLanguage: t.html_lang,
    areaServed: 'CH',
    provider: { '@type': 'ProfessionalService', name: 'How to Schweiz' }
  };
  return { page, html: layout({ lang, t, page, title: title + ' – How to Schweiz', description: d.intro, body, alternates, jsonld: [ld] }) };
}

/* ---------- Rechtliches (nur Deutsch) ---------- */
function legalPage(file, title, inner) {
  const t = content.de;
  const body = `
<article class="container detail">
  <a class="back-link" href="index.html">${esc(t.home_label)}</a>
  <h1>${esc(title)}</h1>
  ${inner}
  <div class="detail-footer"><a class="btn btn-primary" href="index.html">${esc(t.home_label)}</a></div>
</article>
`;
  return { page: file, html: layout({ lang: 'de', t, page: file, title: title + ' – How to Schweiz', description: title + ' – How to Schweiz', body, alternates: null, navHome: 'index.html' }) };
}

const impressum = legalPage('impressum.html', 'Impressum', `
  <h2 class="detail-h2">Anbieter dieser Website</h2>
  <address>
    <p class="name">Sami Kaune</p>
    <p>[Firmenname / Rechtsform, falls vorhanden]</p>
    <p>[Strasse und Hausnummer]</p>
    <p>[PLZ] Basel, Schweiz</p>
    <p class="gap">Telefon: [Telefonnummer]</p>
    <p>E-Mail: [E-Mail-Adresse]</p>
    <p class="gap">UID: [Unternehmens-Identifikationsnummer, falls vorhanden]</p>
    <p>Registrierung als Versicherungsvermittler: [Registernummer, falls zutreffend]</p>
  </address>

  <h2 class="detail-h2">Verantwortlich für den Inhalt</h2>
  <p class="detail-p">Sami Kaune, Anschrift wie oben.</p>

  <h2 class="detail-h2">Haftungshinweis</h2>
  <p class="detail-p">Die Inhalte dieser Website wurden sorgfältig erstellt, ersetzen aber keine individuelle Rechts-, Steuer- oder Versicherungsberatung. Für die Inhalte externer Links übernehmen wir keine Haftung. Für den Inhalt der verlinkten Seiten sind ausschliesslich deren Betreiber verantwortlich.</p>
`);

const H = (t) => `<h2 class="detail-h2">${t}</h2>`;
const P = (t) => `<p class="detail-p">${t}</p>`;
const UL = (items) => `<ul class="detail-list">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
const datenschutz = legalPage('datenschutz.html', 'Datenschutzerklärung', [
  P('Mit dieser Datenschutzerklärung informieren wir Sie darüber, welche Personendaten wir beim Besuch dieser Website und bei einer Kontaktaufnahme bearbeiten, zu welchem Zweck und welche Rechte Sie haben. Wir bearbeiten Personendaten nach dem Schweizer Datenschutzgesetz (DSG) und, soweit anwendbar, nach der Datenschutz-Grundverordnung der EU (DSGVO).'),
  P('Stand: Oktober 2026'),

  H('1. Verantwortlicher'),
  `<address>
    <p class="name">Sami Kaune</p>
    <p>[Firmenname / Rechtsform, falls vorhanden]</p>
    <p>[Strasse und Hausnummer]</p>
    <p>[PLZ] Basel, Schweiz</p>
    <p class="gap">E-Mail: [E-Mail-Adresse]</p>
    <p>Telefon: [Telefonnummer]</p>
  </address>`,
  P('Bei Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte erreichen Sie uns unter der oben genannten Adresse.'),

  H('2. Keine Cookies, kein Tracking'),
  P('Diese Website setzt keine Cookies, verwendet keine Analyse- oder Tracking-Werkzeuge und bindet keine Werbung, Social-Media-Plugins, Karten- oder Videodienste von Dritten ein. Schriftarten und alle weiteren Dateien werden direkt von unserem Webserver ausgeliefert; beim Aufruf der Website werden keine Daten an Google oder andere Drittanbieter übertragen.'),

  H('3. Hosting und Server-Logfiles'),
  P('Diese Website wird bei [Name und Sitz des Hosting-Anbieters] betrieben. Bei jedem Aufruf speichert der Webserver automatisch Informationen, die Ihr Browser übermittelt (Server-Logfiles):'),
  UL(['IP-Adresse des anfragenden Geräts', 'Datum und Uhrzeit des Zugriffs', 'aufgerufene Seite bzw. Datei', 'Referrer-URL (die zuvor besuchte Seite)', 'verwendeter Browser und Betriebssystem']),
  P('Diese Daten benötigen wir, um die Website technisch bereitzustellen, ihre Stabilität und Sicherheit zu gewährleisten und Missbrauch zu erkennen. Rechtsgrundlage ist unser berechtigtes Interesse am sicheren Betrieb der Website (Art. 31 Abs. 1 DSG; Art. 6 Abs. 1 lit. f DSGVO). Die Logfiles werden nach spätestens [7] Tagen gelöscht, sofern sie nicht zur Aufklärung eines Sicherheitsvorfalls länger benötigt werden. Mit dem Hosting-Anbieter besteht ein Vertrag über die Auftragsbearbeitung.'),

  H('4. Kontaktaufnahme per Formular, E-Mail oder Telefon'),
  P('Wenn Sie uns über das Kontaktformular, per E-Mail oder telefonisch kontaktieren, bearbeiten wir die Angaben, die Sie uns mitteilen – in der Regel Name, E-Mail-Adresse, optional Telefonnummer sowie die Beschreibung Ihrer Situation. Das Kontaktformular übermittelt keine Daten an unseren Server: Es öffnet Ihr eigenes E-Mail-Programm mit einer vorausgefüllten Nachricht, die Sie selbst absenden.'),
  P('Wir verwenden diese Angaben ausschliesslich, um Ihre Anfrage zu beantworten und ein Erstgespräch bzw. eine Beratung vorzubereiten. Rechtsgrundlage sind vorvertragliche Massnahmen auf Ihre Anfrage (Art. 6 Abs. 1 lit. b DSGVO) sowie Ihre Einwilligung, die Sie im Formular erteilen (Art. 6 Abs. 1 lit. a DSGVO). Die Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen.'),
  P('Bitte teilen Sie uns über das Formular oder per E-Mail keine besonders schützenswerten Daten wie Gesundheitsangaben mit. Solche Informationen besprechen wir, falls für die Beratung nötig, im persönlichen Gespräch.'),
  P('Ihre Anfrage und die Korrespondenz bewahren wir auf, solange es für die Bearbeitung nötig ist. Kommt keine Zusammenarbeit zustande, löschen wir die Daten spätestens [12] Monate nach dem letzten Kontakt. Kommt es zu einer Beratung, gelten die gesetzlichen Aufbewahrungspflichten.'),

  H('5. Terminbuchung'),
  P('[Dieser Abschnitt wird ergänzt, sobald ein Online-Buchungstool eingebunden ist: Name und Sitz des Anbieters, bearbeitete Daten, Speicherort, Rechtsgrundlage und Link zu dessen Datenschutzerklärung.]'),

  H('6. Weitergabe an Dritte'),
  P('Wir verkaufen Ihre Daten nicht und geben sie nicht zu Werbezwecken weiter. Für Fragen, die über unsere eigene Beratung hinausgehen, arbeiten wir mit spezialisierten Partnern zusammen, etwa Rechtsanwälten, Steuerberatern oder Versicherungsgesellschaften. Ihre Daten geben wir an solche Partner nur weiter, wenn Sie dem vorher zugestimmt haben oder es für die von Ihnen gewünschte Leistung erforderlich ist. Darüber hinaus erhalten nur unsere technischen Dienstleister (z.&nbsp;B. Hosting, E-Mail) Zugriff, soweit es für ihre Aufgabe nötig ist.'),

  H('7. Bearbeitung in der Schweiz und im Ausland'),
  P('Wir bearbeiten Ihre Daten grundsätzlich in der Schweiz [und/oder im EWR – je nach Standort des Hosting- und E-Mail-Anbieters anpassen]. Die Schweiz und die Staaten des EWR verfügen gegenseitig über ein angemessenes Datenschutzniveau. Eine Übermittlung in andere Staaten findet nur statt, wenn dort ein angemessener Schutz gewährleistet ist, etwa durch Standardvertragsklauseln.'),

  H('8. Datensicherheit'),
  P('Diese Website wird verschlüsselt über HTTPS übertragen. Wir treffen angemessene technische und organisatorische Massnahmen, um Ihre Daten vor Verlust, Missbrauch und unberechtigtem Zugriff zu schützen.'),

  H('9. Externe Links'),
  P('Diese Website enthält Links zu Websites Dritter. Erst wenn Sie einen solchen Link anklicken, werden Daten an den jeweiligen Betreiber übertragen. Für dessen Datenbearbeitung ist ausschliesslich dieser Betreiber verantwortlich.'),

  H('10. Ihre Rechte'),
  P('Sie haben im Rahmen des anwendbaren Datenschutzrechts insbesondere folgende Rechte:'),
  UL(['Auskunft darüber, ob und welche Personendaten wir über Sie bearbeiten', 'Berichtigung unrichtiger Daten', 'Löschung Ihrer Daten, soweit keine Aufbewahrungspflicht besteht', 'Einschränkung der Bearbeitung', 'Herausgabe Ihrer Daten in einem gängigen elektronischen Format (Datenübertragbarkeit)', 'Widerspruch gegen eine Bearbeitung, die auf unserem berechtigten Interesse beruht', 'Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft']),
  P('Für die Ausübung Ihrer Rechte genügt eine formlose Nachricht an die oben genannte Adresse. Zur Prüfung Ihrer Identität können wir einen Nachweis verlangen.'),
  P('Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. In der Schweiz ist dies der Eidgenössische Datenschutz- und Öffentlichkeitsbeauftragte (EDÖB, www.edoeb.admin.ch). Wenn Sie in der EU wohnen, können Sie sich auch an die Aufsichtsbehörde Ihres Wohnsitzlandes wenden, in Deutschland an die Datenschutzbehörde Ihres Bundeslandes.'),

  H('11. Änderungen'),
  P('Wir passen diese Datenschutzerklärung an, wenn sich unsere Website oder die rechtlichen Vorgaben ändern. Es gilt die jeweils auf dieser Seite veröffentlichte Fassung.'),
].join('\n  '));

/* ---------- Für Berater (nur Deutsch, nicht für Suchmaschinen) ---------- */
function advisorPage() {
  const t = content.de;
  const file = 'fuer-berater.html';
  const item = (title, text) => `<li><strong>${title}</strong><span>${text}</span></li>`;
  const body = `
<section class="container detail detail-wide">
  <a class="back-link" href="index.html">${esc(t.home_label)}</a>
  <span class="pill">Für Finanzberater in Deutschland</span>
  <h1>Ihr Kunde zieht in die Schweiz. Sie verlieren ihn nicht.</h1>
  <p class="detail-intro">Wenn ein Kunde auswandert, endet die Beratung oft abrupt – und mit ihr das Geschäft. Dabei ist der Umzug einer der wichtigsten Beratungsanlässe überhaupt: Einiges muss noch in Deutschland abgeschlossen oder angepasst werden, solange der Kunde hier wohnt. Dieses Briefing zeigt, worauf es ankommt, und wie wir die Arbeit zwischen Ihnen und uns aufteilen.</p>

  <h2 class="detail-h2">Warum der Zeitpunkt vor dem Umzug zählt</h2>
  <p class="detail-p">Nach der Abmeldung in Deutschland schließen viele deutsche Versicherer keine neuen Verträge mehr mit Kunden ab, die im Ausland wohnen. Gleichzeitig ist der Kunde heute gesünder als in ein paar Jahren. Das Zeitfenster liegt zwischen Jobzusage und Wegzug – in der Regel zwei bis sechs Monate. Wer es nutzt, sichert den Kunden sauber ab und bleibt sein Ansprechpartner für die deutsche Seite.</p>

  <h2 class="detail-h2">Die Umsatzchance: Ihr Briefing für das Bestandsgespräch</h2>
  <div class="brief-grid">
    <div class="brief-col brief-col-go">
      <h3>Vor dem Umzug abschließen oder erhöhen</h3>
      <ul>
        ${item('Berufsunfähigkeitsversicherung', 'Die deutsche BU sichert den zuletzt ausgeübten Beruf ab. Die Schweizer Invalidenversicherung und die Pensionskasse zahlen dagegen nur bei Erwerbsunfähigkeit, gemessen am gesamten Arbeitsmarkt – eine echte Lücke. Bestehende BU vor dem Wegzug über die Nachversicherungsgarantie an das höhere Schweizer Gehalt anpassen; Neuabschluss, solange der Wohnsitz noch in Deutschland ist. Bedingungen prüfen: weltweite Geltung, Meldepflichten, Leistungsprüfung im Ausland.')}
        ${item('Risikolebensversicherung', 'Besonders wichtig, wenn Familie oder Kredite in Deutschland bleiben, etwa für eine vermietete Immobilie. Die Todesfallleistung der Pensionskasse hängt am Schweizer Arbeitgeber und fällt bei einem Jobwechsel anders aus.')}
        ${item('PKV-Anwartschaft (für Privatversicherte)', 'In der Schweiz ist die Grundversicherung Pflicht, die deutsche PKV wird ruhend gestellt. Eine große Anwartschaft sichert die Rückkehr ohne neue Gesundheitsprüfung und erhält die Altersrückstellungen – zentral für alle, die eine Rückkehr nicht ausschließen.')}
      </ul>
    </div>
    <div class="brief-col">
      <h3>Weiterführen und anpassen</h3>
      <ul>
        ${item('Private Renten- und Lebensversicherungen', 'Laufen in der Regel weiter. Kündigen ist meist nachteilig. Beiträge und spätere Auszahlungen werden aber nach Schweizer Recht besteuert – vor dem Wegzug steuerlich prüfen lassen.')}
        ${item('Betriebliche Altersversorgung', 'Beim Wechsel zum Schweizer Arbeitgeber beitragsfrei stellen oder privat fortführen. Die erworbenen Ansprüche bleiben erhalten.')}
        ${item('Depots und Sparpläne', 'Einige deutsche Banken und Broker kündigen Kunden mit Wohnsitz in der Schweiz. Rechtzeitig klären, ob das Depot bleiben kann oder übertragen werden muss.')}
        ${item('Grenzgänger', 'Wer in Deutschland wohnen bleibt, behält die meisten Verträge. Bei der Krankenversicherung haben Grenzgänger ein Wahlrecht – wer sich für Deutschland entscheidet, bleibt auch hier Ihr Kunde.')}
      </ul>
    </div>
    <div class="brief-col brief-col-stop">
      <h3>Vorsicht oder beenden</h3>
      <ul>
        ${item('Riester', 'Die Schweiz gehört nicht zur EU/EWR. Ein Wegzug gilt als schädliche Verwendung: Zulagen und Steuervorteile werden zurückgefordert. Keine Neuabschlüsse; bestehende Verträge vor dem Wegzug gezielt beraten.')}
        ${item('Basisrente (Rürup)', 'Die Förderung setzt Steuerpflicht in Deutschland voraus. Neuabschluss kurz vor dem Wegzug ist meist nicht sinnvoll; bestehende Verträge beitragsfrei stellen.')}
        ${item('Sachversicherungen', 'Privathaftpflicht, Hausrat, Kfz und Rechtsschutz sind an den deutschen Wohnsitz gebunden und enden in der Regel mit dem Wegzug oder können gekündigt werden. Die Schweizer Lösungen übernehmen wir.')}
      </ul>
    </div>
  </div>

  <h2 class="detail-h2">So teilen wir uns die Arbeit</h2>
  <ol class="brief-steps">
    <li><strong>Ihr Kunde erzählt vom Umzug.</strong> Sie führen das Bestandsgespräch mit diesem Briefing.</li>
    <li><strong>Sie empfehlen uns weiter.</strong> Ihr Kunde nennt Sie beim Erstkontakt, damit die Empfehlung Ihnen zugeordnet wird.</li>
    <li><strong>Wir übernehmen die Schweizer Seite:</strong> Krankenkasse, Säule 3a, Pensionskasse, Absicherung und Konto.</li>
    <li><strong>Sie bleiben Ansprechpartner für Deutschland.</strong> Wir fassen Ihre deutschen Verträge nicht an.</li>
  </ol>

  <div class="brief-box">
    <h2 class="detail-h2">Kundenschutz und Vergütung</h2>
    <ul class="detail-list">
      <li>Wir beraten ausschließlich zur Schweizer Seite. Bestehende deutsche Verträge werden von uns weder gekündigt noch ersetzt.</li>
      <li>Zieht Ihr Kunde zurück nach Deutschland, geht er an Sie zurück.</li>
      <li>Für jede Empfehlung, aus der eine Zusammenarbeit entsteht, erhalten Sie [20] % der Provisionen, die wir im ersten Jahr mit dem Kunden erzielen – quartalsweise nach Zahlungseingang. Für Ihren Kunden entstehen keine Mehrkosten.</li>
      <li>Die Einzelheiten regeln wir in einer schriftlichen Tippgebervereinbarung.</li>
    </ul>
    <a class="btn btn-primary" href="${PARTNER_URL}">Partner werden</a>
  </div>

  <p class="source brief-note">Hinweis: Dieses Briefing gibt einen allgemeinen Überblick (Stand Oktober 2026) und ersetzt keine Prüfung im Einzelfall. Die Beratung muss sich wie immer am Bedarf des Kunden orientieren und dokumentiert werden. Steuerliche Fragen gehören zu einer Steuerberaterin oder einem Steuerberater. Als Tippgeber stellen Sie nur den Kontakt her und beraten nicht zu Schweizer Produkten.</p>
</section>
`;
  return { page: file, html: layout({ lang: 'de', t, page: file, title: 'Für Berater – How to Schweiz', description: 'Briefing für Finanzberater: Was Kunden vor dem Umzug in die Schweiz noch in Deutschland abschließen oder anpassen sollten.', body, alternates: null, navHome: 'index.html', noindex: true }) };
}

/* ---------- Schreiben ---------- */
function write(file, data) {
  const target = path.join(OUT, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, data);
}
function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  }
}

fs.rmSync(OUT, { recursive: true, force: true });
copyDir(path.join(__dirname, 'assets'), path.join(OUT, 'assets'));

const pages = [];
LANGS.forEach((lang) => {
  pages.push(homePage(lang));
  content.services.forEach((svc) => pages.push(servicePage(lang, svc)));
});
pages.push(impressum, datenschutz, advisorPage());
pages.forEach((p) => write(p.page, p.html));

write('.nojekyll', '');
write('robots.txt', 'User-agent: *\nAllow: /\n' + (SITE_URL ? `Sitemap: ${SITE_URL}/sitemap.xml\n` : ''));
if (SITE_URL) {
  const urls = pages.filter((p) => p.page !== 'fuer-berater.html').map((p) => `  <url><loc>${abs(p.page)}</loc></url>`).join('\n');
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
}

console.log(`${pages.length} Seiten nach docs/ geschrieben` + (SITE_URL ? ` (SITE_URL ${SITE_URL})` : ' (ohne SITE_URL: keine Sitemap/Canonical/hreflang)'));
