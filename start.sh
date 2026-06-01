#!/usr/bin/env bash
set -euo pipefail

echo ""
echo " ╔═══════════════════════════════════════╗"
echo " ║     Mando Print Agent — Inicio        ║"
echo " ╚═══════════════════════════════════════╝"
echo ""

# ── 1. Comprobar Node.js ──────────────────────────────────────
if ! command -v node &>/dev/null; then
    echo "[ERROR] Node.js no está instalado."
    echo "        Instálalo con: brew install node  (macOS)"
    echo "                       nvm install --lts  (Linux/macOS)"
    exit 1
fi

# ── 2. Configurar .env si no existe ──────────────────────────
if [ ! -f ".env" ]; then
    echo "[SETUP] No se encontró .env — copiando plantilla..."
    cp .env.example .env
    echo ""
    echo " ┌─────────────────────────────────────────────────────┐"
    echo " │  Edita .env con tu MANDO_AGENT_TOKEN antes de       │"
    echo " │  continuar.                                          │"
    echo " └─────────────────────────────────────────────────────┘"
    echo ""
    # Abrir con el editor disponible
    if command -v nano &>/dev/null; then
        nano .env
    elif command -v vim &>/dev/null; then
        vim .env
    else
        open .env 2>/dev/null || true
        echo "Presiona Enter cuando hayas guardado el token..."
        read -r
    fi
fi

# ── 3. Instalar dependencias si faltan ────────────────────────
if [ ! -d "node_modules" ]; then
    echo "[INSTALL] Instalando dependencias (solo la primera vez)..."
    npm install --silent
fi

# ── 4. Compilar si falta el build ─────────────────────────────
if [ ! -f "dist/index.js" ]; then
    echo "[BUILD] Compilando TypeScript..."
    npm run build
fi

# ── 5. Arrancar el agente ─────────────────────────────────────
echo "[START] Iniciando Mando Print Agent..."
echo ""
node dist/index.js
