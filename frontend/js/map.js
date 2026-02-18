import { startGame } from "./gameLoop.js";
import { PowerPanel } from "./ui/powerPanel.js";

export function initMap(kingdom) {
    let currentTile = "grass";
    const tileSize = 25;
    let isPainting = false;
    let lastPos = null; 
    const PAINT_THROTTLE_MS = 60; 
    let lastPaintTime = 0;
    let editing = true; 

    const builderContainer = document.createElement("div");
    builderContainer.id = "builderContainer";

    
    const selector = document.createElement("div");
    selector.id = "tileSelector";

    const tiles = ["grass", "water", "sand"];
    const colors = {
        grass: "#2ECC71",
        water: "#1E90FF",
        sand:  "#824504"
    };

    tiles.forEach(type => {
        const div = document.createElement("div");
        div.classList.add("tile-option", type);
        if (type === currentTile) div.classList.add("selected");

        div.addEventListener("click", () => {
            currentTile = type;
            document.querySelectorAll(".tile-option").forEach(el => el.classList.remove("selected"));
            div.classList.add("selected");
        });

        selector.appendChild(div);
    });

    builderContainer.appendChild(selector);

    // --- canvas ---
    const canvas = document.createElement("canvas");
    canvas.id = "mapCanvas";
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");
    // grille logique pour sauvegarde / effacement
    const cols = Math.floor(canvas.width / tileSize);
    const rows = Math.floor(canvas.height / tileSize);
    const grid = Array.from({ length: rows }, () => Array(cols).fill(null));

    function redrawGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const t = grid[y][x];
                if (t) {
                    ctx.fillStyle = colors[t];
                    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                }
            }
        }
    }

    function drawTile(mouseX, mouseY) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const cx = (mouseX - rect.left) * scaleX;
        const cy = (mouseY - rect.top) * scaleY;
        const tx = Math.floor(cx / tileSize);
        const ty = Math.floor(cy / tileSize);

        if (tx < 0 || ty < 0 || tx >= cols || ty >= rows) return;

        if (lastPos && lastPos.tx === tx && lastPos.ty === ty) return;

        lastPos = { tx, ty };

        if (currentTile === 'erase') {
            grid[ty][tx] = null;
            ctx.clearRect(tx * tileSize, ty * tileSize, tileSize, tileSize);
            return;
        }

        grid[ty][tx] = currentTile;
        ctx.fillStyle = colors[currentTile];
        ctx.fillRect(tx * tileSize, ty * tileSize, tileSize, tileSize);
    }

    canvas.addEventListener("mousedown", (e) => {
        if (!editing) return;
        isPainting = true;
        const now = Date.now();
        if (now - lastPaintTime >= PAINT_THROTTLE_MS) {
            drawTile(e.clientX, e.clientY);
            lastPaintTime = now;
        }
    });

    canvas.addEventListener("mousemove", (e) => {
        if (!editing) return;
        if (!isPainting) return;
        const now = Date.now();
        if (now - lastPaintTime < PAINT_THROTTLE_MS) return;
        drawTile(e.clientX, e.clientY);
        lastPaintTime = now;
    });

    canvas.addEventListener("mouseup", () => {
        isPainting = false;
        lastPos = null; 
    });
    document.body.addEventListener("mouseup", () => {
        isPainting = false;
        lastPos = null;
    });

    builderContainer.appendChild(canvas);
    const eraseBtn = document.createElement('button');
    eraseBtn.textContent = 'Effacer';
    eraseBtn.className = 'tool-button';
    eraseBtn.addEventListener('click', () => {
        currentTile = 'erase';
        document.querySelectorAll('.tile-option').forEach(el => el.classList.remove('selected'));
        eraseBtn.classList.add('selected');
    });


    const finishBtn = document.createElement('button');
    finishBtn.textContent = 'Terminer Carte';
    finishBtn.className = 'tool-button';
    finishBtn.addEventListener('click', () => {
        const data = {
            tileSize,
            width: canvas.width,
            height: canvas.height,
            cols,
            rows,
            grid
        };
        window.savedMap = data;
        editing = false;
        isPainting = false;
        eraseBtn.disabled = true;
        finishBtn.disabled = true;
        document.querySelectorAll('.tile-option').forEach(el => el.classList.remove('selected'));
        finishBtn.classList.add('selected');
        alert('Carte terminée et stockée. Lancement du jeu...');
        startGameWithSavedMap(window.savedMap);
    });

    const previewBtn = document.createElement('button');
    previewBtn.textContent = 'Aperçu Carte';
    previewBtn.className = 'tool-button';
    previewBtn.addEventListener('click', () => {
        const data = window.savedMap || {
            tileSize,
            width: canvas.width,
            height: canvas.height,
            cols,
            rows,
            grid
        };

        const win = window.open('', '_blank', 'width=' + data.width + ',height=' + data.height);
        if (!win) {
                alert('Impossible d\'ouvrir la fenêtre (bloquée par le navigateur).');
            return;
        }

        const html = `<!doctype html><html><head><title>Aperçu de la Carte</title>
            <style>body{margin:0;background:#222;color:#fff;font-family:Arial}canvas{display:block}</style>
            </head><body>
            <canvas id="previewCanvas" width="${data.width}" height="${data.height}"></canvas>
            <script>
            const data = ${JSON.stringify(data)};
            const colors = ${JSON.stringify(colors)};
            const canvas = document.getElementById('previewCanvas');
            const ctx = canvas.getContext('2d');
            for (let y=0;y<data.rows;y++){
                for (let x=0;x<data.cols;x++){
                    const t = data.grid[y][x];
                    if (t){
                        ctx.fillStyle = colors[t] || '#999';
                        ctx.fillRect(x*data.tileSize,y*data.tileSize,data.tileSize,data.tileSize);
                    }
                }
            }
            // disable interaction
            canvas.style.pointerEvents = 'none';
            </script>
            </body></html>`;

        win.document.open();
        win.document.write(html);
        win.document.close();
    });

    selector.appendChild(eraseBtn);
    selector.appendChild(previewBtn);
    selector.appendChild(finishBtn);

    document.body.appendChild(builderContainer);

    function startGameWithSavedMap(saved) {
        builderContainer.remove();

        const gameContainer = document.createElement('div');
        gameContainer.id = 'gameContainer';

        const stats = document.createElement('div');
        stats.className = 'game-stats';
        stats.innerHTML = `<strong>Royaume</strong><br>${kingdom ? kingdom.name : 'Inconnu'}`;

        const playCanvas = document.createElement('canvas');
        playCanvas.width = saved.width;
        playCanvas.height = saved.height;
        playCanvas.id = 'playCanvas';
        const pctx = playCanvas.getContext('2d');
        for (let y = 0; y < saved.rows; y++) {
            for (let x = 0; x < saved.cols; x++) {
                const t = saved.grid[y][x];
                if (t) {
                    pctx.fillStyle = colors[t] || '#999';
                    pctx.fillRect(x * saved.tileSize, y * saved.tileSize, saved.tileSize, saved.tileSize);
                }
            }
        }

        const powerTreeBtn = document.createElement('button');
        powerTreeBtn.textContent = 'Arbre de Pouvoir';
        powerTreeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 10px 15px;
            background: gold;
            color: black;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            z-index: 100;
        `;
        powerTreeBtn.addEventListener('click', () => {
            window._powerPanel.openTreeModal();
        });

        gameContainer.appendChild(stats);
        gameContainer.appendChild(playCanvas);
        gameContainer.appendChild(powerTreeBtn);
        gameContainer.style.position = 'relative';
        document.body.appendChild(gameContainer);

        window.startedGame = true;
        window.getSavedMap = () => saved;
        
        window._powerPanel = new PowerPanel(kingdom);
        
        try {
            startGame(saved, kingdom, playCanvas, window._powerPanel);
        } catch (err) {
            console.error('Failed to start game loop:', err);
        }
    }
}
