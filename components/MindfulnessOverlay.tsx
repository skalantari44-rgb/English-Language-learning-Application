import React, { useEffect, useState } from 'react';
import { Leaf } from 'lucide-react';

interface MindfulnessOverlayProps {
  onComplete: () => void;
}

const MindfulnessOverlay: React.FC<MindfulnessOverlayProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  // Simple breath cycle: Inhale (4s), Hold (4s), Exhale (4s)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 12000); // 12 seconds total break

    // Animation steps
    const step1 = setTimeout(() => setStep(1), 0);
    const step2 = setTimeout(() => setStep(2), 4000);
    const step3 = setTimeout(() => setStep(3), 8000);

    return () => {
      clearTimeout(timer);
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-md transition-opacity duration-1000">
      <div className="text-center p-8">
        <Leaf className={`w-16 h-16 mx-auto mb-6 text-sage-400 transition-all duration-[4000ms] ease-in-out
          ${step === 1 ? 'scale-150 opacity-100' : ''}
          ${step === 2 ? 'scale-150 opacity-80' : ''}
          ${step === 3 ? 'scale-100 opacity-60' : ''}
        `} />
        
        <h2 className="text-3xl font-serif text-white mb-4 transition-all duration-500">
            {step === 1 && "Breathe In..."}
            {step === 2 && "Hold..."}
            {step === 3 && "Breathe Out..."}
            {step === 0 && "Prepare..."}
        </h2>
        
        <p className="text-slate-400 max-w-xs mx-auto">
            Clear your mind before the next challenge. Let the knowledge settle.
        </p>

        <div className="mt-8 w-64 h-2 bg-slate-800 rounded-full mx-auto overflow-hidden">
             <div className="h-full bg-sage-500 transition-all duration-[12000ms] ease-linear w-full animate-[width_12s_linear_reverse]" style={{ width: '0%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default MindfulnessOverlay;
