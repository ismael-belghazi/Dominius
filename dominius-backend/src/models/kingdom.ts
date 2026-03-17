import { Human } from './human';
import { Village } from './village';
import { Animal } from './Animal';
import { Army } from './Army';

export interface Kingdom {
  id: number;
  name: string;
  humans: Human[];
  villages: Village[];
  animals: Animal[];
  resources: { food: number; meat: number };
  x?: number;
  y?: number;
  
  leader?: {
    name: string;
    aggressiveness: number; 
    diplomacy: number;      
    strategy: number;       
  };
  allies?: number[]; 
  enemies?: number[]; 
  armies?: Army[];    
  roads?: { from: Village; to: Village }[];
}