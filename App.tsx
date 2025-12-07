import React, { useState } from 'react';
import { GameState, GameStatus, Difficulty } from './types';
import Lobby from './components/Lobby';
import RoomView from './components/RoomView';
import MindfulnessOverlay from './components/MindfulnessOverlay';
import { generateRoom } from './services/geminiService';
import { Star, RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    status: GameStatus.LOBBY,
    difficulty: 'Beginner',
    theme: '',
    currentRoom: null,
    currentPuzzleIndex: 0,
    keysCollected: 0,
    messages: [],
  });

  const startGame = async (theme: string, difficulty: Difficulty) => {
    setGameState(prev => ({ ...prev, status: GameStatus.LOADING, theme, difficulty }));
    
    try {
      const roomData = await generateRoom(theme, difficulty);
      setGameState(prev => ({
        ...prev,
        status: GameStatus.PLAYING,
        currentRoom: roomData,
        currentPuzzleIndex: 0,
        keysCollected: 0,
        messages: []
      }));
    } catch (error) {
      console.error(error);
      setGameState(prev => ({ ...prev, status: GameStatus.ERROR, error: "Failed to create the room." }));
    }
  };

  const handlePuzzleSolved = () => {
    // Check if we have collected 3 keys (which corresponds to solving 3 puzzles)
    const newKeys = gameState.keysCollected + 1;
    
    if (newKeys >= 3) {
      // All puzzles solved
       setGameState(prev => ({
        ...prev,
        keysCollected: newKeys,
        currentPuzzleIndex: -1, // No more puzzles
      }));
    } else {
        // Trigger mindfulness break before next puzzle
        setGameState(prev => ({
            ...prev,
            status: GameStatus.MINDFULNESS_BREAK,
            keysCollected: newKeys,
        }));
    }
  };

  const handleMindfulnessComplete = () => {
     setGameState(prev => ({
        ...prev,
        status: GameStatus.PLAYING,
        currentPuzzleIndex: prev.currentPuzzleIndex + 1,
    }));
  };

  const handleEscape = () => {
    setGameState(prev => ({ ...prev, status: GameStatus.VICTORY }));
  };

  const resetGame = () => {
    setGameState({
      status: GameStatus.LOBBY,
      difficulty: 'Beginner',
      theme: '',
      currentRoom: null,
      currentPuzzleIndex: 0,
      keysCollected: 0,
      messages: [],
    });
  };

  return (
    <div className="bg-slate-900 min-h-screen font-sans text-slate-100">
      
      {gameState.status === GameStatus.LOBBY || gameState.status === GameStatus.LOADING ? (
        <Lobby onStart={startGame} isLoading={gameState.status === GameStatus.LOADING} />
      ) : null}

      {gameState.status === GameStatus.PLAYING && (
        <RoomView 
            gameState={gameState} 
            onPuzzleSolved={handlePuzzleSolved} 
            onUseHint={() => {}} 
            onEscape={handleEscape}
        />
      )}

      {gameState.status === GameStatus.MINDFULNESS_BREAK && (
        <MindfulnessOverlay onComplete={handleMindfulnessComplete} />
      )}

      {gameState.status === GameStatus.VICTORY && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[url('https://picsum.photos/1920/1080?blur=5')] bg-cover bg-center text-center relative">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
            <div className="relative z-10 max-w-2xl">
                <Star className="w-24 h-24 text-yellow-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] animate-spin-slow" />
                <h1 className="text-5xl font-serif font-bold text-white mb-6">Freedom Found</h1>
                <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                    You have navigated the labyrinth of language with patience and clarity. 
                    The world outside awaits, richer and more understood than before.
                </p>
                <div className="flex justify-center gap-4">
                     <button 
                        onClick={resetGame}
                        className="bg-sage-600 hover:bg-sage-500 text-white px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 shadow-lg"
                    >
                        <RefreshCcw className="w-5 h-5" /> Start New Journey
                    </button>
                </div>
            </div>
        </div>
      )}

      {gameState.status === GameStatus.ERROR && (
        <div className="min-h-screen flex items-center justify-center text-center p-4">
             <div>
                 <h2 className="text-2xl text-red-400 font-bold mb-4">Connection Lost</h2>
                 <p className="text-slate-400 mb-4">The mists of uncertainty have clouded the room.</p>
                 <button onClick={resetGame} className="underline text-sage-400 hover:text-sage-300">Return to Lobby</button>
             </div>
        </div>
      )}
    </div>
  );
};

export default App;
