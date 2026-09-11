import React, { useState } from 'react';

interface OnboardingProps {
  onDismiss: () => void;
}

const STEPS = [
  {
    title: '1. PARAMETRIC GENOME SLIDERS',
    desc: 'Manipulate the 8 active genetic loci on the left sidebar to modulate procedural displacement, symmetry, limb branching, and bioluminescence in real time.',
  },
  {
    title: '2. 3D SIMULATION CHAMBER',
    desc: 'Click and drag directly on the viewport to orbit around the organism. Use the scroll wheel to zoom in on cellular ridges and surface-attached tentacles.',
  },
  {
    title: '3. TELEMETRY & D3 VISUALIZATIONS',
    desc: 'Observe the real-time ATP energy draw, cell viability curves, and live 8-axis D3 radar chart reacting dynamically to your environmental mutations.',
  },
];

export const Onboarding: React.FC<OnboardingProps> = ({ onDismiss }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onDismiss();
    }
  };

  const step = STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-base/75 backdrop-blur p-4 font-mono select-none">
      <div className="max-w-md w-full p-6 rounded-lg border border-accent-teal/40 bg-bg-panel shadow-panel flex flex-col space-y-4">
        <div className="flex items-center justify-between text-xs border-b border-border-subtle pb-2">
          <span className="text-accent-teal font-bold uppercase tracking-wider">
            LAB WORKSTATION TOUR // {currentStep + 1} OF {STEPS.length}
          </span>
          <button
            type="button"
            onClick={onDismiss}
            className="text-text-muted hover:text-text-primary text-[10px]"
          >
            [ESC TO CLOSE]
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-bold text-text-primary tracking-wide">
            {step.title}
          </h3>
          <p className="text-xs text-text-muted leading-relaxed">
            {step.desc}
          </p>
        </div>

        <div className="border-t border-border-subtle pt-3 flex justify-between items-center">
          <div className="flex space-x-1">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === currentStep ? 'bg-accent-teal shadow-glow-teal' : 'bg-bg-elevated'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-1.5 rounded bg-accent-teal text-bg-base font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-glow-teal transition-all"
          >
            {currentStep === STEPS.length - 1 ? 'START SIMULATION' : 'NEXT STEP &rarr;'}
          </button>
        </div>
      </div>
    </div>
  );
};
