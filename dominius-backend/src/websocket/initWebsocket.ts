import { Server, Socket } from "socket.io";
import { gameEngine } from "../engine/game.engine";
import { DivinePowerEngine } from "../engine/divine-power.engine";

const divineEngine = new DivinePowerEngine();
let divinePoints = 0;

export function initWebsocket(io: Server) {

  io.on("connection", (socket: Socket) => {
    console.log("Client connecté:", socket.id);

    // =========================
    // WORLD INIT
    // =========================
    socket.emit("WORLD_UPDATE", {
      ...gameEngine.getWorldState(),
      divinePoints
    });

    socket.on("INIT_WORLD", ({ world }) => {
      if (!world) return;
      gameEngine.world.grid = world;
      console.log("World initialized from frontend");
      io.emit("WORLD_UPDATE", {
        ...gameEngine.getWorldState(),
        divinePoints
      });
    });

    // =========================
    // DIVINE ACTIONS
    // =========================
    socket.on("DIVINE_ACTION", (action) => {

      const x = Number(action.x);
      const y = Number(action.y);

      switch (action.type) {

        case "TERRAFORM": {
          if (divinePoints < 1 || isNaN(x) || isNaN(y)) return;
          divineEngine.terraform(x, y, action.tileType);
          divinePoints -= 1;
          break;
        }

        case "SPAWN_KINGDOM": {
          if (divinePoints < 20 || isNaN(x) || isNaN(y)) return;

          const newKingdom = divineEngine.spawnKingdom(action.name, x, y);
          if (!newKingdom) {
            console.error("Impossible de créer le royaume divine");
            return;
          }

          divinePoints -= 20;
          console.log(`[DIVINE] Royaume créé: ${newKingdom.name} avec id=${newKingdom.id} à (${x},${y})`);
          break;
        }

        case "SPAWN_VILLAGE": {
          if (isNaN(x) || isNaN(y)) return;

          let kingdomId: number;
          if (gameEngine.kingdoms.length === 0) {
            const k = divineEngine.spawnKingdom("First Kingdom", x, y);
            if (!k) return;
            kingdomId = k.id;
          } else {
            kingdomId = gameEngine.kingdoms[0].id;
          }

          const village = divineEngine.spawnVillage(
            x,
            y,
            action.name || "Village",
            kingdomId
          );
          if (!village) return;

          if (gameEngine.kingdoms.length > 1) divinePoints -= 10;
          break;
        }

        case "SPAWN_ANIMAL": {
          if (divinePoints < 2 || isNaN(x) || isNaN(y)) return;
          if (action.kingdomId !== undefined && action.animalType !== undefined) {
            divineEngine.spawnAnimal(
              action.kingdomId,
              action.animalType,
              x,
              y
            );
            divinePoints -= 2;
          }
          break;
        }

        case "SMITE": {
          if (divinePoints < 15 || isNaN(x) || isNaN(y)) return;
          divineEngine.smite(x, y);
          divinePoints -= 15;
          break;
        }

      }

      io.emit("WORLD_UPDATE", {
        ...gameEngine.getWorldState(),
        divinePoints
      });
    });
  });

  // =========================
  // GAME TICK
  // =========================
  setInterval(() => {
    gameEngine.tick();

    const population = gameEngine.kingdoms.reduce(
      (acc, k) => acc + k.humans.length,
      0
    );
    divinePoints += population * 0.02;

    io.emit("WORLD_UPDATE", {
      ...gameEngine.getWorldState(),
      divinePoints
    });
  }, 1000);
}