"use client";

import { useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { MathUtils, TextureLoader, type Mesh, type MeshBasicMaterial } from "three";

const CAM_Z = 8;
const CAM_FOV = 35;
const CAM_END_Z = 3;
const FACADE_ASPECT = 1.6;
const BRANCH_ASPECT = 0.9;
// Vertical center of the door in the facade art, as a fraction of its height below the center.
const DOOR_OFFSET = 0.285;

function smooth(from: number, to: number, value: number) {
  const t = MathUtils.clamp((value - from) / (to - from), 0, 1);
  return t * t * (3 - 2 * t);
}

// Distancia delante de la cámara a la que viven las ramas: constante, así que
// su tamaño en pantalla no cambia aunque la cámara avance hacia la puerta.
const OVERLAY_DIST = 6.8;
const BRANCH_REMAIN = 0.6; // fracción de la rama que sigue visible al abrirse

function visibleSize(distance: number, aspect: number) {
  const height = 2 * distance * Math.tan((CAM_FOV * Math.PI) / 360);
  return { width: height * aspect, height };
}

function Scene({ progress }: { progress: MutableRefObject<number> }) {
  const size = useThree((state) => state.size);
  const [facadeMap, leftMap, rightMap] = useLoader(TextureLoader, [
    "/landing/facade.svg",
    "/landing/branch-left.svg",
    "/landing/branch-right.svg",
  ]);
  const left = useRef<Mesh>(null);
  const right = useRef<Mesh>(null);
  const veil = useRef<Mesh>(null);
  const veilMaterial = useRef<MeshBasicMaterial>(null);
  const smoothed = useRef(0);

  const aspect = size.width / size.height;
  const far = visibleSize(CAM_Z, aspect);
  const facadeH = Math.max(far.height, far.width / FACADE_ASPECT) * 1.08;
  const facadeW = facadeH * FACADE_ASPECT;

  // Ramas pegadas a los bordes de la pantalla: su borde exterior coincide con el margen.
  const near = visibleSize(OVERLAY_DIST, aspect);
  const branchH = near.height * 1.08;
  const branchW = branchH * BRANCH_ASPECT;
  const closedX = -near.width / 2 + branchW / 2;
  const openX = closedX - branchW * (1 - BRANCH_REMAIN);

  useFrame((state, delta) => {
    smoothed.current = MathUtils.damp(smoothed.current, progress.current, 5, delta);
    const p = smoothed.current;

    const dolly = smooth(0.45, 0.92, p);
    const camX = 0;
    const camY = MathUtils.lerp(0, -DOOR_OFFSET * facadeH, dolly);
    const camZ = MathUtils.lerp(CAM_Z, CAM_END_Z, dolly);
    state.camera.position.set(camX, camY, camZ);

    const open = smooth(0.04, 0.4, p);
    const sway = Math.sin(state.clock.elapsedTime * 0.6) * 0.008;
    const x = MathUtils.lerp(closedX, openX, open);
    if (left.current) {
      left.current.position.set(camX + x, camY, camZ - OVERLAY_DIST);
      left.current.rotation.z = open * 0.04 + sway;
    }
    if (right.current) {
      right.current.position.set(camX - x, camY, camZ - OVERLAY_DIST);
      right.current.rotation.z = -open * 0.04 - sway;
    }
    // La cortina oculta la fachada detrás de las ramas hasta que se abren.
    if (veil.current && veilMaterial.current) {
      const opacity = 1 - smooth(0.1, 0.38, p);
      veilMaterial.current.opacity = opacity;
      veil.current.visible = opacity > 0.01;
      veil.current.position.set(camX, camY, camZ - OVERLAY_DIST - 0.4);
    }
  });

  return (
    <>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[facadeW, facadeH]} />
        <meshBasicMaterial map={facadeMap} toneMapped={false} />
      </mesh>
      <mesh ref={veil}>
        <planeGeometry args={[near.width * 3, near.height * 3]} />
        <meshBasicMaterial ref={veilMaterial} color="#fde8ec" transparent toneMapped={false} />
      </mesh>
      <mesh ref={left}>
        <planeGeometry args={[branchW, branchH]} />
        <meshBasicMaterial map={leftMap} transparent toneMapped={false} />
      </mesh>
      <mesh ref={right}>
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
