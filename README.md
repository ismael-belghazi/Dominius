# Dominius
Dominius est un simulateur de dieu où le joueur incarne une entité toute-puissante capable de créer, influencer et contrôler un monde vivant. Chaque décision divine impacte le développement des civilisations, la survie des humains et l’équilibre naturel.

# update documentation
npx typedoc --plugin typedoc-plugin-markdown --entryPointStrategy expand --out /documentation/docs ./src

# pour compiler le site de doc
 cd .\documentation\
 mkdocs build

# lance la nouvelle doc en web
 mkdocs serve

# lancer l'application en local
cd .\dominius-backend\
npm install
npm run build          # compile le TypeScript
npm start              # démarre le serveur sur le port 3000

# le backend sert également le frontend, ouvrez http://localhost:3000 dans un navigateur.

# avec Docker
cd .\
docker-compose up --build
# cette commande crée deux conteneurs :
#   * backend (port 3000 sur la machine) - sert l'API et la logique du jeu
#   * frontend (port 8080) - contient l'interface web statique (nginx)
# ouvrez http://localhost:8080 pour voir l'UI ; elle se connectera au backend
# sur http://localhost:3000 (les sockets sont configurés dynamiquement :
# le client envoie les requêtes vers le port exposé par docker).
#
# lancer le teste client (utilitaire de développement)
cd .\dominius-backend\npm run start-client