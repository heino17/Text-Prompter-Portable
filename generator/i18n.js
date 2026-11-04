/* =====================================================================
   i18n.js – Übersetzungen für die App-Oberfläche (DE/EN, erweiterbar)
   =====================================================================
   Übersetzt NUR die Benutzeroberfläche (Labels, Buttons, Meldungen,
   Tooltips). Die Dokumentinhalte (.md-Dateien) und Dateinamen sind
   Nutzerdaten und bleiben unverändert.

   Zentrales Wörterbuch: I18N[sprache][key] = "Text".
   Neue Sprachen einfach als weiteren Eintrag I18N["fr"] = {...} ergänzen.
   ===================================================================== */

var I18N = (function () {
  "use strict";

  var SPEICHER_SCHLUESSEL = "dokumente_sprache";
  var DEFAULT_SPRACHE = "de";

  var texte = {
    de: {
      titel: "Text Prompter",
      "ansicht-titel": "Dokumente anzeigen",
      "bearbeiten-titel": "Dokumente verwalten",
      menue: "Menü",
      "menue-oeffnen": "Menü öffnen",
      "menue-schliessen": "Menü schließen",
      schliessen: "Schließen",
      "menue-navigation": "Dokumenten-Menü",
      "dokumente-bearbeiten": "📝 Dokumente bearbeiten",
      "sprache-kopf": "Sprache",
      lade: "Lade Dokumente …",
      "dokument-auswaehlen": "Dokument auswählen",
      "setliste-anzeigen": "SetListe anzeigen",
      "springe-zu": "Springe zu …",
      "set-suchen": "Suchen …",
      "kein-treffer": "Kein Treffer",
      "bat-nicht-unterstuetzt": "Akku-Anzeige funktioniert nur in Chrome oder Opera",
      "bat-pop-titel": "Akku-Anzeige",
      "bat-pop-firefox": "Funktioniert nur in Chrome oder Opera – dieser Browser (Firefox/Waterfox) bietet die nötige Schnittstelle leider nicht an.",
      "bat-pop-stand": "Stand:",
      "bat-zustand-laden": "Lädt",
      "bat-zustand-akku": "Akkubetrieb",
      "bat-zustand-netz": "Netzbetrieb",
      "text-verkleinern": "Text verkleinern",
      "text-vergroessern": "Text vergrößern",
      "textgroesse": "Textgröße",
      "textgroesse-titel": "Textgröße einstellen",
      "textgroesse-reset": "↺ 100%",
      "textgroesse-reset-titel": "Auf 100% zurücksetzen",
      vollbild: "Vollbild",
      "vollbild-titel": "Vollbild (F11)",
      "vollbild-beenden": "Vollbild beenden (Esc)",
      "design-umschalten": "Helles/Dunkles Design umschalten",
      zurueck: "↩ Zurück zur Ansicht",
      "zurueck-titel": "Zurück zur Dokumentenansicht",
      neu: "+ Neu",
      "neu-titel": "Neues Dokument erstellen",
      importieren: ".md importieren",
      "importieren-titel": "Eine oder mehrere .md-Dateien importieren",
      "alle-exportieren": "Dokumente exportieren",
      "alle-exportieren-titel": "Alle {set} Dokumente als .zip herunterladen",
      "db-exportieren": "Gesamte DB speichern",
      "db-export": "DB Export",
      "db-export-titel": "DB-Export-Optionen öffnen",
      "db-exportieren-titel-file": "dokumente_datenbank.js herunterladen und im Ordner generator/ überschreiben",
      "db-exportieren-titel-server": "dokumente_datenbank.js im Ordner generator/ direkt überschreiben",
      "backup-exportieren": "Daten sichern (Backup)",
      "backup-exportieren-titel": "Alle Nutzerdaten (Dokumente, Audio, Einstellungen, Sets) als ZIP sichern",
      "backup-importieren": "Daten wiederherstellen",
      "backup-importieren-titel": "Nutzerdaten aus einem Backup-ZIP wiederherstellen",
      "backup-erfolg": "Backup erstellt: {datei}",
      "backup-import-erfolg": "Wiederherstellung erfolgreich. Seite wird neu geladen.",
      "backup-import-fehler": "Wiederherstellung fehlgeschlagen: {fehler}",
      "backup-import-bestätigung": "Alle aktuellen Daten werden durch das Backup ersetzt (Audiodateien bleiben unberührt und müssen bei Bedarf manuell aus dem ZIP kopiert werden). Fortfahren?",
      "db-alarm-titel": "Datenbank wurde geändert – Export nötig!",
      "dokumente-kopf": "Dokumente",
      "liste-leer": 'Keine Dokumente vorhanden.<br>Klicke auf „+ Neu" zum Erstellen.',
      "editor-leer": "Klick auf ein Dokument zum Bearbeiten",
      "keine-dokumente-gefundene": "Keine Dokumente gefunden.<br>Bitte lege .md-Dateien in den Ordner „dokumente/“ und führe den Generator aus (generator_node.js oder generator_python.py).",
      "titel-datname-label": "Titel / Dateiname:",
      "titel-platzhalter": "…ist auch Menü-Punkt im Dropdown",
      "titel-hinweis": "Der Titel wird so im Dropdown der Ansicht angezeigt, bzw. bestimmt und verändert auch den Dateinamen der .md in Ordner dokumente/",
      "text-platzhalter": "Text eingeben… Markdown oder einfaches HTML (z.B. Tabelle) möglich.",
      "text-hinweis": "Hinweis: Markdown-Formatierung und einfaches HTML erlaubt (z.B. Tabellen). Bei Tabellen jede Zeile mit &lt;br&gt; beenden.",
      speichern: "Speichern",
      "speichern-titel-file": "Speichern im localStorage → dann DB exportieren!",
      "speichern-titel-server": "Speichert die Datei direkt im Ordner dokumente/",
      "aenderungen-ungespeichert": "Änderungen noch nicht gespeichert!",
      "md-speichern": ".md speichern",
      "md-speichern-titel": "Als {dokument}.md im Ordner dokumente/ speichern",
      duplizieren: "Duplizieren",
      "kopie-suffix": " (Kopie)",
      "duplizieren-titel-server": "Kopie erstellen und neue Datei im Ordner dokumente/ anlegen",
      loeschen: "Löschen",
      "loeschen-titel-server": "Löscht auch die .md-Datei im Ordner dokumente/ !",
      "dokument-nicht-gefunden": "Dokument nicht gefunden",
      "gespeichert": "Gespeichert!",
      "datei-umbenannt": " (Datei umbenannt)",
      "gespeichert-in": "Gespeichert in dokumente/: ",
      "speichern-fehlgeschlagen": "Speichern fehlgeschlagen!",
      "als-gespeichert": "Als ",
      "als-gespeichert-ende": " gespeichert!",
      "download-gestartet": "Download gestartet: ",
      dupliziert: "Dupliziert!",
      geloescht: "Gelöscht!",
      "keine-md-ausgewaehlt": "Keine .md-Dateien ausgewählt.",
      "nichts-importiert": "Nichts importiert.",
      "neu-suffix": " neu",
      "aktualisiert-suffix": " aktualisiert",
      "uebersprungen-suffix": " übersprungen",
      erstellt: "Erstellt!",
      "angelegt-in": "In dokumente/ angelegt: ",
      "neues-dokument-prompt-file": "Name des neuen Dokuments:",
      "neues-dokument-prompt-server": "Name des neuen Dokuments – wird jetzt im Ordner dokumente/ erstellt:",
      "neues-dokument-default": "Neues Dokument",
      "ungespeichert-confirm": "Es gibt ungespeicherte Änderungen. Wirklich fortfahren?",
      "loeschen-confirm": 'Dokument „{name}" wirklich löschen?',
      "ueberschreiben-confirm": '„{datei}" ist bereits vorhanden ("{vorhanden}").\nMit dem Inhalt aus der importierten Datei überschreiben?',
      "jszip-fehlern": "JSZip nicht geladen!",
      "zip-exportiert": " Datei(en) als ZIP exportiert!",
      "db-gespeichert": "DB gespeichert: {ziel} ({anzahl} Dokumente, Reihenfolge übernommen)",
      "db-export-fehlgeschlagen": "DB-Export fehlgeschlagen!",
      "db-exportiert": "dokumente_datenbank.js exportiert!",
      "db-exportieren-aktiv": "Aktuelles Set als DB exportieren",
      "db-exportieren-aktiv-titel": "Nur das aktuelle Set als {datei} herunterladen",
      "db-exportiert-set": "Exportiert: {datei}",
      "db-exportiert-alle": "Alle Sets exportiert: {ziel} ({anzahl} Dokumente)",
      "markdown-datei": "Markdown-Datei",
      "ziehen-sortieren": "Ziehen zum Sortieren",
      "klick-bearbeiten": "Klick zum Bearbeiten, Ziehen zum sortieren",
      "im-viewer-anzeigen": "Im Viewer anzeigen",
      "gruppen-auswahl": "Gruppe / Set",
      "gruppen-anzeigen": "Gruppe/Set wählen",
      "neues-set": "+ Neues Set",
      "neues-set-titel": "Eine neue Gruppe/Set anlegen und als aktive Gruppe übernehmen",
      "neues-set-prompt": "Name der neuen Gruppe / des neuen Sets:",
      "neues-set-default": "Neues Set",
      "set-gewechselt": "Gruppe gewechselt: ",
      "set-erstellt": "Neue Gruppe angelegt: ",
      "gruppen-lang-tipp": "Tipp: Set lange halten zum Umbenennen/Löschen",
      umbenennen: "Umbenennen",
      "umbenennen-prompt": "Neuer Name für das Set:",
      "set-umbenannt": "Set umbenannt",
      "loeschen-set-confirm": 'Set „{name}" entfernen?\nDer Ordner und die .md-Dateien bleiben erhalten.',
      "set-entfernt": "Set entfernt",
      "set-standard-nicht-aenderbar": "Das Standard-Set kann nicht umbenannt oder entfernt werden.",
      audio: "Audio",
      "audio-player": "Audio-Player",
      "audio-abspielen": "Abspielen/Pause",
      "audio-abspielen-aria": "Abspielen",
      "audio-position": "Position",
      "audio-stop": "Stop",
      "audio-rz": "Zurück",
      "audio-vw": "Vor",
      "audio-geschwindigkeit": "Wiedergabegeschwindigkeit",
      "audio-herunterladen": "Herunterladen",
      "audio-bpm": "BPM",
      "audio-bpm-hilfe": "Tempo (Schläge pro Minute) wird während der Wiedergabe automatisch ermittelt.",
      "autoscroll-langsamer": "Langsamer scrollen",
      "autoscroll-schneller": "Schneller scrollen",
      "stimmgeraet": "🎸 Gitarren-Stimmgerät",
      "stimmgeraet-start": "Stimmgerät starten",
      "stimmgeraet-stopp": "Stimmgerät stoppen",
      "stimmgeraet-an": "An",
      "stimmgeraet-zu-tief": "zu tief",
      "stimmgeraet-zu-hoch": "zu hoch",
      "stimmgeraet-gestoppt": "Stimmgerät ist gestoppt",
      "stimmgeraet-hinweis": "Saite anklicken und spielen – das Gerät erkennt den Ton.",
      "stimmgeraet-geraet": "Audio-Eingabegerät",
      "stimmgeraet-default": "Standard",
      "stimmgeraet-kalibrierung": "Kalibrierung (A4)",
      "stimmgeraet-kalib-hinweis": "Referenzton A4: Standard 440 Hz",
      "metronom": "🎵 Metronom",
      "metronom-an": "An",
      "metronom-aus": "Aus",
      "metronom-bpm": "Tempo (BPM)",
      "metronom-lautstaerke": "Lautstärke",
      "metronom-hinweis": "Schläge pro Minute (BPM) einstellen und starten."
    },

    en: {
      titel: "Text Prompter",
      "ansicht-titel": "View documents",
      "bearbeiten-titel": "Manage documents",
      menue: "Menu",
      "menue-oeffnen": "Open menu",
      "menue-schliessen": "Close menu",
      schliessen: "Close",
      "menue-navigation": "Document menu",
      "dokumente-bearbeiten": "📝 Edit documents",
      "sprache-kopf": "Language",
      lade: "Loading documents …",
      "dokument-auswaehlen": "Select document",
      "setliste-anzeigen": "Show setlist",
      "springe-zu": "Jump to …",
      "set-suchen": "Search …",
      "kein-treffer": "No matches",
      "bat-nicht-unterstuetzt": "Battery indicator works only in Chrome or Opera",
      "bat-pop-titel": "Battery indicator",
      "bat-pop-firefox": "Works only in Chrome or Opera – this browser (Firefox/Waterfox) does not provide the required interface.",
      "bat-pop-stand": "Status:",
      "bat-zustand-laden": "Charging",
      "bat-zustand-akku": "On battery",
      "bat-zustand-netz": "Plugged in",
      "text-verkleinern": "Decrease text size",
      "text-vergroessern": "Increase text size",
      "textgroesse": "Text size",
      "textgroesse-titel": "Adjust text size",
      "textgroesse-reset": "↺ 100%",
      "textgroesse-reset-titel": "Reset to 100%",
      vollbild: "Fullscreen",
      "vollbild-titel": "Fullscreen (F11)",
      "vollbild-beenden": "Exit fullscreen (Esc)",
      "design-umschalten": "Toggle light/dark theme",
      zurueck: "↩ Back to view",
      "zurueck-titel": "Back to the document view",
      neu: "+ New",
      "neu-titel": "Create a new document",
      importieren: ".md import",
      "importieren-titel": "Import one or more .md files",
      "alle-exportieren": "Export documents",
      "alle-exportieren-titel": "Download all {set} documents as .zip",
      "db-exportieren": "Save entire DB",
      "db-export": "DB Export",
      "db-export-titel": "Open DB export options",
      "db-exportieren-titel-file": "Download dokumente_datenbank.js and overwrite it in the generator/ folder",
      "db-exportieren-titel-server": "Directly overwrite dokumente_datenbank.js in the generator/ folder",
      "backup-exportieren": "Back up data",
      "backup-exportieren-titel": "Back up all user data (documents, audio, settings, sets) as ZIP",
      "backup-importieren": "Restore data",
      "backup-importieren-titel": "Restore user data from a backup ZIP",
      "backup-erfolg": "Backup created: {datei}",
      "backup-import-erfolg": "Restore successful. Reloading page.",
      "backup-import-fehler": "Restore failed: {fehler}",
      "backup-import-bestätigung": "All current data will be replaced by the backup (audio files are left untouched and can be copied manually from the ZIP if needed). Continue?",
      "db-alarm-titel": "Database has changed – export required!",
      "dokumente-kopf": "Documents",
      "liste-leer": 'No documents available.<br>Click “+ New” to create one.',
      "editor-leer": "Click a document to edit",
      "keine-dokumente-gefundene": "No documents found.<br>Please put .md files into the folder “dokumente/” and run the generator (generator_node.js or generator_python.py).",
      "titel-datname-label": "Title / filename:",
      "titel-platzhalter": "…also a menu item in the dropdown",
      "titel-hinweis": "The title is shown in the dropdown of the view and also determines/changes the filename of the .md file in the dokumente/ folder",
      "text-platzhalter": "Enter text… Markdown or simple HTML (e.g. table) supported.",
      "text-hinweis": "Note: Markdown formatting and simple HTML are allowed (e.g. tables). For tables, end every line with &lt;br&gt;.",
      speichern: "Save",
      "speichern-titel-file": "Save to localStorage → then export DB!",
      "speichern-titel-server": "Saves the file directly in the dokumente/ folder",
      "aenderungen-ungespeichert": "Changes not saved yet!",
      "md-speichern": "Save .md",
      "md-speichern-titel": "Save {dokument}.md in the dokumente/ folder",
      duplizieren: "Duplicate",
      "kopie-suffix": " (copy)",
      "duplizieren-titel-server": "Create a copy and create a new file in the dokumente/ folder",
      loeschen: "Delete",
      "loeschen-titel-server": "Also deletes the .md file in the dokumente/ folder !",
      "dokument-nicht-gefunden": "Document not found",
      gespeichert: "Saved!",
      "datei-umbenannt": " (file renamed)",
      "gespeichert-in": "Saved in dokumente/: ",
      "speichern-fehlgeschlagen": "Saving failed!",
      "als-gespeichert": "Saved as ",
      "als-gespeichert-ende": "!",
      "download-gestartet": "Download started: ",
      dupliziert: "Duplicated!",
      geloescht: "Deleted!",
      "keine-md-ausgewaehlt": "No .md files selected.",
      "nichts-importiert": "Nothing imported.",
      "neu-suffix": " new",
      "aktualisiert-suffix": " updated",
      "uebersprungen-suffix": " skipped",
      erstellt: "Created!",
      "angelegt-in": "Created in dokumente/: ",
      "neues-dokument-prompt-file": "Name of the new document:",
      "neues-dokument-prompt-server": "Name of the new document – will be created in the dokumente/ folder:",
      "neues-dokument-default": "New document",
      "ungespeichert-confirm": "There are unsaved changes. Continue anyway?",
      "loeschen-confirm": 'Really delete document “{name}”?',
      "ueberschreiben-confirm": '“{datei}” already exists ("{vorhanden}").\nOverwrite with the content of the imported file?',
      "jszip-fehlern": "JSZip not loaded!",
      "zip-exportiert": " file(s) exported as ZIP!",
      "db-gespeichert": "DB saved: {ziel} ({anzahl} documents, order preserved)",
      "db-export-fehlgeschlagen": "DB export failed!",
      "db-exportiert": "dokumente_datenbank.js exported!",
      "db-exportieren-aktiv": "Export current set as DB",
      "db-exportieren-aktiv-titel": "Download only the current set as {datei}",
      "db-exportiert-set": "Exported: {datei}",
      "db-exportiert-alle": "All sets exported: {ziel} ({anzahl} documents)",
      "markdown-datei": "Markdown file",
      "ziehen-sortieren": "Drag to reorder",
      "klick-bearbeiten": "Click to edit, drag to reorder",
      "im-viewer-anzeigen": "Show in viewer",
      "gruppen-auswahl": "Group / Set",
      "gruppen-anzeigen": "Choose group/set",
      "neues-set": "+ New set",
      "neues-set-titel": "Create a new group/set and make it the active group",
      "neues-set-prompt": "Name of the new group / set:",
      "neues-set-default": "New set",
      "set-gewechselt": "Group switched: ",
      "set-erstellt": "New group created: ",
      "gruppen-lang-tipp": "Hint: long-press a set to rename/delete",
      umbenennen: "Rename",
      "umbenennen-prompt": "New name for the set:",
      "set-umbenannt": "Set renamed",
      "loeschen-set-confirm": 'Remove set “{name}”?\nThe folder and the .md files are kept.',
      "set-entfernt": "Set removed",
      "set-standard-nicht-aenderbar": "The default set cannot be renamed or removed.",
      audio: "Audio",
      "audio-player": "Audio Player",
      "audio-abspielen": "Play/Pause",
      "audio-abspielen-aria": "Play",
      "audio-position": "Position",
      "audio-stop": "Stop",
      "audio-rz": "Back",
      "audio-vw": "Forward",
      "audio-geschwindigkeit": "Playback speed",
      "audio-herunterladen": "Download",
      "audio-bpm": "BPM",
      "audio-bpm-hilfe": "Tempo (beats per minute) is detected automatically during playback.",
      "autoscroll-langsamer": "Scroll slower",
      "autoscroll-schneller": "Scroll faster",
      "stimmgeraet": "🎸 Guitar Tuner",
      "stimmgeraet-start": "Start tuner",
      "stimmgeraet-stopp": "Stop tuner",
      "stimmgeraet-an": "On",
      "stimmgeraet-zu-tief": "too low",
      "stimmgeraet-zu-hoch": "too high",
      "stimmgeraet-gestoppt": "Tuner is stopped",
      "stimmgeraet-hinweis": "Click a string and play – the tuner detects the note.",
      "stimmgeraet-geraet": "Audio input device",
      "stimmgeraet-default": "Default",
      "stimmgeraet-kalibrierung": "Calibration (A4)",
      "stimmgeraet-kalib-hinweis": "Reference pitch A4: standard 440 Hz",
      "metronom": "🎵 Metronome",
      "metronom-an": "On",
      "metronom-aus": "Off",
      "metronom-bpm": "Tempo (BPM)",
      "metronom-lautstaerke": "Volume",
      "metronom-hinweis": "Set beats per minute (BPM) and start."
    }
  };

  var aktuelleSprache = leseGespeichert();

  function leseGespeichert() {
    try {
      return localStorage.getItem(SPEICHER_SCHLUESSEL) || DEFAULT_SPRACHE;
    } catch (e) {
      return DEFAULT_SPRACHE;
    }
  }

  function setSprache(neueSprache) {
    if (!texte[neueSprache]) neueSprache = DEFAULT_SPRACHE;
    aktuelleSprache = neueSprache;
    try {
      localStorage.setItem(SPEICHER_SCHLUESSEL, aktuelleSprache);
    } catch (e) { /* ignorieren */ }
  }

  // Übersetzt einen Schlüssel. Platzhalter {name}, {datei}, {vorhanden}
  // werden durch vars ersetzt.
  function t(schluessel, vars) {
    var wb = texte[aktuelleSprache] || texte[DEFAULT_SPRACHE];
    var s = wb[schluessel];
    if (s === undefined) {
      s = texte[DEFAULT_SPRACHE][schluessel] !== undefined
        ? texte[DEFAULT_SPRACHE][schluessel]
        : schluessel;
    }
    if (vars) {
      for (var k in vars) {
        if (Object.prototype.hasOwnProperty.call(vars, k)) {
          s = s.split("{" + k + "}").join(vars[k]);
        }
      }
    }
    return s;
  }

  // Wendet die Übersetzung auf alle Elemente mit data-i18n an.
  function applyI18n() {
    var el = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < el.length; i++) {
      var e = el[i];
      var k = e.getAttribute("data-i18n");
      if (e.getAttribute("data-i18n-no-text") !== "1") {
        if (e.getAttribute("data-i18n-html") === "1") {
          e.innerHTML = t(k);
        } else {
          e.textContent = t(k);
        }
      }
      if (e.getAttribute("data-i18n-aria")) {
        e.setAttribute("aria-label", t(e.getAttribute("data-i18n-aria")));
      }
      if (e.getAttribute("data-i18n-title")) {
        e.setAttribute("title", t(e.getAttribute("data-i18n-title")));
      }
    }
    // <title> separat (kein data-i18n nötig):
    document.title = t("titel");
    // SetListe-Dropdown-Button zeigt anfangs den "Springe zu …"-Text
    var setAuswahl = document.getElementById("set-dropdown-auswahl");
    if (setAuswahl) setAuswahl.textContent = t("springe-zu");
  }

  // Initialisiert die Sprache aus dem localStorage (oder Standard) und
  // wendet sie sofort an, ohne neu zu laden.
  function init() {
    setSprache(leseGespeichert());
    applyI18n();
    var btnSelect = document.querySelectorAll(".sprache-btn");
    for (var i = 0; i < btnSelect.length; i++) {
      var b = btnSelect[i];
      if (b.getAttribute("data-sprache") === aktuelleSprache) {
        b.classList.add("aktiv");
      }
      b.addEventListener("click", function () {
        var neu = this.getAttribute("data-sprache");
        if (neu === aktuelleSprache) return;
        setSprache(neu);
        location.reload();
      });
    }
  }

  return {
    t: t,
    setSprache: setSprache,
    applyI18n: applyI18n,
    init: init,
    getSprache: function () { return aktuelleSprache; },
    DEFAULT: DEFAULT_SPRACHE
  };
})();
