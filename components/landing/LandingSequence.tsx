"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useSyncExternalStore } from "react";

// Three.js/WebGL cannot render on the server, so the scene is loaded client-only.
const LandingCanvas = dynamic(
  () => import("./LandingCanvas").then((mod) => mod.LandingCanvas),
  { ssr: false },
);

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// useSyncExternalStore reads its snapshot on every render, and each probe
// would otherwise leak a WebGL context and evict the real scene's context.
let webglSupport: boolean | undefined;

function hasWebGL() {
  if (webglSupport === undefined) {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      webglSupport = Boolean(gl);
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

function smooth(from: number, to: number, value: number) {
  const t = Math.min(1, Math.max(0, (value - from) / (to - from)));
  return t * t * (3 - 2 * t);
}

function StaticLanding() {
  return (
    <section
      aria-label="Introducción"
      className="relative flex min-h-screen flex-col items-center justify-between bg-[url(/landing/facade.svg)] bg-cover bg-bottom px-4 py-16 text-center"
    >
      <h1 className="font-serif text-6xl text-ink sm:text-8xl">Book Diary</h1>
      <a href="#biblioteca" className="btn-primary">
        Entrar a la biblioteca
      </a>
    </section>
  );
}

function AnimatedLanding() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  useEffect(() => {
    function update() {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      progress.current = p;
      if (titleRef.current) titleRef.current.style.opacity = String(1 - smooth(0.06, 0.26, p));
      if (hintRef.current) hintRef.current.style.opacity = String(1 - smooth(0.02, 0.1, p));
      if (fadeRef.current) fadeRef.current.style.opacity = String(smooth(0.88, 0.98, p));
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section ref={sectionRef} aria-label="Introducción" className="relative h-[500vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0">
          <LandingCanvas progress={progress} />
        </div>
        <div
          ref={titleRef}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center"
        >
          <h1 className="font-serif text-6xl text-ink [text-shadow:0_2px_24px_var(--background)] sm:text-8xl">
            Book Diary
          </h1>
          <p className="text-ink-soft [text-shadow:0_1px_12px_var(--background)]">
            Un diario personal de lecturas
          </p>
        </div>
        <div
          ref={hintRef}
          className="pointer-events-none absolute inset-x-0 bottom-8 text-center text-sm text-ink-soft"
        >
          Desplázate
        </div>
        <div
          ref={fadeRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-background opacity-0"
        />
      </div>
    </section>
  );
}

export function LandingSequence() {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
  const webgl = useSyncExternalStore(
    () => () => {},
    hasWebGL,
    () => true,
  );

  return reducedMotion || !webgl ? <StaticLanding /> : <AnimatedLanding />;
}
