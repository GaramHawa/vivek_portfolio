"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function WarpParticles({ onComplete }: { onComplete: () => void }) {
  const count = 1500;
  const meshRef = useRef<THREE.LineSegments>(null);
  const startTime = useRef(Date.now());
  const duration = 3500; // ms
  const [triggered, setTriggered] = useState(false);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 6);
    const col = new Float32Array(count * 6);
    for (let i = 0; i < count; i++) {
      // Random position in a cylinder around the camera
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 8 + 0.5;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = (Math.random() - 0.5) * 100;

      // Point A (Head)
      pos[i * 6] = x;
      pos[i * 6 + 1] = y;
      pos[i * 6 + 2] = z;

      // Point B (Tail)
      pos[i * 6 + 3] = x;
      pos[i * 6 + 4] = y;
      pos[i * 6 + 5] = z - 2;

      // Colors
      const r = Math.random();
      let cr, cg, cb;
      if (r < 0.3) {
        // Cyan tint
        cr = 0.4 + Math.random() * 0.2; cg = 0.8 + Math.random() * 0.2; cb = 1.0;
      } else if (r < 0.5) {
        // Purple tint
        cr = 0.6 + Math.random() * 0.3; cg = 0.3 + Math.random() * 0.2; cb = 0.9 + Math.random() * 0.1;
      } else {
        // White
        cr = 0.9 + Math.random() * 0.1; cg = 0.9 + Math.random() * 0.1; cb = 0.9 + Math.random() * 0.1;
      }
      
      // Head color
      col[i * 6] = cr; col[i * 6 + 1] = cg; col[i * 6 + 2] = cb;
      // Tail color (slightly faded for a motion blur effect)
      col[i * 6 + 3] = cr * 0.3; col[i * 6 + 4] = cg * 0.3; col[i * 6 + 5] = cb * 0.3;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    const elapsed = Date.now() - startTime.current;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-in acceleration
    const speed = 0.2 + progress * progress * 5.0;
    // Tail stretches violently as we accelerate
    const tailLength = 2 + progress * 40;

    const posAttr = meshRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Move head
      arr[i * 6 + 2] += speed;

      // Reset stars that pass the camera
      if (arr[i * 6 + 2] > 50) {
        arr[i * 6 + 2] = -50;
      }
      
      // Update tail position relative to head
      arr[i * 6 + 5] = arr[i * 6 + 2] - tailLength;
    }
    posAttr.needsUpdate = true;

    // Fade out at end
    const mat = meshRef.current.material as THREE.LineBasicMaterial;
    mat.opacity = progress < 0.9 ? 1 : Math.max(0, 1 - (progress - 0.9) * 10);

    if (progress >= 1 && !triggered) {
      setTriggered(true);
      onComplete();
    }
  });

  return (
    <lineSegments ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count * 2}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={count * 2}
        />
      </bufferGeometry>
      {/* @ts-expect-error — r3f typing */}
      <lineBasicMaterial
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

function CentralFlash() {
  const meshRef = useRef<THREE.Mesh>(null);
  const startTime = useRef(Date.now());

  useFrame(() => {
    if (!meshRef.current) return;
    const elapsed = (Date.now() - startTime.current) / 1000;
    const scale = Math.sin(elapsed * 2) * 0.3 + 1.0;
    meshRef.current.scale.setScalar(scale);
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.15 + Math.sin(elapsed * 3) * 0.1;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -20]}>
      <circleGeometry args={[3, 32]} />
      <meshBasicMaterial
        color="#8b5cf6"
        transparent
        opacity={0.2}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

interface WarpTransitionProps {
  onComplete: () => void;
}

export default function WarpTransition({ onComplete }: WarpTransitionProps) {
  const [show, setShow] = useState(true);

  const handleDone = () => {
    setTimeout(() => {
      setShow(false);
      onComplete();
    }, 400);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: false }}
      >
        <color attach="background" args={["#000000"]} />
        <WarpParticles onComplete={handleDone} />
        <CentralFlash />
      </Canvas>

      {/* Radial blur overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.9) 100%)",
        }}
      />
    </div>
  );
}
