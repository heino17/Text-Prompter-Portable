# Security Policy / Sicherheitsrichtlinie

🇩🇪 **Deutsch** · 🇺🇸 **English** (see below)

---

## 🇩🇪 Deutsch

### Unterstützte Versionen

Es wird jeweils die **aktuellste Version** auf dem `main`-Branch unterstützt. Ältere Releases erhalten keine Sicherheitsupdates.

### Sicherheitslücke melden

Bitte **keine** öffentlichen Issues für Sicherheitsprobleme erstellen.

- Nutze die GitHub-Funktion **„Report a vulnerability"** (Security → Report a vulnerability) für eine vertrauliche Meldung, **oder**
- kontaktiere den Maintainer per E-Mail (siehe Profil).

Wir bemühen uns, innerhalb von **7 Tagen** zu antworten und einen Fix zeitnah zu veröffentlichen.

### Scope

**In Scope:**
- Der lokale Node-Server (`generator/server.js`) – Path-Traversal, Dateizugriff außerhalb des Projektordners, Eingabevalidierung der API-Endpunkte.
- Cross-Site-Scripting (XSS) in der Oberfläche (`dokumente_anzeigen.html`, `index.html`), da Dokumentinhalte als HTML gerendert werden.
- Offenlegung von Dateipfaden/Inhalten über die lokalen Endpunkte.

**Nicht in Scope:**
- Der Server läuft **nur auf `localhost`** und ist nicht für den Netzwerkbetrieb gedacht. Ein Betrieb hinter einem Reverse-Proxy/öffentlich ist nicht vorgesehen.
- Schwachstellen in Browser-Erweiterungen oder im Betriebssystem des Nutzers.
- Denial of Service durch den Nutzer selbst (z. B. sehr große Dateien) – die App ist für den persönlichen Gebrauch.
- Fehlende Authentifizierung – beabsichtigt, da rein lokal.

### Hinweise für Nutzer

- Die App ist für den **lokalen** Gebrauch gedacht. Den Server nicht öffentlich erreichbar machen.
- Nur vertrauenswürdige `.md`-Dateien laden/importieren (Markdown wird als HTML gerendert).
- Die portablen Node-Binaries stammen von nodejs.org – bei Bedarf selbst prüfen/ersetzen.

---

## 🇺🇸 English

### Supported versions

Only the **latest version** on the `main` branch is supported. Older releases do not receive security updates.

### Reporting a vulnerability

Please **do not** open public issues for security problems.

- Use GitHub's **"Report a vulnerability"** feature (Security → Report a vulnerability) for a confidential report, **or**
- contact the maintainer by email (see profile).

We aim to respond within **7 days** and release a fix promptly.

### Scope

**In scope:**
- The local Node server (`generator/server.js`) – path traversal, file access outside the project folder, input validation of API endpoints.
- Cross-site scripting (XSS) in the UI (`dokumente_anzeigen.html`, `index.html`), since document content is rendered as HTML.
- Disclosure of file paths/contents via local endpoints.

**Out of scope:**
- The server runs **only on `localhost`** and is not intended for network use. Operation behind a reverse proxy / publicly is not supported.
- Vulnerabilities in browser extensions or the user's operating system.
- Denial of service by the user themselves (e.g. very large files) – the app is for personal use.
- Missing authentication – intentional, as the app is purely local.

### Notes for users

- The app is intended for **local** use. Do not expose the server publicly.
- Only load/import trusted `.md` files (Markdown is rendered as HTML).
- The portable Node binaries come from nodejs.org – verify/replace them yourself if needed.
EOF