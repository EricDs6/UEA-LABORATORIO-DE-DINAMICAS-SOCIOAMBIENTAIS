#!/bin/bash

# Atualiza o sistema
sudo apt update && sudo apt upgrade -y

# Instala dependências
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y

# Adiciona chave GPG do Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/docker.gpg

# Adiciona o repositório oficial do Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/trusted.gpg.d/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Atualiza pacotes novamente e instala o Docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io -y

# Inicia e habilita o serviço Docker
sudo systemctl start docker
sudo systemctl enable docker

# Adiciona o usuário atual ao grupo docker
sudo usermod -aG docker $USER

# Teste do Docker (requer logout/login após o usermod)
echo "Teste do Docker (pode falhar até você reiniciar a sessão):"
docker run hello-world || echo "Reinicie a sessão antes de usar o Docker sem sudo."

# Instalação do Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/2.24.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verifica a instalação
docker --version
docker-compose --version

echo "✅ Instalação concluída! Reinicie a sessão para aplicar permissões do Docker."
