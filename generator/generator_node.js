#!/usr/bin/env node
/**
 * generator_node.js
 *
 * Liest alle .md-Dateien aus dem Ordner "dokumente/" – inklusive aller
 * Sets/Gruppen (Unterordner) – und erzeugt daraus die Datei
 * "generator/dokumente_datenbank.js" mit dem Inhalt als JS-Array.
 * Jeder Eintrag wird mit "set" (id) und "setName" (Anzeigename) ausgezeichnet,
 * damit die Zuordnung zu seinem Set erhalten bleibt.
 *
 * Warum eine .js-Datei statt .json?
 * Unter dem file://-Protokoll blockieren Browser fetch()-Zugriffe auf
 * lokale Dateien (CORS). Eine ganz normale <script src="..."> Einbindung
 * ist davon nicht betroffen, daher verpacken wir die Daten als
 * JavaScript-Variable statt als JSON-Datei.
 *
 * Die Set-Metadaten (Name + Reihenfolge) kommen aus generator/sets/*.json.
 * Das Standard-Set ist immer die Wurzel dokumente/.
 *
 * Aufruf: node generator_node.js
 * (im Ordner "generator/", auch die generierte dateien.js liegt und bleibt in "generator/")
 */

const fs = require("fs");
const path = require("path");

const ORDNER = path.join(__dirname, "../dokumente");
const SETS_ORDNER = path.join(__dirname, "sets");
const ZIEL_DATEI = path.join(__dirname, "dokumente_datenbank.js");
const STANDARD_SET_ID = "Standard";
const STANDARD_SET_NAME = "Set 1";

function ermittleTitel(dateiname, inhalt) {
  // Nimmt die erste Markdown-Überschrift (# ...) als Titel,
  // fällt sonst auf den Dateinamen zurück.
  const treffer = inhalt.match(/^#\s+(.+)$/m);
  if (treffer) return treffer[1].trim();
  return dateiname.replace(/\.md$/i, "");
}

function idAusDateiname(dateiname) {
  return dateiname.replace(/\.md$/i, "").replace(/[^a-zA-Z0-9_-]/g, "_");
}

// Liest die Set-Liste als [{ id, name }]: Standard-Set + alle Einträge aus
// generator/sets/*.json. Abgestimmt auf server.js: nur Sets mit Datendatei.
function liesSets() {
  const sets = [{ id: STANDARD_SET_ID, name: STANDARD_SET_NAME }];
  let standardName = STANDARD_SET_NAME;
  try {
    if (fs.existsSync(path.join(SETS_ORDNER, STANDARD_SET_ID + ".json"))) {
      const daten = JSON.parse(fs.readFileSync(path.join(SETS_ORDNER, STANDARD_SET_ID + ".json"), "utf8"));
      if (daten && daten.name) standardName = String(daten.name);
    }
  } catch (e) { /* ignorieren */ }
  sets[0].name = standardName;
  try {
    if (fs.existsSync(SETS_ORDNER)) {
      const eintraege = fs.readdirSync(SETS_ORDNER);
      for (const e of eintraege) {
        if (!e.toLowerCase().endsWith(".json")) continue;
        const id = e.slice(0, -5);
        if (id === STANDARD_SET_ID) continue;
        let name = id;
        try {
          const daten = JSON.parse(fs.readFileSync(path.join(SETS_ORDNER, e), "utf8"));
          if (daten && daten.name) name = String(daten.name);
        } catch (err) { /* ignorieren */ }
        sets.push({ id, name });
      }
    }
  } catch (e) { /* ignorieren */ }
  return sets;
}

// Alle .md-Dateien eines Sets als Dokumente-Array; berücksichtigt die
// per Set gespeicherte Reihenfolge (generator/sets/<set>.json).
function liesDokumente(setId, setName) {
  const ordnerSet = setId === STANDARD_SET_ID ? ORDNER : path.join(ORDNER, setId);
  if (!fs.existsSync(ordnerSet)) return [];
  let reihenfolge = [];
  try {
    const datei = path.join(SETS_ORDNER, setId.replace(/[^a-zA-Z0-9_\-. ]/g, "_") + ".json");
    if (fs.existsSync(datei)) {
      const daten = JSON.parse(fs.readFileSync(datei, "utf8"));
      if (Array.isArray(daten && daten.reihenfolge)) {
        reihenfolge = daten.reihenfolge.filter((e) => typeof e === "string");
      }
    }
  } catch (e) { /* ignorieren */ }

  const dateien = fs
    .readdirSync(ordnerSet)
    .filter((f) => f.toLowerCase().endsWith(".md"))
    .sort((a, b) => a.localeCompare(b, "de"));

  const dokumente = dateien.map((dateiname) => {
    const vollpfad = path.join(ordnerSet, dateiname);
    const inhalt = fs.readFileSync(vollpfad, "utf8");
    return {
      id: idAusDateiname(dateiname),
      name: ermittleTitel(dateiname, inhalt),
      datei: dateiname,
      inhalt: inhalt,
      set: setId,
      setName: setName,
    };
  });

  if (reihenfolge.length > 0) {
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

function main() {
  if (!fs.existsSync(ORDNER)) {
    console.error(`Fehler: Ordner "${ORDNER}" existiert nicht.`);
    process.exit(1);
  }

  const sets = liesSets();
  const dokumente = [];
  for (const set of sets) {
    const docs = liesDokumente(set.id, set.name);
    for (const d of docs) dokumente.push(d);
  }

  if (dokumente.length === 0) {
    console.warn("Warnung: Keine .md-Dateien gefunden.");
  }

  const ausgabe =
    "// Automatisch generiert von generator_node.js — nicht von Hand bearbeiten!\n" +
    "// Neu generieren nach jeder Änderung an den .md-Dateien.\n" +
    "var DOKUMENTE = " +
    JSON.stringify(dokumente, null, 2) +
    ";\n";

  fs.writeFileSync(ZIEL_DATEI, ausgabe, "utf8");
  console.log(`Fertig: ${dokumente.length} Dokument(e) aus ${sets.length} Set(s) nach "${ZIEL_DATEI}" geschrieben.`);
  dokumente.forEach((d) => console.log(`  - [${d.set}]  ${d.datei}  ->  "${d.name}"`));
}

main();