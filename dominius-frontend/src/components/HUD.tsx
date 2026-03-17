import React from "react";
import { TileTypeName, DivineAction } from "../types/world";
import styles from "./HUD.module.css";

interface HUDProps {
  selectedTileType: TileTypeName;
  setSelectedTileType: (t: TileTypeName) => void;
  selectedPower: DivineAction["type"] | "INSPECT"; 
  setSelectedPower: (p: DivineAction["type"] | "INSPECT") => void;
}

export default function HUD({ selectedTileType, setSelectedTileType, selectedPower, setSelectedPower }: HUDProps) {
  return (
    <div className={styles.hud}>
      <div className={styles.section}>
        <strong>Terrain:</strong>
        {["GRASS","SAND","WATER","MOUNTAIN"].map(t => (
          <button
            key={t}
            className={`${styles.button} ${selectedTileType===t ? styles.active : ""}`}
            onClick={()=>setSelectedTileType(t as TileTypeName)}
          >{t}</button>
        ))}
      </div>
      <div className={styles.section}>
        <strong>Pouvoir:</strong>
        {["TERRAFORM","SPAWN_VILLAGE","SPAWN_KINGDOM","SMITE","SPAWN_ANIMAL","BLESS"].map(p => (
          <button
            key={p}
            className={`${styles.button} ${selectedPower===p ? styles.active : ""}`}
            onClick={()=>setSelectedPower(p as DivineAction["type"])}
          >{p}</button>
        ))}
        <button
          className={`${styles.button} ${selectedPower==="INSPECT" ? styles.active : ""}`}
          onClick={()=>setSelectedPower("INSPECT")}
        >INSPECT</button>
      </div>
    </div>
  );
}