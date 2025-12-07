import React, { useState, useRef, useEffect } from 'react';
import { GameState, Puzzle } from '../types';
import { Key, Unlock, HelpCircle, Send, ArrowRight } from 'lucide-react';
import { checkAnswerWithGemini } from '../services/geminiService';

interface RoomViewProps {
  gameState: GameState;
  onPuzzleSolved: () => void;
  onUseHint: () => void;
  onEscape: () => void;
}

const RoomView: React.FC<RoomViewProps> = ({ gameState, onPuzzleSolved, onUseHint, onEscape }) => {
  const { currentRoom, currentPuzzleIndex, keysCollected } = gameState;
  const currentPuzzle = currentRoom?.puzzles[currentPuzzleIndex];

  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset state when puzzle changes
    setInput('');
    setFeedback(null);
    setShowHint(false);
  }, [currentPuzzleIndex]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentPuzzle || isSubmitting) return;

    setIsSubmitting(true);
    const result = await checkAnswerWithGemini(currentPuzzle, input);
    setIsSubmitting(false);

    setFeedback(result.feedback);

    if (result.isCorrect) {
      setTimeout(() => {
        onPuzzleSolved();
      }, 2000); // Wait 2s to read feedback before moving on
    }
  };

  if (!currentRoom) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar / Info Panel */}
      <aside className="w-full md:w-1/3 lg:w-1/4 bg-slate-800 border-r border-slate-700 p-6 flex flex-col">
        <div className="mb-8">
          <h2 className="text-2xl font-serif text-sage-300 mb-2">{currentRoom.title}</h2>
          <p className="text-slate-400 text-sm leading-relaxed">{currentRoom.description}</p>
        </div>

        <div className="mb-auto">
          <h3 className="text-sm uppercase tracking-wider text-slate-500 font-bold mb-4">Progress</h3>
          <div className="flex items-center gap-2 mb-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-12 w-12 rounded-lg border-2 flex items-center justify-center transition-all ${
                  i < keysCollected
                    ? 'border-sage-500 bg-sage-500/20 text-sage-400'
                    : 'border-slate-700 bg-slate-800/50 text-slate-600'
                }`}
              >
                {i < keysCollected ? <Key className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500">Collect 3 keys to escape.</p>
        </div>
      </aside>

      {/* Main Game Area */}
      <main className="flex-1 p-4 md:p-8 flex flex-col max-w-3xl mx-auto w-full relative">
        
        {/* Puzzle Card */}
        {currentPuzzle && (
          <div className="flex-1 flex flex-col justify-center animate-fade-in">
            <div className="bg-slate-800/80 backdrop-blur border border-slate-600 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
               {/* Decorative background element */}
               <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-sage-500/10 rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-sage-900/50 text-sage-300 px-3 py-1 rounded-full text-xs font-semibold border border-sage-700 uppercase tracking-wide">
                    {currentPuzzle.type} Puzzle
                  </span>
                  <button 
                    onClick={() => { setShowHint(true); onUseHint(); }}
                    className="text-slate-400 hover:text-lavender-400 transition-colors flex items-center gap-1 text-sm"
                    disabled={showHint}
                  >
                    <HelpCircle className="w-4 h-4" /> {showHint ? 'Hint Revealed' : 'Need a Hint?'}
                  </button>
                </div>

                <h3 className="text-2xl md:text-3xl font-serif font-medium mb-8 leading-snug">
                  {currentPuzzle.question}
                </h3>

                {showHint && (
                  <div className="mb-6 p-4 bg-lavender-900/20 border-l-2 border-lavender-500 rounded-r text-lavender-200 text-sm italic animate-fade-in">
                    "Guide: {currentPuzzle.hint}"
                  </div>
                )}

                {/* Feedback Area */}
                {feedback && (
                  <div className={`mb-6 p-4 rounded-lg text-sm font-medium animate-fade-in ${
                    feedback.includes("Perfect") || feedback.includes("Correct") 
                      ? 'bg-sage-900/40 text-sage-200 border border-sage-500/30'
                      : 'bg-red-900/20 text-red-200 border border-red-500/30'
                  }`}>
                    {feedback}
                  </div>
                )}

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your answer here..."
                    disabled={isSubmitting}
                    className={`w-full bg-slate-900/50 border-2 rounded-xl px-5 py-4 text-lg focus:outline-none transition-all duration-300 placeholder:text-slate-600 ${
                      isSubmitting
                        ? 'border-sage-400/50 bg-sage-400/5 cursor-wait animate-pulse'
                        : 'border-slate-600 focus:border-sage-500 focus:ring-1 focus:ring-sage-500'
                    }`}
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !input.trim()}
                    className="absolute right-2 top-2 bottom-2 bg-sage-600 hover:bg-sage-500 disabled:bg-slate-700 text-white rounded-lg px-4 flex items-center justify-center transition-colors"
                  >
                    {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
        
        {!currentPuzzle && keysCollected >= 3 && (
            <div className="flex-1 flex flex-col items-center justify-center animate-fade-in text-center">
                 <div className="w-20 h-20 bg-sage-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(85,132,100,0.4)] animate-bounce">
                    <Unlock className="w-10 h-10 text-white" />
                 </div>
                 <h2 className="text-4xl font-serif font-bold text-white mb-4">The Door Opens</h2>
                 <p className="text-slate-300 max-w-md mb-8">
                     You have collected the keys of wisdom. The path ahead is clear.
                 </p>
                 <button
                    onClick={onEscape}
                    className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-sage-100 transition-colors flex items-center gap-2"
                 >
                     Walk Through <ArrowRight className="w-5 h-5" />
                 </button>
            </div>
        )}

      </main>
    </div>
  );
};

export default RoomView;