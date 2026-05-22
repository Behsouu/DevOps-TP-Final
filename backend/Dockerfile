# Image de base Node.js légère
FROM node:20-alpine

# Dossier de travail dans le container
WORKDIR /app

# Copie les fichiers de dépendances en premier
# (optimisation : Docker met en cache cette couche si package.json n'a pas changé)
COPY package*.json ./

# Installe uniquement les dépendances de production
RUN npm install --production

# Copie le reste du code
COPY . .

# Expose le port du serveur
EXPOSE 3000

# Commande de démarrage
CMD ["node", "index.js"]