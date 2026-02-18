import { gameEngine } from '../engine/game.engine';
import { DivinePowerEngine } from '../engine/divine-power.engine';

const divineEngine = new DivinePowerEngine(gameEngine);

export class WorldService {

  static terraform(x: number, y: number, type: any) {
    divineEngine.terraform(x, y, type);
  }

  static spawnVillage(x: number, y: number, name: string) {
    return divineEngine.spawnVillage(x, y, name);
  }

  static tick() {
    gameEngine.tick();
  }

  static getState() {
    return gameEngine.getWorldState();
  }
}
