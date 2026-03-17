import React from "react";
import { Tile as TileType } from "../types/world";
import styles from "./Tile.module.css";

interface Props {
  tile: TileType;
  overlay?: string[];
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

export default function Tile({
  tile,
  overlay = [],
  onMouseEnter,
  onMouseDown,
  onClick
}: Props) {
  return (
    <div
      className={styles.tile}
      onMouseEnter={onMouseEnter}
      onMouseDown={onMouseDown}
      onClick={onClick}
      style={{ background: TILE_COLORS[tile.type] }}
    >
      {/*  HUMAIN pixel */}
      {overlay.includes("human") && (
        <div className={styles.entity}>
          <svg width="12" height="12" shapeRendering="crispEdges">
            <rect x="4" y="1" width="4" height="3" fill="#ffe0bd"/> {/* tête */}
            <rect x="3" y="4" width="6" height="5" fill="#2196f3"/> {/* corps */}
          </svg>
        </div>
      )}

      {/* ANIMAL pixel */}
      {overlay.includes("animal") && (
        <div className={styles.entity}>
          <svg width="12" height="12" shapeRendering="crispEdges">
            <rect x="2" y="4" width="8" height="4" fill="#e53935"/> {/* corps */}
            <rect x="3" y="2" width="2" height="2" fill="#e53935"/> {/* tête */}
          </svg>
        </div>
      )}

      {/* VILLAGE pixel */}
      {overlay.includes("village") && (
        <div className={styles.entity}>
          <svg width="12" height="12" shapeRendering="crispEdges">
            <rect x="2" y="5" width="8" height="5" fill="#ffeb3b"/> {/* maison */}
            <rect x="4" y="7" width="2" height="3" fill="#6d4c41"/> {/* porte */}
            <polygon points="2,5 6,2 10,5" fill="#ff9800"/> {/* toit */}
          </svg>
        </div>
      )}
    </div>
  );
}