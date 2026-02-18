export function moveHuman(human, map){
    const dx = Math.floor(Math.random()*3)-1; 
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
        return;
    }

    if (tile === 'sand') {
        if (Math.random() < 0.5) return;
    }

    human.x = nx;
    human.y = ny;
}
