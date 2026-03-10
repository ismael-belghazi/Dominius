import express from 'express';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { gameEngine } from './engine/game.engine';
import worldRoutes from './routes/worldRoutes';
import errorHandler from './middleware/errorHandler';
import { DivinePowerEngine } from './engine/divine-power.engine';

const app = express();
const divineEngine = new DivinePowerEngine(gameEngine);

// middleware JSON + routes REST
app.use(express.json());
app.use('/api/world', worldRoutes);
app.use(errorHandler);

// frontend
const frontendDir = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendDir));
app.get('/', (_req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

// ======================
// GAME LOOP GLOBAL
// ======================
let tickCount = 0;
setInterval(() => {
  tickCount++;
  gameEngine.tick();
  const state = gameEngine.getWorldState();
  io.emit('WORLD_UPDATE', state);

  // log résumé du monde pour debugging
  console.log(`\n[tick ${tickCount}] royaume(s)=${state.kingdoms.length}`);
  state.kingdoms.forEach(k => {
    console.log(
      `  ${k.name} (id:${k.id}) humans=${k.humans.length} villages=${k.villages.length} animals=${k.animals?.length || 0} resources=${JSON.stringify(k.resources)}`
    );
  });
}, 1000);

// ======================
// WEBSOCKET
// ======================
io.on('connection', (socket) => {
  console.log('Client connecté:', socket.id);
  socket.emit('WORLD_INIT', gameEngine.getWorldState());

  socket.on('DIVINE_ACTION', (action: any) => {
    try {
      console.log('Action divine reçue :', action);
      handleDivineAction(action);
      const state = gameEngine.getWorldState();
      socket.emit('WORLD_UPDATE', state);
    } catch (error) {
      console.error('Erreur lors de l\'exécution de l\'action divine:', error);
    }
  });

  socket.on('SET_MAP', (grid: any[]) => {
    console.log('Carte reçue du client, dimensions', grid.length, 'x', grid[0]?.length);
    if (Array.isArray(grid) && grid.length > 0) {
      gameEngine.world.grid = grid;
      io.emit('WORLD_UPDATE', gameEngine.getWorldState());
    } else {
      console.warn('Format de carte invalide reçu');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté:', socket.id);
  });
});

// ======================
// DIVINE ACTION HANDLER
// ======================
function handleDivineAction(action: any) {
  if (!action || typeof action.x !== 'number' || typeof action.y !== 'number') {
    throw new Error('Action divine malformée, x et y doivent être des nombres');
  }

  switch(action.type) {
    case 'TERRAFORM':
      if (!action.tileType) throw new Error('Action TERRAFORM manquante de tileType');
      gameEngine.terraform(action.x, action.y, action.tileType);
      break;

    case 'SPAWN_VILLAGE':
      if (!action.name) throw new Error('Action SPAWN_VILLAGE manquante de name');

      // Assure qu'il y a un royaume pour accueillir le village
      let kingdomId: number;
      if (gameEngine.kingdoms.length === 0) {
        const newKingdom = divineEngine.spawnKingdom();
        kingdomId = newKingdom.id;
      } else {
        kingdomId = gameEngine.kingdoms[0].id;
      }

      const kingdom = gameEngine.spawnVillageInternal(action.x, action.y, action.name, kingdomId);
      console.log('spawnVillageInternal returned', kingdom);
      break;

    case 'SMITE':
      if (!action.radius) throw new Error('Action SMITE manquante de radius');
      gameEngine.kingdoms.forEach(k => {
        k.humans = k.humans.filter(h => Math.hypot(h.x-action.x, h.y-action.y) > action.radius);
        k.villages = k.villages.filter(v => Math.hypot(v.x-action.x, v.y-action.y) > action.radius);
        k.animals = k.animals.filter(a => Math.hypot(a.x-action.x, a.y-action.y) > action.radius);
      });
      break;

    case 'SPAWN_ANIMAL':
      if (typeof action.kingdomId !== 'number' || !action.animalType) throw new Error('Action SPAWN_ANIMAL malformée');
      const res = gameEngine.createAnimal(action.kingdomId, action.animalType, action.x, action.y);
      console.log('spawnAnimal result', res);
      break;

    case 'BLESS':
      if (typeof action.kingdomId !== 'number') throw new Error('Action BLESS malformée');
      const k = gameEngine.kingdoms.find(x => x.id === action.kingdomId);
      if (k) k.humans.forEach(h => { h.hunger = Math.max(0, h.hunger - 20); });
      break;

    default:
      throw new Error('Type d\'action divin non reconnu');
  }
}

httpServer.listen(3000, () => {
  console.log('Serveur en écoute sur le port 3000');
});