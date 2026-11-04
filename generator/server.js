#!/usr/bin/env node
/**
 * server.js  —  "Mini-Server" für den Text Prompter
 *
 * Ersetzt den manuellen Generator + den Speicher-Umweg:
 *   - liefert dokumente_anzeigen.html samt generator/*-Bibliotheken aus
 *   - GET  /api/sets        listet alle Sets (Gruppen) und das aktive Set
 *   - POST /api/sets/aktiv  wechselt das aktive Set
 *   - POST /api/sets/neu    legt ein neues Set (Unterordner) an
 *   - GET  /api/dokumente   liest alle .md des AKTIVEN Sets und gibt sie
 *                           als DOKUMENTE-Array (JSON) zurück
 *   - POST /api/speichern   schreibt eine .md direkt ins aktive Set
 *                           (Body: { datei: "Name.md", inhalt: "...", name: "Titel" })
 *   - POST /api/loeschen    löscht eine .md aus dem aktiven Set
 *                           (Body: { datei: "Name.md" })
 *   - POST /api/db-export   schreibt generator/dokumente_datenbank.js aus
 *                           allen .md des aktiven Sets (Button "DB exportieren",
 *                           mit { alle: true } aus ALLEN Sets)
 *   - POST /api/db-export-set liefert das aktive Set als Download-Datei
 *                           (Button "Aktuelles Set exportieren")
 *   - POST /api/reihenfolge speichert die per Drag&Drop gesetzte Reihenfolge
 *                           des aktiven Sets
 *                           (Body: { reihenfolge: ["a.md", "b.md", ...] })
 *   - POST /api/sichtbarkeit speichert die Sichtbarkeit des aktiven Sets
 *                           (Body: { sichtbarkeit: { datei: true/false } })
 *   - POST /api/einstellungen speichert die Viewer-Einstellungen (Textgröße %
 *                           + Auto-Scroll-Tempo px/s) des aktiven Sets in
 *                           generator/einstellungen_dokumente.js
 *                           (Body: { set, textgroessen: {...}, autoscroll: {...} })
 *
 * Aufruf:      node server.js
 * Im Browser:  http://localhost:8080
 *
 * Erfordert keine weiteren Abhängigkeiten (nur Node-eigene Module).
 * PDFs/alles Weitere wird normal als statische Datei ausgeliefert.
 *
 * Sets (Gruppen):
 *   Jedes Set ist ein Unterordner in dokumente/. Das Standard-Set ist der
 *   Ordner dokumente/ selbst. Weitere Sets liegen unter dokumente/<set-id>/.
 *   Die zugehörigen Metadaten (Name, Reihenfolge, Sichtbarkeit) liegen pro
 *   Set in generator/sets/<set-id>.json; die Liste aller Sets + das aktive
 *   Set in generator/sets.json.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

// server.js liegt in generator/, daher eine Ebene höher als Projekt-Wurzel.
const WURZEL = path.resolve(__dirname, "..");
const DOKUMENTE_ORDNER = path.join(WURZEL, "dokumente");
const AUDIO_ORDNER = path.join(WURZEL, "verlinkte_audiodateien");
const GENERATOR_ORDNER = path.join(WURZEL, "generator");
const SETS_ORDNER = path.join(GENERATOR_ORDNER, "sets");
const SETS_DATEI = path.join(GENERATOR_ORDNER, "sets.json");
const EINSTELLUNGEN_DATEI = path.join(GENERATOR_ORDNER, "einstellungen_dokumente.js");
const STANDARD_SET_ID = "Standard";
const STANDARD_SET_NAME = "Set 1";
const STANDARD_PORT = 8080;
const MAX_BODY = 5 * 1024 * 1024; // 5 MB
const SERVER_VERSION = "1.7.5";

// --- Grundlegende Funktionen ---

function contentType(pfad) {
  const ext = path.extname(pfad).toLowerCase();
  const mime = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".md": "text/markdown; charset=utf-8",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".zip": "application/zip",
  };
  return mime[ext] || "application/octet-stream";
}

// Titel wie der Generator: erste "# Überschrift", sonst Dateiname.
function ermittleTitel(dateiname, inhalt) {
  const treffer = inhalt.match(/^#\s+(.+)$/m);
  if (treffer) return treffer[1].trim();
  return dateiname.replace(/\.md$/i, "");
}

// Dateiname -> id (Kleinbuchstaben, Sonderzeichen -> "_"), wie der Generator.
function idAusDateiname(dateiname) {
  return dateiname.replace(/\.md$/i, "").replace(/[^a-zA-Z0-9_-]/g, "_");
}

// Set-id -> Unterordnerpfad in dokumente/. Das Standard-Set ist die Wurzel.
function setOrdner(setId) {
  if (!setId || setId === STANDARD_SET_ID) return DOKUMENTE_ORDNER;
  return path.join(DOKUMENTE_ORDNER, sicherSetId(setId));
}

// Bereinigt eine Set-id für die Verwendung als Ordnername (nur alphanumerische
// Zeichen sowie "_" und "-"; keine Pfadzeichen).
function sicherSetId(setId) {
  if (typeof setId !== "string") return STANDARD_SET_ID;
  const bereinigt = setId.replace(/[^a-zA-Z0-9_\-. ]/g, "").trim();
  return bereinigt || STANDARD_SET_ID;
}

// --- Sets-Verwaltung ---

// Liest generator/sets.json ({ aktivesSet }); legt es ggf. mit der Migration
// aus den Legacy-Dateien an. Rückgabe: { aktivesSet }.
function liesSetsIndex() {
  try {
    if (fs.existsSync(SETS_DATEI)) {
      const daten = JSON.parse(fs.readFileSync(SETS_DATEI, "utf8"));
      if (daten && daten.aktivesSet) return { aktivesSet: String(daten.aktivesSet) };
    }
  } catch (e) { /* ignorieren */ }

  // Erststart: Standard-Set aktiv.
  const index = { aktivesSet: STANDARD_SET_ID };
  try {
    fs.mkdirSync(GENERATOR_ORDNER, { recursive: true });
    fs.writeFileSync(SETS_DATEI, JSON.stringify(index, null, 2), "utf8");
  } catch (e) { /* ignorieren */ }
  return index;
}

