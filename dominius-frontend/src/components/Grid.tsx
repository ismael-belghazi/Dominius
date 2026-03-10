import React, { useState, useEffect } from "react";
import Tile from "./Tile";
import { Tile as TileType, Kingdom, DivineAction, TileTypeName } from "../types/world";
import { socket } from "../engine/socket";

interface GridProps {
  initialWorld: TileType[][];
  initialKingdoms: Kingdom[];
  selectedTileType: TileTypeName;
  selectedPower: DivineAction["type"];
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

  // ===============================
  // Socket.io mise à jour en temps réel
  // ===============================
  useEffect(() => {
    socket.on("WORLD_UPDATE", (state: { world: TileType[][]; kingdoms: Kingdom[] }) => {
      // Clonage correct du world 2D pour forcer re-render
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
  // Overlay pour chaque tile
  // ===============================
  const getOverlay = (tile: TileType): string[] => {
    const overlay: string[] = [];
    kingdoms.forEach(k => {
      k.humans.forEach(h => { if (h.x === tile.x && h.y === tile.y) overlay.push("human"); });
      k.animals.forEach(a => { if (a.x === tile.x && a.y === tile.y) overlay.push("animal"); });
      k.villages.forEach(v => { if (v.x === tile.x && v.y === tile.y) overlay.push("village"); });
    });
    return overlay;
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${world[0]?.length || 0}, 16px)`,
        userSelect: "none"
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
        />
      ))}
    </div>
  );
}