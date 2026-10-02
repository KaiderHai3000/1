# Sterbegeld – Kundenseite (Ziel des QR-Codes)

Landingpage für Kunden, die beim Bestatter den QR-Code scannen. Unabhängig von der
How-to-Schweiz-Website. Die Seite ist auf `noindex` gesetzt.

- `index.html` – komplette Seite mit Fragebogen (CSS und JavaScript inline, Hell-/Dunkelmodus)
- `assets/fonts/` – Schriften lokal (Fraunces, Work Sans; SIL Open Font License)

Zum Veröffentlichen den Ordner `sterbegeld/` hochladen.

## Zuordnung zum Bestatter

Jeder Bestatter bekommt einen eigenen QR-Code mit Kürzel, z. B. `https://…/sterbegeld/?b=gerstner`.

- Kürzel und Namen in `BESTATTER` (Skript am Ende von `index.html`) eintragen, z. B.
  `'gerstner': 'Bestattungsinstitut Gerstner'`. Dann zeigt die Seite „Empfohlen von …“ und
  schickt Kürzel und Namen mit dem Fragebogen mit.
- Ohne Kürzel (ein Flyer für alle) erscheint stattdessen das optionale Freifeld
  „Über welchen Bestatter …“. Unbekannte Kürzel werden trotzdem mitgeschickt.

## Vor dem Livegang ergänzen

- Formular verbinden: `FORM_ENDPOINT` (z. B. Formspree) oder ersatzweise `CONTACT_EMAIL` (öffnet eine vorausgefüllte E-Mail)
- Telefonnummer und E-Mail im Abschnitt „Lieber direkt sprechen?“ (mit `TODO` markiert)
- Impressum (inkl. Angaben nach § 34d GewO) und Datenschutzerklärung verlinken; der Einwilligungstext verweist auf die Datenschutzerklärung
- Beitragsbeispiele (Allianz, Stand 06/2026) regelmäßig prüfen
