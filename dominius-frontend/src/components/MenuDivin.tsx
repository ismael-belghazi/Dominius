import React from "react";
import { TileTypeName } from "../types/world";
import { socket } from "../engine/socket";

interface Props {
  x: number;
  y: number;
  onClose: () => void;
}

// Types disponibles
const TILE_TYPES: TileTypeName[] = ["GRASS", "SAND", "WATER", "MOUNTAIN"];
const ANIMAL_TYPES = ["Cow", "Sheep", "Pig", "Chicken", "Deer", "Rabbit", "Fish"];

export default function MenuDivin({ x, y, onClose }: Props) {
  // Fonction pour émettre une action divine
  const emitDivineAction = (action: object) => {
    socket.emit("DIVINE_ACTION", action);
    onClose();
  };

  return (
    <div style={{
      position: "fixed",
      top: y,
      left: x,
      background: "#222",
      color: "#fff",
      padding: "8px",
      borderRadius: "4px",
      zIndex: 1000,
      minWidth: "140px",
      boxShadow: "0 0 10px rgba(0,0,0,0.5)"
    }}>
      {/* Terraform */}
      <strong style={{ display: "block", marginBottom: "4px" }}>Terraform</strong>
      {TILE_TYPES.map(t => (
        <div
          key={t}
          style={{ cursor: "pointer", padding: "4px" }}
          onClick={() => emitDivineAction({ type: "TERRAFORM", x, y, tileType: t })}
        >
          {t}
        </div>
      ))}

      <hr style={{ borderColor: "#444", margin: "6px 0" }} />

      {/* Spawn Village */}
      <div
        style={{ cursor: "pointer", padding: "4px", color: "yellow" }}
        onClick={() => emitDivineAction({ type: "SPAWN_VILLAGE", x, y, name: `Village-${Date.now()}` })}
      >
        Spawn Village
      </div>

      {/* Spawn Kingdom */}
      <div
        style={{ cursor: "pointer", padding: "4px", color: "orange" }}
        onClick={() => emitDivineAction({ 
          type: "SPAWN_KINGDOM", 
          name: `Kingdom-${Date.now()}`,
          x,  
          y
        })}
      >
        Spawn Kingdom
      </div>

      <hr style={{ borderColor: "#444", margin: "6px 0" }} />

      {/* Spawn Animal */}
      <strong style={{ display: "block", marginTop: "6px", marginBottom: "4px" }}>Spawn Animal</strong>
      {ANIMAL_TYPES.map(a => (
        <div
          key={a}
          style={{ cursor: "pointer", padding: "4px", color: "lightgreen" }}
          onClick={() => emitDivineAction({ type: "SPAWN_ANIMAL", x, y, animalType: a })}
        >
          {a}
        </div>
      ))}

      <hr style={{ borderColor: "#444", margin: "6px 0" }} />

      {/* Cancel */}
      <div style={{ cursor: "pointer", color: "red", padding: "4px" }} onClick={onClose}>Cancel</div>
    </div>
  );
}