"use client";

import React, { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import type { Project } from "@/data/projects";

function createLabelTexture(text: string, color: string) {
  const width = 1536;
  const height = 320;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = color;
  ctx.font = "bold 120px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeStyle = "rgba(0, 0, 0, 0.55)";
  ctx.lineWidth = 8;
  ctx.strokeText(text, width / 2, height / 2);
  ctx.fillText(text, width / 2, height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function createParticlePositions(count: number, size: number, seedOffset: number) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = i * GOLDEN_ANGLE + seedOffset;
    const r = size * (1.3 + ((i % 10) / 10) * 0.8);
    const h = ((i % 7) - 3) * (size * 0.12);
    pos[i * 3] = Math.cos(angle) * r;
    pos[i * 3 + 1] = h;
    pos[i * 3 + 2] = Math.sin(angle) * r;
  }
  return pos;
}

interface CelestialBodyProps {
  project: Project;
  orbitRadius: number;
  orbitSpeed: number;
  size: number;
  orbitOffset: number;
  onClick: () => void;
  onHover: (hovering: boolean) => void;
}

export default function CelestialBody({
  project,
  orbitRadius,
  orbitSpeed,
  size,
  orbitOffset,
  onClick,
  onHover,
}: CelestialBodyProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const labelRef = useRef<THREE.Mesh>(null);
  const hovered = useRef(false);
  const targetScale = useRef(1);

  // Orbiting particles unique to each planet
  const particlePositions = useMemo(
    () => createParticlePositions(60, size, project.id * 1.7),
    [project.id, size]
  );

  const mainColor = useMemo(
    () => new THREE.Color(project.color),
    [project.color]
  );
  const emissiveCol = useMemo(
    () => new THREE.Color(project.emissiveColor),
    [project.emissiveColor]
  );
  const glowColor = useMemo(
    () => new THREE.Color(project.glowColor),
    [project.glowColor]
  );

  const baseLogoTexture = useLoader(THREE.TextureLoader, project.logoUrl);
  const logoTexture = useMemo(() => {
    if (!baseLogoTexture) return null;
    const texture = baseLogoTexture.clone();
    if ("colorSpace" in texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
    }
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }, [baseLogoTexture]);

  const labelTexture = useMemo(
    () => createLabelTexture(project.name, project.color),
    [project.name, project.color]
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Orbit around center
    const angle = t * orbitSpeed + orbitOffset;
    groupRef.current.position.x = Math.cos(angle) * orbitRadius;
    groupRef.current.position.z = Math.sin(angle) * orbitRadius;
    groupRef.current.position.y = Math.sin(angle * 0.5) * 0.3;

    // Self rotation
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }

    // Hover scale animation
    const target = hovered.current ? 1.3 : 1;
    targetScale.current += (target - targetScale.current) * 0.08;
    if (meshRef.current) {
      meshRef.current.scale.setScalar(targetScale.current);
    }

    // Rotate particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.003;
    }

    // Label billboard effect
    if (labelRef.current) {
      labelRef.current.lookAt(state.camera.position);
    }

    // Pulsing glow
    if (glowRef.current) {
      const pulse = 1 + Math.sin(t * 2) * 0.15;
      glowRef.current.scale.setScalar(pulse * size * 2.2);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.12 + Math.sin(t * 1.5) * 0.05;
    }

    // Planet rings rotation
    if (ringRef.current) {
      ringRef.current.rotation.z = Math.sin(t * 0.2) * 0.1;
    }
  });

  // Planet-specific features
  const hasRings = project.id === 3 || project.id === 5; // Nebula Core, Aurora Ice World

  return (
    <group ref={groupRef}>
      {/* Atmospheric glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Main planet sphere */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerEnter={(e) => {
          e.stopPropagation();
          hovered.current = true;
          onHover(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={(e) => {
          e.stopPropagation();
          hovered.current = false;
          onHover(false);
          document.body.style.cursor = "default";
        }}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          map={logoTexture}
          color="#ffffff"
          emissive={emissiveCol}
          emissiveIntensity={0.15}
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>

      <mesh ref={labelRef} position={[0, -size - 0.45, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[size * 3.2, size * 1.3]} />
        <meshBasicMaterial
          map={labelTexture}
          transparent
          alphaTest={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Rings for certain planets */}
      {hasRings && (
        <mesh ref={ringRef} rotation={[Math.PI * 0.45, 0, 0]}>
          <ringGeometry args={[size * 1.4, size * 1.9, 64]} />
          <meshBasicMaterial
            color={mainColor}
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Orbiting particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
            count={particlePositions.length / 3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={glowColor}
          size={0.03}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
