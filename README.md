# Text Prompter

🇩🇪 **Deutsch**

Lokaler Markdown-Dokumenten-Viewer mit Editor für `.md`-Dateien – als
**portable, komplette Anwendung** (Windows **und** Linux, ohne Installation).

Das gesamte Projekt ist zugleich die portable Mappe: Es startet über
`Windows-start.bat` (Windows) bzw. `Linux-start.sh` (Linux) einen kleinen lokalen Server,
der die App im Browser öffnet und `.md`-Dateien direkt liest/schreibt.

## Starten

### Windows
Doppelklick auf **`Windows-start.bat`** – der Browser öffnet automatisch die Dokumenten-Ansicht
unter `http://localhost:8080/dokumente_anzeigen.html`.

### Linux
**`Linux-start.sh`** starten (ggf. einmalig `chmod +x Linux-start.sh`).
Auch hier öffnet der Browser direkt die Dokumenten-Ansicht unter
`http://localhost:8080/dokumente_anzeigen.html`.

Das Terminal / schwarze Fenster muss am Laufen bleiben, solange du die App
benutzt. Beenden: Fenster schließen oder `Strg+C`.

> **Hinweis:** `Windows-start.bat` erkennt die System-Architektur automatisch und
> wählt das passende Windows-Node aus (`node32.exe` für 32-Bit/x86,
> `node64.exe` für 64-Bit/x64) – das Paket funktioniert auf jedem Rechner,
> egal welche Windows-Version.

## Startseite (index.html)

Beim Öffnen als `file://` (ohne Server) landet man zuerst auf der Startseite
`index.html` – mit drei übersichtlichen Karten:

- **Dokumente anzeigen** (hervorgehoben) – öffnet `dokumente_anzeigen.html`
  direkt, funktioniert auch ohne Server über `file://`
- **Windows-Server starten** – „Wie starten?“ zeigt per Dialog (Modal) die
  Schritt-für-Schritt-Anleitung mit Doppelklick auf `Windows-start.bat`
- **Linux-Server starten** – „Wie starten?“ zeigt per Dialog (Modal) die
  Anleitung mit `chmod +x` und `./Linux-start.sh`

Die Startseite ist zudem **DE/EN-umschaltbar** (Sprachumschalter oben) und
folgt dem **Dark/Light-Theme**. Hinweis zur Sicherheit: Browser können die
Server-Skripte nicht per Klick starten – du musst sie im Dateimanager mit
Doppelklick öffnen (das Terminal bleibt dann offen und startet den Server).

## Projektstruktur

```
Text_Prompter_Arbeits_Ordner/
├── Windows-start.bat       # Windows: Doppelklick
├── Linux-start.sh          # Linux:   starten
├── dokumente_anzeigen.html # Single-Page-App: Viewer + Editor in einer Datei
├── index.html              # Startseite mit 3 Karten (Datei-/Server-Zugang, DE/EN, Theme)
├── dokumente/              # .md-Dateien (Inhalte) – werden live gelesen/geschrieben
│   ├── *.md                # Standard/Set 1 (Wurzelordner)
│   └── <Set-Ordner>/       # jedes weitere Set/Gruppe als eigener Unterordner
├── verlinkte_audiodateien/ # .mp3/.wav zum Dokument (gleicher Basisname → 🔊 im Header)
├── generator/              # Bibliotheken, Server & generierte Daten
│   ├── server.js           # Mini-Server (App + .md-Lesen/Speichern via HTTP)
│   ├── i18n.js             # DE/EN-Übersetzungen der Oberfläche
│   ├── marked.js           # Markdown-zu-HTML (offline)
│   ├── jszip.min.js        # ZIP-Export
│   ├── generator_node.js   # (optional) manueller Datenbank-Generator
│   ├── dokumente_datenbank.js  # Generierte Daten (für file://-Modus)
│   ├── einstellungen_dokumente.js # Portable Einstellungen, vom Server gepflegt
│   ├── sets.json           # Listet das aktive Set (Gruppe)
│   └── sets/               # Metadaten je Set: Name, Reihenfolge, Sichtbarkeit
│       └── Standard.json
│   └── favicon-12ML-32/96/180/192.png  # Favicons (Tab, Apple-Touch, Android)
├── node/                   # portable Node-Runtimes (abgespeckt: nur die Kern-Binaries)
│   ├── win/
│   │   ├── node32.exe      # für Windows 32-Bit (x86)
│   │   └── node64.exe      # für Windows 64-Bit (x64)
│   └── linux/              # portables Node für Linux (nur bin/node)
└── ANLEITUNG.txt           # Kurzanleitung für Endnutzer
```

