import { Server, Socket } from "socket.io";
import { gameEngine } from "../engine/game.engine";

export function initWebsocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("Client connecté:", socket.id);

    // Envoi initial de l'état du monde
    socket.emit("worldUpdate", gameEngine.getWorldState());

    // Initialisation du monde depuis le frontend
    socket.on("INIT_WORLD", ({ world }) => {
      if (world) {
        gameEngine.world.grid = world;
        console.log("World initialized from frontend");
        io.emit("worldUpdate", gameEngine.getWorldState());
      }
    });

    // Actions divines
    socket.on("DIVINE_ACTION", (action) => {
      switch (action.type) {
        case "TERRAFORM":
          if (action.tileType !== undefined) {
            gameEngine.world.setTile(action.x, action.y, action.tileType);
          }
          break;

        case "SPAWN_KINGDOM":
          gameEngine.spawnKingdom(action.name);
          break;

        case "SPAWN_VILLAGE":
          // Vérifie qu'il y a au moins un royaume
          if (gameEngine.kingdoms.length === 0) {
            const kingdom = gameEngine.spawnKingdom(); // crée un royaume par défaut
            gameEngine.spawnVillageInternal(action.x, action.y, action.name!, kingdom.id);
          } else {
            // Ajoute au premier royaume existant (ou tu peux choisir un royaume spécifique)
            gameEngine.spawnVillageInternal(action.x, action.y, action.name!, gameEngine.kingdoms[0].id);
          }
          break;

        case "SPAWN_ANIMAL":
          if (action.kingdomId !== undefined && action.animalType !== undefined) {
            gameEngine.createAnimal(action.kingdomId, action.animalType, action.x, action.y);
          }
          break;

        case "SMITE":
          const radius = action.radius ?? 0;
          gameEngine.kingdoms.forEach((k) => {
            k.humans = k.humans.filter(h => Math.hypot(h.x - action.x, h.y - action.y) > radius);
            k.villages = k.villages.filter(v => Math.hypot(v.x - action.x, v.y - action.y) > radius);
            k.animals = k.animals.filter(a => Math.hypot(a.x - action.x, a.y - action.y) > radius);
          });
          break;
      }

      io.emit("worldUpdate", gameEngine.getWorldState());
    });
  });

  // Tick automatique toutes les secondes
  setInterval(() => {
    gameEngine.tick();
    io.emit("worldUpdate", gameEngine.getWorldState());
  }, 1000);
}