#!/usr/bin/env bash

# ==============================================================================
# VitalFIT - Script para desligar Front-end e Back-end
# ==============================================================================

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$PROJECT_DIR/.vitalfit.pids"

notify() {
    if command -v notify-send >/dev/null 2>&1; then
        notify-send "$1" "$2" 2>/dev/null || true
    fi
}

echo "Encerrando serviços do VitalFIT..."

# Finaliza processos registrados no PID_FILE
if [ -f "$PID_FILE" ]; then
    read -r BACKEND_PID FRONTEND_PID < "$PID_FILE"
    [ -n "$BACKEND_PID" ] && kill -TERM "$BACKEND_PID" 2>/dev/null
    [ -n "$FRONTEND_PID" ] && kill -TERM "$FRONTEND_PID" 2>/dev/null
    rm -f "$PID_FILE"
fi

# Garante que portas 3333 e 5173 sejam liberadas
fuser -k 3333/tcp 2>/dev/null || true
fuser -k 5173/tcp 2>/dev/null || true

notify "VitalFIT" "Front-end e Back-end foram encerrados."
echo "✔ VitalFIT finalizado com sucesso."
