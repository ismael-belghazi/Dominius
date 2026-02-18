export function plague(humans){
    if (!humans) return;
    for (const h of humans){
        if (!h.alive) continue;
        if (Math.random() < 0.15) h.alive = false; 
    }
}