function speichereSetsIndex(index) {
  const sauber = { aktivesSet: index && index.aktivesSet ? String(index.aktivesSet) : STANDARD_SET_ID };
  fs.mkdirSync(GENERATOR_ORDNER, { recursive: true });
  fs.writeFileSync(SETS_DATEI, JSON.stringify(sauber, null, 2), "utf8");
  return sauber;
}

function getAktivesSet() {
  return liesSetsIndex().aktivesSet;
}

// Set-Datendatei: generator/sets/<setId>.json = { name, reihenfolge, sichtbarkeit }
function setDatenDatei(setId) {
  return path.join(SETS_ORDNER, sicherSetId(setId).replace(/[^a-zA-Z0-9_\-. ]/g, "_") + ".json");
}

function liesSetDaten(setId, nameFallback) {
  const datei = setDatenDatei(setId);
  try {
    if (fs.existsSync(datei)) {
      const daten = JSON.parse(fs.readFileSync(datei, "utf8"));
      return {
        name: (daten && daten.name) || nameFallback || setIdName(setId),
        reihenfolge: Array.isArray(daten && daten.reihenfolge)
          ? daten.reihenfolge.filter((e) => typeof e === "string")
          : [],
        sichtbarkeit: (daten && daten.sichtbarkeit && typeof daten.sichtbarkeit === "object" && !Array.isArray(daten.sichtbarkeit))
          ? daten.sichtbarkeit
          : {},
      };
    }
  } catch (e) { /* ignorieren */ }
  return { name: nameFallback || setIdName(setId), reihenfolge: [], sichtbarkeit: {} };
}

function speichereSetDaten(setId, daten) {
  const sauber = {
    name: (daten && daten.name) || setIdName(setId),
    reihenfolge: (daten && Array.isArray(daten.reihenfolge))
      ? daten.reihenfolge.filter((e) => typeof e === "string" && /\.md$/i.test(e))
      : [],
    sichtbarkeit: {},
  };
  if (daten && daten.sichtbarkeit && typeof daten.sichtbarkeit === "object" && !Array.isArray(daten.sichtbarkeit)) {
    for (const [datei, wert] of Object.entries(daten.sichtbarkeit)) {
      if (typeof datei === "string" && /\.md$/i.test(datei)) {
        sauber.sichtbarkeit[datei] = wert !== false;
      }
    }
  }
  fs.mkdirSync(SETS_ORDNER, { recursive: true });
  fs.writeFileSync(setDatenDatei(setId), JSON.stringify(sauber, null, 2), "utf8");
  return sauber;
}

// Berücksichtigt, ob ein Ordner das Standard- (Wurzel) oder ein Unterordner ist.
function bereitsVorhandeneDateien(ordner) {
  if (!fs.existsSync(ordner)) return [];
  return fs.readdirSync(ordner)
    .filter((f) => f.toLowerCase().endsWith(".md"))
    .sort((a, b) => a.localeCompare(b, "de"));
}

// Listet alle Sets (id + Anzeigename). Nur Sets mit einer Datendatei in
// generator/sets/ werden angezeigt. Der Ordner allein reicht nicht aus –
// so verschwinden gelöschte Sets (deren JSON entfernt wurde) aus der Liste.
function listeSets() {
  const sets = {};

  // Alle Sets aus den Datendateien in generator/sets/.
  try {
    if (fs.existsSync(SETS_ORDNER)) {
      const eintraege = fs.readdirSync(SETS_ORDNER);
      for (const e of eintraege) {
        if (!e.toLowerCase().endsWith(".json")) continue;
        const id = e.slice(0, -5);
        sets[id] = liesSetDaten(id).name;
      }
    }
  } catch (e) { /* ignorieren */ }

  // Das Standard-Set sicherstellen (hat immer eine Datendatei).
  if (!sets[STANDARD_SET_ID]) {
    sets[STANDARD_SET_ID] = liesSetDaten(STANDARD_SET_ID, STANDARD_SET_NAME).name;
  }

  return sets;
}

