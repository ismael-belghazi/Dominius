# Dominius
Dominius est un simulateur de dieu où le joueur incarne une entité toute-puissante capable de créer, influencer et contrôler un monde vivant. Chaque décision divine impacte le développement des civilisations, la survie des humains et l’équilibre naturel.

# update documentation
npx typedoc --plugin typedoc-plugin-markdown --entryPointStrategy expand --out /documentation/docs ./src

# pour compiler le site de doc
 cd .\documentation\
 mkdocs build

# lance la nouvelle doc en web
 mkdocs serve

# lancer docker 
 cd .\dominius-backend\
 docker-compose build 
 docker-compose up

# lancer le teste client 
 cd .\dominius-backend\
 npm run start-client