export function initMap() {
    let currentTile = "grass";
    const tileSize = 25;
    let isPainting = false;
    let lastPos = null; // dernière position dessinée

    const builderContainer = document.createElement("div");
    builderContainer.id = "builderContainer";

    // --- menu latéral ---
    const selector = document.createElement("div");
    selector.id = "tileSelector";

    const tiles = ["grass", "water", "sand"];
    const colors = {
        grass: "#2ECC71",
        water: "#1E90FF",
        sand:  "#F1C40F"
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

    function drawTile(mouseX, mouseY) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((mouseX - rect.left) / tileSize) * tileSize;
        const y = Math.floor((mouseY - rect.top) / tileSize) * tileSize;

        // vérifier si on a déjà dessiné ici
        if (lastPos && lastPos.x === x && lastPos.y === y) return;

        lastPos = { x, y };
        ctx.fillStyle = colors[currentTile];
        ctx.fillRect(x, y, tileSize, tileSize);
    }

    canvas.addEventListener("mousedown", (e) => {
        isPainting = true;
        drawTile(e.clientX, e.clientY);
    });

    canvas.addEventListener("mousemove", (e) => {
        if (isPainting) drawTile(e.clientX, e.clientY);
    });

    canvas.addEventListener("mouseup", () => {
        isPainting = false;
        lastPos = null; // reset à la fin du drag
    });
    document.body.addEventListener("mouseup", () => {
        isPainting = false;
        lastPos = null;
    });

    builderContainer.appendChild(canvas);
    document.body.appendChild(builderContainer);
}