function hatMdDateien(ordner) {
  if (!fs.existsSync(ordner)) return false;
  return fs.readdirSync(ordner).some((f) => f.toLowerCase().endsWith(".md"));
}

// Liest den (ggf. umbenannten) Anzeigenamen des Standard-Sets direkt aus der
// Datendatei – ohne über liesSetDaten zu gehen, um Rekursion zu vermeiden.
function standardSetName() {
  try {
    const datei = setDatenDatei(STANDARD_SET_ID);
    if (fs.existsSync(datei)) {
      const daten = JSON.parse(fs.readFileSync(datei, "utf8"));
      if (daten && daten.name) return String(daten.name);
    }
  } catch (e) { /* ignorieren */ }
  return STANDARD_SET_NAME;
}

function setIdName(setId) {
  return setId === STANDARD_SET_ID ? standardSetName() : setId;
}

// --- Dokumente eines Sets ---

// Sucht zur .md-Datei (z.B. "One more time.md") eine verlinkte Audiodatei
// im Ordner "verlinkte_audiodateien/" mit gleichem Basisnamen und Endung
// .mp3 oder .wav. Liefert { url, datei } oder null.
function audioFuerDokument(datei) {
  if (typeof datei !== "string") return null;
  const basis = datei.replace(/\.md$/i, "");
  const kandidaten = [basis + ".mp3", basis + ".wav", basis + ".MP3", basis + ".WAV"];
  try {
    if (fs.existsSync(AUDIO_ORDNER)) {
      const vorhanden = fs.readdirSync(AUDIO_ORDNER);
      for (const kandidat of kandidaten) {
        if (vorhanden.includes(kandidat)) {
          return {
            url: "/verlinkte_audiodateien/" + encodeURIComponent(kandidat),
            datei: kandidat,
          };
        }
      }
      // Case-insensitiv als Fallback (z.B. "One More Time.MP3").
      const basisLower = basis.toLowerCase();
      const treffer = vorhanden.find(
        (f) => f.toLowerCase() === basisLower + ".mp3" || f.toLowerCase() === basisLower + ".wav"
      );
      if (treffer) {
        return { url: "/verlinkte_audiodateien/" + encodeURIComponent(treffer), datei: treffer };
      }
    }
  } catch (e) { /* ignorieren */ }
  return null;
}

// Alle .md-Dateien eines Sets als DOKUMENTE-Array (JSON).
function liesDokumente(setId) {
  const ordner = setOrdner(setId);
  if (!fs.existsSync(ordner)) return [];
  const daten = liesSetDaten(setId);
  const sichtbarkeit = daten.sichtbarkeit;
  let dokumente = bereitsVorhandeneDateien(ordner).map((dateiname) => {
    const inhalt = fs.readFileSync(path.join(ordner, dateiname), "utf8");
    return {
      id: idAusDateiname(dateiname),
      name: ermittleTitel(dateiname, inhalt),
      datei: dateiname,
      inhalt: inhalt,
      aktiv: sichtbarkeit[dateiname] !== false,
      audio: audioFuerDokument(dateiname),
    };
  });

  const reihenfolge = daten.reihenfolge;
  if (reihenfolge && reihenfolge.length > 0) {
    dokumente.sort((a, b) => {
      const ia = reihenfolge.indexOf(a.datei);
      const ib = reihenfolge.indexOf(b.datei);
      const aEnde = ia === -1 ? 1e9 : ia;
      const bEnde = ib === -1 ? 1e9 : ib;
      if (aEnde !== bEnde) return aEnde - bEnde;
      return a.datei.localeCompare(b.datei, "de");
    });
  }
  return dokumente;
}

// Speichert die Reihenfolge (Array aus Dateinamen) eines Sets.
function speichereReihenfolge(setId, dateinamen) {
  const daten = liesSetDaten(setId);
  daten.reihenfolge = (Array.isArray(dateinamen) ? dateinamen : [])
    .filter((e) => typeof e === "string" && /\.md$/i.test(e));
  return speichereSetDaten(setId, daten);
}

// Speichert die Sichtbarkeit (Objekt { "datei.md": true|false }) eines Sets.
function speichereSichtbarkeit(setId, sichtbarkeit) {
  const daten = liesSetDaten(setId);
  daten.sichtbarkeit = sichtbarkeit && typeof sichtbarkeit === "object" && !Array.isArray(sichtbarkeit)
    ? sichtbarkeit
    : {};
  return speichereSetDaten(setId, daten);
}

// Zielpfad einer .md-Datei innerhalb eines Sets; prüft den Dateinamen.
function sicheresDateiPfad(setId, dateiname) {
  if (typeof dateiname !== "string") return null;
  if (/[/\\:]/u.test(dateiname) || dateiname.includes("..")) return null;
  if (!/\.md$/i.test(dateiname)) return null;
  return path.join(setOrdner(setId), dateiname);
}

