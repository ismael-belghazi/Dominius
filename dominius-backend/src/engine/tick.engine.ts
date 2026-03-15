import { GameEngine } from './game.engine';
import { Human } from '../models/human';
import { Kingdom } from '../models/kingdom';
import { Animal } from '../models/Animal';
import { Army } from '../models/Army';
import { Village } from '../models/village';

export class TickEngine {
  constructor(private game: GameEngine) {}

  tick() {
    this.game.kingdoms.forEach(k => {
      // Initialisation sécurisée des tableaux et objets
      k.resources ??= { food: 0, meat: 0 };
      k.animals ??= [];
      k.armies ??= [];
      k.villages ??= [];
      k.allies ??= [];
      k.enemies ??= [];

      this.moveHumans(k);
      this.moveAnimals(k);

      this.tickHumans(k);
      this.tickAnimals(k);

      this.handleFoodConsumption(k);

      this.reproduceHumans(k);
      this.reproduceAnimals(k);

      this.updateVillages(k);

      this.cleanDead(k);

      this.runKingdomAI(k); // IA
    });

    this.cleanDeadKingdoms();
  }

  // =========================
  // HUMAN & ANIMAL MOVEMENT
  // =========================
  private moveHumans(k: Kingdom) {
    k.humans.forEach(h => {
      if (Math.random() > 0.5) return;
      const dirs = [{ dx:1, dy:0 }, { dx:-1, dy:0 }, { dx:0, dy:1 }, { dx:0, dy:-1 }];
      const { dx, dy } = dirs[Math.floor(Math.random()*dirs.length)];
      const nx = h.x + dx;
      const ny = h.y + dy;
      const tile = this.game.world.getTile(nx, ny);
      if (tile && tile.type !== "WATER") { h.x = nx; h.y = ny; }
    });
  }

  private moveAnimals(k: Kingdom) {
    k.animals.forEach(a => {
      if (Math.random() > 0.65) return;
      const dirs = [{ dx:1, dy:0 }, { dx:-1, dy:0 }, { dx:0, dy:1 }, { dx:0, dy:-1 }];
      const { dx, dy } = dirs[Math.floor(Math.random()*dirs.length)];
      const nx = a.x + dx;
      const ny = a.y + dy;
      const tile = this.game.world.getTile(nx, ny);
      if (tile && tile.type !== "WATER") { a.x = nx; a.y = ny; }
    });
  }

  // =========================
  // HUMANS
  // =========================
  private tickHumans(k: Kingdom) {
    k.humans.forEach(h => {
      h.age += 0.03;
      h.hunger += 2;
      const intel = h.intelligence || 0;

      // Vieillesse
      if (h.age > 60) h.health -= 0.3;
      if (h.age > 75) h.health -= 0.7;
      if (h.age > 90) h.health -= 1.5;
      if (h.age > 90 && Math.random() < 0.003) h.health = 0;

      // Famine
      if (h.hunger > 100) { h.health -= 5; h.hunger = 100; }

      if (h.health <= 0) return;

      this.performProfession(h, k, intel);
    });
  }

  private performProfession(h: Human, k: Kingdom, intel: number) {
    const healthFactor = h.health / 100;
    switch (h.profession) {
      case "Farmer":
        const nearVillage = k.villages.find(v => Math.abs(v.x-h.x)<=3 && Math.abs(v.y-h.y)<=3);
        if (nearVillage) {
          const bonus = 1 + intel*0.05;
          k.resources.food += Math.floor(5 * healthFactor * bonus);
        }
        break;
      case "Hunter":
        const prey = k.animals.find(a => Math.abs(a.x-h.x)<=2 && Math.abs(a.y-h.y)<=2);
        if (prey) {
          prey.health -= 20 * healthFactor;
          if (prey.health <= 0) {
            k.resources.meat += 20;
            k.animals = k.animals.filter(a => a.id !== prey.id);
          }
        }
        break;
      case "Breeder":
        if (k.animals.length > 40) return;
        if (Math.random() < 0.04 && k.animals.length>0) {
          const parent = k.animals[Math.floor(Math.random()*k.animals.length)];
          this.game.createAnimal(k.id, parent.type, parent.x, parent.y);
        }
        break;
      case "Cook":
        if (k.resources.meat > 0) { k.resources.meat--; k.resources.food += 4; }
        break;
      case "Teacher":
        k.humans.forEach(s => {
          if (Math.abs(s.x-h.x)<=2 && Math.abs(s.y-h.y)<=2) s.intelligence = (s.intelligence||0)+0.8;
        });
        break;
      case "Doctor":
        const patient = k.humans.find(p => p.health < 80 && Math.abs(p.x-h.x)<=2 && Math.abs(p.y-h.y)<=2);
        if (patient) { patient.health = Math.min(100, patient.health+6); }
        break;
    }
  }

