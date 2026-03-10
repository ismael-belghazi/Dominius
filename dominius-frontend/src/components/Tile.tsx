import React from "react";
import { Tile as TileType } from "../types/world";

interface Props {
  tile: TileType;
  overlay: string[];
  onMouseEnter?: () => void;
  onMouseDown?: () => void;
}

const TILE_COLORS: Record<string, string> = {
  GRASS: "#3c8d0d",
  SAND: "#d9d59b",
  WATER: "#3b82f6",
  MOUNTAIN: "#888888",
};

export default function Tile({ tile, overlay, onMouseEnter, onMouseDown }: Props) {
  return (
    <div
      className="tile"
      onMouseEnter={onMouseEnter}
      onMouseDown={onMouseDown}
      style={{
        width: 16,
        height: 16,
        background: TILE_COLORS[tile.type],
        border: overlay.includes("human") || overlay.includes("village") ? "2px solid green" : "1px solid #222",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* Humains */}
      {overlay.includes("human") && (
        <div
          style={{
            position: "absolute",
            width: 10,
            height: 10,
            top: 1,
            left: 1,
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
            width: 10,
            height: 10,
            top: 1,
            right: 1,
            backgroundColor: "red",
            borderRadius: "50%",
          }}
        />
      )}

      {/* Villages */}
      {overlay.includes("village") && (
        <div
          style={{
            position: "absolute",
            width: 10,
            height: 10,
            bottom: 1,
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