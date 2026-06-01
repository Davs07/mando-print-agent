@echo off
setlocal enabledelayedexpansion

echo.
echo  =========================================
echo   Mando Print Agent - Inicio
echo  =========================================
echo.

:: ── 1. Comprobar Node.js ──────────────────────────────────────
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no esta instalado.
    echo         Descargalo en https://nodejs.org ^(version 18 o superior^)
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node --version') do echo [OK] Node.js %%v detectado

:: ── 2. Configurar .env si no existe ──────────────────────────
if not exist ".env" (
    echo.
    echo [SETUP] No se encontro .env - copiando plantilla...
    copy .env.example .env >nul
    echo.
    echo  ---------------------------------------------------------
    echo   IMPORTANTE: Se abrio el Bloc de notas con el archivo
    echo   .env. Pega tu MANDO_AGENT_TOKEN y guarda el archivo
    echo   antes de cerrar el Bloc de notas.
    echo  ---------------------------------------------------------
    echo.
    notepad .env
    echo.
    echo Presiona cualquier tecla cuando hayas guardado el token...
    pause >nul
)

:: ── 3. Instalar dependencias si faltan ────────────────────────
if not exist "node_modules" (
    echo.
    echo [INSTALL] Instalando dependencias ^(solo la primera vez, puede tardar 1-2 min^)...
    npm install
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] npm install fallo. Revisa tu conexion a internet.
        pause
        exit /b 1
    )
    echo [OK] Dependencias instaladas.
)

:: ── 4. Compilar TypeScript ────────────────────────────────────
if not exist "dist\index.js" (
    echo.
    echo [BUILD] Compilando TypeScript...
    call npm run build
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] La compilacion fallo. Revisa los errores mostrados arriba.
        pause
        exit /b 1
    )
    echo [OK] Compilacion exitosa.
)

:: ── 5. Arrancar el agente ─────────────────────────────────────
echo.
echo [START] Iniciando Mando Print Agent...
echo         Presiona Ctrl+C para detenerlo.
echo.
node dist\index.js

echo.
echo [INFO] El agente se detuvo.
pause
