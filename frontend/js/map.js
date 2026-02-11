export function initMap() {
    let currentTile = "grass";
    let isPainting = false;

    const builderContainer = document.createElement("div");
    builderContainer.id = "builderContainer";

    // --- menu latéral ---
    const selector = document.createElement("div");
    selector.id = "tileSelector";

    const tiles = ["grass", "water", "sand"];
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

    // --- zone de peinture ---
    const mapContainer = document.createElement("div");
    mapContainer.id = "mapContainer";

    function createTile(e) {
        const rect = mapContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const tile = document.createElement("div");
        tile.classList.add("tile", currentTile);

        // snap pour aligner sur une grille virtuelle
        tile.style.left = `${Math.floor(x / 25) * 25}px`;
        tile.style.top  = `${Math.floor(y / 25) * 25}px`;

        mapContainer.appendChild(tile);
    }

    mapContainer.addEventListener("mousedown", (e) => {
        isPainting = true;
        createTile(e);
    });

    mapContainer.addEventListener("mousemove", (e) => {
        if (isPainting) createTile(e);
    });

    mapContainer.addEventListener("mouseup", () => {
        isPainting = false;
    });

    document.body.addEventListener("mouseup", () => {
        isPainting = false;
    });

    builderContainer.appendChild(mapContainer);
    document.body.appendChild(builderContainer);
}
