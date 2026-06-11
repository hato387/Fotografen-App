@echo off
chcp 65001 >nul
title Naturfoto
cd /d "%~dp0"

echo ============================================
echo   Naturfoto - lokale Naturfotografie-App
echo ============================================
echo.

REM Beim ersten Start (oder nach Code-Aenderungen) einen Build erstellen.
if not exist ".next" (
  echo Erstelle einmaligen Production-Build ...
  call npm run build
  echo.
)

echo Starte die App auf http://localhost:3000
echo Dieses Fenster offen lassen, solange du die App nutzt.
echo Zum Beenden: dieses Fenster schliessen.
echo.

REM Browser nach kurzer Wartezeit oeffnen.
start "" /min cmd /c "timeout /t 3 >nul & start http://localhost:3000"

call npm run start
pause
