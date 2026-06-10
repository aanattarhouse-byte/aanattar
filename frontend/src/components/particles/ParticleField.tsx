"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function seededValue(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function EmberCloud() {
  const ref = useRef<THREE.Points>(null);
  const particles = useMemo(() => {
    const count = 520;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (seededValue(i + 1) - 0.5) * 10;
      positions[i * 3 + 1] = (seededValue(i + 2) - 0.5) * 6;
      positions[i * 3 + 2] = (seededValue(i + 3) - 0.5) * 5;
    }

    return positions;
  }, []);

  useFrame(({ clock, pointer }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.025 + pointer.x * 0.08;
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.18) * 0.035 + pointer.y * 0.04;
    ref.current.position.y = Math.sin(clock.elapsedTime * 0.28) * 0.08;
  });

  return (
    <points ref={ref} frustumCulled>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles, 3]} />
      </bufferGeometry>
      <pointsMaterial
        transparent
        color="#ffb347"
        size={0.018}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.55}
      />
    </points>
  );
}

interface ParticleFieldProps {
  className?: string;
  isAbsolute?: boolean;
}

export default function ParticleField({ className = "", isAbsolute = false }: ParticleFieldProps) {
  return (
    <div className={`pointer-events-none ${isAbsolute ? "absolute" : "fixed"} inset-0 z-[2] opacity-70 mix-blend-screen ${className}`}>
      <Canvas camera={{ position: [0, 0, 4.8], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: false, alpha: true }}>
        <EmberCloud />
      </Canvas>
    </div>
  );
}
