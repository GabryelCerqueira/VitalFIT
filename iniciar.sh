#!/usr/bin/env bash

# ==============================================================================
# VitalFIT - Script para iniciar Front-end e Back-end simultaneamente
# ==============================================================================

# Se executado via clique gráfico fora de um terminal, tenta abrir em um terminal
# para exibir os logs em tempo real e permitir encerrar com Ctrl+C.
if [ ! -t 1 ] && [ -z "$VITALFIT_IN_TERMINAL" ]; then
    export VITALFIT_IN_TERMINAL=1
    for term in xterm gnome-terminal xfce4-terminal konsole alacritty kitty; do
        if command -v "$term" >/dev/null 2>&1; then
            if [ "$term" = "gnome-terminal" ] || [ "$term" = "xfce4-terminal" ]; then
                exec "$term" -- bash "$0" "$@"
            else
                exec "$term" -T "VitalFIT" -e bash "$0" "$@"
            fi
        fi
    done
fi

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

PID_FILE="$PROJECT_DIR/.vitalfit.pids"

# Cores para o terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

notify() {
    if command -v notify-send >/dev/null 2>&1; then
        notify-send "$1" "$2" 2>/dev/null || true
    fi
}

echo -e "${BOLD}${CYAN}======================================================${NC}"
echo -e "${BOLD}${CYAN}               🚀 VITALFIT - DEV SERVER               ${NC}"
echo -e "${BOLD}${CYAN}======================================================${NC}"

# Função de encerramento limpo
cleanup() {
    trap - SIGINT SIGTERM SIGHUP EXIT
    echo -e "\n${YELLOW}Encerrando Front-end e Back-end...${NC}"
    rm -f "$PID_FILE"
    
    if [ -n "$BACKEND_PID" ]; then
        kill -TERM "$BACKEND_PID" 2>/dev/null
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill -TERM "$FRONTEND_PID" 2>/dev/null
    fi

    # Garante liberação das portas 3333 e 5173
    fuser -k 3333/tcp 2>/dev/null || true
    fuser -k 5173/tcp 2>/dev/null || true

    notify "VitalFIT" "Front-end e Back-end foram encerrados."
    echo -e "${GREEN}✔ Serviços encerrados com sucesso.${NC}"
    exit 0
}

# Captura sinais de encerramento
trap cleanup SIGINT SIGTERM SIGHUP EXIT

# Garante que portas antigas não estejam ocupadas antes de iniciar
fuser -k 3333/tcp 2>/dev/null || true
fuser -k 5173/tcp 2>/dev/null || true

# Verifica dependências do back-end
if [ ! -d "$PROJECT_DIR/back-end/node_modules" ]; then
    echo -e "${YELLOW}[Back-end] Instalando dependências (npm install)...${NC}"
    (cd "$PROJECT_DIR/back-end" && npm install)
fi

# Verifica dependências do front-end
if [ ! -d "$PROJECT_DIR/front-end/node_modules" ]; then
    echo -e "${YELLOW}[Front-end] Instalando dependências (npm install)...${NC}"
    (cd "$PROJECT_DIR/front-end" && npm install)
fi

notify "VitalFIT" "Iniciando Front-end e Back-end..."

# Inicia o Back-end
echo -e "${BLUE}[Back-end]${NC} Iniciando servidor Node/Express em http://localhost:3333 ..."
(cd "$PROJECT_DIR/back-end" && npm run dev) &
BACKEND_PID=$!

# Inicia o Front-end
echo -e "${GREEN}[Front-end]${NC} Iniciando Vite em http://localhost:5173 ..."
(cd "$PROJECT_DIR/front-end" && npm run dev) &
FRONTEND_PID=$!

# Grava os PIDs para controle
echo "$BACKEND_PID $FRONTEND_PID" > "$PID_FILE"

echo -e "\n${BOLD}${GREEN}✔ Front-end e Back-end iniciados com sucesso!${NC}"
echo -e "   👉 ${BOLD}Back-end:${NC}  ${CYAN}http://localhost:3333${NC}"
echo -e "   👉 ${BOLD}Front-end:${NC} ${CYAN}http://localhost:5173${NC}"
echo -e "\n${YELLOW}Pressione Ctrl+C a qualquer momento para desligar ambos.${NC}\n"

# Aguarda ambos os processos
wait "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null
