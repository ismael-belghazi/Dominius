import { Human } from './human';
import { Village } from './village';
import { Animal } from './Animal';

export interface Kingdom {
  id: number;
  name: string;
  humans: Human[];
  villages: Village[];
  animals: Animal[];
  resources: {
    food: number;
    meat: number;
  };
}
