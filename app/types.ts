export type Screen = 'start' | 'playing';

export type Room = 'living-room' | 'kitchen' | 'bedroom' | 'garden';

export const ROOMS: { id: Room; label: string; emoji: string }[] = [
  { id: 'living-room', label: 'Living Room', emoji: '🛋️' },
  { id: 'kitchen', label: 'Kitchen', emoji: '🍳' },
  { id: 'bedroom', label: 'Bedroom', emoji: '🛏️' },
  { id: 'garden', label: 'Garden', emoji: '🌻' },
];