// Baut den Datei-Inhalt der Datenbank aus einem DOKUMENTE-Array.
function baueDatenbankInhalt(dokumente, quelle) {
  return (
    "// Automatisch generiert von " + quelle + " (Button \"DB exportieren\")\n" +
    "// Neu generieren nach jeder Änderung an den .md-Dateien.\n" +
    "var DOKUMENTE = " + JSON.stringify(dokumente, null, 2) + ";\n"
  );
}

// Erzeugt generator/dokumente_datenbank.js aus den .md-Dateien des aktiven Sets
// oder aus dem übergebenen dokumente-Array (für Drag&Drop-Reihenfolge).
function schreibeDatenbank(setId, geordneteDokumente) {
  const dokumente = geordneteDokumente && Array.isArray(geordneteDokumente)
    ? geordneteDokumente
    : liesDokumente(setId);
  const ausgabe = baueDatenbankInhalt(dokumente, "server.js");
  fs.mkdirSync(GENERATOR_ORDNER, { recursive: true });
  const ziel = path.join(GENERATOR_ORDNER, "dokumente_datenbank.js");
  fs.writeFileSync(ziel, ausgabe, "utf8");
  return { anzahl: dokumente.length, ziel: "generator/dokumente_datenbank.js" };
}

// Leitet aus einem (Anzeige-)Set-Namen den Dateinamen für den Export ab,
// z.B. "12 months later" -> "12_months_later_dokumente_datenbank.js".
function dateinameFuerSet(name) {
  const bereinigt = String(name || "Set")
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return (bereinigt || "Set") + "_dokumente_datenbank.js";
}

// Erzeugt generator/dokumente_datenbank.js aus ALLEN Sets. Jedes Dokument
// wird mit "set" (id) und "setName" (Anzeigename) ausgezeichnet, damit die
// Zuordnung erhalten bleibt. Für das aktive Set wird – wenn vorhanden – die
// übergebene (Drag&Drop-geordnete) Liste verwendet, sonst gilt der Server-Stand.
function schreibeDatenbankAlle(geordneteAktiveDokumente) {
  const sets = listeSets();
  const aktiv = getAktivesSet();
  const alle = [];
  for (const [setId, setName] of Object.entries(sets)) {
    let dokumente = (setId === aktiv && Array.isArray(geordneteAktiveDokumente) && geordneteAktiveDokumente.length)
      ? geordneteAktiveDokumente
      : liesDokumente(setId);
    for (const dok of dokumente) {
      alle.push(Object.assign({}, dok, { set: setId, setName: setName }));
    }
  }
  const ausgabe = baueDatenbankInhalt(alle, "server.js (Export: alle Sets)");
  fs.mkdirSync(GENERATOR_ORDNER, { recursive: true });
  const ziel = path.join(GENERATOR_ORDNER, "dokumente_datenbank.js");
  fs.writeFileSync(ziel, ausgabe, "utf8");
  return { anzahl: alle.length, ziel: "generator/dokumente_datenbank.js" };
}

// --- Viewer-Einstellungen (Textgröße / Auto-Scroll) ---

function liesEinstellungen() {
  try {
    if (fs.existsSync(EINSTELLUNGEN_DATEI)) {
      const text = fs.readFileSync(EINSTELLUNGEN_DATEI, "utf8");
      const start = text.indexOf("{");
      const ende = text.lastIndexOf("}");
      if (start !== -1 && ende > start) {
        const daten = JSON.parse(text.slice(start, ende + 1));
        if (daten && typeof daten === "object" && !Array.isArray(daten)) return daten;
      }
    }
  } catch (e) { /* ignorieren */ }
  return {};
}

function schreibeEinstellungen(daten) {
  const ausgabe =
    "// Automatisch generiert von server.js (Viewer-Einstellungen).\n" +
    "// Textgrößen (%) und Auto-Scroll-Geschwindigkeit (px/s) pro Dokument, pro Set.\n" +
    "// Nicht von Hand bearbeiten – wird vom Text Prompter überschrieben.\n" +
    "var EINSTELLUNGEN_DOKUMENTE = " + JSON.stringify(daten, null, 2) + ";\n";
  fs.mkdirSync(GENERATOR_ORDNER, { recursive: true });
  fs.writeFileSync(EINSTELLUNGEN_DATEI, ausgabe, "utf8");
  return daten;
}

function speichereSetEinstellungen(setId, daten) {
  const alle = liesEinstellungen();
  const eintrag = (alle[setId] && typeof alle[setId] === "object" && !Array.isArray(alle[setId]))
    ? alle[setId]
    : {};
  eintrag.textgroessen = (daten && daten.textgroessen && typeof daten.textgroessen === "object" && !Array.isArray(daten.textgroessen))
    ? daten.textgroessen
    : {};
  eintrag.autoscroll = (daten && daten.autoscroll && typeof daten.autoscroll === "object" && !Array.isArray(daten.autoscroll))
    ? daten.autoscroll
    : {};
  alle[setId] = eintrag;
  schreibeEinstellungen(alle);
  return eintrag;
}

function verschiebeSetEinstellungen(altId, neuId) {
  if (altId === neuId) return;
  const alle = liesEinstellungen();
  if (alle[altId] !== undefined && alle[neuId] === undefined) {
    alle[neuId] = alle[altId];
  }
  if (alle[altId] !== undefined) {
    delete alle[altId];
    schreibeEinstellungen(alle);
  }
}