## Features

### Viewer
- Dokumente anzeigen, durchblättern (⛶ Vollbild / F11, Esc zum Beenden)
- **Mehrere Sets/Gruppen** – Umschalter im Header wechselt das aktive Set
  (jeder Gruppe ist ein eigener Unterordner in `dokumente/` zugeordnet); neue
  Sets lassen sich direkt dort anlegen. Das angezeigte Set wird gemerkt.
- **Dokumenten-Auswahl** – Custom-Dropdown mit Suchfeld (live filtert, Reihenfolge bleibt);
  die Breite wächst mit dem längsten Titel (kein Abschneiden, Überlappung ausgeschlossen)
- **Textgröße pro Dokument** – Klick auf die Prozentanzeige `100%` im Header öffnet
  ein Popover mit **Schieberegler (70–222 %)**, darunter −/+-Buttons (ein Tipp = 1 %,
  gedrückt halten = wiederholt zählen) und `↺`-Reset auf 100 %; die Größe wird pro
  Dokument gespeichert
  - **Zoom per Tastatur/Maus:** `STRG+Mausrad`, `STRG+Plus`/`STRG+Minus` und
    `STRG+0` (Reset auf 100 %) – 1-%-Schritte, wird pro Dokument gespeichert;
    beim `STRG+Mausrad` wird das normale Scrollen unterbrochen
- **Durchblättern mit der Tastatur** – `⬆` = vorheriger, `⬇` = nächster Text
- **Dark/Light-Theme** – Umschalter im Header (localStorage)
- **Akku-Anzeige** im Header (rechts) – Live-Updates über die Battery Status API,
  mit **Long-Press-Popover** (Details & Erklärung):

  **Zustände (Symbol → Ampel → Blinken):**
  - 🪫 **≤ 31 %** – rot, **blinkt** (gleiche Blink-Animation wie beim Laden)
  - 🔋 **32–49 %** – golden
  - 🔋 **≥ 50 %** – grün
  - ⚡ **beim Laden** – blinkt (Blitz-Symbol)
  - 🔌 **Netzbetrieb** (100 % geladen + Ladung aktiv) – grün, **nicht** blinkend, zeigt "100 %"

  **Browser-Unterschiede:**
  - **Chrome / Opera / Brave / Chromium** – die Battery API wird unterstützt,
    die Akku-Anzeige zeigt alle Zustände & den Netzbetrieb vollständig
  - **Firefox / Waterfox** – keine Battery API → die Anzeige bleibt sichtbar,
    aber zeigt nur `🔋 ?`; Tooltip & Long-Press-Popover erklären, dass die
    Akku-Anzeige nur in Chrome/Opera/Chromium funktioniert
- **Scroll-Andocken** – Seiten springen exakt unter den Header (beide Wischrichtungen)
- **Auto-Scroll** – Tippe auf den Text: der Inhalt scrollt automatisch weiter und
  stoppt am Dokumentende von selbst (erneutes Tippen stoppt). Die Scroll-Geschwindigkeit
  lässt sich über die beim Start kurz eingeblendeten −/+ einstellen (ein Tipp = 1 Schritt,
  gedrückt halten = wiederholt zählen) und wird pro Dokument gespeichert. Tippen auf
  Links oder bei Textauswahl startet nicht.
- **Portable Einstellungen** – Textgrößen und Auto-Scroll-Geschwindigkeiten
  wandern mit dem App-Ordner. Im Server-Modus schreibt der Browser sie in
  `generator/einstellungen_dokumente.js` (vom Server gepflegt, nicht von Hand
  bearbeiten); unter `file://` dient diese Datei als Fallback, lokale Änderungen
  bleiben im localStorage.
- **Audioplayer** – gehörte Audiodateien direkt zum Dokument abspielen. Liegt im
  Ordner `verlinkte_audiodateien/` eine Datei mit gleichem Basisnamen (`.mp3`
  oder `.wav`), erscheint im Header das 🔊-Icon. Der Player (Play/Pause/Stop,
  ⟲ 10 s zurück / ⟳ 10 s vor) öffnet sich als Popover – **in beiden
  Ansichten** (Viewer & Editor). Das Seek funktioniert auch in Chrome, weil der
  Server **Range-Requests (HTTP 206 Partial Content)** unterstützt.
