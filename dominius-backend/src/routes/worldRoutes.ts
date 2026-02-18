import { Router } from 'express';
import { WorldService } from '../services/worldservice';

const router = Router();

router.post('/terraform', (req, res) => {
  const { x, y, type } = req.body;
  WorldService.terraform(x, y, type);
  res.json({ message: 'Tile updated' });
});

router.post('/village', (req, res) => {
  const { x, y, name } = req.body;
  const kingdom = WorldService.spawnVillage(x, y, name);
  res.json(kingdom);
});

router.get('/state', (req, res) => {
  res.json(WorldService.getState());
});

export default router;
