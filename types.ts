
export interface KOLLevel {
  id: string;
  name: string;
  count: number;
  costMin: number;
  costMax: number;
  sellingMin: number;
  sellingMax: number;
}

export interface SavedCalculation {
  id: string;
  name: string;
  levels: KOLLevel[];
  createdAt: string; // ISO string
}
