import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import particleVert from '../shaders/particle.vert';
import particleFrag from '../shaders/particle.frag';
import { genomeRefs } from '../store/genomeRefs';

const PARTICLE_COUNT = 400;

export const NutrientParticles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const [geometry, uniforms] = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const scales = new Float32Array(PARTICLE_COUNT);
    const phases = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Uniform random distribution in spherical volume around organism
      const r = 2.0 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      scales[i] = 0.5 + Math.random() * 0.8;
      phases[i] = Math.random() * Math.PI * 2;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('a_scale', new THREE.BufferAttribute(scales, 1));
    geo.setAttribute('a_phase', new THREE.BufferAttribute(phases, 1));

    const uni = {
      u_time: { value: 0.0 },
      u_pulseRate: { value: genomeRefs.pulseRate.current },
    };

    return [geo, uni];
  }, []);

  useFrame((_, delta) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.u_time.value += delta;
    materialRef.current.uniforms.u_pulseRate.value = genomeRefs.pulseRate.current;
  });

  useEffect(() => {
    return () => {
      geometry.dispose();
      materialRef.current?.dispose();
    };
  }, [geometry]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particleVert}
        fragmentShader={particleFrag}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