- **BPM-Anzeige** – während eine Audiodatei spielt, ermittelt der Player
  **live das Tempo** (Beats per Minute) und zeigt es im Popover an (Zeile
  „BPM"). Technik: **Onset-Detection** über den Spektrum-Fluss (positive
  Bandenergie-Differenzen im Mid-Bereich) plus **Tempo-Autokorrelation** über
  ein laufendes Fenster (~4 s, Bereich **60–200 BPM**, per Median geglättet).
  Ohne zuverlässiges Ergebnis oder bei Pause erscheint „–". Erkennt automatisch
  auch die Wiedergabegeschwindigkeit (0.5×/1.5×/… verändert das gemessene
  Tempo mit).

### 🎸 Gitarren-Stimmgerät (im Menü #menu-panel)
- **Chromatischer Stimmer für 6 Saiten** (Standard-Stimmung E A D G B e) mit
  **Echtzeit-Anzeige** der erkannten Note, der Abweichung in **Cent** und einem
  **Meter** (Balken + Nadel, ♭/♯).
- **Pitch-Erkennung:** Harmonic Product Spectrum (HPS) mit eigener Radix-2-FFT
  (4× Zero-Padding, Hann-Fenster) + parabolischer Interpolation. Das HPS
  verstärkt gezielt den **Grundton** gegen lauterere Obertöne – wichtig für die
  tiefen Saiten E/A/D, die sonst als Oberton fehlinterpretiert werden.
- **Saite antippen:** Ein Klick auf eine Saite erzwingt dieses Ziel
  (erzwungene Zuordnung). Ein zweiter Klick (oder Automatik) erkennt die Saite
  frei. Die Auto-Erkennung bevorzugt die **direkte** (h=1) Zuordnung und nutzt
  eine **Oberton-Reduktion** nur als Fallback; eine **Hysterese** verhindert das
  Springen zwischen fast gleichwertigen Saiten (v. a. e ↔ E).
