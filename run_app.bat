@echo off
echo Starting Home Care App...
echo.
echo Attempting to start with 'python'...
python app.py
if %ERRORLEVEL% == 0 goto end

echo.
echo 'python' command failed. Attempting with 'py'...
py app.py
if %ERRORLEVEL% == 0 goto end

echo.
echo 'py' command failed. Attempting with 'python3'...
python3 app.py
if %ERRORLEVEL% == 0 goto end

echo.
echo CRITICAL: Could not find Python. Please ensure Python is installed and added to PATH.
echo.

:end
pause
