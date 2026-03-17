export type TileTypeName = "GRASS" | "WATER" | "MOUNTAIN" | "SAND";

// ---------------------
// TILES
// ---------------------
export interface Tile {
  x: number;
  y: number;
  type: TileTypeName;
}

// ---------------------
// HUMANS
// ---------------------
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

// ---------------------
// ANIMALS
// ---------------------
export type AnimalType = "Cow" | "Sheep" | "Pig" | "Chicken" | "Deer" | "Rabbit" | "Fish";

export interface Animal {
  id: number;
  x: number;
  y: number;
  type: AnimalType;
  age: number;
  hunger: number;
  health: number;
}

// ---------------------
// INFRASTRUCTURES
// ---------------------
export interface Infrastructure {
  type: "Market" | "Mill" | "Barracks" | "Library" | "Hospital";
  level: number;
}

// ---------------------
// VILLAGES
// ---------------------
export interface Village {
  id: number;
  name: string;
  x: number;
  y: number;
  population: number;
  infrastructures: Infrastructure[];
}

// ---------------------
// KINGDOMS
// ---------------------
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

// ---------------------
// WORLD STATE
// ---------------------
export interface WorldState {
  world: Tile[][];
  kingdoms: Kingdom[];
}

// ---------------------
// DIVINE ACTIONS
// ---------------------
export type DivineActionType =
  | "TERRAFORM"
  | "SPAWN_VILLAGE"
  | "SPAWN_KINGDOM"
  | "SPAWN_ANIMAL"
  | "SMITE"
  | "BLESS"
  | "HEAL"
  | "PLAGUE"
  | "RAIN"
  | "INSPECT"; 

export interface DivineAction {
  type: DivineActionType;
  x?: number;
  y?: number;
  tileType?: TileTypeName;
  name?: string;
  radius?: number;
  kingdomId?: number;
  animalType?: AnimalType;
}