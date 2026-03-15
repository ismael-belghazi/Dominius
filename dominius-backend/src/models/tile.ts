import { Kingdom } from './kingdom';

export interface World {
  tick: number;
  divineEnergy: number;
  kingdoms: Kingdom[];
}

export interface Tile {
  x: number;
  y: number;
  type: string; 
  village?: {
    id: number;
    name: string;
    food: number;
    population: number;
  };
  kingdomId?: number;
}