import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { genomeRefs } from '../store/genomeRefs';
import { getDisplacedSurfacePoint } from '../utils/noise';

const MAX_BRANCHES = 12;

export const Branches: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Tapered tentacle / branch cylinder with base anchor
  const geometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.02, 0.1, 0.85, 8, 12);
    geo.translate(0, 0.425, 0); // Pivot at the base
    return geo;
  }, []);

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#1d3e38',
      roughness: 0.3,
      metalness: 0.2,
      emissive: '#114a43',
      emissiveIntensity: 0.6,
    });
  }, []);

  // StrictMode disposal
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  // Precomputed canonical distribution angles on sphere
  const branchDirections = useMemo(() => {
    const dirs: { x: number; y: number; z: number }[] = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < MAX_BRANCHES; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / MAX_BRANCHES);
      dirs.push({
        x: Math.sin(phi) * Math.cos(theta),
        y: Math.cos(phi),
        z: Math.sin(phi) * Math.sin(theta),
      });
    }
    return dirs;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const t = clock.getElapsedTime();
    const branchCount = Math.round(genomeRefs.branchCount.current);
    const growth = genomeRefs.growth.current;
    const mutagen = genomeRefs.mutagen.current;
    const pulseRate = genomeRefs.pulseRate.current;
    const symmetry = genomeRefs.symmetry.current;

    for (let i = 0; i < MAX_BRANCHES; i++) {
      if (i >= branchCount || growth <= 0.01) {
        // Hide inactive branches
        dummy.scale.set(0, 0, 0);
        dummy.position.set(0, 0, 0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        continue;
      }

      // Base direction modulated by symmetry
      const baseDir = branchDirections[i];
      let dirX = baseDir.x;
      let dirY = baseDir.y;
      let dirZ = baseDir.z;

      if (symmetry > 0.05) {
        // Fold towards radial symmetry
        const angle = Math.atan2(dirZ, dirX);
        const radius = Math.sqrt(dirX * dirX + dirZ * dirZ);
        const segment = (2 * Math.PI) / Math.max(1, branchCount);
        const symAngle = Math.round(angle / segment) * segment;
        const blend = symmetry;
        dirX = (1 - blend) * dirX + blend * (Math.cos(symAngle) * radius);
        dirZ = (1 - blend) * dirZ + blend * (Math.sin(symAngle) * radius);
      }

      const len = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ) || 1;
      const norm = { x: dirX / len, y: dirY / len, z: dirZ / len };
      const basePoint = { x: norm.x * 1.2, y: norm.y * 1.2, z: norm.z * 1.2 };

      // Sample exact surface displacement from CPU noise
      const surface = getDisplacedSurfacePoint(basePoint, norm, t, growth, mutagen, pulseRate);

      dummy.position.set(surface.x, surface.y, surface.z);

      // Align branch along normal
      const normalVec = new THREE.Vector3(norm.x, norm.y, norm.z);
      dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normalVec);

      // Add gentle swaying breathing motion
      const sway = Math.sin(t * pulseRate * 2.0 + i) * 0.15 * growth;
      dummy.rotateZ(sway);

      // Scale proportionally with growth
      const scale = 0.6 + 0.5 * growth;
      dummy.scale.set(scale, scale, scale);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, MAX_BRANCHES]}
    />
  );
};
