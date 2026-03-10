import { WorldEngine, TileType } from './world.engine';
import { Kingdom } from '../models/kingdom';
import { Human, Profession } from '../models/human';
import { Village } from '../models/village';
import { TickEngine } from './tick.engine';
import { Animal } from '../models/Animal';

export class GameEngine {
  world: WorldEngine;
  kingdoms: Kingdom[] = [];
  tickEngine: TickEngine;

  private humanId = 1;
  private villageId = 1;
  private kingdomId = 1;
  private animalId = 1;

  constructor() {
    this.world = new WorldEngine(50, 50);
    this.tickEngine = new TickEngine(this);
  }

  // ===============================
  // ID GENERATORS
  // ===============================
  private getNextHumanId(): number { return this.humanId++; }
  private getNextVillageId(): number { return this.villageId++; }
  private getNextKingdomId(): number { return this.kingdomId++; }
  private getNextAnimalId(): number { return this.animalId++; }

  // ===============================
  // ROYAUME
  // ===============================
  spawnKingdom(name?: string): Kingdom {
    const kingdom: Kingdom = {
      id: this.getNextKingdomId(),
      name: name || `Kingdom-${Date.now()}`,
      humans: [],
      villages: [],
      animals: [],
      resources: { food: 1000, meat: 500 },
    };
    this.kingdoms.push(kingdom);
    console.log("Nouveau royaume créé :", kingdom);
    return kingdom;
  }

  // ===============================
  // HUMANS
  // ===============================
  createHuman(x: number, y: number, kingdomId: number): Human {
    return {
      id: this.getNextHumanId(),
      x,
      y,
      kingdomId,
      age: 0,
      health: 100,
      hunger: 0,
      profession: this.assignProfession(),
      intelligence: 0
    };
  }

  private assignProfession(): Profession {
    const professions: Profession[] = ['Farmer', 'Hunter', 'Breeder', 'Cook', 'Teacher', 'Doctor'];
    return professions[Math.floor(Math.random() * professions.length)];
  }

  // ===============================
  // VILLAGE
  // ===============================
  spawnVillageInternal(x: number, y: number, name: string, kingdomId: number): Village | null {
    const tile = this.world.getTile(x, y);
    if (!tile || tile.type === 'WATER') return null;

    const kingdom = this.kingdoms.find(k => k.id === kingdomId);
    if (!kingdom) return null;

    const village: Village = {
      id: this.getNextVillageId(),
      name,
      x,
      y,
      population: 2,
      infrastructures: [],
    };

    kingdom.villages.push(village);

    // Ajout initial de 2 humains au village
    for (let i = 0; i < 2; i++) {
      kingdom.humans.push(this.createHuman(x, y, kingdom.id));
    }

    return village;
  }

  // ===============================
  // TERRAFORM
  // ===============================
  terraform(x: number, y: number, type: TileType): void {
    const tile = this.world.getTile(x, y);
    if (!tile) return;
    tile.type = type;
  }

  // ===============================
  // ANIMALS
  // ===============================
  createAnimal(
    kingdomId: number,
    animalType: 'Cow' | 'Sheep' | 'Pig' | 'Chicken' | 'Deer' | 'Rabbit' | 'Fish',
    x: number,
    y: number
  ): Animal | null {
    const kingdom = this.kingdoms.find(k => k.id === kingdomId);
    if (!kingdom) return null;

    const animal: Animal = {
      id: this.getNextAnimalId(),
      type: animalType,
      x,
      y,
      age: 0,
      hunger: 0,
      health: 100
    };

    kingdom.animals.push(animal);
    return animal;
  }

  // ===============================
  // INFRASTRUCTURE
  // ===============================
  buildInfrastructure(
    villageId: number,
    type: 'Market' | 'Mill' | 'Barracks' | 'Library' | 'Hospital'
  ): void {
    const kingdom = this.kingdoms.find(k =>
      k.villages.some(v => v.id === villageId)
    );
    if (!kingdom) return;

    const village = kingdom.villages.find(v => v.id === villageId);
    if (!village) return;

    const costs: Record<string, number> = {
      Market: 50,
      Mill: 30,
      Barracks: 40,
      Library: 60,
      Hospital: 70
    };

    const cost = costs[type];
    if (kingdom.resources.food < cost) return;

    kingdom.resources.food -= cost;
    village.infrastructures.push({ type, level: 1 });
  }

  // ===============================
  // TICK
  // ===============================
  tick(): void {
    this.tickEngine.tick();
  }

  // ===============================
  // WORLD STATE
  // ===============================
  getWorldState() {
    return {
      world: this.world.grid,
      kingdoms: this.kingdoms
    };
  }
}

// Instance globale
export const gameEngine = new GameEngine();