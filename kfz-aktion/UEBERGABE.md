Ich bin Kai Schindler, Finanzberater bei tecis Pforzheim (Kai.Schindler@tecis.de). Wir machen eine Kfz-Aktion mit Fahrschulen in Pforzheim und im Enzkreis. Bitte mach mit den offenen Aufgaben unten weiter. Nutze dafür Claude in Chrome in meinem angemeldeten Chrome.

## Die Aktion
- Ich halte in Fahrschulen einen kostenlosen 30-Minuten-Vortrag „Dein erstes Auto – Versicherung ohne Kostenfalle“. Viele Fahrschulen behandeln das Thema schon im Theorieunterricht, deshalb ist mein Angebot: Ich übernehme den Praxisteil mit echten Rechenbeispielen.
- Ein QR-Aufsteller in der Fahrschule führt auf ein Google Formular. Dort tragen sich Schüler ein, die ein unverbindliches Kfz-Versicherungsangebot wollen.
- Die Fahrschule bekommt **60 € pro Empfehlung, aus der ein Kunde wird**. Das läuft als Tippgeber-Modell: Die Fahrschule vermittelt nur, sie berät nicht (§34d GewO). Dazu kommt eine schriftliche Vereinbarung.
- Mein Kollege **Marvin Mönig** ist auf Gewerbefahrzeuge spezialisiert und versichert Fahrschulautos. Das ist ein Zusatzangebot, es steht im P.S. der Mail.

## Was schon fertig ist
GitHub-Repo `kaiderhai3000/1`, Branch `claude/sweet-wright-6107qu`, Ordner `kfz-aktion/`:
- `Kfz-Aktion_Fahrschulen_Pforzheim_Enzkreis.xlsx`: 44 Fahrschulen (16 in Pforzheim, 28 im Enzkreis) mit Spalten zum Nachverfolgen, 60 € Provision (Übersicht!G4) und Spalte „Interesse Flotte (Marvin)“
- `Kfz-Aktion_Anschreiben_Fahrschulen.md`: Erst-Mail, Nachfass-Mail, Telefonleitfaden mit Einwänden, Regeln für Tippgeber und Datenschutz
- `formular-erstellen.gs`: Apps Script, das das Formular erstellt hat (schon ausgeführt)
- `Kfz-Aktion_Google-Formular_Anleitung.md`: Anleitung zum Formular
- `aufsteller_erstellen.py`, `qr-links.csv`, `Aufsteller_Fahrschulen.pdf`: 44 QR-Aufsteller (A4), alle QR-Codes geprüft

In meinem Google-Konto (kai.schindler96@googlemail.com):
- Formular „Dein erstes Auto – unverbindliches Kfz-Versicherungsangebot“: https://docs.google.com/forms/d/e/1FAIpQLSe-ihE6oyAauvBkGAgTtipp9KImX7EN4bwDdanxJq7vx106XA/viewform
- Antworten-Tabelle „Kfz-Aktion Fahrschulen – Interessenten (Antworten)“: https://docs.google.com/spreadsheets/d/12I1x4rQF0qdQQ9zEb6q2GKFEXXfWKVQ6dl2nFO3AC2k/edit (Reiter „QR-Links“ mit einem Link pro Fahrschule; das Feld Fahrschule wird über den Parameter entry.889737850 vorausgefüllt)
- Apps-Script-Projekt „Unbenanntes Projekt“ auf script.google.com (enthält den Trigger, der bei jeder neuen Eintragung eine Benachrichtigungs-Mail schickt)

## Offene Aufgaben
1. **Formular bearbeiten** (forms.google.com → das Formular oben): Bei der Frage „Einwilligung“ im Text der Antwortmöglichkeit meine Googlemail-Adresse durch **Kai.Schindler@tecis.de** ersetzen. Danach soll der Text so lauten: „Ich bin einverstanden, dass Kai Schindler (tecis Pforzheim) meine Angaben nutzt, um mich wegen eines unverbindlichen Angebots zur Kfz-Versicherung zu kontaktieren. Meine Einwilligung kann ich jederzeit per E-Mail an Kai.Schindler@tecis.de widerrufen.“
2. **Apps Script bearbeiten** (script.google.com → „Unbenanntes Projekt“): In der Funktion `neueEintragung` die Zeile `Session.getEffectiveUser().getEmail(),` durch `'Kai.Schindler@tecis.de',` ersetzen und speichern. Nicht neu ausführen, sonst entsteht ein zweites Formular.
3. **Testen**: Formular über einen QR-Link ausfüllen und prüfen, ob die Eintragung mit der Fahrschule in der Tabelle steht und die Benachrichtigung ankommt. Die Test-Zeile danach löschen.
4. **Noch offen bei mir**: Link zu einem Datenschutzhinweis im Einwilligungstext ergänzen. Mit der tecis-Compliance klären, ob Google Formular und privates Konto in Ordnung sind und wie die Tippgeber-Vereinbarung aussehen soll. Telefon und Büroadresse in die Mailvorlage eintragen.
5. **Ideen für danach**: Folien für den Vortrag, Tippgeber-Vereinbarung als Vorlage, Telefonnummern der 24 Fahrschulen nachrecherchieren, bei denen sie fehlen.