function entferneSetEinstellungen(setId) {
  const alle = liesEinstellungen();
  if (alle[setId] !== undefined) {
    delete alle[setId];
    schreibeEinstellungen(alle);
  }
}

// --- HTTP-Helfer ---

function jsonAntwort(res, status, daten) {
  const body = JSON.stringify(daten);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-cache",
  });
  res.end(body);
}

function leseBody(req, maxBytes) {
  const limit = (typeof maxBytes === "number" && maxBytes > 0) ? maxBytes : MAX_BODY;
  return new Promise((resolve, reject) => {
    let lange = 0;
    const teile = [];
    req.on("data", (teil) => {
      lange += teil.length;
      if (lange > limit) {
        reject(new Error("Body zu groß"));
        req.destroy();
        return;
      }
      teile.push(teil);
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(teile).toString("utf8")));
      } catch (e) {
        reject(new Error("Ungültiges JSON"));
      }
    });
    req.on("error", reject);
  });
}

// --- Statisches Ausliefern (Datei zeigen oder Index.html) ---

function dieneStatisch(req, res, urlPfad) {
  let pfad = path.normalize(path.join(WURZEL, decodeURIComponent(urlPfad)));
  if (!pfad.startsWith(WURZEL)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  let stat;
  try {
    stat = fs.statSync(pfad);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404 – Nicht gefunden");
    return;
  }
  if (stat.isDirectory()) {
    pfad = path.join(pfad, "index.html");
    try {
      stat = fs.statSync(pfad);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 – Nicht gefunden");
      return;
    }
  }
  const gesamt = stat.size;
  const typ = contentType(pfad);
  const rangeHeader = req.headers.range;

  if (rangeHeader) {
    const teile = rangeHeader.replace(/bytes=/, "").split("-");
    const anfang = parseInt(teile[0], 10);
    const endeHeader = teile[1];
    const start = Number.isFinite(anfang) ? Math.max(0, anfang) : 0;
    const ende =
      endeHeader !== "" && Number.isFinite(Number(endeHeader))
        ? Math.min(Number(endeHeader), gesamt - 1)
        : gesamt - 1;
    if (start > ende || start >= gesamt) {
      res.writeHead(416, {
        "Content-Range": `bytes */${gesamt}`,
      });
      res.end();
      return;
    }
    res.writeHead(206, {
      "Content-Type": typ,
      "Accept-Ranges": "bytes",
      "Content-Range": `bytes ${start}-${ende}/${gesamt}`,
      "Content-Length": ende - start + 1,
    });
    const stream = fs.createReadStream(pfad, { start, end: ende });
    stream.on("error", () => {
      res.destroy();
    });
    stream.pipe(res);
    return;
  }

  // HTML enthält Anwendungslogik & ändert sich zwischen Sitzungen – daher immer
  // neu validieren (kein veraltetes "Set 1" aus dem Browser-Cache anzeigen).
  const istHtml = String(typ).indexOf("text/html") === 0;
  // Auch die Einstellungsdatei (schreibt der Server laufend um) nicht cachen.
  const istEinstellungen = String(pfad).includes("einstellungen_dokumente.js");
  res.writeHead(200, {
    "Content-Type": typ,
    "Accept-Ranges": "bytes",
    "Content-Length": gesamt,
    ...((istHtml || istEinstellungen) ? { "Cache-Control": "no-cache" } : {}),
  });
  fs.createReadStream(pfad).pipe(res);
}

// --- Server ---

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pfad = url.pathname;

  try {
    // Gruppenstatus: Liste aller Sets + aktives Set.
    if (pfad === "/api/sets" && req.method === "GET") {
      const index = liesSetsIndex();
      const setsObj = listeSets();
      const sets = Object.keys(setsObj)
        .sort((a, b) => (a === STANDARD_SET_ID ? -1 : b === STANDARD_SET_ID ? 1 : a.localeCompare(b, "de")))
        .map((id) => ({ id, name: setsObj[id] }));
      jsonAntwort(res, 200, {
        ok: true,
        aktiv: index.aktivesSet,
        sets,
      });
      return;
    }

    // Aktives Set wechseln.
    if (pfad === "/api/sets/aktiv" && req.method === "POST") {
      const body = await leseBody(req);
      const id = sicherSetId(body && body.id);
      if (id !== STANDARD_SET_ID) {
        const ordner = setOrdner(id);
        if (!fs.existsSync(ordner) || !hatMdDateien(ordner)) {
          jsonAntwort(res, 400, { ok: false, fehler: "Set nicht gefunden." });
          return;
        }
      }
      const index = liesSetsIndex();
      index.aktivesSet = id;
      speichereSetsIndex(index);
      jsonAntwort(res, 200, { ok: true, aktiv: id });
      return;
    }

    // Neues Set anlegen (Unterordner in dokumente/).
    if (pfad === "/api/sets/neu" && req.method === "POST") {
      const body = await leseBody(req);
      const name = String((body && body.name) || "").trim() || "Neues Set";
      let id = name.replace(/[^a-zA-Z0-9_-]/g, "_");
      if (!id) id = "Set" + Date.now();
      const index = liesSetsIndex();

      // Falls die id schon existiert (Ordner vorhanden), eindeutig machen.
      let endgueltig = id;
      let ordner = setOrdner(endgueltig);
      let zaehler = 2;
      while (fs.existsSync(ordner) && hatMdDateien(ordner)) {
        endgueltig = id + "_" + zaehler;
        ordner = setOrdner(endgueltig);
        zaehler++;
      }

      fs.mkdirSync(ordner, { recursive: true });
      speichereSetDaten(endgueltig, { name, reihenfolge: [], sichtbarkeit: {} });

      // Das neue Set wird direkt aktiv.
      index.aktivesSet = endgueltig;
      speichereSetsIndex(index);

      jsonAntwort(res, 200, { ok: true, id: endgueltig, name });
      return;
    }

    // Set (Gruppe) umbenennen – Ordner + Datendatei + ggf. aktives Set.
    // Beim Standard-Set wird nur der Anzeigename geändert (ID + Ordner bleiben).
    if (pfad === "/api/sets/umbenennen" && req.method === "POST") {
      const body = await leseBody(req);
      const altId = sicherSetId(body && body.id);
      if (!altId) {
        jsonAntwort(res, 400, { ok: false, fehler: "Kein gültiges Set." });
        return;
      }

      // Standard-Set: nur den sichtbaren Namen ändern, ID/Ordner unangetastet.
      if (altId === STANDARD_SET_ID) {
        const neuerName = String((body && body.name) || "").trim();
        if (!neuerName) {
          jsonAntwort(res, 400, { ok: false, fehler: "Name fehlt." });
          return;
        }
        const alteDaten = liesSetDaten(STANDARD_SET_ID, STANDARD_SET_NAME);
        alteDaten.name = neuerName;
        speichereSetDaten(STANDARD_SET_ID, alteDaten);
        jsonAntwort(res, 200, { ok: true, id: STANDARD_SET_ID, name: neuerName });
        return;
      }

      const alterOrdner = setOrdner(altId);
      if (!fs.existsSync(alterOrdner)) {
        jsonAntwort(res, 400, { ok: false, fehler: "Set nicht gefunden." });
        return;
      }
      const neuerName = String((body && body.name) || "").trim() || setIdName(altId);
      let neuId = neuerName.replace(/[^a-zA-Z0-9_-]/g, "_");
      if (!neuId) neuId = altId;

      // Falls neue id schon belegt wäre, eindeutig machen.
      const index = liesSetsIndex();
      let endgueltig = neuId;
      let neuerOrdner = setOrdner(endgueltig);
      let zaehler = 2;
      while (fs.existsSync(neuerOrdner) && endgueltig !== altId) {
        endgueltig = neuId + "_" + zaehler;
        neuerOrdner = setOrdner(endgueltig);
        zaehler++;
      }

      const alteDaten = liesSetDaten(altId);
      alteDaten.name = neuerName;

      // Ordner umbenennen (er bleibt erhalten, mitsamt .md-Dateien).
      if (alterOrdner !== neuerOrdner) {
        try { fs.renameSync(alterOrdner, neuerOrdner); }
        catch (e) {
          jsonAntwort(res, 500, { ok: false, fehler: "Ordner konnte nicht umbenannt werden." });
          return;
        }
      }

      // Datendatei verschieben (alten Eintrag löschen, neuen anlegen).
      const alteDatei = setDatenDatei(altId);
      try { if (fs.existsSync(alteDatei)) fs.unlinkSync(alteDatei); } catch (e) { /* ignorieren */ }
      speichereSetDaten(endgueltig, alteDaten);

      // Falls das umbenannte Set das aktive war, aktive id nachziehen.
      if (index.aktivesSet === altId) {
        index.aktivesSet = endgueltig;
        speichereSetsIndex(index);
      }

      // Viewer-Einstellungen beim Umbenennen auf die neue Set-id übernehmen.
      verschiebeSetEinstellungen(altId, endgueltig);

      jsonAntwort(res, 200, { ok: true, id: endgueltig, name: neuerName, umbenannt: endgueltig !== altId });
      return;
    }

    // Set (Gruppe) entfernen – nur Metadaten (Datendatei + sets.json-Eintrag).
    // Der Ordner mit seinen .md-Dateien bleibt bewusst erhalten.
    if (pfad === "/api/sets/loeschen" && req.method === "POST") {
      const body = await leseBody(req);
      const id = sicherSetId(body && body.id);
      if (!id || id === STANDARD_SET_ID) {
        jsonAntwort(res, 400, { ok: false, fehler: "Das Standard-Set kann nicht entfernt werden." });
        return;
      }

      const datei = setDatenDatei(id);
      if (fs.existsSync(datei)) {
        try { fs.unlinkSync(datei); } catch (e) { /* ignorieren */ }
      }

      // Falls das entfernte Set aktiv war, auf das Standard-Set umschalten.
      const index = liesSetsIndex();
      if (index.aktivesSet === id) {
        index.aktivesSet = STANDARD_SET_ID;
        speichereSetsIndex(index);
      }

      // Viewer-Einstellungen des entfernten Sets mit aufräumen.
      entferneSetEinstellungen(id);

      jsonAntwort(res, 200, { ok: true, id });
      return;
    }

    // Dokumente des aktiven Sets laden.
    if (pfad === "/api/dokumente" && req.method === "GET") {
      const setId = getAktivesSet();
      const dokumente = liesDokumente(setId);
      const ausgabe =
        "// Automatisch geliefert von server.js aus dokumente/\n" +
        "// Nicht von Hand bearbeiten.\n" +
        "var DOKUMENTE = " + JSON.stringify(dokumente, null, 2) + ";\n";
      res.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8" });
      res.end(ausgabe);
      return;
    }

    // Speichern innerhalb des aktiven Sets.
    if (pfad === "/api/speichern" && req.method === "POST") {
      const body = await leseBody(req);
      const setId = getAktivesSet();
      const ziel = sicheresDateiPfad(setId, (body && body.datei) || "");
      if (!ziel) {
        jsonAntwort(res, 400, { ok: false, fehler: "Ungültiger Dateiname." });
        return;
      }
      const inhalt = String((body && body.inhalt) ?? "");
      fs.mkdirSync(setOrdner(setId), { recursive: true });
      fs.writeFileSync(ziel, inhalt, "utf8");
      jsonAntwort(res, 200, {
        ok: true,
        datei: (body && body.datei) || "",
        name: ermittleTitel((body && body.datei) || "", inhalt),
      });
      return;
    }

    // Löschen innerhalb des aktiven Sets.
    if (pfad === "/api/loeschen" && req.method === "POST") {
      const body = await leseBody(req);
      const setId = getAktivesSet();
      const ziel = sicheresDateiPfad(setId, (body && body.datei) || "");
      if (!ziel || !fs.existsSync(ziel)) {
        jsonAntwort(res, 400, { ok: false, fehler: "Datei nicht gefunden." });
        return;
      }
      fs.unlinkSync(ziel);
      jsonAntwort(res, 200, { ok: true, datei: (body && body.datei) || "" });
      return;
    }

    if (pfad === "/api/db-export" && req.method === "POST") {
      const body = await leseBody(req);
      const setId = getAktivesSet();
      // "alle: true" (Button "DB exportieren") schreibt ALLE Sets in
      // generator/dokumente_datenbank.js. Ohne das Flag bleibt der bisherige
      // Export nur des aktiven Sets erhalten.
      const ergebnis = body && body.alle
        ? schreibeDatenbankAlle(body.dokumente)
        : schreibeDatenbank(setId, body && body.dokumente);
      jsonAntwort(res, 200, {
        ok: true,
        anzahl: ergebnis.anzahl,
        ziel: ergebnis.ziel,
      });
      return;
    }

    // Aktuelles Set als Datei herunterladen (Button "Aktuelles Set exportieren"):
    // liefert nur den Inhalt + Dateinamen, schreibt nichts auf die Platte.
    if (pfad === "/api/db-export-set" && req.method === "POST") {
      const body = await leseBody(req);
      const setId = getAktivesSet();
      const setName = setIdName(setId);
      const dokumente = (body && Array.isArray(body.dokumente) && body.dokumente.length)
        ? body.dokumente
        : liesDokumente(setId);
      jsonAntwort(res, 200, {
        ok: true,
        anzahl: dokumente.length,
        set: setId,
        dateiname: dateinameFuerSet(setName),
        inhalt: baueDatenbankInhalt(dokumente, "server.js (Export: aktives Set)"),
      });
      return;
    }

    if (pfad === "/api/reihenfolge" && req.method === "POST") {
      const body = await leseBody(req);
      const setId = getAktivesSet();
      const gespeichert = speichereReihenfolge(setId, body && body.reihenfolge);
      jsonAntwort(res, 200, { ok: true, anzahl: gespeichert.reihenfolge.length });
      return;
    }

    if (pfad === "/api/sichtbarkeit" && req.method === "POST") {
      const body = await leseBody(req);
      const setId = getAktivesSet();
      const gespeichert = speichereSichtbarkeit(setId, body && body.sichtbarkeit);
      jsonAntwort(res, 200, { ok: true, anzahl: Object.keys(gespeichert.sichtbarkeit).length });
      return;
    }

    // Viewer-Einstellungen (Textgröße + Auto-Scroll) des aktiven Sets in
    // generator/einstellungen_dokumente.js schreiben (portabel, wandert mit).
    if (pfad === "/api/einstellungen" && req.method === "POST") {
      const body = await leseBody(req);
      const setId = (body && body.set) ? sicherSetId(body.set) : getAktivesSet();
      const gespeichert = speichereSetEinstellungen(setId, body);
      jsonAntwort(res, 200, {
        ok: true,
        set: setId,
        textgroessen: Object.keys(gespeichert.textgroessen).length,
        autoscroll: Object.keys(gespeichert.autoscroll).length,
      });
      return;
    }

    // --- Backup: alle Nutzerdaten als JSON (für ZIP-Export im Browser) ---
    // Gestreamt, um den Speicherverbrauch auf Tablets/kleinen Geräten gering
    // zu halten (kein riesiges Zwischen-JSON im RAM).
    if (pfad === "/api/backup" && req.method === "GET") {
      const index = liesSetsIndex();
      res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": 'attachment; filename="text-prompter-backup.json"',
      });
      res.write('{"version":' + JSON.stringify(SERVER_VERSION) +
        ',"erstellt":' + JSON.stringify(new Date().toISOString()) +
        ',"setsIndex":' + JSON.stringify(index) + ',"sets":[');
      const setsObj = listeSets();
      const setIds = Object.keys(setsObj);
      setIds.forEach((setId, i) => {
        const daten = liesSetDaten(setId, setsObj[setId]);
        const ordner = setOrdner(setId);
        const dateien = [];
        if (fs.existsSync(ordner)) {
          const mdFiles = fs.readdirSync(ordner).filter((f) => f.toLowerCase().endsWith(".md"));
          for (const datei of mdFiles) {
            dateien.push({ datei, inhalt: fs.readFileSync(path.join(ordner, datei), "utf8") });
          }
        }
        const setObj = {
          id: setId,
          name: (daten && daten.name) || setsObj[setId],
          reihenfolge: (daten && daten.reihenfolge) || [],
          sichtbarkeit: (daten && daten.sichtbarkeit) || {},
          dateien,
        };
        if (i > 0) res.write(",");
        res.write(JSON.stringify(setObj));
      });
      res.write('],"audio":[');
      if (fs.existsSync(AUDIO_ORDNER)) {
        const audioFiles = fs.readdirSync(AUDIO_ORDNER).filter((f) => /\.(mp3|wav)$/i.test(f));
        audioFiles.forEach((f, i) => {
          if (i > 0) res.write(",");
          const buf = fs.readFileSync(path.join(AUDIO_ORDNER, f));
          res.write(JSON.stringify({ datei: f, base64: buf.toString("base64") }));
        });
      }
      res.write('],"einstellungen":' + JSON.stringify(liesEinstellungen()) + "}");
      res.end();
      return;
    }

    // --- Restore: Nutzerdaten aus einem Backup wiederherstellen ---
    if (pfad === "/api/restore" && req.method === "POST") {
      const body = await leseBody(req, 50 * 1024 * 1024);
      if (!body || !Array.isArray(body.sets)) {
        jsonAntwort(res, 400, { ok: false, fehler: "Ungültiges Backup." });
        return;
      }
      // Sets-Index
      if (body.setsIndex && body.setsIndex.aktivesSet) {
        speichereSetsIndex({ aktivesSet: String(body.setsIndex.aktivesSet) });
      }
      // Sets + Dokumente
      for (const set of body.sets) {
        const setId = sicherSetId(set && set.id);
        if (!setId) continue;
        const ordner = setOrdner(setId);
        fs.mkdirSync(ordner, { recursive: true });
        for (const d of (set.dateien || [])) {
          const ziel = sicheresDateiPfad(setId, d && d.datei);
          if (ziel) fs.writeFileSync(ziel, String((d && d.inhalt) ?? ""), "utf8");
        }
        speichereSetDaten(setId, {
          name: (set && set.name) || setId,
          reihenfolge: set && set.reihenfolge,
          sichtbarkeit: set && set.sichtbarkeit,
        });
      }
      // Audio
      if (Array.isArray(body.audio)) {
        fs.mkdirSync(AUDIO_ORDNER, { recursive: true });
        for (const a of body.audio) {
          if (a && a.datei && a.base64) {
            const safe = path.basename(String(a.datei));
            fs.writeFileSync(path.join(AUDIO_ORDNER, safe), Buffer.from(a.base64, "base64"));
          }
        }
      }
      // Einstellungen
      if (body.einstellungen && typeof body.einstellungen === "object" && !Array.isArray(body.einstellungen)) {
        schreibeEinstellungen(body.einstellungen);
      }
      jsonAntwort(res, 200, { ok: true });
      return;
    }

    // Alles andere: statische Datei liefern (App, generator/*, …)
    dieneStatisch(req, res, pfad === "/" ? "/index.html" : pfad);
  } catch (e) {
    jsonAntwort(res, 500, { ok: false, fehler: String(e && e.message) });
  }
});

// Beim Start das Standard-Set einmalig aus den Legacy-Daten migrieren.
try {
  liesSetsIndex();
} catch (e) { /* ignorieren */ }

// Beim Start die Einstellungsdatei anlegen, falls sie (noch) nicht existiert.
try {
  if (!fs.existsSync(EINSTELLUNGEN_DATEI)) schreibeEinstellungen({});
} catch (e) { /* ignorieren */ }

const port = process.env.PORT || STANDARD_PORT;
server.listen(port, () => {
  console.log("Text Prompter läuft unter:  http://localhost:" + port);
  console.log("Zum Beenden:  Strg+C");
});
