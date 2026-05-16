export type Screen = 'start' | 'playing' | 'choosing' | 'journal';

export type Location = 'house' | 'garden' | 'beach' | 'park' | 'cafe';

export type Rarity = 'common' | 'uncommon' | 'rare';

export interface LocationConfig {
  id: Location;
  label: string;
  emoji: string;
}

export const LOCATIONS: LocationConfig[] = [
  { id: 'house', label: 'House', emoji: '🏠' },
  { id: 'garden', label: 'Garden', emoji: '🌻' },
  { id: 'beach', label: 'Beach', emoji: '🏖️' },
  { id: 'park', label: 'Park', emoji: '🌳' },
  { id: 'cafe', label: 'Café', emoji: '☕' },
];

export interface GameItem {
  id: string;
  emoji: string;
  label: string;
  xPos: number;       // 0-100 horizontal position in world
  depth: number;      // 0-100 depth (0=far/back, 100=close/front)
  rarity: Rarity;
  reaction?: 'wag' | 'jump' | 'sniff' | 'sit';
  miniGame?: 'fetch' | 'dig' | 'chase';
  message: string;
  found?: boolean;
}

export interface SaveData {
  treats: number;
  collectedItems: string[];  // "location:itemId" format
}

export const RARITY_TREATS: Record<Rarity, number> = {
  common: 1,
  uncommon: 2,
  rare: 5,
};

export const RARITY_COLORS: Record<Rarity, string> = {
  common: '#FBBF24',
  uncommon: '#A78BFA',
  rare: '#F472B6',
};
