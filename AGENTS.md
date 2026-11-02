# AGENTS.md – Text Prompter Portable

Dieses Dokument richtet sich an KI-Agenten (und Mitwirkende), die an diesem
Repository arbeiten. Es fasst die wichtigsten Regeln und Erinnerungen zusammen.

## Versionsnummer (PFLICHT bei jeder Änderung)

- Die App-Version steht in genau drei Stellen:
  - `index.html` (zwei i18n-Einträge: Deutsch und Englisch) – `"… · v1.x.y"`
  - `dokumente_anzeigen.html` (`.menu-fuss-version`) – `v1.x.y`
- **Nach jeder funktionalen Änderung die Patch-Version erhöhen** (z. B. `v1.7.1` → `v1.7.2`), bei größeren Features die Minor-Version (`v1.8.0`).
- Alle drei Stellen müssen übereinstimmen. Nie nur eine Stelle ändern.
- Die Versionsnummer ist die einzige Stelle, an der die App-Version gepflegt wird – keine separate `package.json`-Version o. ä.

## Projekt-Kernprinzipien (nicht brechen)

- **Offline first:** Keine CDN-Links, keine externen Ressourcen.
- **Keine Abhängigkeiten:** Der Server nutzt nur Node-eigene Module (`http`, `fs`, `path`). Kein `npm install`.
- **Portabel:** Alles läuft aus dem Ordner – Windows (32/64-Bit) **und** Linux, ohne Installation.
- **Ein-Datei-App:** Die Oberfläche lebt in `dokumente_anzeigen.html` (Viewer + Editor).
- **i18n:** UI-Texte über `generator/i18n.js` (DE **und** EN) – neue Strings in beiden Sprachen.

## Generierte Dateien (nicht von Hand bearbeiten)

- `generator/dokumente_datenbank.js`
- `generator/einstellungen_dokumente.js`
- `generator/sets/*.json`, `generator/sets.json`

Diese werden vom Server (`generator/server.js`) gepflegt. Bei Bedarf über die API neu erzeugen, nicht manuell editieren.

## Große Binaries (Git LFS)

- `node/linux/bin/node`, `node/win/node32.exe`, `node/win/node64.exe` werden über Git LFS getrackt (siehe `.gitattributes`).
- Niemals als normale Git-Blobs committen (GitHub 100-MB-Limit).

## Commit & Push

- Committen ist erlaubt; **Pushen nur auf ausdrückliche Anweisung des Nutzers**.
- Aussagekräftige Commit-Messages auf Deutsch oder Englisch.

## Struktur-Hinweise

- Server-Root ist der Projektordner; `server.js` liegt in `generator/`.
- Dokumente: `dokumente/` (Standard-Set = Wurzel), weitere Sets als Unterordner.
- Audio: `verlinkte_audiodateien/` (gleicher Basisname wie das `.md`).
EOF