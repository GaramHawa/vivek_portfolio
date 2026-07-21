"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface OrbitRingProps {
  radius: number;
  color?: string;
}

export default function OrbitRing({
  radius,
  color = "#ffffff",
}: OrbitRingProps) {
  const lineRef = useRef<THREE.Line>(null);

  const geometry = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        )
      );
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    return geo;
  }, [radius]);

  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [color]);

  return <primitive ref={lineRef} object={new THREE.Line(geometry, material)} />;
}
