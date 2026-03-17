import { WorldEngine, TileType } from './world.engine';
import { Kingdom } from '../models/kingdom';
import { Human, Profession } from '../models/human';
import { Village } from '../models/village';
import { TickEngine } from './tick.engine';
import { Animal } from '../models/Animal';
import { Army } from '../models/Army';

export class GameEngine {
  world: WorldEngine;
  kingdoms: Kingdom[] = [];
  tickEngine: TickEngine;

  private humanId = 1;
  private villageId = 1;
  private kingdomId = 1;
  private animalId = 1;
  private armyId = 1;

  constructor() {
    this.world = new WorldEngine(50, 50);
    this.tickEngine = new TickEngine(this);
  }

  private getNextHumanId(): number { return this.humanId++; }
  private getNextVillageId(): number { return this.villageId++; }
  private getNextKingdomId(): number { return this.kingdomId++; }
  private getNextAnimalId(): number { return this.animalId++; }
  private getNextArmyId(): number { return this.armyId++; }

  private getKingdom(id: number): Kingdom | undefined {
    return this.kingdoms.find(k => k.id === id);
  }

  private isValidTile(x: number, y: number): boolean {
    const tile = this.world.getTile(x, y);
    return !!tile && tile.type !== "WATER";
  }

  // ===============================
  // SPAWN KINGDOM
  // ===============================
  spawnKingdom(name: string, centerX: number, centerY: number): Kingdom | null {
    if (!this.isValidTile(centerX, centerY)) return null;

    const kingdom: Kingdom = {
      id: this.getNextKingdomId(),
      name,
      humans: [],
      villages: [],
      animals: [],
      armies: [],
      resources: { food: 500, meat: 200 },
      allies: [],
      enemies: [],
      leader: {
        name: `Leader-${Date.now()}`,
        aggressiveness: Math.floor(Math.random() * 100),
        diplomacy: Math.floor(Math.random() * 100),
        strategy: Math.floor(Math.random() * 100)
      }
    };

    this.kingdoms.push(kingdom);

    // Assigner les tuiles autour du royaume
    const radius = 3;
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        const tile = this.world.getTile(centerX + dx, centerY + dy);
        if (tile && tile.type !== "WATER") tile.kingdomId = kingdom.id;
      }
    }

    // Créer le village capital exactement sur la case cliquée
    const village = this.spawnVillageInternal(centerX, centerY, `${name}-Capital`, kingdom.id);
    if (!village) console.error("Impossible de créer le village capital");

    console.log(`[GameEngine] Royaume ${name} créé à la case cliquée (${centerX},${centerY})`);
    return kingdom;
  }

  // ===============================
  // SPAWN VILLAGE
  // ===============================
  spawnVillageInternal(
    x: number,
    y: number,
    name: string,
    kingdomId: number,
    kingdomParam?: Kingdom
  ): Village | null {
    if (!this.isValidTile(x, y)) return null;

    const kingdom = kingdomParam || this.getKingdom(kingdomId);
    if (!kingdom) return null;

    const village: Village = {
      id: this.getNextVillageId(),
      name,
      x,
      y,
      population: 0,
      infrastructures: []
    };
    kingdom.villages.push(village);

    const starterHumans = kingdom.villages.length === 1 ? 4 : 2;
    for (let i = 0; i < starterHumans; i++) {
      kingdom.humans.push(this.createHuman(x, y, kingdom.id));
    }

    console.log(`[GameEngine] Village créé: ${name} pour le royaume ${kingdom.name} à (${x},${y})`);
    return village;
  }

  createHuman(x: number, y: number, kingdomId: number): Human {
    return {
      id: this.getNextHumanId(),
      x, y,
      kingdomId,
      age: 18,
      health: 100,
      hunger: 0,
      profession: this.assignProfession(),
      intelligence: Math.floor(Math.random() * 10)
    };
  }

  private assignProfession(): Profession {
    const professions: Profession[] = ["Farmer", "Hunter", "Breeder", "Cook", "Teacher", "Doctor"];
    return professions[Math.floor(Math.random() * professions.length)];
  }

  terraform(x: number, y: number, type: TileType) {
    const tile = this.world.getTile(x, y);
    if (tile) tile.type = type;
  }

  createAnimal(kingdomId: number, type: Animal["type"], x: number, y: number): Animal | null {
    if (!this.isValidTile(x, y)) return null;
    const kingdom = this.getKingdom(kingdomId);
    if (!kingdom) return null;
    const animal: Animal = { id: this.getNextAnimalId(), type, x, y, age: 0, hunger: 0, health: 100 };
    kingdom.animals.push(animal);
    return animal;
  }

  createArmy(
    kingdomId: number,
    units: { type: "Soldier" | "Archer" | "Cavalry"; count: number }[],
    x: number,
    y: number
  ): Army {
    const kingdom = this.getKingdom(kingdomId);
    if (!kingdom) throw new Error("Kingdom not found");
    kingdom.armies ??= [];
    const army: Army = { id: this.getNextArmyId(), kingdomId, units, x, y, status: "idle" };
    kingdom.armies.push(army);
    return army;
  }

  buildInfrastructure(villageId: number, type: "Market" | "Mill" | "Barracks" | "Library" | "Hospital") {
    const kingdom = this.kingdoms.find(k => k.villages.some(v => v.id === villageId));
    if (!kingdom) return;
    const village = kingdom.villages.find(v => v.id === villageId);
    if (!village) return;
    const costs: Record<string, number> = { Market: 50, Mill: 30, Barracks: 40, Library: 60, Hospital: 70 };
    const cost = costs[type];
    if (kingdom.resources.food < cost) return;
    kingdom.resources.food -= cost;
    village.infrastructures.push({ type, level: 1 });
  }

  tick() { this.tickEngine.tick(); }

  getWorldState() { return { world: this.world.grid, kingdoms: this.kingdoms }; }
}

export const gameEngine = new GameEngine();