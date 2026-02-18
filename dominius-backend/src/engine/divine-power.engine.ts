import { GameEngine } from './game.engine';
import { TileType } from './world.engine';

export class DivinePowerEngine {

  constructor(private game: GameEngine) {}

  terraform(x: number, y: number, type: TileType) {
    this.game.world.setTile(x, y, type);
  }

  spawnVillage(x: number, y: number, name: string) {
    return this.game.spawnVillageInternal(x, y, name);
  }

  smite(x: number, y: number, radius: number) {
    this.game.kingdoms.forEach(k => {
      k.humans = k.humans.filter(h => {
        const dist = Math.hypot(h.x - x, h.y - y);
        return dist > radius;
      });

      k.villages = k.villages.filter(v => {
        const dist = Math.hypot(v.x - x, v.y - y);
        return dist > radius;
      });
    });
  }
}
