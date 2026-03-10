import { GameEngine } from './game.engine';
import { Human } from '../models/human';
import { Kingdom } from '../models/kingdom';
import { Animal } from '../models/Animal';

export class TickEngine {

  constructor(private game: GameEngine) {}

  tick() {

    this.game.kingdoms.forEach(k => {

      if (!k.resources) k.resources = { food: 0, meat: 0 };
      if (!k.animals) k.animals = [];

      this.moveHumans(k);
      this.moveAnimals(k);

      this.tickHumans(k);
      this.tickAnimals(k);

      this.handleFoodConsumption(k);

      this.reproduceHumans(k);
      this.reproduceAnimals(k);

      this.updateVillages(k);

      this.cleanDead(k);

    });

    this.cleanDeadKingdoms();

  }

  // =========================
  // MOVEMENT
  // =========================

  private moveHumans(k: Kingdom) {

    k.humans.forEach(h => {

      if (Math.random() > 0.45) return;

      const dirs = [
        { dx:1, dy:0 },
        { dx:-1, dy:0 },
        { dx:0, dy:1 },
        { dx:0, dy:-1 }
      ];

      const { dx, dy } = dirs[Math.floor(Math.random() * dirs.length)];

      const nx = h.x + dx;
      const ny = h.y + dy;

      const tile = this.game.world.getTile(nx, ny);

      if (tile && tile.type !== "WATER") {
        h.x = nx;
        h.y = ny;
      }

    });

  }

  private moveAnimals(k: Kingdom) {

    k.animals.forEach(a => {

      if (Math.random() > 0.6) return;

      const dirs = [
        { dx:1, dy:0 },
        { dx:-1, dy:0 },
        { dx:0, dy:1 },
        { dx:0, dy:-1 }
      ];

      const { dx, dy } = dirs[Math.floor(Math.random() * dirs.length)];

      const nx = a.x + dx;
      const ny = a.y + dy;

      const tile = this.game.world.getTile(nx, ny);

      if (tile && tile.type !== "WATER") {
        a.x = nx;
        a.y = ny;
      }

    });

  }

  // =========================
  // HUMANS
  // =========================

  private tickHumans(k: Kingdom) {

    k.humans.forEach(h => {

      h.age += 0.03;
      h.hunger += 2;

      // vieillesse progressive
      if (h.age > 60) h.health -= 0.3;
      if (h.age > 75) h.health -= 0.6;
      if (h.age > 90) h.health -= 1.2;

      // mort naturelle aléatoire
      if (h.age > 85 && Math.random() < 0.002) {
        h.health = 0;
      }

      // famine
      if (h.hunger > 100) {
        h.health -= 4;
        h.hunger = 100;
      }

      if (h.health <= 0) return;

      this.performProfession(h, k);

    });

  }

  // =========================
  // PROFESSIONS
  // =========================

  private performProfession(h: Human, k: Kingdom) {

    const healthFactor = h.health / 100;

    switch (h.profession) {

      // FARMER
      case "Farmer":

        const nearVillage = k.villages.find(
          v => Math.abs(v.x - h.x) <= 3 && Math.abs(v.y - h.y) <= 3
        );

        if (nearVillage) {
          k.resources.food += Math.floor(5 * healthFactor);
        }

      break;


      // HUNTER
      case "Hunter":

        const prey = k.animals.find(
          a => Math.abs(a.x - h.x) <= 1 && Math.abs(a.y - h.y) <= 1
        );

        if (prey) {

          prey.health -= 15 * healthFactor;

          if (prey.health <= 0) {
            k.resources.meat += 15;
            k.animals = k.animals.filter(a => a.id !== prey.id);
          }

        }

      break;


      // BREEDER
      case "Breeder":

        if (k.animals.length < 2) return;

        const a1 = k.animals[Math.floor(Math.random()*k.animals.length)];
        const a2 = k.animals[Math.floor(Math.random()*k.animals.length)];

        if (a1.type === a2.type && Math.random() < 0.05) {

          this.game.createAnimal(k.id, a1.type, a1.x, a1.y);

        }

      break;


      // COOK
      case "Cook":

        if (k.resources.meat > 0) {

          k.resources.meat--;
          k.resources.food += 3;

        }

      break;


      // TEACHER
      case "Teacher":

        const students = k.humans.filter(
          p => p.age < 18 &&
          Math.abs(p.x - h.x) <= 2 &&
          Math.abs(p.y - h.y) <= 2
        );

        students.forEach(s => {
          s.intelligence = (s.intelligence || 0) + 0.5;
        });

      break;


      // DOCTOR
      case "Doctor":

        const patient = k.humans.find(
          p => p.health < 80 &&
          Math.abs(p.x - h.x) <= 2 &&
          Math.abs(p.y - h.y) <= 2
        );

        if (patient) {
          patient.health = Math.min(100, patient.health + 4);
        }

      break;

    }

  }

  // =========================
  // FOOD
  // =========================

  private handleFoodConsumption(k: Kingdom) {

    k.humans.forEach(h => {

      if (h.hunger < 20) return;

      if (k.resources.food > 0) {

        k.resources.food--;

        h.hunger -= 40;

        if (h.hunger < 0) h.hunger = 0;

        h.health = Math.min(100, h.health + 0.5);

      }

      else {

        h.health -= 2;

      }

    });

  }

  // =========================
  // ANIMALS
  // =========================

  private tickAnimals(k: Kingdom) {

    k.animals.forEach(a => {

      a.age += 0.05;
      a.hunger += 2;

      if (a.age > 8) a.health -= 0.5;
      if (a.age > 12) a.health -= 1;

      if (a.hunger > 80) a.health -= 3;

    });

    k.animals = k.animals.filter(a => a.health > 0);

  }

  private reproduceAnimals(k: Kingdom) {

    if (k.animals.length < 2) return;

    if (Math.random() > 0.08) return;

    const parent = k.animals[Math.floor(Math.random()*k.animals.length)];

    this.game.createAnimal(k.id, parent.type, parent.x, parent.y);

  }

  // =========================
  // HUMAN REPRODUCTION
  // =========================

  private reproduceHumans(k: Kingdom) {

    const adults = k.humans.filter(
      h =>
        h.age >= 18 &&
        h.age <= 40 &&
        h.health > 60 &&
        h.hunger < 40
    );

    if (adults.length < 2) return;

    if (k.humans.length > 150) return;

    const h1 = adults[Math.floor(Math.random()*adults.length)];
    const h2 = adults[Math.floor(Math.random()*adults.length)];

    if (h1 === h2) return;

    if (Math.abs(h1.x - h2.x) <= 1 && Math.abs(h1.y - h2.y) <= 1) {

      if (Math.random() < 0.03) {

        const baby = this.game.createHuman(h1.x, h1.y, k.id);

        k.humans.push(baby);

      }

    }

  }

  // =========================
  // VILLAGES
  // =========================

  private updateVillages(k: Kingdom) {

    k.villages.forEach(v => {

      const villagers = k.humans.filter(
        h => Math.abs(h.x - v.x) <= 5 && Math.abs(h.y - v.y) <= 5
      );

      v.population = villagers.length;

    });

  }

  // =========================
  // CLEANUP
  // =========================

  private cleanDead(k: Kingdom) {

    k.humans = k.humans.filter(h => h.health > 0);

    if (k.humans.length === 0) {
      k.villages = [];
    }

  }

  private cleanDeadKingdoms() {

    this.game.kingdoms =
      this.game.kingdoms.filter(k => k.humans.length > 0);

  }

}