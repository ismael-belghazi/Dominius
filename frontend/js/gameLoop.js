import { Human } from "./entites/human.js";
import { Building } from "./entites/building.js";
import { moveHuman } from "./simulation/movement.js";
import { updateHunger } from "./simulation/hunger.js";
import { aging } from "./simulation/aging.js";

let _rafId = null;

// Import power functions synchronously
import { meteorStrike } from "./godPowers/meteor.js";
import { blessing } from "./godPowers/blessing.js";
import { plague } from "./godPowers/plague.js";

export function startGame(savedMap, kingdom, canvas, powerPanel) {
    const ctx = canvas.getContext('2d');
    let selectedPower = null;
    let frameCount = 0;

    // ensure kingdom has humans array
    if (!kingdom) kingdom = { humans: [] };
    if (!kingdom.humans) kingdom.humans = [];

    // spawn 5 humans if none
    if (kingdom.humans.length === 0) {
        for (let i = 0; i < 5; i++) {
            // spawn at a random non-water tile
            let spawned = false;
            for (let attempts = 0; attempts < 100 && !spawned; attempts++) {
                const rx = Math.floor(Math.random() * savedMap.cols);
                const ry = Math.floor(Math.random() * savedMap.rows);
                const tile = savedMap.grid[ry][rx];
                if (tile !== 'water') {
                    const px = rx * savedMap.tileSize + Math.floor(savedMap.tileSize / 2);
                    const py = ry * savedMap.tileSize + Math.floor(savedMap.tileSize / 2);
                    kingdom.humans.push(new Human(px, py));
                    spawned = true;
                }
            }
            if (!spawned) {
                // fallback to center
                kingdom.humans.push(new Human(Math.floor(savedMap.width / 2), Math.floor(savedMap.height / 2)));
            }
        }
    }

    const humans = kingdom.humans;
    if (!kingdom.buildings) kingdom.buildings = [];
    const buildings = kingdom.buildings;
    let selectedHuman = null;
    let inspectionPanel = null;

    function updateHumans() {
        for (const h of humans) {
            if (!h.alive) continue;
            moveHuman(h, savedMap);
            updateHunger(h);
            aging(h);
            
            // Humans try to eat from nearby farms
            tryEatFromBuilding(h);
            
            // Humans try to build when near others
            tryBuildStructure(h);
            
            // if died during hunger update, skip further
            if (!h.alive) continue;
            // keep humans inside bounds
            h.x = Math.max(0, Math.min(h.x, savedMap.width - h.size));
            h.y = Math.max(0, Math.min(h.y, savedMap.height - h.size));
        }
    }

    // Humans eat from nearby farms
    function tryEatFromBuilding(human) {
        for (const building of buildings) {
            if (building.type !== 'farm') continue;
            if (!building.isHumanInside(human)) continue;
            
            // try to eat from farm
            if (building.food > 0 && human.hunger < 100) {
                const eaten = Math.min(20, building.food, 100 - human.hunger);
                human.hunger += eaten;
                building.food -= eaten;
            }
        }
    }

    // Humans build structures when near others
    function tryBuildStructure(human) {
        if (Math.random() > 0.001) return; // very rare
        if (buildings.length >= 100) return; // max buildings
        
        // check if there are nearby humans
        let nearbyCount = 0;
        for (const other of humans) {
            if (other === human || !other.alive) continue;
            const dist = Math.hypot(human.x - other.x, human.y - other.y);
            if (dist < 50) nearbyCount++;
        }
        
        // build if enough people nearby
        if (nearbyCount >= 2) {
            const types = ['farm', 'house', 'market'];
            const type = types[Math.floor(Math.random() * types.length)];
            buildStructure(human.x + (Math.random() - 0.5) * 40, human.y + (Math.random() - 0.5) * 40, type);
        }
    }

    // Earn power points based on living population and buildings (much slower rate)
    function earnPowerPoints() {
        if (!powerPanel) return;
        const livingCount = humans.filter(h => h.alive).length;
        let totalPoints = livingCount * 0.001; // 10x slower: earn 1 point per 1000 frames per human
        
        // add points from buildings (also slower)
        for (const building of buildings) {
            totalPoints += building.generatePoints() * 0.1;
        }
        
        powerPanel.addPoints(totalPoints);
    }

    // Build a building at click position
    function buildStructure(x, y, type = 'farm') {
        if (buildings.length >= 50) return; // max 50 buildings
        const building = new Building(x, y, type);
        buildings.push(building);
    }

    // Open inspection panel for a human
    function inspectHuman(human) {
        selectedHuman = human;
        closeInspectionPanel();
        
        inspectionPanel = document.createElement('div');
        inspectionPanel.id = 'humanInspectionPanel';
        inspectionPanel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #1a1a1a;
            border: 2px solid #FFD700;
            border-radius: 8px;
            padding: 15px;
            color: white;
            font-family: Arial;
            width: 250px;
            z-index: 200;
        `;
        
        const title = document.createElement('h3');
        title.textContent = 'Statistiques';
        title.style.cssText = 'margin: 0 0 10px 0; color: #FFD700;';
        inspectionPanel.appendChild(title);
        
        const stats = document.createElement('div');
        stats.style.cssText = 'font-size: 12px; line-height: 1.8;';
        stats.innerHTML = `
            <div>Age: ${human.age.toFixed(1)}</div>
            <div>Faim: ${human.hunger.toFixed(1)}/100</div>
            <div>Vivant: ${human.alive ? 'OUI' : 'NON'}</div>
            <div style="margin-top: 10px; font-size: 10px; color: #aaa;">
                Position: (${human.x.toFixed(0)}, ${human.y.toFixed(0)})
            </div>
        `;
        inspectionPanel.appendChild(stats);
        
        // Power buttons
        const powerBtnsDiv = document.createElement('div');
        powerBtnsDiv.style.cssText = 'margin-top: 10px; display: flex; gap: 5px; flex-wrap: wrap;';
        
        const unlocked = powerPanel.getUnlockedPowers();
        for (const pk of unlocked) {
            const power = powerPanel.tree[pk];
            const btn = document.createElement('button');
            btn.textContent = power.name;
            btn.style.cssText = `
                flex: 1;
                min-width: 60px;
                padding: 5px;
                background: ${power.type === 'positive' ? '#2d5016' : '#5a1a1a'};
                color: ${power.type === 'positive' ? '#90EE90' : '#FF6B6B'};
                border: 1px solid ${power.type === 'positive' ? 'green' : 'red'};
                border-radius: 3px;
                cursor: pointer;
                font-size: 10px;
            `;
            btn.addEventListener('click', () => {
                executePowerOnHuman(pk, human);
            });
            powerBtnsDiv.appendChild(btn);
        }
        inspectionPanel.appendChild(powerBtnsDiv);
        
        // Build button
        const buildDiv = document.createElement('div');
        buildDiv.style.cssText = 'margin-top: 10px; display: flex; gap: 3px; flex-wrap: wrap;';
        ['farm', 'house', 'market'].forEach(type => {
            const btn = document.createElement('button');
            btn.textContent = type.charAt(0).toUpperCase() + type.slice(1);
            btn.style.cssText = `
                flex: 1;
                min-width: 50px;
                padding: 5px;
                background: #444;
                color: white;
                border: 1px solid #666;
                border-radius: 3px;
                cursor: pointer;
                font-size: 10px;
            `;
            btn.addEventListener('click', () => {
                buildStructure(human.x, human.y, type);
            });
            buildDiv.appendChild(btn);
        });
        inspectionPanel.appendChild(buildDiv);
        
        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Fermer';
        closeBtn.style.cssText = `
            width: 100%;
            margin-top: 10px;
            padding: 6px;
            background: #444;
            color: white;
            border: 1px solid #666;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
        `;
        closeBtn.addEventListener('click', closeInspectionPanel);
        inspectionPanel.appendChild(closeBtn);
        
        document.body.appendChild(inspectionPanel);
    }

    function closeInspectionPanel() {
        if (inspectionPanel) {
            inspectionPanel.remove();
            inspectionPanel = null;
        }
        selectedHuman = null;
    }

    // Execute power on specific human
    function executePowerOnHuman(powerKey, human) {
        if (!powerPanel.isPowerUnlocked(powerKey)) {
            alert('Pouvoir non déverrouillé !');
            return;
        }
        
        // most powers work on array, so we apply to single human
        if (powerKey === 'meteor') {
            human.alive = false;
            showFeedback('Météore frappe!');
        } else if (powerKey === 'blessing') {
            human.hunger = Math.min(100, human.hunger + 20);
            showFeedback('Bénédiction appliquée!');
        } else if (powerKey === 'plague') {
            if (Math.random() < 0.15) human.alive = false;
            showFeedback('Peste appliquée!');
        } else if (powerKey === 'fertility') {
            // boost for nearby reproduction
            window._reproductionMultiplier = (window._reproductionMultiplier || 1) * 3;
            setTimeout(() => { window._reproductionMultiplier = 1; }, 30000);
            showFeedback('Fertilité appliquée!');
        } else if (powerKey === 'plague2') {
            if (Math.random() < 0.4) human.alive = false;
            showFeedback('Mort Noire appliquée!');
        }
    }

    // Execute a power if unlocked
    function executePower(powerKey) {
        if (!powerPanel) return;
        if (!powerPanel.isPowerUnlocked(powerKey)) {
            alert('Pouvoir non déverré !');
            return;
        }

        let result = '';
        if (powerKey === 'meteor') {
            const before = humans.filter(h => h.alive).length;
            meteorStrike(humans);
            const after = humans.filter(h => h.alive).length;
            const killed = before - after;
            result = `Météore! ${killed} tués.`;
        } else if (powerKey === 'blessing') {
            blessing(kingdom, humans);
            result = `Bénédiction! Faim restaurée.`;
        } else if (powerKey === 'plague') {
            const before = humans.filter(h => h.alive).length;
            plague(humans);
            const after = humans.filter(h => h.alive).length;
            const killed = before - after;
            result = `Peste! ${killed} morts.`;
        } else if (powerKey === 'fertility') {
            // simple fertility boost: increase reproduction chance
            window._reproductionMultiplier = (window._reproductionMultiplier || 1) * 3;
            result = `Fertilité! Reproduction x3.`;
            setTimeout(() => { window._reproductionMultiplier = 1; }, 30000); // 30 sec buff
        } else if (powerKey === 'plague2') {
            const before = humans.filter(h => h.alive).length;
            for (let i = 0; i < 2; i++) plague(humans); // double plague
            const after = humans.filter(h => h.alive).length;
            const killed = before - after;
            result = `Mort Noire! ${killed} décédés.`;
        }

        if (result) showFeedback(result);
        selectedPower = null;
    }

    // Afficher message temporaire de feedback
    function showFeedback(text) {
        const fb = document.createElement('div');
        fb.textContent = text;
        fb.style.cssText = `
            position: fixed;
            top: 150px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: gold;
            padding: 15px 25px;
            border: 2px solid gold;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            z-index: 1000;
            animation: fadeOut 2s forwards;
        `;
        document.head.insertAdjacentHTML('beforeend', '<style>@keyframes fadeOut{0%{opacity:1}100%{opacity:0}}</style>');
        document.body.appendChild(fb);
        setTimeout(() => fb.remove(), 2000);
    }

    // Handle canvas click: inspect human or cast power
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const cx = (e.clientX - rect.left) * scaleX;
        const cy = (e.clientY - rect.top) * scaleY;
        
        // Check if clicked on a human
        let clickedHuman = null;
        for (const h of humans) {
            if (!h.alive) continue;
            const dist = Math.hypot(h.x - cx, h.y - cy);
            if (dist < 10) { // click radius
                clickedHuman = h;
                break;
            }
        }
        
        if (clickedHuman) {
            inspectHuman(clickedHuman);
        } else if (selectedPower) {
            // fall back to power casting on empty space
            executePower(selectedPower);
        }
    });

    // Créer l'interface de sélection de pouvoir
    const powerSelectorDiv = document.createElement('div');
    powerSelectorDiv.style.cssText = `
        position: absolute;
        top: 60px;
        left: 10px;
        background: #222;
        border: 2px solid #666;
        padding: 10px;
        border-radius: 5px;
        color: white;
        font-size: 12px;
        max-width: 150px;
        z-index: 50;
    `;
    powerSelectorDiv.innerHTML = `<strong>Pouvoirs:</strong><div id="powerList"></div>`;
    canvas.parentElement.appendChild(powerSelectorDiv);

    function updatePowerSelector() {
        if (!powerPanel) return;
        const powerList = document.getElementById('powerList');
        const unlocked = powerPanel.getUnlockedPowers();
        powerList.innerHTML = unlocked.map(pk => {
            const p = powerPanel.tree[pk];
            return `<div style="cursor:pointer;padding:3px;background:${selectedPower===pk?'gold':'#444'};color:${selectedPower===pk?'black':'white'};margin:2px 0;border-radius:3px" onclick="window._selectPower('${pk}')">${p.name}</div>`;
        }).join('');
        if (unlocked.length === 0) powerList.textContent = 'Aucun pouvoir';
    }
    window._selectPower = (pk) => {
        selectedPower = selectedPower === pk ? null : pk;
        updatePowerSelector();
    };

    // Initial power selector update
    updatePowerSelector();

    // simple emergence: create villages when clusters of humans present
    function detectAndCreateVillages(){
        if (!kingdom.villages) kingdom.villages = [];
        const visited = new Set();
        for (let i=0;i<humans.length;i++){
            const a = humans[i];
            if (!a.alive) continue;
            if (visited.has(i)) continue;
            const cluster = [i];
            for (let j=i+1;j<humans.length;j++){
                const b = humans[j];
                if (!b.alive) continue;
                const d = Math.hypot(a.x - b.x, a.y - b.y);
                if (d < 20) cluster.push(j);
            }
            if (cluster.length >= 3){
                // compute center
                let sx=0, sy=0;
                for (const idx of cluster){ sx += humans[idx].x; sy += humans[idx].y; visited.add(idx); }
                const cx = Math.round(sx/cluster.length);
                const cy = Math.round(sy/cluster.length);
                // check if a village already near
                const exists = kingdom.villages.some(v=>Math.hypot(v.x-cx,v.y-cy)<30);
                if (!exists){
                    const v = { x: cx, y: cy, population: [] };
                    // assign humans to village population
                    for (const idx of cluster){ v.population.push(humans[idx]); }
                    kingdom.villages.push(v);
                }
            }
        }
    }

    // reproduction: simple rule - when two humans are close and healthy
    function reproductionStep(){
        const multiplier = window._reproductionMultiplier || 1;
        for (let i=0;i<humans.length;i++){
            const a = humans[i];
            if (!a.alive || a.hunger < 60) continue;
            for (let j=i+1;j<humans.length;j++){
                const b = humans[j];
                if (!b.alive || b.hunger < 60) continue;
                const d = Math.hypot(a.x-b.x,a.y-b.y);
                if (d < 6 && Math.random() < 0.001 * multiplier){ // tiny chance each frame, boosted by fertility
                    const nx = (a.x + b.x)/2 + (Math.random()-0.5)*4;
                    const ny = (a.y + b.y)/2 + (Math.random()-0.5)*4;
                    const child = new Human(nx, ny);
                    humans.push(child);
                    // reduce parents' hunger
                    a.hunger = Math.max(0, a.hunger - 30);
                    b.hunger = Math.max(0, b.hunger - 30);
                }
            }
        }
    }

    function render() {
        // draw map
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < savedMap.rows; y++) {
            for (let x = 0; x < savedMap.cols; x++) {
                const t = savedMap.grid[y][x];
                if (t) {
                    // simple color mapping — same as map module expects
                    let color = '#999';
                    if (t === 'grass') color = '#2ECC71';
                    if (t === 'water') color = '#1E90FF';
                    if (t === 'sand') color = '#824504';
                    ctx.fillStyle = color;
                    ctx.fillRect(x * savedMap.tileSize, y * savedMap.tileSize, savedMap.tileSize, savedMap.tileSize);
                }
            }
        }

        // draw buildings
        for (const building of buildings) {
            ctx.fillStyle = building.color;
            ctx.fillRect(building.x - building.size / 2, building.y - building.size / 2, building.size, building.size);
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 1;
            ctx.strokeRect(building.x - building.size / 2, building.y - building.size / 2, building.size, building.size);
        }

        // draw humans
        for (const h of humans) {
            if (h === selectedHuman) {
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(h.x - 1, h.y - 1, h.size + 2, h.size + 2);
            }
            ctx.fillStyle = h.alive ? 'white' : '#444';
            ctx.fillRect(h.x, h.y, h.size, h.size);
        }
    }

    // Update buildings production
    function updateBuildings() {
        for (const building of buildings) {
            building.produceFood();
        }
    }

    function loop() {
        frameCount++;
        if (frameCount % 5 === 0) { // earn points every 5 frames
            earnPowerPoints();
            updatePowerSelector();
        }
        updateHumans();
        updateBuildings();
        detectAndCreateVillages();
        reproductionStep();
        render();
        _rafId = requestAnimationFrame(loop);
    }

    // start loop
    if (_rafId) cancelAnimationFrame(_rafId);
    loop();

    // expose stop for debugging
    window.stopGame = () => { if (_rafId) cancelAnimationFrame(_rafId); };
    window.closeHumanPanel = closeInspectionPanel;
}
