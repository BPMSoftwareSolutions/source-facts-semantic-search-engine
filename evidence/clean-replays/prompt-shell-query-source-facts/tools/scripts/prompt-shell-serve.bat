@echo off
setlocal EnableExtensions

set "SCRIPT_NAME=%~nx0"
set "SCRIPT_DIR=%~dp0"
for %%I in ("%SCRIPT_DIR%..\..") do set "REPO_ROOT=%%~fI"

set "DEFAULT_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
set "NODE_RUNTIME_ROOT=%REPO_ROOT%\runtime\node"
set "COCKPIT_JS=%NODE_RUNTIME_ROOT%\dist\prompt-shell\ui\server\starts-prompt-shell-cockpit.js"

set "HOST=127.0.0.1"
set "PORT=8787"
set "SQLITE_DB="
set "PRINT_ONLY=0"
set "RESTART=1"

:parse
if "%~1"=="" goto ready

if /I "%~1"=="--help" goto usage
if /I "%~1"=="-h" goto usage
if /I "%~1"=="/?" goto usage

if /I "%~1"=="--host" (
  if "%~2"=="" goto missing_value
  set "HOST=%~2"
  shift
  shift
  goto parse
)

if /I "%~1"=="--port" (
  if "%~2"=="" goto missing_value
  set "PORT=%~2"
  shift
  shift
  goto parse
)

if /I "%~1"=="--sqlite-db" (
  if "%~2"=="" goto missing_value
  for %%I in ("%~2") do set "SQLITE_DB=%%~fI"
  shift
  shift
  goto parse
)

if /I "%~1"=="--print-only" (
  set "PRINT_ONLY=1"
  shift
  goto parse
)

if /I "%~1"=="--restart" (
  set "RESTART=1"
  shift
  goto parse
)

if /I "%~1"=="--no-restart" (
  set "RESTART=0"
  shift
  goto parse
)

echo ERROR: Unknown option: %~1
echo.
goto usage_fail

:missing_value
echo ERROR: %~1 requires a value.
goto fail

:ready
if exist "%DEFAULT_NODE%" (
  set "NODE_EXE=%DEFAULT_NODE%"
) else (
  for /f "delims=" %%N in ('where node 2^>nul') do (
    if not defined NODE_EXE set "NODE_EXE=%%N"
  )
)

if not defined NODE_EXE (
  echo ERROR: Node.js was not found.
  echo Expected Codex runtime node at:
  echo   %DEFAULT_NODE%
  echo Or install Node.js on PATH.
  goto fail
)

if not exist "%COCKPIT_JS%" (
  echo ERROR: Compiled prompt-shell cockpit server was not found:
  echo   %COCKPIT_JS%
  echo.
  echo Build it first:
  echo   cd /d "%NODE_RUNTIME_ROOT%"
  echo   npm run build
  goto fail
)

if not defined SOURCE_FACTS_CLI_PATH if exist "C:\lab\repos\source-facts-semantic-search-engine\src\cli.js" set "SOURCE_FACTS_CLI_PATH=C:\lab\repos\source-facts-semantic-search-engine\src\cli.js"

set "APP_URL=http://%HOST%:%PORT%"

echo.
echo Prompt shell app server
echo -----------------------
echo URL:         %APP_URL%
echo Runtime cwd: %NODE_RUNTIME_ROOT%
if defined SQLITE_DB echo SQLite db:   %SQLITE_DB%
if "%RESTART%"=="1" (
  echo Restart:     enabled ^(default^)
) else (
  echo Restart:     disabled
)
echo.

if "%PRINT_ONLY%"=="1" (
  echo cd /d "%NODE_RUNTIME_ROOT%"
  if defined SQLITE_DB (
    echo "%NODE_EXE%" --import "file:///C:/lab/repos/source-facts-semantic-search-engine/src/prompt-shell/registers-source-facts-query-effect.js" "%COCKPIT_JS%" --host "%HOST%" --port "%PORT%" --sqlite-db "%SQLITE_DB%"
  ) else (
    echo "%NODE_EXE%" --import "file:///C:/lab/repos/source-facts-semantic-search-engine/src/prompt-shell/registers-source-facts-query-effect.js" "%COCKPIT_JS%" --host "%HOST%" --port "%PORT%"
  )
  goto success
)

if "%RESTART%"=="1" (
  call :restart_existing_server
  if errorlevel 1 goto fail
)

echo Press Ctrl+C to stop the server.
echo.

pushd "%NODE_RUNTIME_ROOT%" || goto fail
if defined SQLITE_DB (
  "%NODE_EXE%" --import "file:///C:/lab/repos/source-facts-semantic-search-engine/src/prompt-shell/registers-source-facts-query-effect.js" "%COCKPIT_JS%" --host "%HOST%" --port "%PORT%" --sqlite-db "%SQLITE_DB%"
) else (
  "%NODE_EXE%" --import "file:///C:/lab/repos/source-facts-semantic-search-engine/src/prompt-shell/registers-source-facts-query-effect.js" "%COCKPIT_JS%" --host "%HOST%" --port "%PORT%"
)
set "EXIT_CODE=%ERRORLEVEL%"
popd

if "%EXIT_CODE%"=="0" goto success

echo.
echo Prompt shell app server exited with code %EXIT_CODE%.
goto fail

:usage
echo Usage:
echo   %SCRIPT_NAME% [--host host] [--port port] [--sqlite-db path] [--no-restart] [--print-only]
echo.
echo Defaults:
echo   Host: 127.0.0.1
echo   Port: 8787
echo   Restart: enabled ^(stops an existing prompt-shell server on the target port first^)
echo.
echo Examples:
echo   %SCRIPT_NAME%
echo   %SCRIPT_NAME% --port 8790
echo   %SCRIPT_NAME% --host 0.0.0.0 --port 8787
echo   %SCRIPT_NAME% --sqlite-db "%USERPROFILE%\.cognitive-codebase\persistence.sqlite"
echo   %SCRIPT_NAME% --no-restart
echo   %SCRIPT_NAME% --print-only --port 8790
goto success

:usage_fail
echo Usage:
echo   %SCRIPT_NAME% [--host host] [--port port] [--sqlite-db path] [--no-restart] [--print-only]
goto fail

:restart_existing_server
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $port=[int]$env:PORT; $listeners=Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue; if (-not $listeners) { Write-Host ('No existing listener on port {0}.' -f $port); exit 0 }; $pids=$listeners | Select-Object -ExpandProperty OwningProcess -Unique; $blocked=@(); foreach ($pidValue in $pids) { $proc=Get-CimInstance Win32_Process -Filter ('ProcessId={0}' -f $pidValue) -ErrorAction SilentlyContinue; $cmd=[string]$proc.CommandLine; if ($cmd -match 'starts-prompt-shell-cockpit\.js' -or $cmd -match 'prompt-shell[\\/]+ui[\\/]+server') { Write-Host ('Stopping existing prompt-shell cockpit server PID {0} on port {1}.' -f $pidValue,$port); Stop-Process -Id $pidValue -Force -ErrorAction Stop } else { $blocked += ('PID {0}: {1}' -f $pidValue,$cmd) } }; if ($blocked.Count -gt 0) { Write-Error ('Port {0} is in use by a non prompt-shell process. Refusing to stop it. {1}' -f $port,($blocked -join ' | ')); exit 2 }; Start-Sleep -Milliseconds 500; exit 0"
if errorlevel 1 (
  echo ERROR: Could not restart the prompt-shell server for port %PORT%.
  goto fail
)
exit /b 0

:success
exit /b 0

:fail
exit /b 1
