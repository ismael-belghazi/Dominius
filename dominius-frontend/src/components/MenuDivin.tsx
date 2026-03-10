import React from "react";
import { TileTypeName } from "../types/world";
import { socket } from "../engine/socket";

interface Props {
  x: number;
  y: number;
  onClose: () => void;
}

const TILE_TYPES: TileTypeName[] = ["GRASS", "SAND", "WATER", "MOUNTAIN"];
const ANIMAL_TYPES = ["Cow", "Sheep", "Pig", "Chicken", "Deer", "Rabbit", "Fish"];

export default function MenuDivin({ x, y, onClose }: Props) {
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
      minWidth: "120px"
    }}>
      {/* Terraform */}
      <strong style={{ display: "block", marginBottom: "4px" }}>Terraform</strong>
      {TILE_TYPES.map(t => (
        <div
          key={t}
          style={{ cursor: "pointer", padding: "4px" }}
          onClick={() => { 
            socket.emit("DIVINE_ACTION", { type: "TERRAFORM", x, y, tileType: t }); 
            onClose(); 
          }}
        >
          {t}
        </div>
      ))}

      <hr style={{ borderColor: "#444", margin: "6px 0" }} />

      {/* Spawn Village */}
      <div
        style={{ cursor: "pointer", padding: "4px", color: "yellow" }}
        onClick={() => { 
          socket.emit("DIVINE_ACTION", { type: "SPAWN_VILLAGE", x, y, name: `Village-${Date.now()}` }); 
          onClose(); 
        }}
      >
        Spawn Village
      </div>

      {/* Spawn Kingdom */}
      <div
        style={{ cursor: "pointer", padding: "4px", color: "orange" }}
        onClick={() => { 
          socket.emit("DIVINE_ACTION", { 
            type: "SPAWN_KINGDOM", 
            name: `Kingdom-${Date.now()}`,
            x,   // coordonnées pour la visualisation
            y
          }); 
          onClose(); 
        }}
      >
        Spawn Kingdom
      </div>

      {/* Spawn Animal */}
      <strong style={{ display: "block", marginTop: "6px", marginBottom: "4px" }}>Spawn Animal</strong>
      {ANIMAL_TYPES.map(a => (
        <div
          key={a}
          style={{ cursor: "pointer", padding: "4px", color: "lightgreen" }}
          onClick={() => { 
            socket.emit("DIVINE_ACTION", { type: "SPAWN_ANIMAL", kingdomId: 1, animalType: a, x, y }); 
            onClose(); 
          }}
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