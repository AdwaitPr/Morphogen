import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { OrganismMaterial } from './OrganismMaterial';
import { Branches } from './Branches';

export const Organism: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Detail=4 gives ~5,120 triangles (dense enough for smooth FBM displacement)
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.2, 4), []);

  // StrictMode cleanup
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  return (
    <group>
      {/* Central Displaced Organism Core */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        position={[0, 0, 0]}
      >
        <OrganismMaterial />
      </mesh>

      {/* Surface-Attached Instanced Branches / Limbs */}
      <Branches />
    </group>
  );
};
