import React from 'react';
import { OrbitControls } from '@react-three/drei';

export const CameraRig: React.FC = () => {
  return (
    <OrbitControls
      makeDefault
      enableDamping
      dampingFactor={0.05}
      autoRotate
      autoRotateSpeed={0.5}
      minDistance={2.0}
      maxDistance={10.0}
      minPolarAngle={0.3}
      maxPolarAngle={2.8}
    />
  );
};
