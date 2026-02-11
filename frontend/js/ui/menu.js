import { Kingdom } from "../entites/kingdom.js";
import { initMap } from "../map.js";

let currentKingdom = null;

export function initMenu() {
    const menu = document.createElement("div");
    menu.className = "menu";

    menu.innerHTML = `
        <div class="menu-box">
            <h2>Créer ton royaume</h2>
            <input id="kingdomName" placeholder="Nom du royaume">
            <button id="createKingdom">Créer</button>
        </div>
    `;

    document.body.appendChild(menu);

    const createBtn = document.getElementById("createKingdom");
    const nameInput = document.getElementById("kingdomName");

    createBtn.addEventListener("click", () => {
        const name = nameInput.value.trim();
        if (!name) return alert("Entre un nom pour ton royaume !");

        currentKingdom = new Kingdom(name);
        menu.remove();

        // affichage du nom centré
        const title = document.createElement("h1");
        title.id = "kingdomTitle";
        title.innerText = `${currentKingdom.name}`;
        document.body.appendChild(title);

        // lance builder
        initMap();
    });
}

export function getKingdom() {
    return currentKingdom;
}
