export function aging(human){
    if (!human.alive) return;
    human.age += 0.01;
}
