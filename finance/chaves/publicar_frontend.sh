#!/bin/bash

# Este script é projetado para ser executado no Git Bash no Windows.
# Ele automatiza a construção e o deploy do frontend da sua aplicação.

# Define o caminho base do projeto no ambiente Git Bash
# O "C:" no Windows é mapeado para "/c/" no Git Bash
PROJECT_BASE_PATH="/c/temp/finance/finance-frontend"

echo "Iniciando processo de deploy do frontend..."

# Navega para o diretório do projeto
# Garante que o diretório existe antes de tentar mudar para ele
if [ -d "$PROJECT_BASE_PATH" ]; then
  cd "$PROJECT_BASE_PATH" || { echo "Erro: Não foi possível navegar para $PROJECT_BASE_PATH. Verifique o caminho."; exit 1; }
  echo "Diretório atual: $(pwd)"
else
  echo "Erro: O diretório $PROJECT_BASE_PATH não existe. Verifique o caminho."
  exit 1
fi

# Remove o diretório 'build' existente de forma recursiva e silenciosa
# 'rm -rf' é o equivalente Linux/Bash para 'rmdir /s/q'
echo "Removendo diretório 'build' existente..."
rm -rf build

# Executa o comando de build do npm
# Certifique-se de que Node.js e npm estão instalados e acessíveis no seu Git Bash PATH
echo "Executando 'npm run build'..."
npm run build

# Copia arquivos .env (linha comentada no original, mantida assim)
# Se você quiser ativar esta linha, descomente e certifique-se de que os caminhos estão corretos
# echo "Copiando arquivos .env (se houver)..."
# cp "$PROJECT_BASE_PATH"/*.env "$PROJECT_BASE_PATH"/build/

# Copia os arquivos da pasta 'build' para o servidor remoto usando scp
# O caminho de origem no Windows (c:\temp) é convertido para o formato Git Bash (/c/temp)
echo "Copiando arquivos para o servidor remoto via SCP..."
scp -r "$PROJECT_BASE_PATH"/build root@31.97.249.115:/webapps/finance

# Executa um script remoto no servidor via SSH
# Este comando permanece o mesmo, pois é um comando SSH padrão
echo "Executando script remoto 'compilarFrontend.sh' via SSH..."
ssh root@31.97.249.115 /webapps/scripts/compilarFrontend.sh

echo "Processo de deploy concluído."




