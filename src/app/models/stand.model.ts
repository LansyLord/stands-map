export interface Stand {
  id: string; 
  name: string;
  description: string;
  logoUrl?: string; 
  status: 'available' | 'occupied';
  position: { x: number; y: number };
}