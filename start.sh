#!/usr/bin/env bash

# SCRIPT DE INICIO DEL PROYECTO
# Uso: bash ./start.sh

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🚀 B3RM3LL0N.GITHUB.IO - SERVIDOR LOCAL                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Detectar el puerto disponible
PORT=8000

# Verificar si Python está disponible
if command -v python3 &> /dev/null; then
    echo "✅ Python 3 encontrado"
    echo ""
    echo "🌐 Iniciando servidor en http://localhost:$PORT"
    echo ""
    echo "💡 Presiona Ctrl+C para detener el servidor"
    echo ""
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    echo "✅ Python encontrado"
    echo ""
    echo "🌐 Iniciando servidor en http://localhost:$PORT"
    echo ""
    echo "💡 Presiona Ctrl+C para detener el servidor"
    echo ""
    python -m http.server $PORT
elif command -v npx &> /dev/null; then
    echo "✅ Node.js encontrado"
    echo ""
    echo "🌐 Iniciando servidor en http://localhost:$PORT"
    echo ""
    echo "💡 Presiona Ctrl+C para detener el servidor"
    echo ""
    npx http-server -p $PORT
else
    echo "❌ No se encontró Python ni Node.js"
    echo ""
    echo "Instala uno de estos:"
    echo "  - Python: https://python.org"
    echo "  - Node.js: https://nodejs.org"
    exit 1
fi
