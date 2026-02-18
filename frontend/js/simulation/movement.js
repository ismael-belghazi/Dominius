export function moveHuman(human, map){
    // very simple map-aware random move
    const dx = Math.floor(Math.random()*3)-1; // -1,0,1
    const dy = Math.floor(Math.random()*3)-1;
    const nx = human.x + dx;
    const ny = human.y + dy;

    if (!map) {
        human.x = nx;
        human.y = ny;
        return;
    }

    const tx = Math.floor(nx / map.tileSize);
    const ty = Math.floor(ny / map.tileSize);
    if (tx < 0 || ty < 0 || tx >= map.cols || ty >= map.rows) return;

    const tile = map.grid[ty][tx];
    if (tile === 'water') {
        // forbidden: do not move into water
        return;
    }

    if (tile === 'sand') {
        // sand slows movement: only move ~50% of attempts
        if (Math.random() < 0.5) return;
    }

    // otherwise move
    human.x = nx;
    human.y = ny;
}
