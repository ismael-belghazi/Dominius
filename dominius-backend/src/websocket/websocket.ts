import { Server } from 'socket.io';
import { gameEngine } from '../engine/game.engine';

export function initWebsocket(io: Server) {

  setInterval(() => {
    gameEngine.tick();
    io.emit('worldUpdate', gameEngine.getWorldState());
  }, 1000);

}
