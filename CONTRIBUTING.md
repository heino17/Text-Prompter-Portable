# Contributing / Mitwirken

🇩🇪 **Deutsch** · 🇺🇸 **English** (see below)

---

## 🇩🇪 Deutsch

Vielen Dank für dein Interesse am **Text Prompter – Portable**! Beiträge sind willkommen.

### Grundprinzipien

- **Offline first:** Die App funktioniert vollständig ohne Internet. Keine CDN-Links, keine externen Ressourcen.
- **Keine Abhängigkeiten:** Der Server nutzt ausschließlich Node-eigene Module (`http`, `fs`, `path`). Kein `npm install`, keine `node_modules`.
- **Portabel bleiben:** Alles muss im Ordner laufen – Windows (32/64-Bit) **und** Linux, ohne Installation.
- **Ein-Datei-App:** Die Oberfläche lebt in `dokumente_anzeigen.html` (Viewer + Editor). Änderungen dort bitte mit Bedacht und getestet.
- **Sprache:** UI-Texte werden über `generator/i18n.js` (DE/EN) verwaltet – neue Strings in **beiden** Sprachen ergänzen.

### So kannst du beitragen

1. **Issue suchen/erstellen** – vor größeren Änderungen bitte ein Issue öffnen, damit wir uns abstimmen.
2. **Fork & Branch** – `git checkout -b feature/kurze-beschreibung`.
3. **Ändern & testen** – Server starten (`Windows-start.bat` / `Linux-start.sh`), im Browser unter `http://localhost:8080` prüfen. Mindestens: Viewer (Dokumente durchblättern, Theme, Audio), Editor (Speichern/Löschen/Import/Export), Set-Wechsel.
4. **Kleine, fokussierte PRs** – ein Thema pro Pull Request, aussagekräftige Commit-Messages.
5. **Generierte Dateien** (`generator/dokumente_datenbank.js`, `generator/einstellungen_dokumente.js`, `generator/sets/*.json`) nach Möglichkeit nicht von Hand bearbeiten – sie werden vom Server gepflegt.

### Code-Stil

- Bestehenden Stil übernehmen (Einrückung, Namenskonventionen). Im Projekt wird viel Deutsch verwendet (Variablennamen, Kommentare) – das ist gewollt und konsistent halten.
- Keine unnötigen Refactorings neben der eigentlichen Änderung.
- Neue Features in der `README.md` (DE **und** EN) dokumentieren.

### Melden von Fehlern

Bitte ein Issue mit: Schritten zur Reproduktion, erwartetem vs. tatsächlichem Verhalten, Browser/OS, ggf. Konsolen-Fehler.

---

## 🇺🇸 English

Thank you for your interest in **Text Prompter – Portable**! Contributions are welcome.

### Core principles

- **Offline first:** The app works fully without internet. No CDN links, no external resources.
- **No dependencies:** The server uses only Node built-in modules (`http`, `fs`, `path`). No `npm install`, no `node_modules`.
- **Stay portable:** Everything must run from the folder – Windows (32/64-bit) **and** Linux, no installation.
- **Single-file app:** The UI lives in `dokumente_anzeigen.html` (viewer + editor). Changes there require care and testing.
- **Language:** UI strings are managed via `generator/i18n.js` (DE/EN) – add new strings in **both** languages.

### How to contribute

1. **Search/create an issue** – for larger changes, please open an issue first so we can align.
2. **Fork & branch** – `git checkout -b feature/short-description`.
3. **Change & test** – start the server (`Windows-start.bat` / `Linux-start.sh`), check in the browser at `http://localhost:8080`. At minimum: viewer (browse documents, theme, audio), editor (save/delete/import/export), set switching.
4. **Small, focused PRs** – one topic per pull request, meaningful commit messages.
5. **Generated files** (`generator/dokumente_datenbank.js`, `generator/einstellungen_dokumente.js`, `generator/sets/*.json`) should not be hand-edited when avoidable – they are maintained by the server.

### Code style

- Follow the existing style (indentation, naming conventions). The project uses a lot of German (variable names, comments) – this is intentional; keep it consistent.
- No unnecessary refactoring alongside the actual change.
- Document new features in `README.md` (DE **and** EN).

### Reporting bugs

Please open an issue with: reproduction steps, expected vs. actual behavior, browser/OS, and console errors if available.
EOF