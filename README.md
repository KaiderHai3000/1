# How to Schweiz – Website

Statische, responsive Website für **How to Schweiz** (Deutsch / English / Schwiizerdütsch), umgesetzt nach dem Design-Entwurf.

## Aufbau

- `index.html` – Startseite mit allen Abschnitten, Leistungs-Detailseiten (`#/leistung/svc1` … `svc6`), Impressum (`#/impressum`) und Datenschutz (`#/datenschutz`)
- `assets/css/style.css` – Gestaltung (Desktop, Tablet, Smartphone)
- `assets/js/i18n.js` – alle Texte in DE / EN / GSW
- `assets/js/main.js` – Sprachumschaltung (wird im Browser gemerkt), Navigation, mobiles Menü, Kontaktformular

Kein Build-Schritt nötig: Dateien auf einen beliebigen Webspace laden (oder GitHub Pages aktivieren) und `index.html` öffnen.

## Vor dem Livegang ergänzen

- Telefonnummer und E-Mail-Adresse (`ph_phone`, `ph_email` in `assets/js/i18n.js`)
- Kontaktformular: E-Mail-Adresse in `CONTACT_EMAIL` (`assets/js/main.js`) eintragen – das Formular öffnet dann das Mailprogramm mit vorausgefüllter Nachricht
- Impressum: Adressen, Tätigkeit/Rechtsform, Aufsichtsbehörde, Registernummer (Platzhalter in eckigen Klammern in `index.html`)
- Datenschutzerklärung (aktuell nur Platzhalter)
- Optional: Foto von Sami Kaune statt Platzhalter-Avatar
