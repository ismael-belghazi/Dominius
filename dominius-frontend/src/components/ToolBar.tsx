import React, { useState } from "react";
import { socket } from "../engine/socket";

interface Props {
  onSelectPower?: (power: string) => void;
}

export default function ToolBar({ onSelectPower }: Props) {
  const [selectedPower, setSelectedPower] = useState<string>("");

  const handleClick = (power: string) => {
    setSelectedPower(power);
    if (onSelectPower) onSelectPower(power);
  };

  const buttonStyle = (active: boolean) => ({
    marginRight: "4px",
    padding: "4px 8px",
    background: active ? "#444" : "#222",
    color: "#fff",
    border: "1px solid #555",
    cursor: "pointer",
    borderRadius: "4px"
  });

  return (
    <div style={{ position: "fixed", top: 0, left: 0, background: "#111", color: "#fff", padding: "8px", zIndex: 1000 }}>
      <button style={buttonStyle(selectedPower === "TERRAFORM")} onClick={() => handleClick("TERRAFORM")}>Terraform</button>
      <button style={buttonStyle(selectedPower === "SPAWN_VILLAGE")} onClick={() => handleClick("SPAWN_VILLAGE")}>Spawn Village</button>
      <button style={buttonStyle(selectedPower === "SPAWN_KINGDOM")} onClick={() => handleClick("SPAWN_KINGDOM")}>Spawn Kingdom</button>
      <button style={buttonStyle(selectedPower === "SPAWN_ANIMAL")} onClick={() => handleClick("SPAWN_ANIMAL")}>Spawn Animal</button>
      <button style={buttonStyle(selectedPower === "SMITE")} onClick={() => handleClick("SMITE")}>Smite</button>
      <button style={buttonStyle(selectedPower === "BLESS")} onClick={() => handleClick("BLESS")}>Bless</button>
    </div>
  );
}