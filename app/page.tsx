'use client';

import { useState } from 'react';
import StartScreen from './components/StartScreen';
import GameScene from './components/GameScene';
import { ROOMS } from './types';
import type { Screen } from './types';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('start');
  const [currentRoom, setCurrentRoom] = useState(0);

  const handlePlay = () => {
    setCurrentRoom(0);
    setScreen('playing');
  };

  const handleNextRoom = () => {
    if (currentRoom < ROOMS.length - 1) {
      setCurrentRoom(prev => prev + 1);
    }
  };

  const handlePrevRoom = () => {
    if (currentRoom > 0) {
      setCurrentRoom(prev => prev - 1);
    }
  };

  const handleQuit = () => {
    setScreen('start');
    setCurrentRoom(0);
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      {screen === 'start' && <StartScreen onPlay={handlePlay} />}
      {screen === 'playing' && (
        <GameScene
          room={ROOMS[currentRoom]}
          roomIndex={currentRoom}
          totalRooms={ROOMS.length}
          onNextRoom={handleNextRoom}
          onPrevRoom={handlePrevRoom}
          onQuit={handleQuit}
        />
      )}
    </div>
  );
}
