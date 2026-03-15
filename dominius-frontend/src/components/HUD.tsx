import React from "react";
import { TileTypeName, DivineAction } from "../types/world";

interface HUDProps {
  selectedTileType: TileTypeName;
  setSelectedTileType: (t: TileTypeName) => void;
  selectedPower: DivineAction["type"] | "INSPECT"; 
  setSelectedPower: (p: DivineAction["type"] | "INSPECT") => void;
}

// Constantes typées
const TILE_TYPES: TileTypeName[] = ["GRASS","SAND","WATER","MOUNTAIN"];
const DIVINE_POWERS: DivineAction["type"][] = ["TERRAFORM","SPAWN_VILLAGE","SPAWN_KINGDOM","SMITE","SPAWN_ANIMAL","BLESS"];

export default function HUD({
  selectedTileType,
  setSelectedTileType,
  selectedPower,
  setSelectedPower
}: HUDProps) {
  return (
    <div style={{ display:"flex", gap:16, marginBottom:8 }}>
      
      <div>
        <strong>Terrain:</strong>
        {TILE_TYPES.map(t => (
          <button
            key={t}
            style={{
              backgroundColor: selectedTileType === t ? "#555" : "#222",
              color: "#fff",
              margin: 2,
              padding: "4px 8px",
              border: "none",
              borderRadius: 4,
              cursor: "pointer"
            }}
            onClick={() => setSelectedTileType(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div>
        <strong>Pouvoir:</strong>
        {DIVINE_POWERS.map(p => (
          <button
            key={p}
            style={{
              backgroundColor: selectedPower === p ? "#555" : "#222",
              color: "#fff",
              margin: 2,
              padding: "4px 8px",
              border: "none",
              borderRadius: 4,
              cursor: "pointer"
            }}
            onClick={() => setSelectedPower(p)}
          >
            {p}
          </button>
        ))}
        <button
          style={{
            backgroundColor: selectedPower === "INSPECT" ? "#555" : "#222",
            color: "#fff",
            margin: 2,
            padding: "4px 8px",
            border: "none",
            borderRadius: 4,
            cursor: "pointer"
          }}
          onClick={() => setSelectedPower("INSPECT")}
        >
          INSPECT
        </button>
      </div>

    </div>
  );
}