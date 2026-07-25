"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group } from "three";

const PALETTE = {
  primary: "#7C4A57",
  accent: "#D4A24E",
  pages: "#F6EFE3",
};

const BOOK_WIDTH = 1.3;
const BOOK_HEIGHT = 1.8;
const BOOK_THICKNESS = 0.34;

// Static pose used both as the resting frame for the animated version and as
// the frozen frame when the OS has prefers-reduced-motion enabled.
const BASE_ROTATION: [number, number, number] = [0.12, 0.55, 0.04];

function Book({ reduceMotion }: { reduceMotion: boolean }) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (reduceMotion || !groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = BASE_ROTATION[1] + t * 0.18;
    groupRef.current.position.y = Math.sin(t * 0.7) * 0.1;
  });

  return (
    <group ref={groupRef} rotation={BASE_ROTATION}>
      {/* Closed cover, wraps the whole book volume */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[BOOK_WIDTH, BOOK_HEIGHT, BOOK_THICKNESS]} />
        <meshStandardMaterial color={PALETTE.primary} roughness={0.65} metalness={0.05} />
      </mesh>

      {/* Page block, offset so a sliver peeks out on the open edge */}
      <mesh position={[0.14, 0, 0]}>
        <boxGeometry args={[BOOK_WIDTH - 0.16, BOOK_HEIGHT - 0.12, BOOK_THICKNESS - 0.06]} />
        <meshStandardMaterial color={PALETTE.pages} roughness={0.9} metalness={0} />
      </mesh>

      {/* Bookmark ribbon draped over the front cover near the spine */}
      <mesh position={[-0.42, -0.15, BOOK_THICKNESS / 2 + 0.01]}>
        <boxGeometry args={[0.1, BOOK_HEIGHT + 0.55, 0.015]} />
        <meshStandardMaterial color={PALETTE.accent} roughness={0.5} metalness={0.1} />
      </mesh>
    </group>
  );
}

export function HeroBook() {
  // Safe to read matchMedia synchronously here: this component is always
  // loaded via dynamic(..., { ssr: false }), so it only ever mounts client-side.
  const [reduceMotion, setReduceMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    function handleChange(event: MediaQueryListEvent) {
      setReduceMotion(event.matches);
    }

    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return (
    <Canvas
      className="h-full w-full"
      camera={{ position: [0, 0.4, 4.2], fov: 32 }}
      gl={{ alpha: true }}
    >
      <ambientLight intensity={0.8} color="#FBF6EE" />
      <directionalLight position={[3, 4, 2]} intensity={1.1} color="#FFF6E9" />
      <pointLight position={[-1.5, -0.5, 2]} intensity={0.5} color={PALETTE.accent} />
      <Book reduceMotion={reduceMotion} />
    </Canvas>
  );
}
