import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import worldRoutes from './routes/worldRoutes';
import errorHandler from './middleware/errorHandler';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(express.json());
app.use('/api/world', worldRoutes);
app.use(errorHandler);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.emit('WORLD_INIT', { kingdoms: [], villages: [] });

  socket.on('REQUEST_TICK', () => {
    socket.emit('WORLD_UPDATE', { kingdoms: [], villages: [] });
  });

  socket.on('DIVINE_ACTION', (action) => {
    console.log('Divine action received:', action);
  });
});

export default app;
