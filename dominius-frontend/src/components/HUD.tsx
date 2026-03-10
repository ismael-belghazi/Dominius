import React from "react";
import { TileTypeName, DivineAction } from "../types/world";

interface HUDProps {
  selectedTileType: TileTypeName;
  setSelectedTileType: (t: TileTypeName) => void;
  selectedPower: DivineAction["type"];
  setSelectedPower: (p: DivineAction["type"]) => void;
}

export default function HUD({ selectedTileType, setSelectedTileType, selectedPower, setSelectedPower }: HUDProps) {
  return (
    <div style={{ display:"flex", gap:"16px", marginBottom:"8px" }}>
      <div>
        <strong>Terrain:</strong>
        {["GRASS","SAND","WATER","MOUNTAIN"].map(t=>(
          <button
            key={t}
            style={{ backgroundColor: selectedTileType===t?"#555":"#222", color:"#fff", margin:"2px" }}
            onClick={()=>setSelectedTileType(t as TileTypeName)}
          >{t}</button>
        ))}
      </div>
      <div>
        <strong>Pouvoir:</strong>
        {["TERRAFORM","SPAWN_VILLAGE","SPAWN_KINGDOM","SMITE","SPAWN_ANIMAL","BLESS"].map(p=>(
          <button
            key={p}
            style={{ backgroundColor: selectedPower===p?"#555":"#222", color:"#fff", margin:"2px" }}
            onClick={()=>setSelectedPower(p as DivineAction["type"])}
          >{p}</button>
        ))}
      </div>
    </div>
  );
}