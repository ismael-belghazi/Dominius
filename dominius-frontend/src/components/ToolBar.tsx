import React, { useState } from "react";
import styles from "./Toolbar.module.css";

interface Props {
  onSelectPower?: (power: DivinePower) => void;
}

export default function ToolBar({ onSelectPower }: Props) {
  const [selectedPower, setSelectedPower] = useState<DivinePower>("TERRAFORM");

  const handleClick = (power: DivinePower) => {
    setSelectedPower(power);
    if (onSelectPower) onSelectPower(power);
  };

  const powers = ["TERRAFORM","SPAWN_VILLAGE","SPAWN_KINGDOM","SPAWN_ANIMAL","SMITE","BLESS"];

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
    <div className={styles.toolbar}>
      {powers.map(p => (
        <button
          key={p}
          className={`${styles.button} ${selectedPower === p ? styles.buttonActive : ""}`}
          onClick={() => handleClick(p)}
        >
          {p.replace("_", " ")}
        </button>
      ))}
    </div>
  );
}