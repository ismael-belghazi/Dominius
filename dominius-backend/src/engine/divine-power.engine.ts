import { gameEngine } from './game.engine';
import { Kingdom } from '../models/kingdom';
import { Human } from '../models/human';
import { Village } from '../models/village';
import { Animal } from '../models/Animal';
import { TileType } from './world.engine';

export class DivinePowerEngine {
  constructor(private readonly game = gameEngine) {}

  // Change le type d'une case
  terraform(x: number, y: number, type: TileType): void {
    this.game.terraform(x, y, type);
  }

  // Crée un village dans un royaume existant
  spawnVillage(x: number, y: number, name: string, kingdomId: number): Village | null {
    const village = this.game.spawnVillageInternal(x, y, name, kingdomId);
    return village;
  }

  // Crée un royaume à la volée
  spawnKingdom(name?: string): Kingdom {
    return this.game.spawnKingdom(name);
  }

  // Frappe divine dans un rayon autour d'un point
  smite(x: number, y: number, radius: number): void {
    this.game.kingdoms.forEach((k: Kingdom) => {
      // Supprime les humains
      k.humans = k.humans.filter((h: Human) => Math.hypot(h.x - x, h.y - y) > radius);
      // Supprime les villages
      k.villages = k.villages.filter((v: Village) => Math.hypot(v.x - x, v.y - y) > radius);
      // Supprime les animaux
      k.animals = k.animals.filter((a: Animal) => Math.hypot(a.x - x, a.y - y) > radius);
    });
  }

  // Fait apparaître un animal dans un royaume (optionnel depuis un village)
  spawnAnimal(
    kingdomId: number,
    type: Animal['type'],
    village?: Village
  ): Animal | null {
    const k = this.game.kingdoms.find((k: Kingdom) => k.id === kingdomId);
    if (!k) return null;

    const spawnX = village?.x ?? 0;
    const spawnY = village?.y ?? 0;

    return this.game.createAnimal(k.id, type, spawnX, spawnY);
  }
}