# Étape 1 : build de l'app React
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build la version de production
RUN npm run build

# Étape 2 : serveur Nginx pour servir les fichiers statiques
FROM nginx:alpine

# Copie les fichiers buildés dans Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]