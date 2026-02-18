export function blessing(kingdom, humans){
    if (!humans) return;
    
    for (const h of humans){
        if (!h.alive) continue;
        h.hunger = Math.min(100, h.hunger + 20);
    }
    
    if (kingdom && typeof kingdom.happiness === 'number') kingdom.happiness += 5;
}
