import React from "react";
import { socket } from "../engine/socket";
import { TileTypeName, DivineAction, AnimalType } from "../types/world";

interface Props {
  x: number;
  y: number;
  onClose: () => void;
}

// Types disponibles
const TILE_TYPES: TileTypeName[] = ["GRASS", "SAND", "WATER", "MOUNTAIN"];
const ANIMAL_TYPES: AnimalType[] = ["Cow", "Sheep", "Pig", "Chicken", "Deer", "Rabbit", "Fish"];
const DIVINE_ACTIONS: { type: Exclude<DivineAction["type"], "TERRAFORM" | "SPAWN_VILLAGE" | "SPAWN_ANIMAL">; label: string; cost?: number }[] = [
  { type: "SMITE", label: "Smite (15 pts)", cost: 15 },
  { type: "BLESS", label: "Bless (5 pts)", cost: 5 },
];

export default function MenuDivin({ x, y, onClose }: Props) {
  const emitDivineAction = (action: DivineAction) => {
    socket.emit("DIVINE_ACTION", action);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: y,
        left: x,
        background: "#222",
        color: "#fff",
        padding: 8,
        borderRadius: 4,
        zIndex: 1000,
        minWidth: 160,
        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        fontSize: 14
      }}
    >
      {/* Terraform */}
      <strong style={{ display: "block", marginBottom: 4 }}>Terraform</strong>
      {TILE_TYPES.map(t => (
        <div
          key={t}
          style={{ cursor: "pointer", padding: 4 }}
          onClick={() => emitDivineAction({ type: "TERRAFORM", x, y, tileType: t })}
        >
          {t} (1 pt)
        </div>
      ))}

      <hr style={{ borderColor: "#444", margin: "6px 0" }} />

      {/* Spawn Village */}
      <div
        style={{ cursor: "pointer", padding: 4, color: "yellow" }}
        onClick={() =>
          emitDivineAction({ type: "SPAWN_VILLAGE", x, y, name: `Village-${Date.now()}` })
        }
      >
        Spawn Village (10 pts, 1er gratuit)
      </div>

    {/* Spawn Kingdom */}
    <div
      style={{ cursor: "pointer", padding: 4, color: "orange" }}
      onClick={() =>
        emitDivineAction({
          type: "SPAWN_KINGDOM",
          name: `Kingdom-${Date.now()}`,
          x,
          y
        })
      }
    >
      Spawn Kingdom
    </div>

      <hr style={{ borderColor: "#444", margin: "6px 0" }} />

      {/* Spawn Animal */}
      <strong style={{ display: "block", marginTop: 6, marginBottom: 4 }}>Spawn Animal (2 pts)</strong>
      {ANIMAL_TYPES.map(a => (
        <div
          key={a}
          style={{ cursor: "pointer", padding: 4, color: "lightgreen" }}
          onClick={() =>
            emitDivineAction({ type: "SPAWN_ANIMAL", x, y, animalType: a })
          }
        >
          {a}
        </div>
      ))}

      <hr style={{ borderColor: "#444", margin: "6px 0" }} />

      {/* Pouvoirs divins */}
      <strong style={{ display: "block", marginBottom: 4 }}>Pouvoirs divins</strong>
      {DIVINE_ACTIONS.map(a => (
        <div
          key={a.type}
          style={{ cursor: "pointer", padding: 4, color: "pink" }}
          onClick={() => emitDivineAction({ type: a.type, x, y })}
        >
          {a.label}
        </div>
      ))}

      <hr style={{ borderColor: "#444", margin: "6px 0" }} />

      {/* Cancel */}
      <div
        style={{ cursor: "pointer", color: "red", padding: 4 }}
        onClick={onClose}
      >
        Cancel
      </div>
    </div>
  );
}