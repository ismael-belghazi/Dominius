import React, { useState } from "react";
import Tile from "./Tile";
import { Tile as TileType, Kingdom, DivineAction, TileTypeName } from "../types/world";

interface GridProps {
  world: TileType[][];
  kingdoms: Kingdom[];
  selectedTileType: TileTypeName;
  selectedPower: DivineAction["type"];
  onDivineAction: (action: DivineAction) => void;
}

export default function Grid({
  world,
  kingdoms,
  selectedTileType,
  selectedPower,
  onDivineAction
}: GridProps) {
  const [dragging, setDragging] = useState(false);
  const [lastChangedTile, setLastChangedTile] = useState<{ x: number; y: number } | null>(null);

  const handleTileAction = (tile: TileType) => {
    if (lastChangedTile && lastChangedTile.x === tile.x && lastChangedTile.y === tile.y) return;

    if (selectedPower === "TERRAFORM") {
      // On ne touche pas aux tuiles existantes si tu veux juste afficher overlays
      tile.type = selectedTileType;
      onDivineAction({ type: "TERRAFORM", x: tile.x, y: tile.y, tileType: selectedTileType });
    } else if (selectedPower === "SPAWN_VILLAGE") {
      onDivineAction({ type: "SPAWN_VILLAGE", x: tile.x, y: tile.y, name: `Village-${Date.now()}` });
    }

    setLastChangedTile({ x: tile.x, y: tile.y });
  };

  const handleMouseDown = (tile: TileType) => {
    setDragging(true);
    handleTileAction(tile);
  };

  const handleMouseEnter = (tile: TileType) => {
    if (dragging && selectedPower === "TERRAFORM") {
      handleTileAction(tile);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setLastChangedTile(null);
  };

  // Retourne uniquement un overlay pour les humains, animaux et villages spawnés
  const getOverlay = (tile: TileType): string[] => {
    const overlay: string[] = [];
    kingdoms.forEach((k) => {
      // Humains
      if (k.humans.some((h) => h.x === tile.x && h.y === tile.y)) overlay.push("human");
      // Animaux
      if (k.animals.some((a) => a.x === tile.x && a.y === tile.y)) overlay.push("animal");
      // Villages spawnés
      if (k.villages.some((v) => v.x === tile.x && v.y === tile.y)) overlay.push("village");
    });
    return overlay;
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${world[0].length}, 16px)`,
        userSelect: "none"
      }}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {world.flat().map((tile) => (
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