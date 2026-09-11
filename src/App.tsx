import React, { useState } from 'react';
import { MotionConfig } from 'motion/react';
import { MobileGate } from './ui/MobileGate';
import { HUD } from './ui/HUD';
import { OrganismScene } from './three/OrganismScene';
import { BootSequence } from './ui/BootSequence';
import { Onboarding } from './ui/Onboarding';
import { useUrlGenome } from './hooks/useUrlGenome';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useUIStore } from './store/uiStore';

export const App: React.FC = () => {
  useUrlGenome();
  useKeyboardShortcuts();

  const [booted, setBooted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const params = new URLSearchParams(window.location.search);
    if (params.get('force') === 'true' || params.get('skipboot') === 'true') return true;
    return sessionStorage.getItem('biosynth_booted') === 'true';
  });

  const showTour = useUIStore((state) => state.showTour);
  const setShowTour = useUIStore((state) => state.setShowTour);
  const reducedMotion = useUIStore((state) => state.reducedMotion);

  const handleBootComplete = () => {
    sessionStorage.setItem('biosynth_booted', 'true');
    setBooted(true);
  };

  return (
    <MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'}>
      <MobileGate>
        {!booted && <BootSequence onComplete={handleBootComplete} />}
        {showTour && <Onboarding onDismiss={() => setShowTour(false)} />}
        <HUD>
          <OrganismScene />
        </HUD>
      </MobileGate>
    </MotionConfig>
  );
};

export default App;
