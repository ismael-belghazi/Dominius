import React, { useState, useEffect } from "react";
import Grid from "./components/Grid";
import HUD from "./components/HUD";
import { TileTypeName, DivineAction, WorldState, Tile } from "./types/world";
import { socket } from "./engine/socket";

const WIDTH = 50;
const HEIGHT = 50;

function createInitialWorld(): Tile[][] {
  const world: Tile[][] = [];
  for(let y=0;y<HEIGHT;y++){
    const row: Tile[] = [];
    for(let x=0;x<WIDTH;x++){
      row.push({ x, y, type:"GRASS" });
    }
    world.push(row);
  }
  return world;
}

export default function App() {
  const [worldState, setWorldState] = useState<WorldState>({
    world: createInitialWorld(),
    kingdoms: []
  });

  const [selectedTileType, setSelectedTileType] = useState<TileTypeName>("GRASS");
  const [selectedPower, setSelectedPower] = useState<DivineAction["type"]>("TERRAFORM");

  useEffect(()=>{
    socket.emit("INIT_WORLD",{ world: worldState.world });

    socket.on("worldUpdate",(state:WorldState)=>{
      const newWorld = state.world.map(row=>row.map(tile=>({...tile})));
      setWorldState({ ...state, world: newWorld });
    });

    return ()=>{ socket.off("worldUpdate"); };
  },[]);

  const handleDivineAction = (action: DivineAction)=>{
    socket.emit("DIVINE_ACTION",action);
  };

  return (
    <div style={{ padding:"16px", background:"#111", color:"#fff", fontFamily:"sans-serif" }}>
      <HUD
        selectedTileType={selectedTileType}
        setSelectedTileType={setSelectedTileType}
        selectedPower={selectedPower}
        setSelectedPower={setSelectedPower}
      />
      <Grid
        world={worldState.world}
        kingdoms={worldState.kingdoms}
        selectedTileType={selectedTileType}
        selectedPower={selectedPower}
        onDivineAction={handleDivineAction}
      />
    </div>
  );
}