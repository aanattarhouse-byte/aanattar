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

function NebulaCloud() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 220;

  // Create soft gradient circle texture for nebula gas pockets
  const softTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.6)");
      gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.15)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    // Color definitions for a luxurious, glowing purple-violet-blue nebula
    const nebulaColors = [
      new THREE.Color("#8b5cf6"), // Violet
      new THREE.Color("#d946ef"), // Magenta
      new THREE.Color("#06b6d4"), // Cyan
      new THREE.Color("#f59e0b"), // Warm Amber
    ];
    const random = createSeededRandom(884211);

    for (let i = 0; i < count; i++) {
      // Clustered distribution (more dense in the center, sparse outer)
      const u = random();
      const v = random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.pow(random(), 2.2) * 5.0; // concentrated cluster

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6; // slightly flattened
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Select a cosmic color and mix it
      const baseColor = nebulaColors[Math.floor(random() * nebulaColors.length)].clone();
      const mixAmount = random() * 0.3;
      baseColor.lerp(new THREE.Color("#ffffff"), mixAmount); // slightly desaturate to glow

      col[i * 3] = baseColor.r;
      col[i * 3 + 1] = baseColor.g;
      col[i * 3 + 2] = baseColor.b;
    }

    return [pos, col];
  }, []);

  useFrame(({ clock, pointer }) => {
    if (!pointsRef.current) return;

    // Slow orbital rotation
    pointsRef.current.rotation.y = clock.elapsedTime * 0.02;
    pointsRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.05) * 0.05;

    // Gentle breathing scale motion
    const scale = 1.0 + Math.sin(clock.elapsedTime * 0.25) * 0.06;
    pointsRef.current.scale.set(scale, scale, scale);

    // Subtle cursor parallax
    pointsRef.current.position.x = pointer.x * 0.25;
    pointsRef.current.position.y = pointer.y * 0.15;
  });

  return (
    <points ref={pointsRef} frustumCulled>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        transparent
        vertexColors
        size={1.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.35}
        map={softTexture || undefined}
      />
    </points>
  );
}

function TwinklingStars() {
  const starsRef = useRef<THREE.Points>(null);
  const count = 650;

  // Star texture
  const starTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.8)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 16, 16);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const gold = new THREE.Color("#fef08a"); // Radiant gold stars
    const white = new THREE.Color("#ffffff"); // Bright white stars
    const blue = new THREE.Color("#93c5fd");  // Cool blue stars
    const random = createSeededRandom(229771);

    for (let i = 0; i < count; i++) {
      // Wider distribution field
      const r = 3.0 + random() * 8.0;
      const theta = random() * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * random() - 1.0);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Mix colors
      const rand = random();
      const finalColor = rand < 0.4 ? white.clone() : rand < 0.8 ? gold.clone() : blue.clone();
      
      col[i * 3] = finalColor.r;
      col[i * 3 + 1] = finalColor.g;
      col[i * 3 + 2] = finalColor.b;
    }

    return [pos, col];
  }, []);

  useFrame(({ clock, pointer }) => {
    if (!starsRef.current) return;

    // Stars rotate at a slightly different speed
    starsRef.current.rotation.y = -clock.elapsedTime * 0.015;
    starsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.08) * 0.02;

    // Twinkling effect (subtle scale pulses)
    starsRef.current.position.x = pointer.x * 0.12;
    starsRef.current.position.y = pointer.y * 0.08;
  });

  return (
    <points ref={starsRef} frustumCulled>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        transparent
        vertexColors
        size={0.05}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.75}
        map={starTexture || undefined}
      />
    </points>
  );
}

interface NebulaParticleFieldProps {
  className?: string;
}

export default function NebulaParticleField({ className = "" }: NebulaParticleFieldProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 z-0 opacity-80 mix-blend-screen overflow-hidden ${className}`}>
      <Canvas camera={{ position: [0, 0, 5.0], fov: 60 }} dpr={[1, 1.5]} gl={{ antialias: false, alpha: true }}>
        <ambientLight intensity={0.6} />
        <NebulaCloud />
        <TwinklingStars />
      </Canvas>
    </div>
  );
}
