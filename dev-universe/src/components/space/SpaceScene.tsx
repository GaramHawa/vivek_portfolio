"use client";

import React, { useState, Suspense, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import Sun from "./Sun";
import CelestialBody from "./CelestialBody";
import OrbitRing from "./OrbitRing";
import { projects } from "@/data/projects";
import type { Project } from "@/data/projects";

interface SpaceSceneProps {
  mantra: string;
  onSelectProject: (project: Project) => void;
}

const orbitConfigs = [
  { radius: 4.5, speed: 0.12, size: 0.35, offset: 0 },
  { radius: 6.5, speed: 0.08, size: 0.35, offset: Math.PI * 0.6 },
  { radius: 8.4, speed: 0.095, size: 0.35, offset: Math.PI * 1.2 },
  { radius: 10.2, speed: 0.065, size: 0.35, offset: Math.PI * 0.3 },
  { radius: 12.0, speed: 0.045, size: 0.35, offset: Math.PI * 1.9 },
];

/* ── Nebula background clouds ── */
function NebulaCloud({
  position,
  color,
  scale,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.z = t * 0.01;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.04 + Math.sin(t * 0.3) * 0.015;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[scale, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.04}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

/* ── Floating cosmic dust particles ── */
function CosmicDust() {
  const count = 300;
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 15 + ((i % 5) * 0.8);
      pos[i * 3] = Math.cos(angle) * radius + ((i % 4) - 1.5) * 0.3;
      pos[i * 3 + 1] = ((i % 7) - 3) * 0.6;
      pos[i * 3 + 2] = Math.sin(angle) * radius + ((i % 3) - 1) * 0.5;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.005;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#6366f1"
        size={0.02}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function SceneContent({
  onSelectProject,
  onHoverProject,
}: {
  onSelectProject: (project: Project) => void;
  onHoverProject: (project: Project | null) => void;
}) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={0.4} />

      {/* Starfield background — increased count & brightness */}
      <Stars
        radius={120}
        depth={100}
        count={5000}
        factor={5}
        saturation={0.3}
        fade
        speed={0.4}
      />

      {/* Nebula clouds for depth */}
      <NebulaCloud position={[-15, 5, -30]} color="#8b5cf6" scale={12} />
      <NebulaCloud position={[20, -3, -25]} color="#0ea5e9" scale={10} />
      <NebulaCloud position={[5, 8, -35]} color="#ec4899" scale={14} />
      <NebulaCloud position={[-10, -6, -20]} color="#f59e0b" scale={8} />

      {/* Cosmic dust */}
      <CosmicDust />

      {/* Central sun */}
      <Sun />

      {/* Orbit rings */}
      {orbitConfigs.map((cfg, i) => (
        <OrbitRing
          key={`ring-${i}`}
          radius={cfg.radius}
          color={projects[i]?.glowColor || "#ffffff"}
        />
      ))}

      {/* Planets */}
      {projects.map((project, i) => (
        <CelestialBody
          key={project.id}
          project={project}
          orbitRadius={orbitConfigs[i].radius}
          orbitSpeed={orbitConfigs[i].speed}
          size={orbitConfigs[i].size}
          orbitOffset={orbitConfigs[i].offset}
          onClick={() => onSelectProject(project)}
          onHover={(h) => onHoverProject(h ? project : null)}
        />
      ))}

      {/* Camera controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={4}
        maxDistance={20}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI * 0.7}
        minPolarAngle={Math.PI * 0.3}
      />
    </>
  );
}

export default function SpaceScene({ mantra, onSelectProject }: SpaceSceneProps) {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

  const handleHover = useCallback((project: Project | null) => {
    setHoveredProject(project);
  }, []);

  return (
    <div className="fixed inset-0 z-10">
      <Canvas
        camera={{ position: [0, 6, 14], fov: 55 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={["#030108"]} />
        {/* Reduced fog range to keep stars visible */}
        <fog attach="fog" args={["#030108", 35, 70]} />
        <Suspense fallback={null}>
          <SceneContent
            onSelectProject={onSelectProject}
            onHoverProject={handleHover}
          />
        </Suspense>
      </Canvas>

      {/* Hover tooltip */}
      {hoveredProject && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-20">
          <div className="bg-black/70 backdrop-blur-lg border border-white/10 rounded-xl px-5 py-3 text-center">
            <div className="flex items-center justify-center gap-2 text-white font-semibold text-sm">
              <Image
                src={hoveredProject.logoUrl}
                alt={`${hoveredProject.name} logo`}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span>{hoveredProject.name}</span>
            </div>
            <div className="text-zinc-400 text-xs mt-0.5">
              {hoveredProject.celestialType} — Click to explore
            </div>
          </div>
        </div>
      )}

      {/* Mantra display */}
      {mantra && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-full px-6 py-2">
            <span className="text-zinc-400 text-xs font-mono">
              &quot;{mantra}&quot;
            </span>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 z-20">
        <p className="text-zinc-600 text-[10px] font-mono">
          Drag to rotate • Scroll to zoom • Click a planet
        </p>
      </div>
    </div>
  );
}
