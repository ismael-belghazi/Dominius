import { gameEngine } from "../engine/game.engine";
import { DivinePowerEngine } from "../engine/divine-power.engine";
import { TileType } from "../engine/world.engine";

const divineEngine = new DivinePowerEngine(gameEngine);

export class WorldService {

  // =========================
  // TERRAFORM
  // =========================
  static terraform(x: number, y: number, type: TileType) {
    const tile = gameEngine.world.getTile(x, y);
    if (!tile) throw new Error("Invalid coordinates");

    divineEngine.terraform(x, y, type);
    return tile;
  }

  // =========================
  // SPAWN KINGDOM
  // =========================
  static spawnKingdom(name?: string, x?: number, y?: number) {
    const kingdomName = name || `Kingdom-${Date.now()}`;
    const centerX = x !== undefined ? x : Math.floor(gameEngine.world.width / 2);
    const centerY = y !== undefined ? y : Math.floor(gameEngine.world.height / 2);

    // Création du royaume via GameEngine
    const newKingdom = gameEngine.spawnKingdom(kingdomName, centerX, centerY);
    if (!newKingdom) throw new Error("Kingdom creation failed");

    // Création du village capital
    const village = gameEngine.spawnVillageInternal(centerX, centerY, `${kingdomName}-Capital`, newKingdom.id);
    if (!village) console.error("Impossible de créer le village initial du royaume");

    return newKingdom;
  }

  // =========================
  // SPAWN VILLAGE
  // =========================
  static spawnVillage(x: number, y: number, name: string) {
    const tile = gameEngine.world.getTile(x, y);
    if (!tile || tile.type === "WATER") throw new Error("Village cannot be placed on water");

    let kingdomId: number;

    if (gameEngine.kingdoms.length === 0) {
      const newKingdom = divineEngine.spawnKingdom("First Kingdom", x, y);
      if (!newKingdom) throw new Error("Kingdom creation failed");
      kingdomId = newKingdom.id;
    } else {
      kingdomId = gameEngine.kingdoms[0].id;
    }

    const village = gameEngine.spawnVillageInternal(x, y, name || "Village", kingdomId);
    if (!village) throw new Error("Village creation failed");

    return village;
  }

  // =========================
  // SMITE
  // =========================
  static smite(x: number, y: number, radius = 1) {
    divineEngine.smite(x, y);
    return { x, y, radius };
  }

  // =========================
  // SPAWN ANIMAL
  // =========================
  static spawnAnimal(
    kingdomId: number,
    type: "Cow" | "Sheep" | "Pig" | "Chicken" | "Deer" | "Rabbit" | "Fish",
    x: number,
    y: number
  ) {
    const animal = gameEngine.createAnimal(kingdomId, type, x, y);
    if (!animal) throw new Error("Animal spawn failed");
    return animal;
  }

  // =========================
  // TICK
  // =========================
  static tick() {
    gameEngine.tick();
  }

  // =========================
  // WORLD STATE
  // =========================
  static getState() {
    return gameEngine.getWorldState();
  }
}