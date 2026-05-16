'use client';

import { useState } from 'react';
import StartScreen from './components/StartScreen';
import GameScene from './components/GameScene';
import LocationPicker from './components/LocationPicker';
import { LOCATIONS } from './types';
import type { Screen, Location } from './types';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('start');
  const [currentLocation, setCurrentLocation] = useState<Location>('house');
  const [visitedLocations, setVisitedLocations] = useState<Location[]>([]);

  const handlePlay = () => {
    setCurrentLocation('house');
    setVisitedLocations([]);
    setScreen('playing');
  };

  const handleSceneEnd = () => {
    setVisitedLocations(prev => [...prev, currentLocation]);
    setScreen('choosing');
  };

  const handlePickLocation = (loc: Location) => {
    setCurrentLocation(loc);
    setScreen('playing');
  };

  const handleQuit = () => {
    setScreen('start');
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      {screen === 'start' && <StartScreen onPlay={handlePlay} />}
      {screen === 'playing' && (
        <GameScene
          location={LOCATIONS.find(l => l.id === currentLocation)!}
          onSceneEnd={handleSceneEnd}
          onQuit={handleQuit}
        />
      )}
      {screen === 'choosing' && (
        <LocationPicker
          visited={visitedLocations}
          onPick={handlePickLocation}
          onQuit={handleQuit}
        />
      )}
    </div>
  );
}
