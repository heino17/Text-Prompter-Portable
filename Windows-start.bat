@echo off
setlocal
cd /d "%~dp0"

title Text Prompter Server (Node.js)

echo ==============================================
echo   Text Prompter - Server wird gestartet...
echo ==============================================
echo.

REM Architektur erkennen und passendes Windows-Node wählen
if "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
    set "NODE_EXE=node\win\node64.exe"
) else (
    set "NODE_EXE=node\win\node32.exe"
)

REM Prüfen, ob das portable Windows-Node vorhanden ist
if not exist "%NODE_EXE%" (
    echo.
    echo [FEHLER] Das portable Windows-Node wurde nicht gefunden.
    echo.
    echo Es muss vorliegen unter:
    echo   %NODE_EXE%
    echo.
    echo Kein Node gefunden - Windows-start.bat bricht ab.
    echo.
    pause
    exit /b 1
)

echo   Node gefunden: %~dp0%NODE_EXE%
echo.
set "START_URL=http://localhost:8080/dokumente_anzeigen.html"
echo   Browser oeffnen: %START_URL%
echo   Beenden: dieses Fenster schliessen (Strg+C)
echo.

REM Browser erst nach kurzer Pause öffnen (wenn der Server steht)
start "" cmd /c "timeout /t 2 /nobreak >nul & start %START_URL%"

REM Server starten; Fenster bei Fehler offen halten
"%NODE_EXE%" generator\server.js
set "CODE=%ERRORLEVEL%"

if not "%CODE%"=="0" (
    echo.
    echo [FEHLER] Der Server wurde mit Fehler-Code %CODE% beendet.
    echo Pruefe die Meldung oben. Port 8080 evtl. belegt?
    echo.
)

echo.
echo Der Server wurde beendet.
pause
endlocal
