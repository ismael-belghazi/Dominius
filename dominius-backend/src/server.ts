import express from 'express';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { gameEngine } from './engine/game.engine';
import worldRoutes from './routes/worldRoutes';
import errorHandler from './middleware/errorHandler';
import { DivinePowerEngine } from './engine/divine-power.engine';

// ----------------------
// TYPES SUPPLÉMENTAIRES
// ----------------------
export interface Village {
  id: number;
  name: string;
  food: number;
  population: number;
}

export interface Tile {
  x: number;
  y: number;
  type: 'GRASS' | 'SAND' | 'WATER' | 'MOUNTAIN';
  village?: Village;
  kingdomId?: number;
}

type AnimalType = "Cow" | "Sheep" | "Pig" | "Chicken" | "Deer" | "Rabbit" | "Fish";

type DivineAction = 
  | { type: 'TERRAFORM'; x: number; y: number; tileType: Tile['type'] }
  | { type: 'SPAWN_VILLAGE'; x: number; y: number; name: string }
  | { type: 'SMITE'; x: number; y: number; radius: number }
  | { type: 'SPAWN_ANIMAL'; x: number; y: number; kingdomId: number; animalType: AnimalType }
  | { type: 'BLESS' | 'heal' | 'plague'; kingdomId: number }
  | { type: 'SPAWN_KINGDOM'; name?: string; x: number; y: number }
  | { type: 'rain'; };

// ----------------------
// INIT
// ----------------------
const app = express();
const divineEngine = new DivinePowerEngine(gameEngine);

app.use(express.json());
app.use('/api/world', worldRoutes);
app.use(errorHandler);

const frontendDir = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendDir));
app.get('/', (_req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

// ----------------------
// GAME LOOP
// ----------------------
let tickCount = 0;
setInterval(() => {
  tickCount++;
  gameEngine.tick();
  const state = gameEngine.getWorldState();
  io.emit('WORLD_UPDATE', state);

  console.log(`\n[tick ${tickCount}] royaume(s)=${state.kingdoms.length}`);
  state.kingdoms.forEach(k => {
    console.log(
      `  ${k.name} (id:${k.id}) humans=${k.humans.length} villages=${k.villages.length} animals=${k.animals?.length || 0} resources=${JSON.stringify(k.resources)}`
    );
  });
}, 1000);

// ----------------------
// SOCKET.IO
// ----------------------
io.on('connection', (socket) => {
  console.log('Client connecté:', socket.id);
  socket.emit('WORLD_INIT', gameEngine.getWorldState());

  socket.on('DIVINE_ACTION', (action: DivineAction) => {
    try {
      console.log('Action divine reçue :', action);
      handleDivineAction(action);
      io.emit('WORLD_UPDATE', gameEngine.getWorldState());
    } catch (error) {
      console.error('Erreur action divine:', error);
    }
  });

  socket.on('SET_MAP', (grid: Tile[][]) => {
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

// ----------------------
// DIVINE ACTION HANDLER
// ----------------------
function handleDivineAction(action: DivineAction) {
  switch(action.type) {
    case 'TERRAFORM':
      gameEngine.terraform(action.x, action.y, action.tileType);
      break;

    case 'SPAWN_VILLAGE': {
      let kingdomId: number;
      if (gameEngine.kingdoms.length === 0) {
        const newKingdom = divineEngine.spawnKingdom(`Kingdom-${Date.now()}`, action.x, action.y);
        if (!newKingdom) throw new Error('Impossible de créer un royaume');
        kingdomId = newKingdom.id;
        if (!gameEngine.kingdoms.includes(newKingdom)) gameEngine.kingdoms.push(newKingdom);
      } else {
        kingdomId = gameEngine.kingdoms[0].id;
      }
      gameEngine.spawnVillageInternal(action.x, action.y, action.name, kingdomId);
      break;
    }

    case 'SMITE':
      if (!action.radius) throw new Error('Action SMITE sans radius');
      gameEngine.kingdoms.forEach(k => {
        k.humans = k.humans.filter(h => Math.hypot(h.x - action.x, h.y - action.y) > action.radius);
        k.villages = k.villages.filter(v => Math.hypot(v.x - action.x, v.y - action.y) > action.radius);
        k.animals = k.animals.filter(a => Math.hypot(a.x - action.x, a.y - action.y) > action.radius);
      });
      break;

    case 'SPAWN_ANIMAL':
      gameEngine.createAnimal(action.kingdomId, action.animalType, action.x, action.y);
      break;

    case 'BLESS':
    case 'heal':
    case 'plague': {
      const kingdom = gameEngine.kingdoms.find(k => k.id === action.kingdomId);
      if (!kingdom) return;
      const delta = action.type === 'plague' ? 20 : -20;
      kingdom.humans.forEach(h => h.hunger = Math.max(0, Math.min(100, h.hunger + delta)));
      kingdom.animals?.forEach(a => a.hunger = Math.max(0, Math.min(100, a.hunger + delta)));
      break;
    }

    case 'SPAWN_KINGDOM': {
      if (action.x === undefined || action.y === undefined) {
        console.error('SPAWN_KINGDOM requires x and y coordinates');
        return;
      }
        const newKingdom = divineEngine.spawnKingdom(action.name || `Kingdom-${Date.now()}`, action.x, action.y);      if (!newKingdom) {
        console.error('Impossible de créer le royaume divine');
        return;
      }
      if (!gameEngine.kingdoms.includes(newKingdom)) gameEngine.kingdoms.push(newKingdom);
      console.log(`[DIVINE] Royaume créé: ${newKingdom.name} avec id=${newKingdom.id} à (${action.x},${action.y})`);
      break;
    }

    default:
      throw new Error('Type d\'action divine non reconnu');
  }
}

// ----------------------
// SERVER LISTEN
// ----------------------
httpServer.listen(3000, () => {
  console.log('Serveur en écoute sur le port 3000');
});