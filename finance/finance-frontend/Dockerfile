# Etapa 1 - Build da aplicação
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV REACT_APP_PUBLIC_API_BASE_URL=http://69.62.91.78/api

RUN npm run build

# Etapa 2 - Servir com Nginx
FROM nginx:alpine

# Copia os arquivos de build para a pasta padrão do Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Remove a configuração padrão e adiciona a sua personalizada (opcional)
#COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
