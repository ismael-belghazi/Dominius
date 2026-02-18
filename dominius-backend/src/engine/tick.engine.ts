import { GameEngine } from './game.engine';
import { Human } from '../models/human';
import { Kingdom } from '../models/kingdom';
import { Animal } from '../models/Animal';
import { Infrastructure, Village } from '../models/village';

export class TickEngine {
  constructor(private game: GameEngine) {}

  tick() {
    this.game.kingdoms.forEach(k => {
      if (!k.resources) k.resources = { food: 0, meat: 0 };
      if (!k.animals) k.animals = [];

      this.tickHumans(k);
      this.tickAnimals(k);
      this.handleFoodConsumption(k);
      this.reproduceHumans(k);
      this.tickVillages(k);
      this.cleanDead(k);
      this.reproduceAnimals(k);
      this.handleInfrastructures(k);
    });

    this.cleanDeadKingdoms();
  }

  private tickHumans(k: Kingdom) {
    k.humans.forEach(h => {
      h.age += 1;
      h.hunger += 2;

      if (h.age > 70) h.health -= Math.floor((h.age - 70) / 2);
      if (h.hunger > 100) h.health -= 5;

      if (h.age >= 18 && h.age <= 60 && h.health > 30) {
        this.performProfession(h, k);
      }

      if (h.profession === 'Teacher' && h.age <= 65 && h.health > 30) {
        this.shareKnowledge(h, k);
      }
    });
  }

  private performProfession(h: Human, k: Kingdom) {
    const healthFactor = h.health / 100;

    switch (h.profession) {
      case 'Farmer':
        k.resources.food += Math.floor(5 * healthFactor);
        break;

      case 'Hunter':
        if (k.animals.length > 0) {
          const prey = k.animals[0];
          prey.health -= Math.floor(10 * healthFactor);
          k.resources.meat += Math.floor(5 * healthFactor);
          if (prey.health <= 0) k.animals.shift();
        }
        break;

      case 'Breeder':
        k.animals.forEach(a => a.health = Math.min(100, a.health + Math.floor(2 * healthFactor)));
        break;

      case 'Cook':
        const meatUsed = Math.min(k.resources.meat, 5);
        k.resources.meat -= meatUsed;
        k.resources.food += meatUsed * 2;
        break;

      case 'Doctor':
        h.health = Math.min(100, h.health + 3);
        break;

      case 'Teacher':
        h.intelligence = (h.intelligence || 0) + 1;
        break;
    }
  }

  private handleFoodConsumption(k: Kingdom) {
    k.villages.forEach(v => {
      const villageHumans = k.humans.filter(h => h.age <= 60);
      const farmer = villageHumans.find(h => h.profession === 'Farmer' && h.health > 30);
      const consumers = villageHumans.filter(h => h !== farmer);

      if (farmer) this.feedHuman(farmer, k);
      consumers.forEach(h => this.feedHuman(h, k));
    });
  }

  private feedHuman(h: Human, k: Kingdom) {
    if (h.hunger <= 0) return;

    let foodEaten = Math.min(k.resources.food, h.hunger);
    if (foodEaten > 0) {
      h.hunger = 0;
      k.resources.food -= foodEaten;
      h.health = Math.min(100, h.health + foodEaten);
      return;
    }

    let meatEaten = Math.min(k.resources.meat, h.hunger);
    if (meatEaten > 0) {
      h.hunger = 0;
      k.resources.meat -= meatEaten;
      h.health = Math.min(100, h.health + meatEaten);
      return;
    }

    h.health -= 2;
  }

  private tickAnimals(k: Kingdom) {
    k.animals.forEach(a => {
      a.age += 1;
      a.hunger += 1;
      if (a.hunger > 50) a.health -= 2;
    });

    k.animals = k.animals.filter(a => a.health > 0);
  }

