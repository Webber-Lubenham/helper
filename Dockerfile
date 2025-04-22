# Imagem base Node.js
FROM node:18-alpine

# Diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Expor porta da aplicação
EXPOSE 3004

# Comando para iniciar a aplicação
CMD ["npm", "start"]