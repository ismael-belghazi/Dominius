export type TileTypeName = "GRASS" | "WATER" | "MOUNTAIN" | "SAND";

export interface Tile {
  x: number;
  y: number;
  type: TileTypeName;
}

export interface Human {
  id: number;
  x: number;
  y: number;
  kingdomId: number;
  age: number;
  health: number;
  hunger: number;
  profession: string;
  intelligence: number;
}

export interface Animal {
  id: number;
  x: number;
  y: number;
  type: string;
  age: number;
  hunger: number;
  health: number;
}

export interface Infrastructure {
  type: "Market" | "Mill" | "Barracks" | "Library" | "Hospital";
  level: number;
}

export interface Village {
  id: number;
  name: string;
  x: number;
  y: number;
  population: number;
  infrastructures: Infrastructure[];
}

export interface Kingdom {
  id: number;
  name: string;
  humans: Human[];
  villages: Village[];
  animals: Animal[];
  resources: {
    food: number;
    meat: number;
  };
}

export interface WorldState {
  world: Tile[][];
  kingdoms: Kingdom[];
}

export interface DivineAction {
  type: "TERRAFORM" | "SPAWN_VILLAGE" | "SMITE" | "SPAWN_ANIMAL" | "BLESS";
  x: number;
  y: number;
  tileType?: TileTypeName;
  name?: string;
  radius?: number;
  kingdomId?: number;
  animalType?: string;
}