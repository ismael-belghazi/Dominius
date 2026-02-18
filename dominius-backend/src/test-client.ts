import { io } from 'socket.io-client';

interface Human {
  id: number;
  profession: string;
  age: number;
  health: number;
  hunger: number;
  intelligence?: number;
}

interface Village {
  id: number;
  name: string;
  x: number;
  y: number;
  population: number;
}

interface Animal {
  id: number;
  type: string;
  age: number;
  hunger: number;
}

interface Kingdom {
  id: number;
  name: string;
  humans: Human[];
  villages: Village[];
  animals?: Animal[];
  resources?: {
    food: number;
    meat: number;
  };
}

interface WorldState {
  kingdoms: Kingdom[];
  world?: any;
}

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log(`Connecté au serveur, id: ${socket.id}`);

  socket.emit('DIVINE_ACTION', { type: 'SPAWN_VILLAGE', x: 10, y: 10, name: 'Village-A' });
  socket.emit('DIVINE_ACTION', { type: 'SPAWN_VILLAGE', x: 15, y: 12, name: 'Village-B' });

  socket.emit('DIVINE_ACTION', { type: 'SPAWN_ANIMAL', kingdomId: 1, animalType: 'Cow' });
  socket.emit('DIVINE_ACTION', { type: 'SPAWN_ANIMAL', kingdomId: 1, animalType: 'Sheep' });

  setInterval(() => {
    socket.emit('REQUEST_TICK');
  }, 2000);

  setTimeout(() => {
    socket.emit('DIVINE_ACTION', { type: 'BLESS', kingdomId: 1 });
  }, 5000);
});

function handleAnimalActions(kingdom: Kingdom) {
  const animals = kingdom.animals ?? [];
  const resources = kingdom.resources ?? { food: 0, meat: 0 };

  kingdom.humans.forEach((human) => {
    if (human.profession === 'Farmer') {
      animals.forEach((animal) => {
        if (animal.hunger > 50) {
          animal.hunger = Math.max(0, animal.hunger - 30);
          console.log(`Le fermier nourrit l'animal ${animal.type} (id:${animal.id}) -> faim: ${animal.hunger}`);
        }
      });
    }

    if (human.profession === 'Hunter') {
      for (let i = animals.length - 1; i >= 0; i--) {
        const animal = animals[i];
        if (animal.hunger > 80) {
          console.log(`Le chasseur tue l'animal ${animal.type} (id:${animal.id})`);
          animals.splice(i, 1);
          resources.meat += 10;
          console.log(`Viande ajoutée +10 -> total: ${resources.meat}`);
        }
      }
    }
  });

  kingdom.animals = animals;
  kingdom.resources = resources;
}

socket.on('WORLD_UPDATE', (state: WorldState) => {
  console.clear();
  console.log('===== État actuel du monde =====');

  state.kingdoms.forEach((kingdom) => {
    console.log(`\nRoyaume ${kingdom.name} (id:${kingdom.id})`);
    const resources = kingdom.resources ?? { food: 0, meat: 0 };
    console.log(`  Ressources: nourriture=${resources.food}, viande=${resources.meat}`);

    console.log('  Villages:');
    kingdom.villages.forEach((v) => {
      console.log(`    - ${v.name} [Population: ${v.population}]`);
    });

    console.log('  Humains:');
    kingdom.humans.forEach((h) => {
      console.log(
        `    - id:${h.id}, métier:${h.profession}, âge:${h.age}, santé:${h.health}, faim:${h.hunger}, intelligence:${h.intelligence ?? 0}`
      );
    });

    const animals = kingdom.animals ?? [];
    if (animals.length > 0) {
      console.log('  Animaux:');
      animals.forEach((a) => {
        console.log(`    - ${a.type} id:${a.id}, âge:${a.age}, faim:${a.hunger}`);
      });
    }

    handleAnimalActions(kingdom);

    console.log('--------------------------------');
  });
});
