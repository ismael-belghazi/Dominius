import { Server, Socket } from "socket.io";
import { gameEngine } from "../engine/game.engine";

export function initWebsocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("Client connecté:", socket.id);

    // Envoi initial de l'état du monde
    socket.emit("WORLD_UPDATE", gameEngine.getWorldState());

    // Initialisation du monde depuis le frontend
    socket.on("INIT_WORLD", ({ world }) => {
      if (world) {
        gameEngine.world.grid = world;
        console.log("World initialized from frontend");
        io.emit("WORLD_UPDATE", gameEngine.getWorldState());
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
          if (gameEngine.kingdoms.length === 0) {
            const kingdom = gameEngine.spawnKingdom(); // royaume par défaut
            gameEngine.spawnVillageInternal(action.x, action.y, action.name!, kingdom.id);
          } else {
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
      // Pas besoin d’émettre ici si le tick automatique est actif
      // io.emit("WORLD_UPDATE", gameEngine.getWorldState());
    });
  });

  // Tick automatique toutes les secondes
  setInterval(() => {
    gameEngine.tick();
    io.emit("WORLD_UPDATE", gameEngine.getWorldState());
  }, 1000);
}