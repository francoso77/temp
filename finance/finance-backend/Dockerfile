# Etapa de build: Compila o código TypeScript para JavaScript
FROM node:20 AS builder

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de configuração do projeto (package.json e package-lock.json)
# para aproveitar o cache do Docker. Se eles não mudarem, as dependências não serão reinstaladas.
COPY package*.json ./

# Instala todas as dependências (incluindo as de desenvolvimento, necessárias para a compilação)
RUN npm install

# Copia todo o código-fonte para o diretório de trabalho
COPY . .

# Executa o comando de build do NestJS.
# Isso irá compilar seu código TypeScript para JavaScript na pasta 'dist'.
# Certifique-se de que suas migrations (src/migration/*.ts) também são compiladas para dist/migration/*.js
RUN npm run build

# Etapa de produção: Cria a imagem final, mais leve, apenas com o necessário para rodar a aplicação
# Usar alpine para uma imagem menor e mais segura em produção
FROM node:20-alpine 

# Define o diretório de trabalho para a aplicação em produção
WORKDIR /app

# Copia os arquivos compilados da etapa de build para a etapa de produção
COPY --from=builder /app/dist ./dist

# Copia os arquivos de configuração do projeto novamente para instalar apenas as dependências de produção
COPY --from=builder /app/package*.json ./

# Instala apenas as dependências de produção.
# Isso garante que a imagem final não contenha bibliotecas de desenvolvimento desnecessárias.
RUN npm install --omit=dev

# Expor a porta que seu aplicativo NestJS escuta.
# No seu `data-source.ts` e nas instruções anteriores, a porta 3000 foi mencionada.
# Se seu NestJS realmente escuta na porta 4000, mantenha 4000.
# Caso contrário, ajuste para 3000.
EXPOSE 4000

# Comando para rodar o contêiner.
# Primeiro, executa as migrations do TypeORM usando o data-source compilado (dist/data-source.js)
# e as migrations compiladas (que devem estar em dist/migration/*.js).
# O '&&' garante que o aplicativo só inicie se as migrations forem bem-sucedidas.
# Certifique-se de que o script 'migration:run:prod' no seu package.json está configurado corretamente
# para usar 'dist/data-source.js' e procurar por migrations em 'dist/migration/*.js'.
# Seu script 'migration:run:prod' atual já faz isso: "npm run build && typeorm migration:run dist/data-source.js"
# No entanto, como o build já foi feito na etapa anterior, podemos simplificar aqui.
CMD ["sh", "-c", "npx typeorm migration:run -d dist/data-source.js && node dist/main"]

# Alternativa para CMD se você preferir usar o script do package.json (menos comum em CMD de produção):
# CMD ["sh", "-c", "npm run migration:run:prod && node dist/main"]
# Mas a forma com 'npx typeorm' é mais direta no ambiente Docker, pois o 'typeorm' CLI está disponível via node_modules.