  // =========================
  // FOOD & ANIMAL
  // =========================
  private handleFoodConsumption(k: Kingdom) {
    k.humans.forEach(h => {
      if (h.hunger < 20) return;
      if (k.resources.food > 0) {
        k.resources.food--;
        h.hunger = Math.max(0, h.hunger-40);
        h.health = Math.min(100, h.health+0.5);
      } else { h.health -= 3; }
    });
  }

  private tickAnimals(k: Kingdom) {
    k.animals.forEach(a => {
      a.age += 0.05;
      a.hunger += 2;
      if (a.age > 8) a.health -= 0.6;
      if (a.age > 12) a.health -= 1.5;
      if (a.hunger > 80) a.health -= 3;
    });
    k.animals = k.animals.filter(a => a.health>0);
  }

  private reproduceAnimals(k: Kingdom) {
    if (k.animals.length < 2 || k.animals.length > 60) return;
    if (Math.random() > 0.08) return;
    const parent = k.animals[Math.floor(Math.random()*k.animals.length)];
    this.game.createAnimal(k.id, parent.type, parent.x, parent.y);
  }

  private reproduceHumans(k: Kingdom) {
    const adults = k.humans.filter(h => h.age>=18 && h.age<=40 && h.health>60 && h.hunger<40);
    if (adults.length<2 || k.humans.length>200) return;
    const h1 = adults[Math.floor(Math.random()*adults.length)];
    const h2 = adults[Math.floor(Math.random()*adults.length)];
    if (h1===h2) return;
    if (Math.abs(h1.x-h2.x)<=1 && Math.abs(h1.y-h2.y)<=1 && Math.random()<0.025) {
      const baby = this.game.createHuman(h1.x,h1.y,k.id);
      baby.age=0;
      k.humans.push(baby);
    }
  }

  private updateVillages(k: Kingdom) {
    k.villages.forEach(v => {
      const villagers = k.humans.filter(h => Math.abs(h.x-v.x)<=5 && Math.abs(h.y-v.y)<=5);
      v.population = villagers.length;
    });
  }

  // =========================
  // CLEANUP
  // =========================
  private cleanDead(k: Kingdom) {
    k.humans = k.humans.filter(h => h.health>0);
    if (k.humans.length===0) { k.villages=[]; k.animals=[]; k.armies=[]; }
  }

  private cleanDeadKingdoms() {
    this.game.kingdoms = this.game.kingdoms.filter(k=>k.humans.length>0);
  }

  // =========================
  // IA & ARMIES
  // =========================
  private runKingdomAI(k: Kingdom) {
    if (!k.leader) return;

    // Agressivité → attaque
    if (k.leader.aggressiveness > 50 && k.enemies?.length) {
      const enemy = this.game.kingdoms.find(e => k.enemies!.includes(e.id));
      if (enemy && enemy.villages.length>0) {
        this.sendArmyToVillage(k, enemy.villages[0]);
      }
    }

    // Création aléatoire de village
    if (Math.random() < 0.01 && k.villages.length>0) this.createVillageForAI(k);

    // Déplacement des armées
    k.armies?.forEach(a => this.moveArmy(a));
  }

  private sendArmyToVillage(k: Kingdom, target: Village) {
    k.armies ??= [];
    const army: Army = this.game.createArmy(k.id, [{ type: 'Soldier', count: 10 }], k.villages[0].x, k.villages[0].y);
    army.destination = { x: target.x, y: target.y };
    army.status = 'marching';
  }

  private createVillageForAI(k: Kingdom) {
    const base = k.villages[0];
    const x = base.x + Math.floor(Math.random()*5)-2;
    const y = base.y + Math.floor(Math.random()*5)-2;
    const name = `AI-Village-${Date.now()}`;
    this.game.spawnVillageInternal(x,y,name,k.id);
  }

  private moveArmy(a: Army) {
    if (!a.destination) return;
    const dx = a.destination.x - a.x;
    const dy = a.destination.y - a.y;
    if (dx!==0) a.x += dx/Math.abs(dx);
    if (dy!==0) a.y += dy/Math.abs(dy);
    if (Math.abs(a.x - a.destination.x)<1 && Math.abs(a.y - a.destination.y)<1) a.status='idle';
  }
}