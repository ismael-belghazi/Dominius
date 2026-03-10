import { gameEngine } from '../engine/game.engine';
import { DivinePowerEngine } from '../engine/divine-power.engine';

const divineEngine = new DivinePowerEngine(gameEngine);

export class WorldService {

  static terraform(x: number, y: number, type: any) {
    divineEngine.terraform(x, y, type);
  }

  // Spawn village en créant un royaume si nécessaire
  static spawnVillage(x: number, y: number, name: string) {
    let kingdomId: number;

    // Si aucun royaume, en crée un
    if (gameEngine.kingdoms.length === 0) {
      const newKingdom = divineEngine.spawnKingdom();
      kingdomId = newKingdom.id;
    } else {
      // Sinon prend le premier royaume existant
      kingdomId = gameEngine.kingdoms[0].id;
    }

    // Appelle spawnVillageInternal avec le kingdomId
    return gameEngine.spawnVillageInternal(x, y, name, kingdomId);
  }

  static tick() {
    gameEngine.tick();
  }

  static getState() {
    return gameEngine.getWorldState();
  }
}