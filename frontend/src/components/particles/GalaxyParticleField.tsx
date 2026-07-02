"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function createSeededRandom(seed: number) {
  let value = seed;

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function Galaxy() {
  const ref = useRef<THREE.Points>(null);
  const count = 3500;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const branches = 3;
    const radius = 5;
    const spin = 1.2;
    const randomness = 0.45;
    const power = 3.5; // Concentrates more stars at the center

    const insideColor = new THREE.Color("#ffe3b3");  // Radiant bright gold core
    const outsideColor = new THREE.Color("#ff5b1a"); // Deep orange-red arms
    const mixColor = new THREE.Color("#9b3cf3");     // Cosmic indigo/purple dust hints
    const random = createSeededRandom(421337);

    for (let i = 0; i < count; i++) {
      // Distance from center
      const r = Math.pow(random(), power) * radius;

      // Position math
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;
      const spinAngle = r * spin;

      // Cubic-based distribution for arm scattering (fluffy edges)
      const randomX = Math.pow(random(), 3) * (random() < 0.5 ? 1 : -1) * randomness * r;
      const randomY = Math.pow(random(), 3) * (random() < 0.5 ? 1 : -1) * randomness * r;
      const randomZ = Math.pow(random(), 3) * (random() < 0.5 ? 1 : -1) * randomness * r;

      pos[i * 3] = Math.cos(branchAngle + spinAngle) * r + randomX;
      pos[i * 3 + 1] = randomY;
      pos[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

      // Color mapping
      const finalColor = insideColor.clone();
      if (r < radius * 0.4) {
        // Core to inner arm transition (gold to orange)
        finalColor.lerp(outsideColor, r / (radius * 0.4));
      } else {
        // Outer arm to void transition (orange to purple/indigo)
        finalColor.copy(outsideColor);
        finalColor.lerp(mixColor, (r - radius * 0.4) / (radius * 0.6));
      }

      col[i * 3] = finalColor.r;
      col[i * 3 + 1] = finalColor.g;
      col[i * 3 + 2] = finalColor.b;
    }

    return [pos, col];
  }, []);

  useFrame(({ clock, pointer }) => {
    if (!ref.current) return;
    
    // Smooth infinite rotation
    ref.current.rotation.y = clock.elapsedTime * 0.06;
    
    // Tilt the galaxy slightly and add subtle mouse influence
    ref.current.rotation.x = -Math.PI / 4.8 + Math.sin(clock.elapsedTime * 0.05) * 0.03 + pointer.y * 0.08;
    ref.current.rotation.z = clock.elapsedTime * 0.01 + pointer.x * 0.08;
    
    // Gentle floating motion
    ref.current.position.y = Math.sin(clock.elapsedTime * 0.2) * 0.05;
  });

  return (
    <points ref={ref} frustumCulled>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        transparent
        vertexColors
        size={0.026}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.75}
      />
    </points>
  );
}

interface GalaxyParticleFieldProps {
  className?: string;
}

export default function GalaxyParticleField({ className = "" }: GalaxyParticleFieldProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 z-0 opacity-80 mix-blend-screen overflow-hidden ${className}`}>
      <Canvas camera={{ position: [0, 1.8, 3.8], fov: 60 }} dpr={[1, 1.5]} gl={{ antialias: false, alpha: true }}>
        <ambientLight intensity={0.5} />
        <Galaxy />
      </Canvas>
    </div>
  );
}
