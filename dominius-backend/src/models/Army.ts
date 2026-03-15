export interface Army {
  id: number;
  kingdomId: number;
  units: { type: 'Soldier' | 'Archer' | 'Cavalry'; count: number }[];
  x: number;
  y: number;
  destination?: { x: number; y: number };
  status: 'idle' | 'marching' | 'battling';
}