import React from "react";
import { socket } from "../engine/socket";
import styles from "./MenuDivin.module.css";

interface Props {
  x: number;
  y: number;
  onClose: () => void;
}

const TILE_TYPES: TileTypeName[] = ["GRASS", "SAND", "WATER", "MOUNTAIN"];
const ANIMAL_TYPES: AnimalType[] = ["Cow", "Sheep", "Pig", "Chicken", "Deer", "Rabbit", "Fish"];
const DIVINE_ACTIONS: { type: Exclude<DivineAction["type"], "TERRAFORM" | "SPAWN_VILLAGE" | "SPAWN_ANIMAL">; label: string; cost?: number }[] = [
  { type: "SMITE", label: "Smite (15 pts)", cost: 15 },
  { type: "BLESS", label: "Bless (5 pts)", cost: 5 },
];

export default function MenuDivin({ x, y, onClose }: Props) {
  const emitDivineAction = (action: object) => {
    socket.emit("DIVINE_ACTION", action);
    onClose();
  };

  return (
    <div className={styles.menu} style={{ top: y, left: x }}>
      {/* Terraform */}
      <div className={styles.header}>Terraform</div>
      {TILE_TYPES.map(t => (
        <div
          key={t}
          className={`${styles.item} ${styles.tile}`}
          onClick={() => emitDivineAction({ type: "TERRAFORM", x, y, tileType: t })}
        >
          {t} (1 pt)
        </div>
      ))}

      <hr className={styles.hr} />

      {/* Villages et Royaumes */}
      <div
        className={`${styles.item} ${styles.village}`}
        onClick={() => emitDivineAction({ type: "SPAWN_VILLAGE", x, y, name: `Village-${Date.now()}` })}
      >
        Spawn Village (10 pts, 1er gratuit)
      </div>

      <div
        className={`${styles.item} ${styles.kingdom}`}
        onClick={() => emitDivineAction({ type: "SPAWN_KINGDOM", x, y, name: `Kingdom-${Date.now()}` })}
      >
        Spawn Kingdom
      </div>

      <hr className={styles.hr} />

      {/* Animaux */}
      <div className={styles.header}>Spawn Animal</div>
      {ANIMAL_TYPES.map(a => (
        <div
          key={a}
          className={`${styles.item} ${styles.animal}`}
          onClick={() => emitDivineAction({ type: "SPAWN_ANIMAL", x, y, animalType: a })}
        >
          {a}
        </div>
      ))}

      <hr className={styles.hr} />

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
        className={`${styles.item} ${styles.tile}`}
        onClick={onClose}
      >
        Cancel
      </div>
    </div>
  );
}