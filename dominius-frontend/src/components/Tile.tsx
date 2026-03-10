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
        border: "1px solid #222",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* Humains */}
      {overlay.includes("human") && (
        <div
          style={{
            position: "absolute",
            width: "50%",
            height: "50%",
            top: "0%",
            left: "0%",
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
            width: "50%",
            height: "50%",
            top: "0%",
            right: "0%",
            backgroundColor: "red",
            borderRadius: "50%",
          }}
        />
      )}

      {/* Village – seulement au hover */}
      {overlay.includes("village") && (
        <div
          className="village-overlay"
          style={{
            position: "absolute",
            width: "50%",
            height: "50%",
            bottom: "0%",
            left: "25%",
            backgroundColor: "yellow",
            borderRadius: "50%",
            opacity: 0,
            transition: "opacity 0.2s",
          }}
        />
      )}

      <style>{`
        .tile:hover .village-overlay {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}