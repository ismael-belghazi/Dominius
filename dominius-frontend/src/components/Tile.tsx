import React from "react";
import { Tile as TileType } from "../types/world";
import styles from "./Tile.module.css";

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
  return (
    <div
      className={styles.tile}
      onMouseEnter={onMouseEnter}
      onMouseDown={onMouseDown}
      onClick={onClick}
      style={{ background: TILE_COLORS[tile.type], cursor: overlay.includes("human") ? "pointer" : "default" }}
    >
      {overlay.includes("human") && <div style={{
        position: "absolute", top: 2, left: 2, width: iconSize, height: iconSize,
        backgroundColor: "blue", borderRadius: "50%", opacity: 0.8
      }}/>}
      {overlay.includes("animal") && <div style={{
        position: "absolute", top: 2, right: 2, width: iconSize, height: iconSize,
        backgroundColor: "red", borderRadius: "50%", opacity: 0.8
      }}/>}
      {overlay.includes("village") && <div style={{
        position: "absolute", bottom: 2, left: 3, width: iconSize, height: iconSize,
        backgroundColor: "yellow", borderRadius: "50%", opacity: 0.8, border: "1px solid #aaa"
      }}/>}
    </div>
  );
}