@echo off
echo Starting JavaScript fix test server...
echo.
cd /d "%~dp0"
python server.py
echo.
echo Server stopped.
pause