'use client';

import { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import GameScene from './components/GameScene';
import LocationPicker from './components/LocationPicker';
import Journal from './components/Journal';
import { LOCATIONS } from './types';
import type { Screen, Location, SaveData } from './types';

const DEFAULT_SAVE: SaveData = { treats: 0, collectedItems: [] };

function loadSave(): SaveData {
  if (typeof window === 'undefined') return DEFAULT_SAVE;
  try {
    const raw = localStorage.getItem('poppy-save');
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_SAVE;
}

function writeSave(data: SaveData) {
  try {
    localStorage.setItem('poppy-save', JSON.stringify(data));
  } catch {}
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>('start');
  const [currentLocation, setCurrentLocation] = useState<Location>('house');
  const [visitedLocations, setVisitedLocations] = useState<Location[]>([]);
  const [save, setSave] = useState<SaveData>(DEFAULT_SAVE);

  // Load save on mount
  useEffect(() => {
    setSave(loadSave());
  }, []);

  const handlePlay = () => {
    setCurrentLocation('house');
    setVisitedLocations([]);
    setScreen('playing');
  };

  const handleSceneEnd = (treatsEarned: number, newCollected: string[]) => {
    setVisitedLocations(prev => [...prev, currentLocation]);
    setSave(prev => {
      const updated = {
        treats: prev.treats + treatsEarned,
        collectedItems: Array.from(new Set([...prev.collectedItems, ...newCollected])),
      };
      writeSave(updated);
      return updated;
    });
    setScreen('choosing');
  };

  const handlePickLocation = (loc: Location) => {
    setCurrentLocation(loc);
    setScreen('playing');
  };

  const handleQuit = () => setScreen('start');
  const handleJournal = () => setScreen('journal');

  return (
    <div className="h-screen w-screen overflow-hidden">
      {screen === 'start' && (
        <StartScreen
          onPlay={handlePlay}
          onJournal={handleJournal}
          treats={save.treats}
          collectedCount={save.collectedItems.length}
        />
      )}
      {screen === 'playing' && (
        <GameScene
          location={LOCATIONS.find(l => l.id === currentLocation)!}
          collectedItems={save.collectedItems}
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
      {screen === 'journal' && (
        <Journal
          collectedItems={save.collectedItems}
          treats={save.treats}
          onBack={() => setScreen('start')}
        />
      )}
    </div>
  );
}