- **Stabilität & Rausch-Gating:** Ein Ton erscheint erst nach Bestätigung über
  mehrere Frames (geglätteter Wert, „Alter" wie bei pitchy) und nur, wenn die
  Spitze deutlich über dem Grundrauschen liegt (lokaler Peak, ≥ 6 dB) – gegen
  Flackern und Hintergrundrauschen.
- **Kalibrierung (A4):** Der Referenz-Stimmton ist über ein Dropdown von
  **430–450 Hz** einstellbar (Standard **440 Hz**). Alle Saiten-Ziele und die
  Note-Namen werden entsprechend skaliert; die **gewählte Kalibrierung wird
  gemerkt** (localStorage) und beim nächsten Start wiederhergestellt.
- **Audio-Eingabegerät:** wählbar per Dropdown (für USB-Gitarren-Interfaces);
  beim Wechsel wird bei laufendem Stimmer automatisch neu gestartet. Die
  gewählte **Eingabequelle wird gemerkt** (localStorage) und beim nächsten
  Start wiederhergestellt.
- *Bedienhinweis:* Wie bei jedem Stimmgerät auf Pegel, Treiber und die richtige
  Zupf-Technik achten – ggf. 2–3 Versuche, bis die beste Einstellung sitzt.

### Editor (über das Menü: 📝 Dokumente bearbeiten)
- **Mehrere Sets/Gruppen** – eigener Set-Umschalter im Editor-Header; wechselt die
  aktive Gruppe und lädt deren Dokumente. „+ Neues Set" legt eine leere Gruppe an,
  die sofort aktiv wird.
- Dokumentenliste mit Vorschau
- **Drag & Drop** für die Reihenfolge (⠿-Handle) – **wird dauerhaft gespeichert**
  (im Server-Modus in `generator/sets/<set>.json`, unter `file://` im localStorage);
  nicht gelistete Dokumente hängen alphabetisch am Ende
- **Toggle-Switch** – Dokument im Viewer anzeigen/verstecken
- **Editor** – Titel-Feld + Textbereich für den Inhalt
- Buttons: **Speichern**, **Duplizieren**, **Löschen** (mit Bestätigung)
- **Export:**
  - "Dokumente exportieren" – alle `.md`-Dateien des aktiven Sets als ZIP
    (jede Datei beginnt mit `# <Dateiname>` als Überschrift)
  - "DB Export" (Dropdown): "DB exportieren" erzeugt `dokumente_datenbank.js`
    **aller Sets** (jeder Eintrag mit `set`/`setName` ausgezeichnet);
    "Aktuelles Set exportieren" lädt nur das aktive Set als
    `<Setname>_dokumente_datenbank.js` herunter
    (z.B. `12_months_later_dokumente_datenbank.js`, `Tom_s_Band_dokumente_datenbank.js`)
  - **"Daten sichern / wiederherstellen"** (im "DB Export"-Dropdown):
    - "Daten sichern (Backup)" erzeugt ein ZIP mit **allen** Nutzerdaten
      (Dokumente aller Sets, Audio, Einstellungen, Set-Metadaten) plus
      `backup.json` – für Archiv, Weitergabe oder Wiederherstellung.
    - "Daten wiederherstellen" spielt ein Backup-ZIP wieder ein; Audiodateien
      bleiben dabei unberührt (können bei Bedarf manuell aus dem ZIP
      in `verlinkte_audiodateien/` kopiert werden).
- **".md importieren"** – eine oder mehrere `.md`-Dateien einlesen
  (Titel wird aus der ersten `# Überschrift` ermittelt, sonst aus dem Dateinamen)

> **Überschriften-Handling:** Der Titel eines Dokuments steht nur noch an
> einer Stelle (im Dropdown der Ansicht). Die `.md`-Inhalte selbst enthalten
> keine `# <Titel>`-Zeile; beim ZIP-Export wird die Überschrift automatisch
> ergänzt (einmal pro Datei).

## Server

Die App erkennt den Servernodus automatisch (sobald sie über
`http(s)://` geladen wird) und arbeitet dann direkt mit den `.md`-Dateien in
`dokumente/`:

- **Anzeige:** Der Viewer lädt die Dokumente live vom Server – kein
  manuelles `dokumente_datenbank.js`-Update nötig.
- **Mehrere Sets/Gruppen:** Jede Gruppe ist ein Unterordner in `dokumente/`.
  Das **aktive Set** bestimmt, welche Gruppe angezeigt/bearbeitet wird
  (gespeichert in `generator/sets.json`; Namens-/Sortier-/Sichtbarkeitsdaten je
  Gruppe in `generator/sets/<set>.json`). Das Standard-Set ist `dokumente/`
  selbst.
- **Speichern:** "Speichern", ".md speichern", "+ Neu" und "Duplizieren"
  schreiben die `.md` direkt in den Ordner des **aktiven Sets** (kein Speicher-Dialog).
- **Löschen:** entfernt die `.md`-Datei aus dem Ordner des aktiven Sets.
- **"← Zurück zur Ansicht"** lädt den Server-Stand neu.
- **Audio ausliefern:** Dateien aus `verlinkte_audiodateien/` werden unter
  `/verlinkte_audiodateien/…` ausgeliefert. Der Server beantwortet
  `Range`-Requests mit **HTTP 206 Partial Content** (inkl. `Accept-Ranges`),
  damit das Spulen im Player **auch in Chrome** funktioniert (Firefox toleriert
  fehlende Ranges, Chrome nicht).
- Unter `file://` bleibt ein reiner Offline-Betrieb möglich (nur das eine
  Standard-Set aus `dokumente_datenbank.js`).

### Server-Endpoints

- `GET  /api/sets`  → listet alle Sets + das aktive Set
  (`{ "ok":true, "aktiv":"Standard", "sets":[{"id":"Standard","name":"Set 1"}] }`)
- `POST /api/sets/aktiv`  → wechselt das aktive Set (Body: `{ "id": "…" }`)
- `POST /api/sets/neu`  → legt ein neues Set/Unterordner an und macht es aktiv
  (Body: `{ "name": "…" }`)
- `GET  /api/dokumente`  → listet alle `.md` **des aktiven Sets** als DOKUMENTE-Array (JSON)
- `POST /api/speichern`  → schreibt eine `.md` in das aktive Set
  (Body: `{ "datei": "Name.md", "inhalt": "…" }`)
- `POST /api/loeschen`   → löscht eine `.md` aus dem aktiven Set (Body: `{ "datei": "Name.md" }`)
- `POST /api/reihenfolge` → speichert die Drag&Drop-Reihenfolge des aktiven Sets
  (Body: `{ "reihenfolge": ["a.md", …] }`)
- `POST /api/sichtbarkeit` → speichert die Sichtbarkeit des aktiven Sets
  (Body: `{ "sichtbarkeit": {"a.md": true, …} }`)
- `POST /api/db-export`  → erzeugt `generator/dokumente_datenbank.js` aus dem
  aktiven Set (optional mit `{ "dokumente": […] }` für die gewünschte Reihenfolge);
  mit `{ "alle": true, "dokumente": […] }` aus **allen Sets** (jeder Eintrag mit
  `set`/`setName` ausgezeichnet)
- `POST /api/db-export-set` → liefert das aktive Set als Download
  (`{ "dateiname": "<Setname>_dokumente_datenbank.js", "inhalt": "…" }`)
- `GET  /api/backup` → liefert **alle** Nutzerdaten als JSON (Dokumente aller
  Sets, Audio als Base64, Einstellungen, Set-Metadaten) – für Backup/ZIP-Export
- `POST /api/restore` → stellt Nutzerdaten aus einem Backup wieder her
  (Body: Backup-JSON; Audiodateien werden dabei ignoriert)

## Portable Weitergabe an andere

Das ganze Projekt ist bereits eine portable Mappe – **keine Installation
nötig** (weder Node noch Python). Beide Node-Runtimes (Windows 32/64-Bit +
Linux) liegen im Ordner.

> **Abgespeckte Node-Laufzeiten:** Die App braucht nur die einfachen Core-Module
> (`http`, `fs`, `path` – keine npm-Pakete). Deshalb liegen im `node/`-Ordner nur
> die einzelnen Kern-Binaries (`bin/node`, `node32.exe`, `node64.exe`) und keine
> npm/npx/corepack-Bestandteile. Das reduziert die Paketgröße von ~371 MB auf
> ~265 MB, ohne irgendwelche Funktionen oder Plattform-Support (inkl.
> Windows-32-Bit) zu verlieren.

**Für den Anwender:** Den gesamten Ordner als ZIP weitergeben → entpacken →
`Windows-start.bat` (Windows) bzw. `Linux-start.sh` (Linux) starten → der Browser öffnet
automatisch `http://localhost:8080/dokumente_anzeigen.html`.

**Für den Geber (einmalig):** Die portablen Node-Versionen (ZIP von
nodejs.org) in `node/win/` (`node32.exe`/`node64.exe`) und `node/linux/`
entpacken, **die unnötigen Dateien entfernen** (`npm`/`npx`/`corepack`,
`node_modules/`, `include/`, `share/`, `CHANGELOG.md`, `README.md` – nur das
`bin/node`-Binary bzw. die `.exe`-Dateien sind nötig), dann zippen und
verschicken.

## Technisches

- **marked.js** – Markdown-zu-HTML (lokal, offline-fähig)
- **JSZip** – ZIP-Export im Browser
- **localStorage** – Einstellungen (Theme, Textgrößen) bleiben erhalten
- **Einstellungsdatei** – im Server-Modus schreibt `server.js` Textgrößen +
  Auto-Scroll-Tempi nach `generator/einstellungen_dokumente.js` (portabel)
- **Kein CDN** – funktioniert komplett offline
- **Server:** nur Node-eigene Module (`http`, `fs`, `path`), keine Installation
- **Range-Requests:** der Server liefert MP3/WAV mit `Accept-Ranges: bytes` und
  beantwortet Range-Header mit HTTP 206 – Voraussetzung für das Spulen im
  Chrome-Audioplayer.

---

*Zuletzt aktualisiert: 04.11.2026*

---

## 🇺🇸 English

# Text Prompter

Local Markdown document viewer with an editor for `.md` files – as a
**portable, complete application** (Windows **and** Linux, no installation).

The whole project is at the same time the portable case: `Windows-start.bat`
(Windows) or `Linux-start.sh` (Linux) starts a small local server that opens
the app in the browser and reads/writes `.md` files directly.

## Getting Started

### Windows
Double-click **`Windows-start.bat`** – the browser automatically opens the document view
at `http://localhost:8080/dokumente_anzeigen.html`.

### Linux
Run **`Linux-start.sh`** (if necessary, run `chmod +x Linux-start.sh` once).
Here too, the browser opens the document view directly at
`http://localhost:8080/dokumente_anzeigen.html`.

The terminal / black window must stay open while you use the app.
To quit: close the window or press `Ctrl+C`.

> **Note:** `Windows-start.bat` auto-detects the system architecture and picks
> the appropriate Windows Node (`node32.exe` for 32-bit/x86,
> `node64.exe` for 64-bit/x64) – the package works on any machine,
> regardless of the Windows version.

## Start Page (index.html)

When opened as `file://` (without a server) you first land on the start page
`index.html` – with three clear cards:

- **View documents** (highlighted) – opens `dokumente_anzeigen.html`
  directly, works even without a server via `file://`
- **Start Windows server** – "How to start?" shows a step-by-step guide
  (modal dialog) with a double-click on `Windows-start.bat`
- **Start Linux server** – "How to start?" shows a guide (modal dialog)
  for `chmod +x` and `./Linux-start.sh`

The start page is also **DE/EN switchable** (language switch at the top) and
follows the **Dark/Light theme**. Security note: browsers cannot launch the
server scripts by clicking – you must open them with a double-click in the
file manager (the terminal stays open and starts the server).

## Project Structure

```
Text_Prompter_Arbeits_Ordner/
├── Windows-start.bat       # Windows: double-click
├── Linux-start.sh          # Linux:   start
├── dokumente_anzeigen.html # Single-page app: viewer + editor in one file
├── index.html              # Start page with 3 cards (file/server access, DE/EN, theme)
├── dokumente/              # .md files (contents) – read/written live
│   ├── *.md                # Default/Set 1 (root folder)
│   └── <Set folder>/       # each further set/group as its own subfolder
├── verlinkte_audiodateien/ # .mp3/.wav for the document (same base name → 🔊 in header)
├── generator/              # Libraries, server & generated data
│   ├── server.js           # Mini server (app + .md read/save via HTTP)
│   ├── i18n.js             # DE/EN translations of the UI
│   ├── marked.js           # Markdown-to-HTML (offline)
│   ├── jszip.min.js        # ZIP export
│   ├── generator_node.js   # (optional) manual database generator
│   ├── dokumente_datenbank.js  # Generated data (for file:// mode)
│   ├── einstellungen_dokumente.js # Portable settings, maintained by the server
│   ├── sets.json           # Lists the active set (group)
│   ├── sets/               # Metadata per set: name, order, visibility
│   │   └── Standard.json
│   └── favicon-12ML-32/96/180/192.png  # Favicons (tab, Apple-Touch, Android)
├── node/                   # Portable Node runtimes (slimmed: only core binaries)
│   ├── win/
│   │   ├── node32.exe      # for Windows 32-bit (x86)
│   │   └── node64.exe      # for Windows 64-bit (x64)
│   └── linux/              # portable Node for Linux (only bin/node)
└── ANLEITUNG.txt           # Quick guide for end users
```

## Features

### Viewer
- View and browse documents (⛶ fullscreen / F11, Esc to exit)
- **Multiple sets/groups** – the switcher in the header changes the active set
  (each group is its own subfolder in `dokumente/`); new sets can be created
  directly there. The shown set is remembered.
- **Document selection** – custom dropdown with search field (filters live, keeps order);
  the width grows with the longest title (no truncation, overlap excluded)
- **Text size per document** – click the `100%` percentage display in the header to
  open a popover with a **slider (70–222 %)**, with −/+ buttons below (one tap = 1 %,
  press and hold = counts repeatedly) and a `↺` reset to 100 %; the size is saved per
  document
  - **Zoom via keyboard/mouse:** `Ctrl+Mouse wheel`, `Ctrl+Plus`/`Ctrl+Minus` and
    `Ctrl+0` (reset to 100 %) – 1-% steps, saved per document;
    with `Ctrl+Mouse wheel` normal scrolling is interrupted
- **Keyboard paging** – `↑` = previous, `↓` = next text
- **Dark/Light theme** – toggle in the header (localStorage)
- **Battery indicator** in the header (right) – live updates via the Battery Status API,
  with **long-press popover** (details & explanation):

  **States (symbol → traffic light → blinking):**
  - 🪫 **≤ 31 %** – red, **blinking** (same blink animation as while charging)
  - 🔋 **32–49 %** – golden
  - 🔋 **≥ 50 %** – green
  - ⚡ **while charging** – blinking (lightning icon)
  - 🔌 **plugged in** (100 % charged + charging active) – green, **not** blinking, shows "100 %"

  **Browser differences:**
  - **Chrome / Opera / Brave / Chromium** – the Battery API is supported,
    the battery indicator shows all states & charging completely
  - **Firefox / Waterfox** – no Battery API → the indicator stays visible,
    but only shows `🔋 ?`; tooltip & long-press popover explain that the
    battery indicator only works in Chrome/Opera/Chromium
- **Scroll anchoring** – pages snap exactly below the header (both swipe directions)
- **Auto-scroll** – tap on the text: the content scrolls automatically and
  stops by itself at the end of the document (tapping again stops). The scroll speed
  can be set via the briefly shown −/+ controls (one tap = 1 step, press and hold =
  counts repeatedly) and is saved per document. Tapping on links or during text
  selection does not start.
- **Portable settings** – text sizes and auto-scroll speeds travel with the app folder.
  In server mode the browser writes them to
  `generator/einstellungen_dokumente.js` (maintained by the server, don't edit
  by hand); under `file://` this file serves as fallback, local changes
  stay in localStorage.
- **Audio player** – play audio files linked directly to the document. If a file
  with the same base name (`.mp3` or `.wav`) exists in the `verlinkte_audiodateien/`
  folder, the 🔊 icon appears in the header. The player (Play/Pause/Stop,
  ⟲ 10 s back / ⟳ 10 s forward) opens as a popover – **in both views**
  (Viewer & Editor). Seek works even in Chrome, because the server supports
  **range requests (HTTP 206 Partial Content)**.
- **BPM display** – while an audio file plays, the player detects **the tempo
  live** (beats per minute) and shows it in the popover ("BPM" line). Technique:
  **onset detection** via spectral flux (positive band-energy differences in the
  mid-range) plus **tempo autocorrelation** over a running window (~4 s, range
  **60–200 BPM**, smoothed by median). Without a reliable result or while paused
  "–" appears. It also automatically detects the playback speed (0.5×/1.5×/…
  changes the measured tempo).

### 🎸 Guitar Tuner (in the #menu-panel menu)
- **Chromatic tuner for 6 strings** (standard tuning E A D G B e) with
  **real-time display** of the detected note, deviation in **cents** and a
  **meter** (bar + needle, ♭/♯).
- **Pitch detection:** Harmonic Product Spectrum (HPS) with a custom radix-2 FFT
  (4× zero-padding, Hann window) + parabolic interpolation. HPS amplifies the
  **fundamental** specifically against louder overtones – important for the low
  strings E/A/D, which would otherwise be misinterpreted as overtones.
- **Tap a string:** a click on a string forces that target (forced mapping).
  A second click (or automatic mode) detects the string freely. Auto-detection
  prefers the **direct** (h=1) mapping and uses **overtone reduction** only as
  a fallback; **hysteresis** prevents jumping between nearly equivalent strings
  (esp. e ↔ E).
- **Stability & noise gating:** a note appears only after confirmation over
  several frames (smoothed value, "age" like in pitchy) and only if the peak is
  clearly above the noise floor (local peak, ≥ 6 dB) – against flickering and
  background noise.
- **Calibration (A4):** the reference tuning note is selectable via a dropdown
  from **430–450 Hz** (default **440 Hz**). All string targets and note names
  are scaled accordingly; the **selected calibration is remembered**
  (localStorage) and restored on the next start.
- **Audio input device:** selectable via dropdown (for USB guitar interfaces);
  when changed, the tuner restarts automatically while running. The selected
  **input source is remembered** (localStorage) and restored on the next start.
- *Usage note:* As with any tuner, watch out for level, drivers and correct
  picking technique – possibly 2–3 attempts until the best setting is found.

### Editor (via the menu: 📝 Edit documents)
- **Multiple sets/groups** – own set switcher in the editor header; switches the
  active group and loads its documents. "+ New set" creates an empty group
  that becomes active immediately.
- Document list with preview
- **Drag & drop** for the order (⠿ handle) – **saved permanently**
  (in server mode in `generator/sets/<set>.json`, under `file://` in localStorage);
  unlisted documents are appended alphabetically at the end
- **Toggle switch** – show/hide a document in the viewer
- **Editor** – title field + text area for the content
- Buttons: **Save**, **Duplicate**, **Delete** (with confirmation)
- **Export:**
  - "Export documents" – all `.md` files of the active set as ZIP
    (each file starts with `# <filename>` as heading)
  - "DB Export" (dropdown): "Export DB" creates `dokumente_datenbank.js`
    of **all sets** (each entry tagged with `set`/`setName`);
    "Export current set" downloads only the active set as
    `<Setname>_dokumente_datenbank.js`
    (e.g. `12_months_later_dokumente_datenbank.js`, `Tom_s_Band_dokumente_datenbank.js`)
  - **"Back up / Restore data"** (in the "DB Export" dropdown):
    - "Back up data" creates a ZIP with **all** user data
      (documents of all sets, audio, settings, set metadata) plus
      `backup.json` – for archiving, sharing or restoring.
    - "Restore data" restores a backup ZIP; audio files are left untouched
      (can be copied manually from the ZIP into `verlinkte_audiodateien/`
      if needed).
- **"Import .md"** – read one or more `.md` files
  (title is taken from the first `# heading`, otherwise from the file name)

> **Heading handling:** The title of a document now appears in only one place
> (in the view dropdown). The `.md` contents themselves don't contain a
> `# <Title>` line; the ZIP export adds the heading automatically
> (once per file).

## Server

The app detects server mode automatically (as soon as it is loaded via
`http(s)://`) and then works directly with the `.md` files in `dokumente/`:

- **Display:** the viewer loads the documents live from the server – no
  manual `dokumente_datenbank.js` update needed.
- **Multiple sets/groups:** each group is a subfolder in `dokumente/`.
  The **active set** determines which group is shown/edited
  (stored in `generator/sets.json`; name/order/visibility data per
  group in `generator/sets/<set>.json`). The default set is `dokumente/`
  itself.
- **Save:** "Save", "Save .md", "+ New" and "Duplicate"
  write the `.md` directly into the folder of the **active set** (no save dialog).
- **Delete:** removes the `.md` file from the active set's folder.
- **"← Back to view"** reloads the server state.
- **Serving audio:** files from `verlinkte_audiodateien/` are served under
  `/verlinkte_audiodateien/…`. The server answers `Range` requests with
  **HTTP 206 Partial Content** (incl. `Accept-Ranges`), so that seeking in the
  player **also works in Chrome** (Firefox tolerates missing ranges, Chrome doesn't).
- Under `file://` a purely offline operation remains possible (only the one
  default set from `dokumente_datenbank.js`).

### Server Endpoints

- `GET  /api/sets`  → lists all sets + the active set
  (`{ "ok":true, "aktiv":"Standard", "sets":[{"id":"Standard","name":"Set 1"}] }`)
- `POST /api/sets/aktiv`  → switches the active set (body: `{ "id": "…" }`)
- `POST /api/sets/neu`  → creates a new set/subfolder and makes it active
  (body: `{ "name": "…" }`)
- `GET  /api/dokumente`  → lists all `.md` **of the active set** as a DOKUMENTE array (JSON)
- `POST /api/speichern`  → writes a `.md` into the active set
  (body: `{ "datei": "Name.md", "inhalt": "…" }`)
- `POST /api/loeschen`   → deletes a `.md` from the active set (body: `{ "datei": "Name.md" }`)
- `POST /api/reihenfolge` → saves the drag&drop order of the active set
  (body: `{ "reihenfolge": ["a.md", …] }`)
- `POST /api/sichtbarkeit` → saves the visibility of the active set
  (body: `{ "sichtbarkeit": {"a.md": true, …} }`)
- `POST /api/db-export`  → creates `generator/dokumente_datenbank.js` from the
  active set (optionally with `{ "dokumente": […] }` for the desired order);
  with `{ "alle": true, "dokumente": […] }` from **all sets** (each entry tagged
  with `set`/`setName`)
- `POST /api/db-export-set` → serves the active set as download
  (`{ "dateiname": "<Setname>_dokumente_datenbank.js", "inhalt": "…" }`)
- `GET  /api/backup` → serves **all** user data as JSON (documents of all sets,
  audio as base64, settings, set metadata) – for backup/ZIP export
- `POST /api/restore` → restores user data from a backup
  (body: backup JSON; audio files are ignored)

## Portable distribution to others

The whole project is already a portable case – **no installation
needed** (neither Node nor Python). Both Node runtimes (Windows 32/64-bit +
Linux) are in the folder.

> **Slimmed-down Node runtimes:** the app only needs the simple core modules
> (`http`, `fs`, `path` – no npm packages). That's why the `node/` folder only
> contains the individual core binaries (`bin/node`, `node32.exe`, `node64.exe`)
> and no npm/npx/corepack parts. This reduces the package size from ~371 MB to
> ~265 MB without losing any functionality or platform support (incl.
> Windows 32-bit).

**For the user:** share the entire folder as ZIP → unpack →
run `Windows-start.bat` (Windows) or `Linux-start.sh` (Linux) → the browser opens
`http://localhost:8080/dokumente_anzeigen.html` automatically.

**For the provider (once):** unpack the portable Node versions (ZIP from
nodejs.org) into `node/win/` (`node32.exe`/`node64.exe`) and `node/linux/`,
remove the unnecessary files (`npm`/`npx`/`corepack`, `node_modules/`,
`include/`, `share/`, `CHANGELOG.md`, `README.md` – only the
`bin/node` binary or the `.exe` files are needed), then zip and send.

## Technical

- **marked.js** – Markdown-to-HTML (local, offline-capable)
- **JSZip** – ZIP export in the browser
- **localStorage** – settings (theme, text sizes) persist
- **Settings file** – in server mode `server.js` writes text sizes +
  auto-scroll tempos to `generator/einstellungen_dokumente.js` (portable)
- **No CDN** – works completely offline
- **Server:** only Node built-in modules (`http`, `fs`, `path`), no installation
- **Range requests:** the server serves MP3/WAV with `Accept-Ranges: bytes`
  and answers Range headers with HTTP 206 – prerequisite for seeking in the
  Chrome audio player.

---

*Last updated: 04.11.2026*
