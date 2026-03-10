import { useEffect, useState } from "react";
import { WorldState } from "../types/world";
import { socket } from "../engine/socket";

export function useWorld() {
  const [world, setWorld] = useState<WorldState | null>(null);
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("worldUpdate", (state: WorldState) => setWorld(state));

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("worldUpdate");
    };
  }, []);

  return { world, connected };
}