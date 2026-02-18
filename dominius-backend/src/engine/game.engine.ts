import { WorldEngine, TileType } from './world.engine';
import { Kingdom } from '../models/kingdom';
import { Human, Profession } from '../models/human';
import { Village, Infrastructure } from '../models/village';
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

  getNextHumanId() { return this.humanId++; }
  getNextVillageId() { return this.villageId++; }
  getNextKingdomId() { return this.kingdomId++; }
  getNextAnimalId() { return this.animalId++; }

  createHuman(x: number, y: number, kingdomId: number): Human {
    return {
      id: this.getNextHumanId(),
      x,
      y,
      kingdomId,
      age: 0,
      health: 100,
      hunger: 0,
      profession: this.assignProfession()
    };
  }

  private assignProfession(): Profession {
    const professions: Profession[] = ['Farmer', 'Hunter', 'Breeder', 'Cook', 'Teacher', 'Doctor'];
    return professions[Math.floor(Math.random() * professions.length)];
  }

  spawnVillageInternal(x: number, y: number, name: string) {
    const tile = this.world.getTile(x, y);
    if (!tile || tile.type === 'WATER') return null;

    const kingdom: Kingdom = {
      id: this.getNextKingdomId(),
      name: `Kingdom-${Date.now()}`,
      humans: [],
      villages: [],
      animals: [],
      resources: { food: 0, meat: 0 }
    };

    const village: Village = {
      id: this.getNextVillageId(),
      name,
      x,
      y,
      population: 2,
      infrastructures: []
    };

    kingdom.villages.push(village);

    for (let i = 0; i < 2; i++) {
      kingdom.humans.push(this.createHuman(x, y, kingdom.id));
    }

    this.kingdoms.push(kingdom);
    return kingdom;
  }

  tick() {
    this.tickEngine.tick();
  }

  terraform(x: number, y: number, type: TileType) {
    this.world.setTile(x, y, type);
  }

  getWorldState() {
    return {
      world: this.world.grid,
      kingdoms: this.kingdoms
    };
  }

  spawnAnimal(
    kingdomId: number,
    animalType: 'Cow' | 'Sheep' | 'Pig' | 'Chicken' | 'Deer' | 'Rabbit' | 'Fish',
    village?: Village
  ) {
    const kingdom = this.kingdoms.find(k => k.id === kingdomId);
    if (!kingdom) return null;

    if (!kingdom.animals) kingdom.animals = [];

    const x = village ? village.x : 0;
    const y = village ? village.y : 0;

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

  // Construction d'une infrastructure
  buildInfrastructure(
    village: Village,
    type: 'Market' | 'Mill' | 'Barracks' | 'Library' | 'Hospital'
  ) {
    const kingdom = this.kingdoms.find(k => k.villages.includes(village));
    if (!kingdom || !kingdom.resources) return;

    const costs: Record<string, number> = {
      Market: 50,
      Mill: 30,
      Barracks: 40,
      Library: 60,
      Hospital: 70
    };

    const cost = costs[type];
    if (kingdom.resources.food >= cost) {
      kingdom.resources.food -= cost;
      const infrastructure: Infrastructure = { type, level: 1 };
      village.infrastructures.push(infrastructure);
      console.log(`${type} construite dans le village ${village.name}`);
    } else {
      console.log(`Pas assez de nourriture pour construire ${type} dans le village ${village.name}`);
    }
  }
}

export const gameEngine = new GameEngine();
