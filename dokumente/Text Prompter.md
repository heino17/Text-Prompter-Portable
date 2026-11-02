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
├── generator/              # Bibliotheken, Server & generierte Daten
│   ├── server.js           # Mini-Server (App + .md-Lesen/Speichern via HTTP)
│   ├── i18n.js             # DE/EN-Übersetzungen der Oberfläche
│   ├── marked.js           # Markdown-zu-HTML (offline)
│   ├── jszip.min.js        # ZIP-Export
│   ├── generator_node.js   # (optional) manueller Datenbank-Generator
│   ├── dokumente_datenbank.js  # Generierte Daten (für file://-Modus)
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
- **Dokumenten-Auswahl** – Custom-Dropdown mit Suchfeld (live filtert, Reihenfolge bleibt)
- **Textgröße pro Dokument** – +/- im Header, wird pro Dokument gespeichert
- **Dark/Light-Theme** – Umschalter im Header (localStorage)
- **Akku-Anzeige** im Header (rechts) – Symbol/Ampelfarben je Ladezustand,
  Live-Updates, **Netzbetrieb-Erkennung** (🔌 bei 100 % + Ladevorgang), blinkt bei ≤31 %;
  **Long-Press-Popover** mit Details (nur Chromium/Opera wird unterstützt,
  Firefox/Waterfox zeigt einen Hinweis)
- **Scroll-Andocken** – Seiten springen exakt unter den Header (beide Wischrichtungen)

### Editor (über das Menü: 📝 Dokumente bearbeiten)
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
    **aller Sets** (jeder Eintrag wird mit `set`/`setName` ausgezeichnet);
    "Aktuelles Set exportieren" lädt nur das aktive Set als
    `<Setname>_dokumente_datenbank.js` herunter
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
- **Speichern:** "Speichern", ".md speichern", "+ Neu" und "Duplizieren"
  schreiben die `.md` direkt nach `dokumente/` (kein Speicher-Dialog).
- **Löschen:** entfernt die `.md`-Datei aus `dokumente/`.
- **"← Zurück zur Ansicht"** lädt den Server-Stand neu.
- Unter `file://` bleibt ein reiner Offline-Betrieb möglich.

### Server-Endpoints

- `GET  /api/dokumente`  → listet alle `.md` als DOKUMENTE-Array (JSON)
- `POST /api/speichern`  → schreibt eine `.md` nach `dokumente/`
  (Body: `{ "datei": "Name.md", "inhalt": "…" }`)
- `POST /api/loeschen`   → löscht eine `.md` (Body: `{ "datei": "Name.md" }`)
- `POST /api/reihenfolge` → speichert die Drag&Drop-Reihenfolge in
  `generator/sets/<set>.json` (Body: `{ "reihenfolge": ["a.md", …] }`)
- `POST /api/db-export`  → erzeugt `generator/dokumente_datenbank.js`
  (optional mit `{ "dokumente": […] }` für die gewünschte Reihenfolge);
  mit `{ "alle": true }` aus **allen Sets**
- `POST /api/db-export-set` → liefert das aktive Set als Download
  (`{ "dateiname": "<Setname>_dokumente_datenbank.js", "inhalt": "…" }`)

## Portable Weitergabe an andere

Das ganze Projekt ist bereits eine portable Mappe – **keine Installation
nötig** (weder Node noch Python). Beide Node-Runtimes (Windows 32/64-Bit +
Linux) liegen im Ordner.

> **Abgespeckte Node-Laufzeiten:** Die App braucht nur die einfachen Core-Module
> (`http`, `fs`, `path` – keine npm-Pakete). Deshalb liegen im `node/`-Ordner nur
> die einzelnen Kern-Binaries (`bin/node`, `node32.exe`, `node64.exe`) und keine
> npm/npx/corepack-Bestandteile. Das reduziert die Paketgröße von ~371&nbsp;MB auf
> ~265&nbsp;MB, ohne irgendwelche Funktionen oder Plattform-Support (inkl.
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
- **Kein CDN** – funktioniert komplett offline
- **Server:** nur Node-eigene Module (`http`, `fs`, `path`), keine Installation

---

*Zuletzt aktualisiert: 30.08.2026*
