/**
 * Kfz-Aktion Fahrschulen – erstellt das Google Formular automatisch.
 *
 * So geht's:
 * 1. https://script.google.com öffnen → „Neues Projekt“
 * 2. Den gesamten Inhalt dieser Datei einfügen (vorhandenen Code ersetzen)
 * 3. DATENSCHUTZ_LINK unten eintragen (falls schon vorhanden)
 * 4. Oben die Funktion „formularErstellen“ auswählen → „Ausführen“
 * 5. Berechtigungen bestätigen (eigenes Konto → „Erweitert“ → „Zu … wechseln“)
 * 6. Unten im „Ausführungsprotokoll“ stehen die Links zu Formular und Tabelle.
 *    In der Tabelle gibt es den Reiter „QR-Links“ mit einem Link pro Fahrschule.
 */

// ---- Einstellungen ----------------------------------------------------------
const BERATER = 'Kai Schindler';
const BUERO = 'tecis Pforzheim';
const DATENSCHUTZ_LINK = ''; // z. B. 'https://…/datenschutz' – leer = Hinweis fehlt noch
// -----------------------------------------------------------------------------

const FAHRSCHULEN = [
  'Fahrschule Britsch', 'Fahrschule Veser + Weiss', 'Fahrschule Becht', 'Fahrschule Birr',
  'Fahrschule Gisela', 'Fahrschule Weiss', 'Fahrschule X', 'Fahrschule Kirschler',
  'Fahrschule Seewald', 'Fahrschule Schwarzer', 'Fahrschule Klinger', 'Fahrschule Kunzmann',
  'Fahrschule Lieberwirth', 'Fahrschule Mikol', 'Die Autohaus Fahrschule (ahg)', 'Fahrschule Kästner',
  'Fahrschule Fischer', 'Fahrschule Six', 'Fahrschule Wallner', 'Fahrlehrerin Christa Bohrer',
  'Fahrschule No Limit', 'Tom Engel Fahrschule', 'Fahrschule Jim Engel', 'TIP Fahrschule',
  'Fahrschule Fröhlich', "Udo's Fahrschule", "Fahrschule Jörg's", 'Fahrschule Jaggy',
  'Academy Fahrschule SNH', 'Fahrschule Kölmel', 'ASS Fahrerschulung Jilke', 'Fahrlehrer Stefan Kurbel',
  'Steffens Fahrschule', 'Fahrschule Sasse', "Frank's Fahrschule", 'Fahrschule Bernd Waidner',
  'Fahrschule Patric Waidner', 'Fahrschule Jost', "Rüdiger's Fahrschule", 'Fahrschule Könne',
  'Fahrschule Zenker', 'Fahrschule Pannier', 'Fahrschule Adam', 'Fahrschule Damerius',
];

