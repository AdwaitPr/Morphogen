import React, { Suspense } from 'react';
import { Environment } from '@react-three/drei';

export const Lighting: React.FC = () => {
  return (
    <>
      {/* Soft Ambient Fill */}
      <ambientLight intensity={0.2} color="#8fb3b0" />

      {/* Key Directional Light — Bioluminescent Teal */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.4}
        color="#4FB6AC"
        castShadow={false}
      />

      {/* Secondary Fill Light */}
      <directionalLight
        position={[-5, -2, -2]}
        intensity={0.4}
        color="#1f423e"
      />

      {/* Rim Point Light — Thermal Amber */}
      <pointLight
        position={[-3, 2, -3]}
        intensity={1.0}
        distance={15}
        decay={2}
        color="#E8A33D"
      />

      {/* Soft Image-Based Lighting via drei Environment */}
      <Suspense fallback={null}>
        <Environment preset="warehouse" resolution={256} background={false} />
      </Suspense>
    </>
  );
};
