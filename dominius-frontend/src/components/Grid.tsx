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

  // ===============================
  // Socket.io mise à jour en temps réel
  // ===============================
  useEffect(() => {
    socket.on("WORLD_UPDATE", (state: { world: TileType[][]; kingdoms: Kingdom[] }) => {
      const newWorld = state.world.map(row => row.map(tile => ({ ...tile })));
      const newKingdoms = state.kingdoms.map(k => ({
        ...k,
        humans: k.humans.map(h => ({ ...h })),
        animals: k.animals.map(a => ({ ...a })),
        villages: k.villages.map(v => ({ ...v }))
      }));
      setWorld(newWorld);
      setKingdoms(newKingdoms);
    });

    return () => { socket.off("WORLD_UPDATE"); };
  }, []);

  // ===============================
  // Actions divines
  // ===============================
  const handleTileAction = (tile: TileType) => {
    if (lastChangedTile && lastChangedTile.x === tile.x && lastChangedTile.y === tile.y) return;

    if (selectedPower === "TERRAFORM") {
      onDivineAction({ type: "TERRAFORM", x: tile.x, y: tile.y, tileType: selectedTileType });
    } else if (selectedPower === "SPAWN_VILLAGE") {
      onDivineAction({ type: "SPAWN_VILLAGE", x: tile.x, y: tile.y, name: `Village-${Date.now()}` });
    } else if (selectedPower === "SPAWN_ANIMAL") {
      if (kingdoms[0]) {
        onDivineAction({ type: "SPAWN_ANIMAL", kingdomId: kingdoms[0].id, animalType: "Cow", x: tile.x, y: tile.y });
      }
    }

    setLastChangedTile({ x: tile.x, y: tile.y });
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
    });
    return overlay;
  };

  // ===============================
  // Clic pour inspecter
  // ===============================
  const handleTileClick = (tile: TileType) => {
    if (selectedPower !== "INSPECT") return;

    let found = false;
    for (const k of kingdoms) {
      const human = k.humans.find(h => Math.abs(h.x - tile.x) < 0.5 && Math.abs(h.y - tile.y) < 0.5);
      if (human) {
        setInspectedHuman(human);
        setInspectedAnimal(null);
        found = true;
        break;
      }
      const animal = k.animals.find(a => Math.abs(a.x - tile.x) < 0.5 && Math.abs(a.y - tile.y) < 0.5);
      if (animal) {
        setInspectedAnimal(animal);
        setInspectedHuman(null);
        found = true;
        break;
      }
    }
    if (!found) {
      setInspectedHuman(null);
      setInspectedAnimal(null);
    }
  };

  // ===============================
  // Mise à jour dynamique si la créature bouge
  // ===============================
  useEffect(() => {
    if (inspectedHuman) {
      const updatedHuman = kingdoms.flatMap(k => k.humans).find(h => h.id === inspectedHuman.id);
      if (updatedHuman) setInspectedHuman(updatedHuman);
      else setInspectedHuman(null);
    }
    if (inspectedAnimal) {
      const updatedAnimal = kingdoms.flatMap(k => k.animals).find(a => a.id === inspectedAnimal.id);
      if (updatedAnimal) setInspectedAnimal(updatedAnimal);
      else setInspectedAnimal(null);
    }
  }, [kingdoms]);

  // ===============================
  // Render
  // ===============================
  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* Grille */}
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

      {/* Onglet inspection */}
      <aside style={{
        width: 250,
        background: "#222",
        color: "#fff",
        padding: "16px",
        overflowY: "auto",
        borderLeft: "2px solid #444"
      }}>
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