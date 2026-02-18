export type TileType = 'GRASS' | 'SAND' | 'WATER' | 'MOUNTAIN';

export interface Tile {
  x: number;
  y: number;
  type: TileType;
}

export class WorldEngine {
  grid: Tile[][];

  constructor(public width: number, public height: number) {
    this.grid = [];
    for (let y = 0; y < height; y++) {
      const row: Tile[] = [];
      for (let x = 0; x < width; x++) {
        row.push({ x, y, type: 'GRASS' });
      }
      this.grid.push(row);
    }
  }

  getTile(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return null;
    return this.grid[y][x];
  }

  setTile(x: number, y: number, type: TileType) {
    const tile = this.getTile(x, y);
    if (tile) tile.type = type;
  }
}
