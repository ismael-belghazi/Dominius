import React from "react";
import { Tile as TileType } from "../types/world";

interface Props {
  tile: TileType;
  overlay: string[];
  onMouseEnter?: () => void;
  onMouseDown?: () => void;
  onClick?: () => void; // <-- nouveau
}

const TILE_COLORS: Record<string, string> = {
  GRASS: "#3c8d0d",
  SAND: "#d9d59b",
  WATER: "#3b82f6",
  MOUNTAIN: "#888888",
};

export default function Tile({ tile, overlay, onMouseEnter, onMouseDown, onClick }: Props) {
  const iconSize = 10;

  return (
    <div
      className="tile"
      onMouseEnter={onMouseEnter}
      onMouseDown={onMouseDown}
      onClick={onClick} 
      style={{
        width: 16,
        height: 16,
        background: TILE_COLORS[tile.type],
        border: "1px solid #222",
        boxSizing: "border-box",
        position: "relative",
        cursor: overlay.includes("human") ? "pointer" : "default"
      }}
    >
      {/* Humains */}
      {overlay.includes("human") && (
        <div
          style={{
            position: "absolute",
            opacity: 0.8,
            width: iconSize,
            height: iconSize,
            top: 2,
            left: 2,
            backgroundColor: "blue",
            borderRadius: "50%",
          }}
        />
      )}

      {/* Animaux */}
      {overlay.includes("animal") && (
        <div
          style={{
            position: "absolute",
            opacity: 0.8,
            width: iconSize,
            height: iconSize,
            top: 2,
            right: 2,
            backgroundColor: "red",
            borderRadius: "50%",
          }}
        />
      )}

      {/* Village */}
      {overlay.includes("village") && (
        <div
          style={{
            position: "absolute",
            opacity: 0.8,
            width: iconSize,
            height: iconSize,
            bottom: 2,
            left: 3,
            backgroundColor: "yellow",
            borderRadius: "50%",
            border: "1px solid #aaa"
          }}
        />
      )}
    </div>
  );
}