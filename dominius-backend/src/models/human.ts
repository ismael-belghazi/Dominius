export type Profession = 'Farmer' | 'Hunter' | 'Breeder' | 'Cook' | 'Teacher' | 'Doctor';

export interface Human {
  id: number;
  x: number;
  y: number;
  kingdomId: number;
  age: number;
  health: number;
  hunger: number;
  profession?: Profession;
  intelligence?: number; 
}
