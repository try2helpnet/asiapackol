
import { KOLLevel } from './types';

export const INITIAL_KOL_LEVELS: KOLLevel[] = [
  {
    id: crypto.randomUUID(),
    name: "KOC (<10k followers)",
    count: 1,
    costMin: 800,
    costMax: 1500,
    sellingMin: 1600,
    sellingMax: 3000,
  },
  {
    id: crypto.randomUUID(),
    name: "Micro (10-50K followers)",
    count: 1,
    costMin: 2000,
    costMax: 11000,
    sellingMin: 4000,
    sellingMax: 22000,
  },
  {
    id: crypto.randomUUID(),
    name: "Macro (100K-500K followers)",
    count: 1,
    costMin: 31000,
    costMax: 86000,
    sellingMin: 62000,
    sellingMax: 172000,
  },
];

export const LOCAL_STORAGE_KEY = 'kol-budget-calcs';
export const MAX_SAVED_RESULTS = 20;
