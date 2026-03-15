import { gameEngine } from './game.engine';
import { Kingdom } from '../models/kingdom';
import { Human } from '../models/human';
import { Village } from '../models/village';
import { Animal } from '../models/Animal';
import { TileType } from './world.engine';

export class DivinePowerEngine {

  faith: number = 1000; // points de foi initiaux

  constructor(private readonly game = gameEngine) {}

  // =========================
  // UTILITAIRE
  // =========================
  private spendFaith(cost: number): boolean {
    if (this.faith < cost) return false;
    this.faith -= cost;
    return true;
  }

  // =========================
  // TERRAFORM
  // =========================
  terraform(x: number, y: number, type: TileType): boolean {
    const cost = 5;
    if (!this.spendFaith(cost)) return false;
    this.game.terraform(x, y, type);
    return true;
  }

  // =========================
  // SPAWN KINGDOM
  // =========================
  spawnKingdom(name: string, x: number, y: number): Kingdom | null {
    if (x === undefined || y === undefined) {
      console.error("spawnKingdom requires explicit x and y coordinates");
      return null;
    }

    const cost = 200;
    if (!this.spendFaith(cost)) return null;

    const kingdomName = name || `Kingdom-${Date.now()}`;

    // Création du royaume exactement sur la case cliquée
    const newKingdom = this.game.spawnKingdom(kingdomName, x, y);
    if (!newKingdom) {
      console.error("Impossible de créer le royaume divine");
      return null;
    }

    // Création du village capital sur la case cliquée
    const capital = this.game.spawnVillageInternal(x, y, `${kingdomName}-Capital`, newKingdom.id);
    if (!capital) console.error("Impossible de créer le village capital");

    console.log(`[DivinePowerEngine] Royaume créé: ${kingdomName} à (${x},${y})`);
    return newKingdom;
  }

  // =========================
  // SPAWN VILLAGE
  // =========================
  spawnVillage(x: number, y: number, name: string, kingdomId: number): Village | null {
    const kingdom = this.game.kingdoms.find(k => k.id === kingdomId);
    if (!kingdom) return null;

    const cost = kingdom.villages.length === 0 ? 0 : 40;
    if (!this.spendFaith(cost)) return null;

    return this.game.spawnVillageInternal(x, y, name, kingdomId);
  }

  // =========================
  // SPAWN ANIMAL
  // =========================
  spawnAnimal(kingdomId: number, type: Animal['type'], x: number, y: number): Animal | null {
    const cost = 10;
    if (!this.spendFaith(cost)) return null;
    return this.game.createAnimal(kingdomId, type, x, y);
  }

  // =========================
  // SMITE
  // =========================
  smite(x: number, y: number): boolean {
    const cost = 50;
    if (!this.spendFaith(cost)) return false;

    this.game.kingdoms.forEach(k => {
      k.humans = k.humans.filter(h => !(h.x === x && h.y === y));
      k.animals = k.animals.filter(a => !(a.x === x && a.y === y));
      k.villages = k.villages.filter(v => !(v.x === x && v.y === y));
    });

    return true;
  }

  // =========================
  // HEAL
  // =========================
  heal(x: number, y: number): boolean {
    const cost = 25;
    if (!this.spendFaith(cost)) return false;

    this.game.kingdoms.forEach(k => {
      k.humans.forEach(h => {
        if (Math.abs(h.x - x) <= 2 && Math.abs(h.y - y) <= 2) {
          h.health = Math.min(100, h.health + 30);
        }
      });
    });

    return true;
  }

  // =========================
  // BLESS
  // =========================
  bless(x: number, y: number): boolean {
    const cost = 30;
    if (!this.spendFaith(cost)) return false;

    this.game.kingdoms.forEach(k => {
      k.humans.forEach(h => {
        if (Math.abs(h.x - x) <= 2 && Math.abs(h.y - y) <= 2) {
          h.intelligence = (h.intelligence || 0) + 10;
        }
      });
    });

    return true;
  }

  // =========================
  // PLAGUE
  // =========================
  plague(x: number, y: number): boolean {
    const cost = 60;
    if (!this.spendFaith(cost)) return false;

    this.game.kingdoms.forEach(k => {
      k.humans.forEach(h => {
        if (Math.abs(h.x - x) <= 2 && Math.abs(h.y - y) <= 2) {
          h.health -= 30;
        }
      });
    });

    return true;
  }
}