export function plague(humans){
    if (!humans) return;
    // small chance to kill each human
    for (const h of humans){
        if (!h.alive) continue;
        if (Math.random() < 0.15) h.alive = false; // 15% mortality
    }
}