  private reproduceHumans(k: Kingdom) {
    k.villages.forEach(v => {
      const adults = k.humans.filter(h => h.age >= 18 && h.age <= 45 && h.health > 40);
      if (adults.length < 2) return;

      const villageHumans = k.humans.filter(h => h.age <= 60);
      const foodFactor = k.resources.food / Math.max(1, villageHumans.length);
      const populationFactor = Math.max(0, 1 - villageHumans.length / 100);
      const reproductionChance = Math.min(0.5, 0.05 + foodFactor * 0.03) * populationFactor;

      adults.forEach(h1 => {
        if (Math.random() > reproductionChance) return;

        let h2 = adults[Math.floor(Math.random() * adults.length)];
        while (h2 === h1) h2 = adults[Math.floor(Math.random() * adults.length)];

        const child = this.game.createHuman(v.x, v.y, k.id);
        child.intelligence = Math.floor(
          ((h1.intelligence || 0) + (h2.intelligence || 0)) / 2 + Math.random() * 5
        );

        k.humans.push(child);
      });
    });
  }

  private reproduceAnimals(k: Kingdom) {
    const animalTypes = Array.from(new Set(k.animals.map(a => a.type)));

    animalTypes.forEach(type => {
      const animalsOfType = k.animals.filter(a => a.type === type);
      if (animalsOfType.length < 2) return;

      const foodFactor = k.resources.food / Math.max(1, animalsOfType.length);
      const reproductionChance = Math.min(0.5, 0.05 + foodFactor * 0.03);

      animalsOfType.forEach(a1 => {
        if (Math.random() > reproductionChance) return;

        let a2 = animalsOfType[Math.floor(Math.random() * animalsOfType.length)];
        while (a2 === a1) a2 = animalsOfType[Math.floor(Math.random() * animalsOfType.length)];

        const child: Animal = {
          id: this.game.getNextAnimalId(),
          type,
          age: 0,
          hunger: 0,
          health: 100,
          x: a1.x,
          y: a1.y
        };
        k.animals.push(child);
      });
    });
  }

  private shareKnowledge(h: Human, k: Kingdom) {
    const hInt = h.intelligence || 0;
    if (hInt < 1 || h.age > 65) return;

    k.humans.forEach(other => {
      if (other === h) return;

      const otherInt = other.intelligence || 0;
      if (otherInt < hInt) other.intelligence = Math.min(100, otherInt + 1);
    });
  }

  private tickVillages(k: Kingdom) {
    k.villages.forEach(v => {
      const villageHumans = k.humans.filter(h => h.age <= 60);
      v.population = villageHumans.length;
    });
  }

  private cleanDead(k: Kingdom) {
    k.humans = k.humans.filter(h => h.health > 0);
    if (k.humans.length === 0) k.villages = [];
  }

  private cleanDeadKingdoms() {
    this.game.kingdoms = this.game.kingdoms.filter(k => k.humans.length > 0);
  }

  private handleInfrastructures(k: Kingdom) {
    k.villages.forEach(v => {
      v.infrastructures.forEach(infra => {
        switch (infra.type) {
          case 'Market':
            k.resources.food += Math.floor(k.resources.food * 0.1);
            break;
          case 'Mill':
            k.resources.food += Math.floor(k.resources.food * 0.5);
            break;
        }
      });
    });
  }

  spawnAnimal(
    kingdom: Kingdom,
    animalType: 'Cow' | 'Sheep' | 'Pig' | 'Chicken' | 'Deer' | 'Rabbit' | 'Fish'
  ) {
    const animal: Animal = {
      id: kingdom.animals.length + 1,
      type: animalType,
      age: 0,
      hunger: 0,
      health: 100,
      x: 0,
      y: 0
    };
    kingdom.animals.push(animal);
  }

  buildInfrastructure(
    village: Village,
    type: 'Market' | 'Mill' | 'Barracks' | 'Library' | 'Hospital'
  ) {
    const infra: Infrastructure = { type, level: 1 };
    village.infrastructures.push(infra);

    const kingdom = this.game.kingdoms.find(k => k.villages.includes(village));
    if (!kingdom) return;

    if (type === 'Market' && kingdom.resources.food >= 50) kingdom.resources.food -= 50;
    else if (type === 'Mill' && kingdom.resources.food >= 30) kingdom.resources.food -= 30;
  }
}
