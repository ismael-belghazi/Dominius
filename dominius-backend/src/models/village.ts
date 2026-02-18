export interface Infrastructure {
  type: 'Market' | 'Mill' | 'Barracks' | 'Library' | 'Hospital';
  level: number;            
}

export interface Village {
  id: number;
  name: string;
  x: number;                
  y: number;               
  population: number;       
  infrastructures: Infrastructure[];
}
