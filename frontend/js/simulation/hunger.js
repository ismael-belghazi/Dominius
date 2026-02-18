export function updateHunger(human){
    if (!human.alive) return;
    human.hunger -= 0.02;
    if (human.hunger <= 0){
        human.alive = false;
    }
}
