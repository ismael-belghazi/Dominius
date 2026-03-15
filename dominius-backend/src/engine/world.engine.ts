export type TileType = 'GRASS' | 'SAND' | 'WATER' | 'MOUNTAIN';

export interface Tile {
  x: number;
  y: number;
  type: TileType;
  kingdomId?: number;
}

export class WorldEngine {

  grid: Tile[][];

  constructor(public width: number, public height: number) {

    this.grid = [];

    for (let y = 0; y < height; y++) {

      const row: Tile[] = [];

      for (let x = 0; x < width; x++) {

        row.push({
          x,
          y,
          type: 'GRASS'
        });

      }

      this.grid.push(row);

    }

    this.generateWorld();

  }

  // =====================
  // BASIC
  // =====================

  getTile(x: number, y: number): Tile | null {

    if (x < 0 || y < 0 || x >= this.width || y >= this.height)
      return null;

    return this.grid[y][x];

  }

  setTile(x: number, y: number, type: TileType) {

    const tile = this.getTile(x, y);

    if (tile)
      tile.type = type;

  }

  // =====================
  // UTILS
  // =====================

  isWater(x: number, y: number): boolean {

    const tile = this.getTile(x, y);

    return tile?.type === "WATER";

  }

  isWalkable(x: number, y: number): boolean {

    const tile = this.getTile(x, y);

    if (!tile) return false;

    return tile.type !== "WATER";

  }

  getNeighbors(x: number, y: number): Tile[] {

    const neighbors: Tile[] = [];

    const dirs = [
      { dx:1, dy:0 },
      { dx:-1, dy:0 },
      { dx:0, dy:1 },
      { dx:0, dy:-1 }
    ];

    dirs.forEach(d => {

      const tile = this.getTile(x + d.dx, y + d.dy);

      if (tile)
        neighbors.push(tile);

    });

    return neighbors;

  }

  // =====================
  // WORLD GENERATION
  // =====================

  private generateWorld() {

    for (let y = 0; y < this.height; y++) {

      for (let x = 0; x < this.width; x++) {

        const r = Math.random();

        if (r < 0.05) {

          this.setTile(x, y, "WATER");

        }
        else if (r < 0.08) {

          this.setTile(x, y, "MOUNTAIN");

        }
        else if (r < 0.12) {

          this.setTile(x, y, "SAND");

        }

      }

    }

    this.smoothTerrain();

  }

  // =====================
  // SMOOTH MAP
  // =====================

  private smoothTerrain() {

    for (let i = 0; i < 2; i++) {

      for (let y = 0; y < this.height; y++) {

        for (let x = 0; x < this.width; x++) {

          const neighbors = this.getNeighbors(x, y);

          const waterCount =
            neighbors.filter(n => n.type === "WATER").length;

          if (waterCount >= 3) {
            this.setTile(x, y, "WATER");
          }

        }

      }

    }

  }

}