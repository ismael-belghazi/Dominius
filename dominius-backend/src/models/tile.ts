import { Kingdom } from './kingdom';

export interface World {
  tick: number;
  divineEnergy: number;
  kingdoms: Kingdom[];
}
