export type Screen = 'start' | 'playing' | 'choosing';

export type Location = 'house' | 'garden' | 'beach' | 'park' | 'cafe';

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

export interface Discoverable {
  id: string;
  emoji: string;
  label: string;
  xPos: number; // position along the horizontal scene (0-100)
  message: string;
  found: boolean;
}
