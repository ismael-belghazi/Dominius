import React, { useState } from "react";
import { socket } from "../engine/socket";
import { DivineAction } from "../types/world";

// Typage strict des pouvoirs
type DivinePower = DivineAction["type"] | "INSPECT";

interface Props {
  onSelectPower?: (power: DivinePower) => void;
}

export default function ToolBar({ onSelectPower }: Props) {
  const [selectedPower, setSelectedPower] = useState<DivinePower>("TERRAFORM");

  const handleClick = (power: DivinePower) => {
    setSelectedPower(power);
    if (onSelectPower) onSelectPower(power);
  };

  const buttonStyle = (active: boolean) => ({
    marginRight: 4,
    padding: "4px 8px",
    background: active ? "#444" : "#222",
    color: "#fff",
    border: "1px solid #555",
    cursor: "pointer",
    borderRadius: 4
  });

  const POWERS: DivinePower[] = [
    "TERRAFORM",
    "SPAWN_VILLAGE",
    "SPAWN_KINGDOM",
    "SPAWN_ANIMAL",
    "SMITE",
    "BLESS",
    "INSPECT"
  ];

  return (
    <div style={{ position: "fixed", top: 0, left: 0, background: "#111", color: "#fff", padding: 8, zIndex: 1000 }}>
      {POWERS.map(power => (
        <button
          key={power}
          style={buttonStyle(selectedPower === power)}
          onClick={() => handleClick(power)}
        >
          {power.replace("_", " ")}
        </button>
      ))}
    </div>
  );
}