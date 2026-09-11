import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import vertexShader from '../shaders/organism.vert';
import fragmentShader from '../shaders/organism.frag';
import { genomeRefs } from '../store/genomeRefs';

export const OrganismMaterial: React.FC = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const colorHelper = useMemo(() => new THREE.Color(), []);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0.0 },
      u_growth: { value: genomeRefs.growth.current },
      u_mutagen: { value: genomeRefs.mutagen.current },
      u_pulseRate: { value: genomeRefs.pulseRate.current },
      u_symmetry: { value: genomeRefs.symmetry.current },
      u_bioluminescence: { value: genomeRefs.bioluminescence.current },
      u_baseColor: {
        value: new THREE.Color().setHSL(
          genomeRefs.hue.current / 360,
          genomeRefs.saturation.current,
          0.14
        ),
      },
    }),
    []
  );

  // Tier 1 Hot Path: update uniforms on every animation frame directly from genomeRefs
  useFrame((_, delta) => {
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;

    u.u_time.value += delta;
    u.u_growth.value = genomeRefs.growth.current;
    u.u_mutagen.value = genomeRefs.mutagen.current;
    u.u_pulseRate.value = genomeRefs.pulseRate.current;
    u.u_symmetry.value = genomeRefs.symmetry.current;
    u.u_bioluminescence.value = genomeRefs.bioluminescence.current;

    // Derive HSL cellular color
    colorHelper.setHSL(
      genomeRefs.hue.current / 360,
      genomeRefs.saturation.current,
      0.14
    );
    u.u_baseColor.value.copy(colorHelper);
  });

  // StrictMode cleanup
  useEffect(() => {
    return () => {
      materialRef.current?.dispose();
    };
  }, []);

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
      transparent={false}
      depthWrite={true}
      depthTest={true}
      side={THREE.DoubleSide}
    />
  );
};
