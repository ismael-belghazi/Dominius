import React from "react";
import { Tile as TileType } from "../types/world";

interface Props {
  tile: TileType;
  overlay?: string[]; // rendu optionnel avec fallback
  onMouseEnter?: () => void;
  onMouseDown?: () => void;
  onClick?: () => void;
}

const TILE_COLORS: Record<string, string> = {
  GRASS: "#3c8d0d",
  SAND: "#d9d59b",
  WATER: "#3b82f6",
  MOUNTAIN: "#888888",
};

export default function Tile({ tile, overlay = [], onMouseEnter, onMouseDown, onClick }: Props) {
  const iconSize = 10;

  const overlayColors: Record<string, string> = {
    human: "blue",
    animal: "red",
    village: "yellow",
    kingdomHover: "rgba(255,165,0,0.3)", // futur royaume
    kingdom: "rgba(255,165,0,0.15)" // royaume existant
  };

  return (
    <div
      className="tile"
      onMouseEnter={onMouseEnter}
      onMouseDown={onMouseDown}
      onClick={onClick}
      style={{
        width: 16,
        height: 16,
        background: TILE_COLORS[tile.type] || "#000",
        border: "1px solid #222",
        boxSizing: "border-box",
        position: "relative",
        cursor: overlay.includes("human") ? "pointer" : "default"
      }}
    >
      {/* Overlay pour zone de futur royaume */}
      {overlay.includes("kingdomHover") && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: overlayColors["kingdomHover"],
            pointerEvents: "none",
            border: "1px dashed orange",
            boxSizing: "border-box"
          }}
        />
      )}

      {/* Overlay pour royaume existant */}
      {overlay.includes("kingdom") && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: overlayColors["kingdom"],
            pointerEvents: "none",
            boxSizing: "border-box"
          }}
        />
      )}

      {/* Humains */}
      {overlay.includes("human") && (
        <div
          style={{
            position: "absolute",
            top: 2,
            left: 2,
            width: iconSize,
            height: iconSize,
            borderRadius: "50%",
            backgroundColor: overlayColors["human"],
            opacity: 0.8
          }}
        />
      )}

      {/* Animaux */}
      {overlay.includes("animal") && (
        <div
          style={{
            position: "absolute",
            top: 2,
            right: 2,
            width: iconSize,
            height: iconSize,
            borderRadius: "50%",
            backgroundColor: overlayColors["animal"],
            opacity: 0.8
          }}
        />
      )}

      {/* Village */}
      {overlay.includes("village") && (
        <div
          style={{
            position: "absolute",
            bottom: 2,
            left: 3,
            width: iconSize,
            height: iconSize,
            borderRadius: "50%",
            backgroundColor: overlayColors["village"],
            border: "1px solid #aaa",
            opacity: 0.8
          }}
        />
      )}
    </div>
  );
}