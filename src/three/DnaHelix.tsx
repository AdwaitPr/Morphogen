import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import dnaVert from '../shaders/dna.vert';
import dnaFrag from '../shaders/dna.frag';

const HELIX_COUNT = 8;

export const DnaHelix: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Construct a single double-helix segment geometry
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 40;
    const height = 6.0;
    const radius = 0.4;
    const turns = 2.0;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const y = (t - 0.5) * height;
      const angle = t * turns * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, 32, 0.02, 6, false);
  }, []);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0.0 },
    }),
    []
  );

  // Distribute instances randomly in outer spherical shell
  const instanceData = useMemo(() => {
    const data: { pos: THREE.Vector3; rot: THREE.Euler; rotSpeed: number; scale: number }[] = [];
    for (let i = 0; i < HELIX_COUNT; i++) {
      const phi = Math.random() * Math.PI;
      const theta = Math.random() * Math.PI * 2;
      const r = 9.0 + Math.random() * 6.0;

      data.push({
        pos: new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          (Math.random() - 0.5) * 8.0,
          r * Math.cos(phi)
        ),
        rot: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
        rotSpeed: 0.02 + Math.random() * 0.04,
        scale: 0.4 + Math.random() * 0.4,
      });
    }
    return data;
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current || !materialRef.current) return;
    materialRef.current.uniforms.u_time.value += delta;

    instanceData.forEach((item, i) => {
      item.rot.y += item.rotSpeed * delta;
      dummy.position.copy(item.pos);
      dummy.rotation.copy(item.rot);
      dummy.scale.set(item.scale, item.scale, item.scale);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  useEffect(() => {
    return () => {
      geometry.dispose();
      materialRef.current?.dispose();
    };
  }, [geometry]);

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, HELIX_COUNT]}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={dnaVert}
        fragmentShader={dnaFrag}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
      />
    </instancedMesh>
  );
};
