# Google Formular für die Kfz-Aktion – Anleitung

## Schnellweg (empfohlen): Formular per Script erstellen – ca. 2 Minuten

1. [script.google.com](https://script.google.com) öffnen, mit dem Google-Konto, in dem das Formular liegen soll → **Neues Projekt**.
2. Den kompletten Inhalt von [`formular-erstellen.gs`](formular-erstellen.gs) einfügen (den vorhandenen Code ersetzen). Den gleichen Text gibt es auch als Google Doc in deinem Drive: „Kfz-Aktion – Script für Google Formular“.
3. Speichern (Disketten-Symbol).
4. Oben die Funktion **formularErstellen** auswählen → **Ausführen**.
5. Berechtigungen bestätigen: Konto wählen → **Erweitert** → **Zu Projekt wechseln (unsicher)** → **Zulassen**. Die Warnung kommt, weil das Script von dir selbst stammt und nicht von Google geprüft ist.
6. Im **Ausführungsprotokoll** unten stehen danach drei Links: Formular, Formular bearbeiten, Antworten-Tabelle.

Das Script erledigt automatisch alles aus den Schritten 1–5 unten: alle Fragen, den Abschnitt für Unter-18-Jährige, die Einstellungen, die verknüpfte Antworten-Tabelle und eine E-Mail an dich bei jeder neuen Eintragung. In der Tabelle gibt es außerdem den Reiter **QR-Links** mit einem eigenen Link pro Fahrschule. Sag mir Bescheid, wenn das Script gelaufen ist, dann baue ich aus diesen Links die QR-Codes.

Danach nur noch **Schritt 6 (Testen)** machen.

---

## Alternative: Formular von Hand anlegen – ca. 10 Minuten

Am Ende schickst du mir den **vorausgefüllten Link** (Schritt 5). Daraus mache ich die QR-Codes für alle Fahrschulen.

> **Vorab mit der tecis-Compliance klären:** Darf ein Google Formular für Interessenten-Daten genutzt werden, und mit welchem Konto (privat oder tecis)? Google speichert die Daten auch außerhalb der EU. Außerdem brauchst du einen kurzen **Datenschutzhinweis**, auf den das Formular verlinkt.

---

## 1. Formular anlegen

1. [forms.google.com](https://forms.google.com) öffnen → **Leeres Formular**.
2. **Titel:** Dein erstes Auto – unverbindliches Kfz-Versicherungsangebot
3. **Beschreibung:**

> Du hast bald deinen Führerschein oder schon dein erstes Auto im Blick? Trag dich ein, und ich melde mich mit einem unverbindlichen Angebot für deine Kfz-Versicherung. Ich vergleiche mehrere Versicherer und zeige dir, wie du als Fahranfänger nicht mit dem teuersten Beitrag startest.
>
> Kostenlos und unverbindlich – du entscheidest danach selbst.
>
> Kai Schindler, Finanzberater, tecis Pforzheim

---

## 2. Fragen (Abschnitt 1)

Das Formular bewusst kurz halten: Alles Weitere klären wir im Gespräch. Jede zusätzliche Frage kostet Eintragungen.

| # | Frage | Fragetyp | Pflicht | Antworten / Hinweis |
|---|---|---|---|---|
| 1 | Vor- und Nachname | Kurzantwort | Ja | |
| 2 | Handynummer | Kurzantwort | Ja | Beschreibung: „Für Rückruf oder WhatsApp“ |
| 3 | E-Mail-Adresse | Kurzantwort | Nein | |
| 4 | Wie alt bist du? | Multiple Choice | Ja | Unter 18 · 18–20 · 21–24 · 25 oder älter |
| 5 | Hast du schon ein Auto? | Multiple Choice | Ja | Ja · Ich suche gerade · Noch nicht, kommt später |
| 6 | Welches Auto? (Marke/Modell, falls bekannt) | Kurzantwort | Nein | |
| 7 | Könntest du über deine Eltern versichert werden (z. B. als Zweitwagen)? | Multiple Choice | Nein | Ja · Nein · Weiß ich nicht |
| 8 | Wie soll ich dich kontaktieren? | Kästchen | Ja | Anruf · WhatsApp · E-Mail |
| 9 | Fahrschule | Kurzantwort | Ja | Beschreibung: „Wird automatisch ausgefüllt.“ – **Wichtig für die 60 € Zuordnung** |
| 10 | Einwilligung | Kästchen | Ja | Text siehe unten |

**Text für die Einwilligung (Frage 10, eine Option):**

> Ich bin einverstanden, dass Kai Schindler (tecis Pforzheim) meine Angaben nutzt, um mich wegen eines unverbindlichen Angebots zur Kfz-Versicherung zu kontaktieren. Meine Einwilligung kann ich jederzeit per E-Mail an [E-Mail] widerrufen. Datenschutzhinweise: [Link]

---

## 3. Extra-Abschnitt für Unter-18-Jährige

Bei BF17-Schülern sollen die Eltern eingebunden sein.

1. Unten auf **Abschnitt hinzufügen** klicken (Symbol mit zwei Rechtecken).
2. **Titel:** Du bist unter 18?
   **Beschreibung:** Dann melde ich mich gemeinsam bei dir und deinen Eltern.
3. Fragen:
   - **Name eines Elternteils** – Kurzantwort – Pflicht
   - **Telefonnummer des Elternteils** – Kurzantwort – Pflicht
   - **Einverständnis** – Kästchen – Pflicht – „Mein Elternteil ist mit der Kontaktaufnahme einverstanden.“
4. Bei **Frage 4 (Alter)**: ⋮ → **Basierend auf der Antwort zum Abschnitt wechseln**:
   - Unter 18 → *Abschnitt 2 (Du bist unter 18?)*
   - alle anderen → *Formular senden*

Der Wechsel passiert erst, wenn Abschnitt 1 komplett ausgefüllt ist. Die Einwilligung wird also immer abgefragt.

---

## 4. Einstellungen

Zahnrad / **Einstellungen**:
- **Antworten → E-Mail-Adressen erfassen:** *Nicht erfassen*
- **Auf 1 Antwort beschränken:** **AUS** (sonst müssen sich die Schüler mit Google anmelden – das kostet viele Eintragungen)
- **Präsentation → Bestätigungsnachricht:**
  > Danke! Ich melde mich in den nächsten Tagen bei dir. – Kai Schindler, tecis Pforzheim

Reiter **Antworten**:
- **Mit Google Tabellen verknüpfen** → neue Tabelle anlegen. Dort landen alle Eintragungen inkl. Fahrschule.
- ⋮ → **E-Mail-Benachrichtigungen für neue Antworten erhalten** aktivieren.

---

## 5. Vorausgefüllten Link erstellen – und mir schicken

1. Oben rechts ⋮ → **Vorausgefüllten Link abrufen**.
2. Bei **Fahrschule** genau das eintragen: `FAHRSCHULE`
3. Alle anderen Felder leer lassen → **Link abrufen** → **Link kopieren**.
4. Den Link hier in den Chat einfügen.

Er sieht ungefähr so aus:
`https://docs.google.com/forms/d/e/1FAIpQL.../viewform?usp=pp_url&entry.123456789=FAHRSCHULE`

Ich ersetze dann `FAHRSCHULE` für jede der 44 Fahrschulen durch ihren Namen und erstelle die QR-Codes und Aufsteller.

---

## 6. Vor dem Druck testen

- Formular einmal **mit dem Handy** über einen QR-Code ausfüllen, ohne bei Google angemeldet zu sein.
- Prüfen, ob der Name der Fahrschule in der Tabelle ankommt.
