"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glow1Ref = useRef<THREE.Mesh>(null);
  const glow2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }

    if (glow1Ref.current) {
      const s1 = 1 + Math.sin(t * 1.5) * 0.08;
      glow1Ref.current.scale.setScalar(s1);
      (glow1Ref.current.material as THREE.MeshBasicMaterial).opacity =
        0.2 + Math.sin(t * 2) * 0.05;
    }

    if (glow2Ref.current) {
      const s2 = 1 + Math.sin(t * 0.8 + 1) * 0.12;
      glow2Ref.current.scale.setScalar(s2);
      (glow2Ref.current.material as THREE.MeshBasicMaterial).opacity =
        0.08 + Math.sin(t * 1.2) * 0.03;
    }
  });

  return (
    <group>
      {/* Core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ff8c00"
          emissiveIntensity={1.5}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Inner glow */}
      <mesh ref={glow1Ref}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color="#ffaa00"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer glow */}
      <mesh ref={glow2Ref}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Point light from sun */}
      <pointLight color="#ffd700" intensity={2} distance={30} decay={2} />
      <pointLight color="#ff8c00" intensity={0.8} distance={50} decay={1.5} />
    </group>
  );
}
