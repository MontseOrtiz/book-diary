"use client";

import { useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { MathUtils, TextureLoader, type Mesh, type MeshBasicMaterial } from "three";

const CAM_Z = 8;
const CAM_FOV = 35;
const CAM_END_Z = 3;
const FACADE_ASPECT = 1.6;
const BRANCH_ASPECT = 0.9;
const BRANCH_Z = 1.2;
// Vertical center of the door in the facade art, as a fraction of its height below the center.
const DOOR_OFFSET = 0.285;

function smooth(from: number, to: number, value: number) {
  const t = MathUtils.clamp((value - from) / (to - from), 0, 1);
  return t * t * (3 - 2 * t);
}

function Scene({ progress }: { progress: MutableRefObject<number> }) {
  const viewport = useThree((state) => state.viewport);
  const [facadeMap, leftMap, rightMap] = useLoader(TextureLoader, [
    "/landing/facade.svg",
    "/landing/branch-left.svg",
    "/landing/branch-right.svg",
  ]);
  const left = useRef<Mesh>(null);
  const right = useRef<Mesh>(null);
  const veil = useRef<MeshBasicMaterial>(null);
  const smoothed = useRef(0);

  const facadeH = Math.max(viewport.height, viewport.width / FACADE_ASPECT) * 1.08;
  const facadeW = facadeH * FACADE_ASPECT;

  // Viewport size at the branch plane, which sits closer to the camera.
  const k = (CAM_Z - BRANCH_Z) / CAM_Z;
  const visibleW = viewport.width * k;
  const branchH = viewport.height * k * 1.08;
  const branchW = branchH * BRANCH_ASPECT;
  const closedX = -branchW / 2 + visibleW * 0.08;
  const openX = -visibleW / 2 - branchW / 2 + branchW * 0.18;

  useFrame((state, delta) => {
    smoothed.current = MathUtils.damp(smoothed.current, progress.current, 5, delta);
    const p = smoothed.current;

    const open = smooth(0.04, 0.4, p);
    const sway = Math.sin(state.clock.elapsedTime * 0.6) * 0.008;
    const x = MathUtils.lerp(closedX, openX, open);
    if (left.current) {
      left.current.position.x = x;
      left.current.rotation.z = open * 0.06 + sway;
    }
    if (right.current) {
      right.current.position.x = -x;
      right.current.rotation.z = -open * 0.06 - sway;
    }

    // The veil hides the facade behind the branches until they part.
    if (veil.current) veil.current.opacity = 1 - smooth(0.1, 0.38, p);

    const dolly = smooth(0.45, 0.92, p);
    state.camera.position.set(
      0,
      MathUtils.lerp(0, -DOOR_OFFSET * facadeH, dolly),
      MathUtils.lerp(CAM_Z, CAM_END_Z, dolly),
    );
  });

  return (
    <>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[facadeW, facadeH]} />
        <meshBasicMaterial map={facadeMap} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.6]}>
        <planeGeometry args={[facadeW * 3, facadeH * 3]} />
        <meshBasicMaterial ref={veil} color="#fde8ec" transparent toneMapped={false} />
      </mesh>
      <mesh ref={left} position={[closedX, 0, BRANCH_Z]}>
        <planeGeometry args={[branchW, branchH]} />
        <meshBasicMaterial map={leftMap} transparent toneMapped={false} />
      </mesh>
      <mesh ref={right} position={[-closedX, 0, BRANCH_Z]}>
        <planeGeometry args={[branchW, branchH]} />
        <meshBasicMaterial map={rightMap} transparent toneMapped={false} />
      </mesh>
    </>
  );
}

const MAX_RECOVERIES = 3;

export function LandingCanvas({ progress }: { progress: MutableRefObject<number> }) {
  // React Strict Mode (dev) and real GPU resets both leave R3F with a lost
  // context on a reused <canvas>. Remounting with a fresh canvas recovers.
  const [recoveries, setRecoveries] = useState(0);

  return (
    <Canvas
      key={recoveries}
      className="h-full w-full"
      camera={{ position: [0, 0, CAM_Z], fov: CAM_FOV }}
      dpr={[1, 2]}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", () => {
          setRecoveries((count) => (count < MAX_RECOVERIES ? count + 1 : count));
        });
      }}
    >
      <Scene progress={progress} />
    </Canvas>
  );
}
