import React from 'react';
import { THEMES, DIFFICULTIES } from '../constants';
import { Difficulty } from '../types';
import { Wind, BookOpen, Sparkles } from 'lucide-react';

interface LobbyProps {
  onStart: (theme: string, difficulty: Difficulty) => void;
  isLoading: boolean;
}

const Lobby: React.FC<LobbyProps> = ({ onStart, isLoading }) => {
  const [selectedTheme, setSelectedTheme] = React.useState(THEMES[0]);
  const [selectedDiff, setSelectedDiff] = React.useState(DIFFICULTIES[0]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-sage-200">
        <div className="w-24 h-24 rounded-full border-4 border-sage-500/30 border-t-sage-400 animate-spin mb-8"></div>
        <h2 className="text-2xl font-serif animate-pulse">Summoning the Room...</h2>
        <p className="mt-4 text-sage-400 italic">"Breathe in... Breathe out..."</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 p-6 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full">
        <header className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Wind className="w-12 h-12 text-sage-400 animate-breathe" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-sage-300 to-lavender-300 mb-4">
            Mindful Escape
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Unlock the doors of language through focus and calm. Select your path to begin.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Difficulty Selection */}
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-sage-300">
              <BookOpen className="w-5 h-5" /> Your Proficiency
            </h3>
            <div className="space-y-3">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => setSelectedDiff(diff)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 border ${
                    selectedDiff.id === diff.id
                      ? 'bg-sage-900/40 border-sage-500 shadow-[0_0_15px_rgba(85,132,100,0.3)]'
                      : 'bg-slate-800 border-slate-700 hover:border-slate-500 hover:bg-slate-700'
                  }`}
                >
                  <div className="font-bold text-lg">{diff.label}</div>
                  <div className="text-sm text-slate-400">{diff.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selection */}
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-lavender-300">
              <Sparkles className="w-5 h-5" /> Your Sanctuary
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl text-center transition-all duration-300 border h-full ${
                    selectedTheme.id === theme.id
                      ? 'bg-lavender-900/40 border-lavender-500 shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                      : 'bg-slate-800 border-slate-700 hover:border-slate-500 hover:bg-slate-700'
                  }`}
                >
                  <div className="text-4xl mb-2">{theme.icon}</div>
                  <div className="font-medium text-sm">{theme.name}</div>
                </button>
              ))}
            </div>
            <div className="mt-4 p-3 bg-slate-900/50 rounded-lg text-sm text-slate-400 italic">
              {selectedTheme.description}
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => onStart(selectedTheme.name, selectedDiff.id)}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-sage-600 font-serif rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-500 hover:bg-sage-500 hover:scale-105 shadow-lg shadow-sage-900/50"
          >
            Enter Sanctuary
            <Wind className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
