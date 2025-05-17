#!/bin/bash

echo "========================================"
echo "      INSTALANDO ROCKET.CHAT NO UBUNTU"
echo "========================================"

echo "[1/5] Atualizando o sistema..."
sudo apt update && sudo apt upgrade -y

echo "[2/5] Instalando Snapd..."
sudo apt install snapd -y

echo "[3/5] Instalando Rocket.Chat via Snap..."
sudo snap install rocketchat-server

echo "[4/5] Liberando porta 3000 no firewall..."
sudo ufw allow 3000/tcp

echo "[5/5] Finalizado!"
echo "Acesse o Rocket.Chat em: http://<IP_DO_SERVIDOR>:3000"

echo "========================================"
echo "  Rocket.Chat instalado com sucesso!"
echo "========================================"