function formularErstellen() {
  const meineEmail = Session.getActiveUser().getEmail();

  const form = FormApp.create('Kfz-Aktion Fahrschulen – Interessenten');
  form.setTitle('Dein erstes Auto – unverbindliches Kfz-Versicherungsangebot')
    .setDescription(
      'Du hast bald deinen Führerschein oder schon dein erstes Auto im Blick? ' +
      'Trag dich ein, und ich melde mich mit einem unverbindlichen Angebot für deine Kfz-Versicherung. ' +
      'Ich vergleiche mehrere Versicherer und zeige dir, wie du als Fahranfänger nicht mit dem teuersten Beitrag startest.\n\n' +
      'Kostenlos und unverbindlich – du entscheidest danach selbst.\n\n' +
      BERATER + ', Finanzberater, ' + BUERO)
    .setCollectEmail(false)
    .setLimitOneResponsePerUser(false) // keine Google-Anmeldung nötig
    .setAllowResponseEdits(false)
    .setProgressBar(false)
    .setConfirmationMessage('Danke! Ich melde mich in den nächsten Tagen bei dir. – ' + BERATER + ', ' + BUERO);

  // ---- Abschnitt 1 ----
  form.addTextItem().setTitle('Vor- und Nachname').setRequired(true);
  form.addTextItem().setTitle('Handynummer').setHelpText('Für Rückruf oder WhatsApp').setRequired(true);
  form.addTextItem().setTitle('E-Mail-Adresse')
    .setValidation(FormApp.createTextValidation().requireTextIsEmail().build());
  const alter = form.addMultipleChoiceItem().setTitle('Wie alt bist du?').setRequired(true);
  form.addMultipleChoiceItem().setTitle('Hast du schon ein Auto?').setRequired(true)
    .setChoiceValues(['Ja', 'Ich suche gerade', 'Noch nicht, kommt später']);
  form.addTextItem().setTitle('Welches Auto? (Marke/Modell, falls bekannt)');
  form.addMultipleChoiceItem()
    .setTitle('Könntest du über deine Eltern versichert werden (z. B. als Zweitwagen)?')
    .setChoiceValues(['Ja', 'Nein', 'Weiß ich nicht']);
  form.addCheckboxItem().setTitle('Wie soll ich dich kontaktieren?').setRequired(true)
    .setChoiceValues(['Anruf', 'WhatsApp', 'E-Mail']);
  const fahrschule = form.addTextItem().setTitle('Fahrschule')
    .setHelpText('Wird automatisch ausgefüllt.').setRequired(true);
  form.addCheckboxItem().setTitle('Einwilligung').setRequired(true)
    .setChoiceValues([
      'Ich bin einverstanden, dass ' + BERATER + ' (' + BUERO + ') meine Angaben nutzt, um mich wegen eines ' +
      'unverbindlichen Angebots zur Kfz-Versicherung zu kontaktieren. Meine Einwilligung kann ich jederzeit per E-Mail an ' +
      meineEmail + ' widerrufen.' + (DATENSCHUTZ_LINK ? ' Datenschutzhinweise: ' + DATENSCHUTZ_LINK : ''),
    ]);

  // ---- Abschnitt 2: unter 18 ----
  const u18 = form.addPageBreakItem().setTitle('Du bist unter 18?')
    .setHelpText('Dann melde ich mich gemeinsam bei dir und deinen Eltern.');
  form.addTextItem().setTitle('Name eines Elternteils').setRequired(true);
  form.addTextItem().setTitle('Telefonnummer des Elternteils').setRequired(true);
  form.addCheckboxItem().setTitle('Einverständnis').setRequired(true)
    .setChoiceValues(['Mein Elternteil ist mit der Kontaktaufnahme einverstanden.']);

  const SUBMIT = FormApp.PageNavigationType.SUBMIT;
  alter.setChoices([
    alter.createChoice('Unter 18', u18),
    alter.createChoice('18–20', SUBMIT),
    alter.createChoice('21–24', SUBMIT),
    alter.createChoice('25 oder älter', SUBMIT),
  ]);

  // ---- Antworten-Tabelle + QR-Links ----
  const ss = SpreadsheetApp.create('Kfz-Aktion Fahrschulen – Interessenten (Antworten)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  SpreadsheetApp.flush();

  const qr = ss.insertSheet('QR-Links');
  const zeilen = [['Fahrschule', 'Formular-Link (für QR-Code)']];
  FAHRSCHULEN.forEach(function (name) {
    const url = form.createResponse()
      .withItemResponse(fahrschule.createResponse(name))
      .toPrefilledUrl();
    zeilen.push([name, url]);
  });
  qr.getRange(1, 1, zeilen.length, 2).setValues(zeilen);
  qr.getRange(1, 1, 1, 2).setFontWeight('bold');
  qr.setColumnWidth(1, 260).setColumnWidth(2, 700);

  // ---- E-Mail bei jeder neuen Eintragung ----
  ScriptApp.newTrigger('neueEintragung').forForm(form).onFormSubmit().create();

  Logger.log('Formular (zum Ausfüllen): ' + form.getPublishedUrl());
  Logger.log('Formular (bearbeiten):    ' + form.getEditUrl());
  Logger.log('Antworten-Tabelle:        ' + ss.getUrl());
  if (!DATENSCHUTZ_LINK) Logger.log('HINWEIS: DATENSCHUTZ_LINK fehlt noch – vor dem Druck ergänzen.');
}

function neueEintragung(e) {
  const werte = {};
  e.response.getItemResponses().forEach(function (r) {
    werte[r.getItem().getTitle()] = r.getResponse();
  });
  MailApp.sendEmail(
    Session.getEffectiveUser().getEmail(),
    'Kfz-Aktion: neue Eintragung – ' + (werte['Fahrschule'] || ''),
    Object.keys(werte).filter(function (k) { return k !== 'Einwilligung' && k !== 'Einverständnis'; })
      .map(function (k) { return k + ': ' + werte[k]; }).join('\n'));
}
