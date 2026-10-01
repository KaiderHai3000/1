# How to Schweiz – Website

Statische, responsive Website für **How to Schweiz** (Deutsch / English / Schwiizerdütsch).
Jede Sprache und jede Leistung hat eine eigene Unterseite, damit Google sie einzeln findet.

## Aufbau

| Pfad | Inhalt |
| --- | --- |
| `src/content.js` | **Alle Texte** (DE / EN / GSW), inkl. FAQ und Leistungs-Detailseiten |
| `src/build.js` | Erzeugt aus den Texten die fertigen Seiten in `docs/` |
| `src/assets/` | CSS, JavaScript, Schriften (lokal, ohne Google-Server), Favicon, Vorschaubild |
| `docs/` | **Fertige Website** – diesen Ordner hochladen bzw. als GitHub-Pages-Quelle wählen |

Seiten: `/` (DE), `/en/`, `/gsw/`, je sechs Leistungsseiten unter `leistungen/`, dazu `impressum.html` und `datenschutz.html`.

## Texte ändern

1. Text in `src/content.js` anpassen
2. `node src/build.js` ausführen (Node.js genügt, keine weiteren Pakete nötig)
3. Inhalt von `docs/` hochladen

Sobald die Domain feststeht, mit Domain bauen – dann kommen Sitemap, Canonical-Links,
Sprachverknüpfungen (hreflang) und das Vorschaubild für WhatsApp/LinkedIn dazu:

```
SITE_URL=https://www.deine-domain.ch node src/build.js
```

## Vor dem Livegang ergänzen

- Telefonnummer und E-Mail (`ph_phone`, `ph_email` in `src/content.js`)
- Kontaktformular: Adresse in `CONTACT_EMAIL` (`src/assets/js/main.js`) – oder durch Terminbuchung ersetzen
- Impressum (Platzhalter in `src/build.js`, Abschnitt „Rechtliches“)
- Datenschutzerklärung (aktuell nur Platzhalter)
- Fotos von Sami
- Schwiizerdütsch-Texte von einer Muttersprachlerin / einem Muttersprachler gegenlesen lassen
- Zahlen jährlich prüfen (Krankenkassenprämie, Säule-3a-Maximalbetrag, Statistiken)
