#!/usr/bin/env bash
# Linux-start.sh  -  Text Prompter für Linux (portables Node im Ordner)
# Aufruf: ./Linux-start.sh   (im Ordner Text_Prompter_Portable)

cd "$(dirname "$0")"

echo "=============================================="
echo "  Text Prompter - Server wird gestartet..."
echo "=============================================="
echo

NODE_BIN="node/linux/bin/node"

# Ausführbarkeit sicherstellen (nach USB-Transfer oft verloren)
chmod +x "$NODE_BIN" 2>/dev/null

if [ ! -x "$NODE_BIN" ]; then
  echo "[FEHLER] Das portable Linux-Node wurde nicht gefunden oder ist nicht ausführbar:"
  echo "  $NODE_BIN"
  echo "Bitte im Terminal ausführen:"
  echo "  chmod +x Linux-start.sh node/linux/bin/node"
  echo "  ./Linux-start.sh"
  echo "Abbruch."
  exit 1
fi

echo "  Node gefunden: $PWD/$NODE_BIN ($("$NODE_BIN" --version))"
echo
START_URL="http://localhost:8080/dokumente_anzeigen.html"
echo "  Browser oeffnen: $START_URL"
echo "  Beenden:  Strg+C  (in diesem Terminal)"
echo

# Nach kurzer Pause den Browser öffnen (falls vorhanden)
( sleep 2
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$START_URL" >/dev/null 2>&1 &
  fi
) &

# Server starten
"$NODE_BIN" --max-old-space-size=512 generator/server.js
CODE=$?

if [ "$CODE" -ne 0 ]; then
  echo
  echo "[FEHLER] Der Server endete mit Code $CODE."
  echo "Prüfe die Meldung oben. Port 8080 evtl. belegt?"
fi

echo
echo "Der Server wurde beendet."
