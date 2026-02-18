import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { gameEngine } from './engine/game.engine';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

// ======================
// GAME LOOP GLOBAL
// ======================

setInterval(() => {
  gameEngine.tick();
  io.emit('WORLD_UPDATE', gameEngine.getWorldState());
}, 1000);

// ======================
// WEBSOCKET
// ======================

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.emit('WORLD_INIT', gameEngine.getWorldState());

  socket.on('DIVINE_ACTION', (action: any) => {
    handleDivineAction(action);
    socket.emit('WORLD_UPDATE', gameEngine.getWorldState());
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ======================
// DIVINE ACTION HANDLER
// ======================

function handleDivineAction(action: any) {
  switch(action.type) {
    case 'TERRAFORM':
      gameEngine.terraform(action.x, action.y, action.tileType);
      break;
    case 'SPAWN_VILLAGE':
      gameEngine.spawnVillageInternal(action.x, action.y, action.name);
      break;
    case 'SMITE':
      gameEngine.kingdoms.forEach(k => {
        k.humans = k.humans.filter(h => Math.hypot(h.x-action.x, h.y-action.y) > action.radius);
        k.villages = k.villages.filter(v => Math.hypot(v.x-action.x, v.y-action.y) > action.radius);
        k.animals = k.animals.filter(a => Math.hypot(a.x-action.x, a.y-action.y) > action.radius);
      });
      break;
  }
}

httpServer.listen(3000, () => {
  console.log('Server running on port 3000');
});
