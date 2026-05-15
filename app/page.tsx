'use client';

import { useState } from 'react';
import StartScreen from './components/StartScreen';
import GameScene from './components/GameScene';
import ResultsScreen from './components/ResultsScreen';

export type Screen = 'start' | 'playing' | 'results';
export type LifeStage = 'puppy' | 'junior' | 'adolescent' | 'adult' | 'senior';

export interface StageResult {
  stage: LifeStage;
  score: number;
  treats: number;
  tricks: number;
  stars: number;
}

export const STAGES: { id: LifeStage; label: string; age: string; gradient: string; emoji: string }[] = [
  { id: 'puppy', label: 'Puppy', age: '8 weeks', gradient: 'from-emerald-400 via-teal-400 to-cyan-400', emoji: '🌱' },
  { id: 'junior', label: 'Junior', age: '6 months', gradient: 'from-amber-400 via-orange-400 to-rose-400', emoji: '🌻' },
  { id: 'adolescent', label: 'Adolescent', age: '1 year', gradient: 'from-violet-500 via-purple-500 to-fuchsia-500', emoji: '⚡' },
  { id: 'adult', label: 'Adult', age: '3 years', gradient: 'from-blue-500 via-indigo-500 to-violet-500', emoji: '🌟' },
  { id: 'senior', label: 'Senior', age: '10 years', gradient: 'from-rose-400 via-pink-400 to-amber-300', emoji: '🌅' },
];

export default function Home() {
  const [screen, setScreen] = useState<Screen>('start');
  const [currentStage, setCurrentStage] = useState(0);
  const [results, setResults] = useState<StageResult[]>([]);

  const handlePlay = () => {
    setCurrentStage(0);
    setResults([]);
    setScreen('playing');
  };

  const handleStageComplete = (result: StageResult) => {
    setResults(prev => [...prev, result]);
    if (currentStage < STAGES.length - 1) {
      setCurrentStage(prev => prev + 1);
    } else {
      setScreen('results');
    }
  };

  const handleRestart = () => {
    setScreen('start');
    setCurrentStage(0);
    setResults([]);
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      {screen === 'start' && <StartScreen onPlay={handlePlay} />}
      {screen === 'playing' && (
        <GameScene
          stage={STAGES[currentStage]}
          stageIndex={currentStage}
          onComplete={handleStageComplete}
          onQuit={handleRestart}
        />
      )}
      {screen === 'results' && (
        <ResultsScreen results={results} onRestart={handleRestart} />
      )}
    </div>
  );
}
