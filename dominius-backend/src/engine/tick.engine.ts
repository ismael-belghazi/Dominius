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

      if (Math.random() > 0.5) return;

      const dirs = [
        {dx:1, dy:0}, {dx:-1, dy:0},
        {dx:0, dy:1}, {dx:0, dy:-1}
      ];

      const {dx, dy} = dirs[Math.floor(Math.random() * dirs.length)];
      const nx = h.x + dx;
      const ny = h.y + dy;

      const tile = this.game.world.getTile(nx, ny);

      if (tile && tile.type !== 'WATER') {
        h.x = nx;
        h.y = ny;
      }

    });
  }

  // =========================
  // HUMANS
  // =========================

  private tickHumans(k: Kingdom) {
    k.humans.forEach(h => {

      h.age++;
      h.hunger += 2;

      if (h.age > 70) h.health -= 1;
      if (h.hunger > 100) h.health -= 5;

      if (h.health <= 0) return;

      this.performProfession(h, k);

    });
  }

  private performProfession(h: Human, k: Kingdom) {

    const healthFactor = h.health / 100;

    switch (h.profession) {

      case 'Farmer':
        k.resources.food += Math.floor(3 * healthFactor);
        break;

      case 'Hunter':
        if (k.animals.length > 0) {
          const prey = k.animals[0];
          prey.health -= Math.floor(10 * healthFactor);
          if (prey.health <= 0) {
            k.resources.meat += 10;
            k.animals.shift();
          }
        }
        break;

      case 'Doctor':
        h.health = Math.min(100, h.health + 2);
        break;

      case 'Teacher':
        h.intelligence = (h.intelligence || 0) + 1;
        break;
    }
  }

  // =========================
  // FOOD
  // =========================

  private handleFoodConsumption(k: Kingdom) {
    k.humans.forEach(h => {

      if (h.hunger <= 0) return;

      if (k.resources.food > 0) {
        k.resources.food--;
        h.hunger = 0;
        h.health = Math.min(100, h.health + 2);
      } else {
        h.health -= 2;
      }

    });
  }

  // =========================
  // ANIMALS
  // =========================

  private tickAnimals(k: Kingdom) {
    k.animals.forEach(a => {
      a.age++;
      a.hunger++;
      if (a.hunger > 50) a.health -= 2;
    });

    k.animals = k.animals.filter(a => a.health > 0);
  }

  private reproduceAnimals(k: Kingdom) {
    if (k.animals.length < 2) return;
    if (Math.random() > 0.1) return;

    const parent = k.animals[Math.floor(Math.random() * k.animals.length)];

    this.game.createAnimal(k.id, parent.type, parent.x, parent.y);
  }

  // =========================
  // HUMANS REPRODUCTION (LIMITED)
  // =========================

  private reproduceHumans(k: Kingdom) {

    const adults = k.humans.filter(h =>
      h.age >= 18 && h.age <= 45 && h.health > 50
    );

    if (adults.length < 2) return;
    if (Math.random() > 0.05) return;

    const parent = adults[Math.floor(Math.random() * adults.length)];

    const child = this.game.createHuman(parent.x, parent.y, k.id);
    k.humans.push(child);
  }

  // =========================
  // VILLAGES
  // =========================

  private updateVillages(k: Kingdom) {
    k.villages.forEach(v => {
      v.population = k.humans.length;
    });
  }

  // =========================
  // CLEANUP
  // =========================

  private cleanDead(k: Kingdom) {
    k.humans = k.humans.filter(h => h.health > 0);
    if (k.humans.length === 0) k.villages = [];
  }

  private cleanDeadKingdoms() {
    this.game.kingdoms =
      this.game.kingdoms.filter(k => k.humans.length > 0);
  }

}