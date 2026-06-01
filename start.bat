@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

echo.
echo  ╔═══════════════════════════════════════╗
echo  ║     Mando Print Agent — Inicio        ║
echo  ╚═══════════════════════════════════════╝
echo.

:: ── 1. Comprobar Node.js ─────────────────────────────────────
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no está instalado.
    echo         Descárgalo en https://nodejs.org ^(versión 18 o superior^)
    pause
    exit /b 1
)

:: ── 2. Configurar .env si no existe ─────────────────────────
if not exist ".env" (
    echo [SETUP] No se encontró .env — copiando plantilla...
    copy .env.example .env >nul
    echo.
    echo  ┌─────────────────────────────────────────────────────┐
    echo  │  Abre .env en el Bloc de notas y pega tu token      │
    echo  │  MANDO_AGENT_TOKEN antes de cerrar.                  │
    echo  └─────────────────────────────────────────────────────┘
    echo.
    notepad .env
    echo Presiona Enter cuando hayas guardado el token...
    pause >nul
)

:: ── 3. Instalar dependencias si faltan ───────────────────────
if not exist "node_modules" (
    echo [INSTALL] Instalando dependencias ^(solo la primera vez^)...
    npm install --silent
    if %errorlevel% neq 0 (
        echo [ERROR] npm install falló. Revisa tu conexión a internet.
        pause
        exit /b 1
    )
)

:: ── 4. Compilar si falta el build ────────────────────────────
if not exist "dist\index.js" (
    echo [BUILD] Compilando TypeScript...
    npm run build
    if %errorlevel% neq 0 (
        echo [ERROR] La compilación falló. Revisa los errores arriba.
        pause
        exit /b 1
    )
)

:: ── 5. Arrancar el agente ────────────────────────────────────
echo [START] Iniciando Mando Print Agent...
echo.
node dist\index.js

pause
