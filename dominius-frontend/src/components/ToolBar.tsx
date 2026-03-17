import React, { useState } from "react";
import styles from "./Toolbar.module.css";

interface Props {
  onSelectPower?: (power: string) => void;
}

export default function ToolBar({ onSelectPower }: Props) {
  const [selectedPower, setSelectedPower] = useState<string>("");

  const handleClick = (power: string) => {
    setSelectedPower(power);
    if (onSelectPower) onSelectPower(power);
  };

  const powers = ["TERRAFORM","SPAWN_VILLAGE","SPAWN_KINGDOM","SPAWN_ANIMAL","SMITE","BLESS"];

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