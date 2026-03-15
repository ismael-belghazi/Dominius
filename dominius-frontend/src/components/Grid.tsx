import React, { useState, useEffect } from "react";
import Tile from "./Tile";
import { Tile as TileType, Kingdom, DivineAction, TileTypeName, Human, Animal } from "../types/world";
import { socket } from "../engine/socket";

interface GridProps {
  initialWorld: TileType[][];
  initialKingdoms: Kingdom[];
  selectedTileType: TileTypeName;
  selectedPower: DivineAction["type"] | "INSPECT";
  onDivineAction: (action: DivineAction) => void;
}

export default function Grid({
  initialWorld,
  initialKingdoms,
  selectedTileType,
  selectedPower,
  onDivineAction
}: GridProps) {
  const [world, setWorld] = useState(initialWorld);
  const [kingdoms, setKingdoms] = useState(initialKingdoms);
  const [dragging, setDragging] = useState(false);
  const [lastChangedTile, setLastChangedTile] = useState<{ x: number; y: number } | null>(null);
  const [inspectedHuman, setInspectedHuman] = useState<Human | null>(null);
  const [inspectedAnimal, setInspectedAnimal] = useState<Animal | null>(null);
  const [smiteRadius, setSmiteRadius] = useState(2);
  const [kingdomHover, setKingdomHover] = useState<{ x: number; y: number; size: number } | null>(null);

  // ===============================
  // Socket.io mise à jour
  // ===============================
  useEffect(() => {
    socket.on("WORLD_UPDATE", (state: { world: TileType[][]; kingdoms: Kingdom[] }) => {
      setWorld(state.world.map(row => row.map(tile => ({ ...tile }))));
      setKingdoms(state.kingdoms.map(k => ({
        ...k,
        humans: k.humans.map(h => ({ ...h })),
        animals: k.animals.map(a => ({ ...a })),
        villages: k.villages.map(v => ({ ...v }))
      })));
    });
    return () => { socket.off("WORLD_UPDATE"); };
  }, []);

  // ===============================
  // Actions divines
  // ===============================
  const handleTileAction = (tile: TileType) => {
    if (lastChangedTile && lastChangedTile.x === tile.x && lastChangedTile.y === tile.y) return;

    switch(selectedPower) {
      case "TERRAFORM":
        onDivineAction({ type: "TERRAFORM", x: tile.x, y: tile.y, tileType: selectedTileType });
        break;
      case "SPAWN_VILLAGE":
        if (kingdoms[0])
          onDivineAction({ type: "SPAWN_VILLAGE", x: tile.x, y: tile.y, name: `Village-${Date.now()}` });
        break;
      case "SPAWN_ANIMAL":
        if (kingdoms[0])
          onDivineAction({ type: "SPAWN_ANIMAL", kingdomId: kingdoms[0].id, animalType: "Cow", x: tile.x, y: tile.y });
        break;
      case "SMITE":
        onDivineAction({ type: "SMITE", x: tile.x, y: tile.y, radius: smiteRadius });
        break;
      case "BLESS":
        if (kingdoms[0])
          onDivineAction({ type: "BLESS", kingdomId: kingdoms[0].id, x: tile.x, y: tile.y });
        break;
      case "SPAWN_KINGDOM":
        setKingdomHover({ x: tile.x, y: tile.y, size: 2 });
        break;
    }

    setLastChangedTile({ x: tile.x, y: tile.y });
  };

  const handleTileClick = (tile: TileType) => {
    if (selectedPower === "INSPECT") {
      let found = false;
      for (const k of kingdoms) {
        const human = k.humans.find(h => Math.abs(h.x - tile.x) < 0.5 && Math.abs(h.y - tile.y) < 0.5);
        if (human) { setInspectedHuman(human); setInspectedAnimal(null); found = true; break; }
        const animal = k.animals.find(a => Math.abs(a.x - tile.x) < 0.5 && Math.abs(a.y - tile.y) < 0.5);
        if (animal) { setInspectedAnimal(animal); setInspectedHuman(null); found = true; break; }
      }
      if (!found) { setInspectedHuman(null); setInspectedAnimal(null); }
    }

    if (selectedPower === "SPAWN_KINGDOM") {
      // Clic pour créer le royaume sur la case cliquée
      onDivineAction({ type: "SPAWN_KINGDOM", x: tile.x, y: tile.y, name: `Kingdom-${Date.now()}` });
      setKingdomHover(null);
    }
  };

  const handleMouseDown = (tile: TileType) => { setDragging(true); handleTileAction(tile); };
  const handleMouseEnter = (tile: TileType) => { if (dragging && selectedPower === "TERRAFORM") handleTileAction(tile); };
  const handleMouseUp = () => { setDragging(false); setLastChangedTile(null); };

  // ===============================
  // Overlay
  // ===============================
  const getOverlay = (tile: TileType): string[] => {
    const overlay: string[] = [];

    kingdoms.forEach(k => {
      k.humans.forEach(h => { if (Math.floor(h.x) === tile.x && Math.floor(h.y) === tile.y) overlay.push("human"); });
      k.animals.forEach(a => { if (Math.floor(a.x) === tile.x && Math.floor(a.y) === tile.y) overlay.push("animal"); });
      k.villages.forEach(v => { if (v.x === tile.x && v.y === tile.y) overlay.push("village"); });

      // Zone du royaume
      if (tile.kingdomId === k.id) overlay.push("kingdom");
    });

    // Hover temporaire
    if (kingdomHover) {
      const dx = Math.abs(tile.x - kingdomHover.x);
      const dy = Math.abs(tile.y - kingdomHover.y);
      if (dx <= kingdomHover.size && dy <= kingdomHover.size) overlay.push("kingdomHover");
    }

    return overlay;
  };

  // ===============================
  // Inspection
  // ===============================
  useEffect(() => {
    if (inspectedHuman) {
      const updated = kingdoms.flatMap(k => k.humans).find(h => h.id === inspectedHuman.id);
      setInspectedHuman(updated || null);
    }
    if (inspectedAnimal) {
      const updated = kingdoms.flatMap(k => k.animals).find(a => a.id === inspectedAnimal.id);
      setInspectedAnimal(updated || null);
    }
  }, [kingdoms]);

  // ===============================
  // Render
  // ===============================
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${world[0]?.length || 0}, 16px)`,
          userSelect: "none",
          flexGrow: 1
        }}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {world.flat().map(tile => (
          <Tile
            key={`${tile.x}-${tile.y}`}
            tile={tile}
            overlay={getOverlay(tile)}
            onMouseEnter={() => handleMouseEnter(tile)}
            onMouseDown={() => handleMouseDown(tile)}
            onClick={() => handleTileClick(tile)}
          />
        ))}
      </div>

      <aside style={{ width: 250, background: "#222", color: "#fff", padding: "16px", overflowY: "auto", borderLeft: "2px solid #444" }}>
        <div>
          <label>Smite Radius: {smiteRadius}</label>
          <input type="range" min={1} max={5} value={smiteRadius} onChange={e => setSmiteRadius(Number(e.target.value))} />
        </div>
        {inspectedHuman ? (
          <>
            <h3>Human {inspectedHuman.id}</h3>
            <div>Age: {inspectedHuman.age}</div>
            <div>Health: {inspectedHuman.health}</div>
            <div>Hunger: {inspectedHuman.hunger}</div>
            <div>Profession: {inspectedHuman.profession}</div>
            <div>Intelligence: {inspectedHuman.intelligence}</div>
          </>
        ) : inspectedAnimal ? (
          <>
            <h3>Animal {inspectedAnimal.id}</h3>
            <div>Type: {inspectedAnimal.type}</div>
            <div>Health: {inspectedAnimal.health}</div>
            <div>Hunger: {inspectedAnimal.hunger}</div>
          </>
        ) : (
          <div>Cliquer sur un humain ou un animal pour inspecter</div>
        )}
      </aside>
    </div>
  );
}