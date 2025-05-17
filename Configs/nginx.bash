# ╭────────────────────────────────────────────────────────────╮
# │     INSTALAÇÃO E CONFIGURAÇÃO DO NGINX COM SITE DO GITHUB  │
# ╰────────────────────────────────────────────────────────────╯

# ▶ 1. Defina as variáveis do seu projeto
DOMINIO="seusite.com"   # Nome do site (pode ser um domínio ou IP fixo)
REPO="https://github.com/Eric0304-dev/seu-repositorio.git"  # Link do seu repositório GitHub

# ▶ 2. Atualize o sistema e instale Git + Nginx
sudo apt update && sudo apt upgrade -y
sudo apt install nginx git -y

# ▶ 3. Crie a estrutura do site e clone os arquivos do GitHub
sudo mkdir -p /var/www/$DOMINIO/html
sudo git clone $REPO /var/www/$DOMINIO/html
sudo chown -R $USER:$USER /var/www/$DOMINIO/html

# ▶ 4. Crie o arquivo de configuração do Nginx
sudo tee /etc/nginx/sites-available/$DOMINIO > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMINIO www.$DOMINIO;

    root /var/www/$DOMINIO/html;
    index index.html index.htm;

    location / {
        try_files \$uri \$uri/ =404;
    }
}
EOF

# ▶ 5. Ative o site e desative o padrão (opcional)
sudo ln -s /etc/nginx/sites-available/$DOMINIO /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# ▶ 6. Teste e reinicie o Nginx
sudo nginx -t
sudo systemctl reload nginx

# ▶ 7. Libere o firewall (se estiver usando UFW)
sudo ufw allow 'Nginx Full'

# ✔ Finalizado!
# O site está ativo e sendo servido via Nginx a partir do repositório GitHub!
# Acesse o site pelo domínio ou IP fixo configurado.
# Para verificar o status do Nginx, use: ip http://ipsudo a