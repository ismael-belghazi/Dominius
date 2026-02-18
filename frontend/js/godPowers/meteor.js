export function meteorStrike(humans){
    if (!humans || humans.length===0) return;
    const killFraction = 0.3; // kill 30% randomly
    const toKill = Math.floor(humans.length * killFraction);
    for (let i=0;i<toKill;i++){
        const idx = Math.floor(Math.random()*humans.length);
        if (humans[idx]) humans[idx].alive = false;
    }
}
